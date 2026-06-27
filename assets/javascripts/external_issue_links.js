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

  function initFaviconPreview(box) {
    var urlInput = box.querySelector('.external-url-input');
    var faviconPreview = box.querySelector('.external-favicon-preview');
    if (!urlInput || !faviconPreview) return;

    var update = function () {
      var favicon = originFavicon(urlInput.value);
      if (favicon) {
        faviconPreview.src = favicon;
        faviconPreview.style.display = '';
      } else {
        faviconPreview.style.display = 'none';
      }
    };

    urlInput.addEventListener('input', update);
    faviconPreview.addEventListener('error', function () {
      faviconPreview.style.display = 'none';
    });
    update();
  }

  function initSourcePreview(box) {
    var sourceSelect = box.querySelector('.external-source-select');
    var sourcePreviewIcon = box.querySelector('.external-source-preview-icon');
    if (!sourceSelect || !sourcePreviewIcon) return;

    var iconMap = parseIconMap(sourceSelect);
    var updateSourceIcon = function () {
      sourcePreviewIcon.src = pluginIconPath(iconMap[sourceSelect.value] || 'other.svg');
    };

    sourceSelect.addEventListener('change', updateSourceIcon);
    updateSourceIcon();
  }

  function setFormValues(formBox, row) {
    if (!formBox || !row) return;

    var form = formBox.querySelector('form');
    var source = formBox.querySelector('[name="external_issue_link[source_type]"]');
    var subject = formBox.querySelector('[name="external_issue_link[subject]"]');
    var url = formBox.querySelector('[name="external_issue_link[url]"]');

    if (form) form.action = row.getAttribute('data-update-url') || '#';
    if (source) {
      source.value = row.getAttribute('data-source-type') || 'other';
      source.dispatchEvent(new Event('change', { bubbles: true }));
    }
    if (subject) subject.value = row.getAttribute('data-subject') || '';
    if (url) {
      url.value = row.getAttribute('data-url') || '';
      url.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

  ready(function () {
    var root = document.getElementById('external-issue-links');
    if (!root) return;

    function currentRows() {
      return Array.prototype.slice.call(root.querySelectorAll('.external-issue-links-list tbody tr'));
    }

    var toggle = root.querySelector('.external-issue-links-toggle-form');
    var addFormBox = root.querySelector('.external-issue-links-add-form');
    var editFormBox = root.querySelector('.external-issue-links-edit-form');
    var cancel = root.querySelector('.external-issue-links-cancel');
    var editCancel = root.querySelector('.external-issue-links-edit-cancel');

    if (toggle && addFormBox) {
      toggle.addEventListener('click', function (e) {
        e.preventDefault();
        if (editFormBox) editFormBox.style.display = 'none';
        addFormBox.style.display = addFormBox.style.display === 'none' ? '' : 'none';
      });
    }
    if (cancel && addFormBox) {
      cancel.addEventListener('click', function (e) {
        e.preventDefault();
        addFormBox.style.display = 'none';
      });
    }
    if (editCancel && editFormBox) {
      editCancel.addEventListener('click', function (e) {
        e.preventDefault();
        editFormBox.style.display = 'none';
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

    function openEditForm(row) {
      if (!row || !editFormBox) return;
      if (addFormBox) addFormBox.style.display = 'none';
      setFormValues(editFormBox, row);
      editFormBox.style.display = '';
      editFormBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      var subjectInput = editFormBox.querySelector('[name="external_issue_link[subject]"]');
      if (subjectInput) subjectInput.focus();
    }

    root.addEventListener('click', function (e) {
      var editBtn = e.target.closest && e.target.closest('.external-issue-links-edit');
      if (!editBtn) return;
      e.preventDefault();
      openEditForm(editBtn.closest('tr[data-id]'));
    });

    root.addEventListener('dblclick', function (e) {
      if (e.target.closest && e.target.closest('a, button, input, select, textarea, .external-issue-links-drag-handle')) return;
      var row = e.target.closest && e.target.closest('tr[data-id]');
      if (row) openEditForm(row);
    });

    Array.prototype.slice.call(root.querySelectorAll('.external-issue-links-form')).forEach(function (box) {
      initFaviconPreview(box);
      initSourcePreview(box);
    });

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
        if (!response.ok && window.console) {
          console.warn('External issue links sort failed', response.status);
        }
      }).catch(function (error) {
        if (window.console) console.warn('External issue links sort request failed', error);
      });
    }
  });
})();
