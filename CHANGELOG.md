# Changelog

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
