# Redmine External Source Links

[![Latest Release](https://img.shields.io/github/v/release/SKonovalovS/redmine-external-source?label=Latest%20Release)](https://github.com/SKonovalovS/redmine-external-source/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Redmine](https://img.shields.io/badge/Redmine-5.0%20%7C%205.1%20%7C%206.x-red.svg)](https://www.redmine.org/)
[![CI](https://github.com/SKonovalovS/redmine-external-source/actions/workflows/compatibility.yml/badge.svg)](https://github.com/SKonovalovS/redmine-external-source/actions/workflows/compatibility.yml)
[![Downloads](https://img.shields.io/github/downloads/SKonovalovS/redmine-external-source/total?label=Downloads)](https://github.com/SKonovalovS/redmine-external-source/releases)

**Redmine External Source Links** adds a native-looking **External source** section to Redmine issue pages.

It lets teams attach links to external systems without full synchronization or API integration. The plugin stores the source type, subject, URL, display order, and journal history inside Redmine.

![Demo](screenshots/usage.gif)

## Features

- Native Redmine issue-page section: **External source**.
- Enable or disable per project via **Project settings → Modules**.
- Role-based permissions:
  - view external sources;
  - manage external sources.
- Add, edit, delete, copy, and reorder external links.
- Edit by pencil icon or by double-clicking a row.
- Drag & drop sorting.
- Issue journal notes for add/update/delete/sort operations.
- Built-in sources with icons:
  - Jira;
  - Redmine (external);
  - BookStack;
  - Alfresco;
  - Confluence;
  - Telegram;
  - MAX;
  - GitLab;
  - GitHub;
  - Bitbucket;
  - YouTube;
  - Other.
- Custom source types via plugin settings.
- Russian and English localization.
- JSON REST API.
- Compatible with Redmine 5.0.x, 5.1.x, and 6.x.

## Screenshots

### Issue page

![Issue page](screenshots/issue-page.png)

### Add or edit external source

![Add external source](screenshots/add-source.png)

## Installation

Clone or unpack the plugin into the Redmine `plugins` directory. The directory name must be exactly:

```text
redmine_external_issue_links
```

```bash
cd /path/to/redmine/plugins
git clone https://github.com/SKonovalovS/redmine-external-source.git redmine_external_issue_links

cd /path/to/redmine
bundle exec rake redmine:plugins:migrate RAILS_ENV=production
bundle exec rake tmp:cache:clear RAILS_ENV=production
sudo systemctl restart redmine
```

For Docker-based installations, place the plugin into the host directory or volume used as the source for Redmine plugins, then restart the Redmine container.

Example:

```bash
cd /opt/redmine/data/plugins
git clone https://github.com/SKonovalovS/redmine-external-source.git redmine_external_issue_links
docker restart redmine-redmine-2
```

## Configuration

### Enable the project module

1. Open a project.
2. Go to **Settings → Modules**.
3. Enable **External source**.

### Configure permissions

Go to **Administration → Roles and permissions** and grant:

- **View external sources**;
- **Manage external sources**.

### Custom sources

Go to **Administration → Plugins → Redmine External Source Links → Configure**.

Example:

```yaml
- key: sharepoint
  label: SharePoint
  icon: external.svg
- key: support_portal
  label: Support Portal
  icon: external.svg
```

Custom icons should be placed in:

```text
plugins/redmine_external_issue_links/assets/images/source_icons/
```

Then use the file name in the `icon` field.

## REST API

Full API documentation is available here:

[docs/API.md](docs/API.md)

Quick example:

```http
POST /issues/:issue_id/external_issue_links.json
Content-Type: application/json

{
  "external_issue_link": {
    "source_type": "gitlab",
    "subject": "MAX Bot repository",
    "url": "https://gitlab.example.com/team/max-bot"
  }
}
```

## Compatibility

| Redmine | Status |
| ------- | ------ |
| 5.0.x   | Supported |
| 5.1.x   | Supported |
| 6.x     | Supported / CI checked |

## Development

See [CONTRIBUTING.md](CONTRIBUTING.md).

## Security

See [SECURITY.md](SECURITY.md).

## Code of Conduct

See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## License

MIT License. See [LICENSE](LICENSE).

## Author

Konovalov Semyon  
GitHub: [SKonovalovS](https://github.com/SKonovalovS)
