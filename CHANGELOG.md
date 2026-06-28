# Changelog

## 1.3.1

### Fixed

- Removed beige row hover background from external source table in both light and dark Redmine themes.
- Added automatic dark-theme detection for plugin assets.
- Inverted the GitHub icon in dark themes so it remains visible on dark backgrounds.

## 1.3.0

### Added

- Added `CODE_OF_CONDUCT.md`.
- Added `CONTRIBUTING.md`.
- Added `SECURITY.md`.
- Added GitHub issue templates.
- Added pull request template.
- Improved README badges for latest release, license, Redmine compatibility, CI and downloads.
- Expanded REST API documentation.
- Improved open-source project documentation.


## 1.2.0

### Added
- Added external source editing.
- Added pencil action for editing existing external sources.
- Added double-click row editing.

### Changed
- Replaced delete text with a compact trash icon action.
- Improved row actions layout.

## 1.1.0 - 2026-06-27

### Removed
- Removed automatic title fetching from URLs because private resources often return login-page titles.

### Fixed
- Enlarged Jira and Confluence icons so they match the visual size of other source icons.

### Added
- Added improved README with badges, screenshots, GIF demo and REST API documentation.
- Added GitHub Actions compatibility workflow for Redmine 5.0, 5.1 and 6.x.
- Added GitHub Actions release workflow that builds a ZIP archive automatically when a version tag is pushed.

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
