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


  function pluginIconPath(icon) {
    if (!icon) icon = 'other.svg';
    return '/plugin_assets/redmine_external_issue_links/images/source_icons/' + icon;
  }

  function parseIconMap(select) {
    if (!select) return {};
    try {
      return JSON.parse(select.getAttribute('data-icon-map') || '{}');
    } catch (e) {
      return {};
    }
  }

  function debounce(fn, delay) {
    var timer = null;
    return function () {
      var self = this;
      var args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () { fn.apply(self, args); }, delay);
    };
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
        'Accept': 'text/javascript, text/html, application/xml, text/xml, */*',
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRF-Token': token || ''
      },
      body: body
    });
  }

  function moveBeforeSubtasks(root) {
    if (!root || root.getAttribute('data-place-before-subtasks') !== 'true') return;

    var issueTree = document.getElementById('issue_tree');
    if (issueTree && issueTree.parentNode && issueTree !== root.nextSibling) {
      issueTree.parentNode.insertBefore(root, issueTree);
    }
  }

  ready(function () {
    var root = document.getElementById('external-issue-links');
    if (!root) return;

    function currentRows() {
      return Array.prototype.slice.call(root.querySelectorAll('.external-issue-links-list tbody tr'));
    }

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

    moveBeforeSubtasks(root);

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

    var sourceSelect = root.querySelector('.external-source-select');
    var sourcePreviewIcon = root.querySelector('.external-source-preview-icon');
    if (sourceSelect && sourcePreviewIcon) {
      var iconMap = parseIconMap(sourceSelect);
      var updateSourceIcon = function () {
        sourcePreviewIcon.src = pluginIconPath(iconMap[sourceSelect.value] || 'other.svg');
      };
      sourceSelect.addEventListener('change', updateSourceIcon);
      updateSourceIcon();
    }

    var subjectInput = root.querySelector('.external-subject-input');
    var fetchTitleUrl = root.getAttribute('data-fetch-title-url');
    var fetchTitle = debounce(function () {
      if (!urlInput || !subjectInput || !fetchTitleUrl) return;
      if (subjectInput.value && subjectInput.value.trim().length > 0) return;
      var url = urlInput.value.trim();
      if (!url || !/^https?:\/\//i.test(url)) return;

      fetch(fetchTitleUrl + '?url=' + encodeURIComponent(url), {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      }).then(function (response) {
        if (!response.ok) return null;
        return response.json();
      }).then(function (data) {
        if (data && data.title && !subjectInput.value.trim()) {
          subjectInput.value = data.title;
        }
      }).catch(function () {});
    }, 600);

    if (urlInput) {
      urlInput.addEventListener('input', fetchTitle);
      urlInput.addEventListener('paste', function () { setTimeout(fetchTitle, 0); });
      urlInput.addEventListener('change', fetchTitle);
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
