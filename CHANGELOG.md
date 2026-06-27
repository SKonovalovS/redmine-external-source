# Changelog

## 1.0.3

- Improved external source form layout.
- Fixed source icon preview update when source changes.
- Moved external source section above Redmine subtasks.
- Added BitBucket and Other sources.
- Removed YouTrack from built-in source list.
- Updated source icons from provided icon pack.
- Added plugin author URL and repository URL metadata.
- Added automatic subject fetching from URL when accessible.
- Centered delete action in external sources table.

## 1.0.2 - 2026-06-24

- Reworked issue page UI to look like native Redmine sections instead of a boxed panel.
- Removed external source search field from the issue page.
- Removed empty-state notification when no external sources are added.
- Moved the add external source action directly under the section heading.
- Added client-side positioning after the native subtasks block when it is present.
- Fixed drag & drop sorting URL: removed `.json` suffix to avoid Redmine API Basic Auth popup in browser sessions.
- Removed API auth handling from the browser-only `sort` action.
- Improved sorting response for XHR requests: returns `200 OK` without redirect.

## 1.0.1 - 2026-06-24

- Fixed Redmine 5.0.x issue hook rendering: use `@issue` instead of unavailable `context`.
- Improved drag & drop sorting: drag is started only from the handle.
- Improved sorting request: URL-encoded POST with `_method=patch`, CSRF token and `X-Requested-With`.
- Prevented accidental native URL/text drag behavior from rows and links.

## 1.0.0

- Added RU/EN localization.
- Added project module enable/disable support.
- Added view/manage permissions.
- Added built-in source registry and SVG icons.
- Added custom sources through plugin settings.
- Added issue journal notes for add/update/delete/sort actions.
- Added drag&drop sorting.
- Added client-side search.
- Added copy link button.
- Added favicon preview while entering URL.
- Added REST JSON API.
- Removed external key field.
- Renamed UI block to "Внешний источник" / "External source".
