# REST API

Redmine External Source Links exposes JSON endpoints for external source management.

API access follows Redmine authentication and project permissions.

## Permissions

| Action | Required permission |
| ------ | ------------------- |
| List links | View external sources |
| Show link | View external sources |
| Create link | Manage external sources |
| Update link | Manage external sources |
| Delete link | Manage external sources |
| Sort links | Manage external sources |

## List external sources

```http
GET /issues/:issue_id/external_issue_links.json
```

Example response:

```json
{
  "external_issue_links": [
    {
      "id": 1,
      "issue_id": 123,
      "source_type": "gitlab",
      "source_name": "GitLab",
      "subject": "MAX Bot repository",
      "url": "https://gitlab.example.com/team/max-bot",
      "position": 1
    }
  ]
}
```

## Show external source

```http
GET /external_issue_links/:id.json
```

## Create external source

```http
POST /issues/:issue_id/external_issue_links.json
Content-Type: application/json
```

```json
{
  "external_issue_link": {
    "source_type": "github",
    "subject": "Feature request",
    "url": "https://github.com/example/project/issues/10"
  }
}
```

## Update external source

```http
PATCH /external_issue_links/:id.json
Content-Type: application/json
```

```json
{
  "external_issue_link": {
    "source_type": "bitbucket",
    "subject": "Updated source title",
    "url": "https://bitbucket.org/example/project/pull-requests/15"
  }
}
```

## Delete external source

```http
DELETE /external_issue_links/:id.json
```

## Sort external sources

```http
PATCH /issues/:issue_id/external_issue_links/sort
Content-Type: application/json
```

```json
{
  "ids": [3, 1, 2]
}
```

## Supported built-in source types

| Key | Label |
| --- | ----- |
| jira | Jira |
| redmine_external | Redmine (external) |
| bookstack | BookStack |
| alfresco | Alfresco |
| confluence | Confluence |
| telegram | Telegram |
| max | MAX |
| gitlab | GitLab |
| github | GitHub |
| bitbucket | Bitbucket |
| youtube | YouTube |
| other | Other |
