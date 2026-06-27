# REST API

Redmine External Source Links exposes a JSON API for reading and managing external source links.

The API uses standard Redmine authentication. For JSON API usage, pass a Redmine API key using one of the standard Redmine methods, for example:

```http
X-Redmine-API-Key: <api-key>
```

For browser UI actions, Redmine session authentication and CSRF protection are used.

## Data model

```json
{
  "id": 15,
  "issue_id": 2,
  "source_type": "gitlab",
  "subject": "MAX bot repository",
  "url": "https://git.example.com/team/max-bot",
  "position": 1,
  "author_id": 1,
  "updated_by_id": 1,
  "created_at": "2026-06-27T10:00:00Z",
  "updated_at": "2026-06-27T10:00:00Z"
}
```

## List external source links for an issue

```http
GET /issues/:issue_id/external_issue_links.json
```

### Response

```json
{
  "external_issue_links": [
    {
      "id": 15,
      "issue_id": 2,
      "source_type": "gitlab",
      "subject": "MAX bot repository",
      "url": "https://git.example.com/team/max-bot",
      "position": 1
    }
  ]
}
```

## Create external source link

```http
POST /issues/:issue_id/external_issue_links.json
Content-Type: application/json
```

### Request

```json
{
  "external_issue_link": {
    "source_type": "jira",
    "subject": "Authorization error",
    "url": "https://jira.example.com/browse/AUTH-123"
  }
}
```

### Response

```json
{
  "success": true,
  "external_issue_link": {
    "id": 15,
    "source_type": "jira",
    "subject": "Authorization error",
    "url": "https://jira.example.com/browse/AUTH-123"
  }
}
```

## Get one external source link

```http
GET /external_issue_links/:id.json
```

## Update external source link

```http
PUT /external_issue_links/:id.json
Content-Type: application/json
```

### Request

```json
{
  "external_issue_link": {
    "source_type": "github",
    "subject": "Pull request with fix",
    "url": "https://github.com/org/repo/pull/1"
  }
}
```

## Delete external source link

```http
DELETE /external_issue_links/:id.json
```

## Sort external source links

For browser UI drag & drop, the plugin uses a session-authenticated request without `.json` to avoid Redmine API Basic Auth prompts.

```http
PATCH /issues/:issue_id/external_issue_links/sort
Content-Type: application/x-www-form-urlencoded
X-CSRF-Token: <token>
X-Requested-With: XMLHttpRequest
```

### Request

```text
external_issue_link_ids[]=5&external_issue_link_ids[]=3&external_issue_link_ids[]=9
```

For API clients, JSON is also supported:

```http
PATCH /issues/:issue_id/external_issue_links/sort.json
Content-Type: application/json
```

```json
{
  "external_issue_link_ids": ["5", "3", "9"]
}
```

## Permissions

The project must have the **External source** module enabled.

Required permissions:

- `view_external_issue_links` — list and show;
- `manage_external_issue_links` — create, update, delete and sort.
