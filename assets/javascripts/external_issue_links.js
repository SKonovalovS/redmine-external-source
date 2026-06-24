(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  function csrfToken() {
    var meta = document.querySelector('meta[name="csrf-token"]');
    return meta && meta.getAttribute('content');
  }

  function originFavicon(url) {
    try {
      var u = new URL(url);
      return u.origin + '/favicon.ico';
    } catch (e) {
      return null;
    }
  }

  function postSort(sortUrl, ids) {
    var token = csrfToken();
    var body = '_method=patch';
    ids.forEach(function (id) {
      body += '&external_issue_link_ids[]=' + encodeURIComponent(id);
    });

    return fetch(sortUrl, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRF-Token': token || ''
      },
      body: body
    });
  }

  ready(function () {
    var root = document.getElementById('external-issue-links');
    if (!root) return;

    var toggle = root.querySelector('.external-issue-links-toggle-form');
    var formBox = root.querySelector('.external-issue-links-form');
    var cancel = root.querySelector('.external-issue-links-cancel');
    if (toggle && formBox) {
      toggle.addEventListener('click', function (e) {
        e.preventDefault();
        formBox.style.display = formBox.style.display === 'none' ? '' : 'none';
      });
    }
    if (cancel && formBox) {
      cancel.addEventListener('click', function (e) {
        e.preventDefault();
        formBox.style.display = 'none';
      });
    }

    var search = root.querySelector('.external-issue-links-search');
    var empty = root.querySelector('.external-issue-links-filter-empty');
    function currentRows() {
      return Array.prototype.slice.call(root.querySelectorAll('.external-issue-links-list tbody tr'));
    }

    if (search) {
      search.addEventListener('input', function () {
        var q = search.value.toLowerCase().trim();
        var visible = 0;
        currentRows().forEach(function (row) {
          var match = !q || (row.getAttribute('data-search-text') || '').indexOf(q) !== -1;
          row.style.display = match ? '' : 'none';
          if (match) visible += 1;
        });
        if (empty) empty.style.display = visible ? 'none' : '';
      });
    }

    root.addEventListener('click', function (e) {
      var btn = e.target.closest && e.target.closest('.external-issue-links-copy');
      if (!btn) return;
      e.preventDefault();
      var url = btn.getAttribute('data-url');
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(function () {
          var old = btn.textContent;
          btn.textContent = '✓';
          setTimeout(function () { btn.textContent = old; }, 1200);
        });
      }
    });

    var urlInput = root.querySelector('.external-url-input');
    var faviconPreview = root.querySelector('.external-favicon-preview');
    if (urlInput && faviconPreview) {
      urlInput.addEventListener('input', function () {
        var favicon = originFavicon(urlInput.value);
        if (favicon) {
          faviconPreview.src = favicon;
          faviconPreview.style.display = '';
        } else {
          faviconPreview.style.display = 'none';
        }
      });
      faviconPreview.addEventListener('error', function () {
        faviconPreview.style.display = 'none';
      });
    }

    var tbody = root.querySelector('.external-issue-links-list tbody');
    var dragged = null;
    var dragAllowed = false;
    var orderBeforeDrag = null;

    if (tbody) {
      currentRows().forEach(function (row) {
        var handle = row.querySelector('.external-issue-links-drag-handle');
        if (!handle) return;

        row.setAttribute('draggable', 'false');
        handle.setAttribute('draggable', 'true');

        handle.addEventListener('mousedown', function () {
          dragAllowed = true;
          row.setAttribute('draggable', 'true');
        });

        handle.addEventListener('dragstart', function (e) {
          dragged = row;
          orderBeforeDrag = orderedIds().join(',');
          row.classList.add('external-issue-link-dragging');
          if (e.dataTransfer) {
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', '');
          }
        });

        row.addEventListener('dragstart', function (e) {
          if (!dragAllowed) e.preventDefault();
        });

        row.addEventListener('dragend', function () {
          row.classList.remove('external-issue-link-dragging');
          row.setAttribute('draggable', 'false');
          dragAllowed = false;

          var orderAfterDrag = orderedIds().join(',');
          dragged = null;

          if (orderBeforeDrag && orderBeforeDrag !== orderAfterDrag) saveOrder();
          orderBeforeDrag = null;
        });

        row.addEventListener('dragover', function (e) {
          if (!dragged || dragged === row) return;
          e.preventDefault();
          var rect = row.getBoundingClientRect();
          var after = (e.clientY - rect.top) > rect.height / 2;
          tbody.insertBefore(dragged, after ? row.nextSibling : row);
        });
      });

      tbody.addEventListener('dragover', function (e) {
        if (dragged) e.preventDefault();
      });
    }

    function orderedIds() {
      if (!tbody) return [];
      return Array.prototype.slice.call(tbody.querySelectorAll('tr[data-id]')).map(function (row) {
        return row.getAttribute('data-id');
      });
    }

    function saveOrder() {
      var sortUrl = root.getAttribute('data-sort-url');
      if (!sortUrl || !tbody) return;
      postSort(sortUrl, orderedIds()).then(function (response) {
        if (!response.ok) {
          // Keep UI responsive, but log the real HTTP status for debugging.
          if (window.console) console.warn('External issue links sort failed', response.status);
        }
      }).catch(function (error) {
        if (window.console) console.warn('External issue links sort request failed', error);
      });
    }
  });
})();
