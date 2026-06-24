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
    var rows = Array.prototype.slice.call(root.querySelectorAll('.external-issue-links-list tbody tr'));
    var empty = root.querySelector('.external-issue-links-filter-empty');
    if (search && rows.length) {
      search.addEventListener('input', function () {
        var q = search.value.toLowerCase().trim();
        var visible = 0;
        rows.forEach(function (row) {
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
    var dragged;
    if (tbody) {
      rows.forEach(function (row) {
        row.setAttribute('draggable', 'true');
        row.addEventListener('dragstart', function () {
          dragged = row;
          row.classList.add('external-issue-link-dragging');
        });
        row.addEventListener('dragend', function () {
          row.classList.remove('external-issue-link-dragging');
          dragged = null;
          saveOrder();
        });
        row.addEventListener('dragover', function (e) {
          e.preventDefault();
          if (!dragged || dragged === row) return;
          var rect = row.getBoundingClientRect();
          var after = (e.clientY - rect.top) > rect.height / 2;
          tbody.insertBefore(dragged, after ? row.nextSibling : row);
        });
      });
    }

    function saveOrder() {
      var sortUrl = root.getAttribute('data-sort-url');
      if (!sortUrl) return;
      var ids = Array.prototype.slice.call(tbody.querySelectorAll('tr[data-id]')).map(function (row) {
        return row.getAttribute('data-id');
      });
      var token = csrfToken();
      fetch(sortUrl, {
        method: 'PATCH',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-Token': token || ''
        },
        body: JSON.stringify({ external_issue_link_ids: ids })
      }).catch(function () {});
    }
  });
})();
