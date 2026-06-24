# Redmine External Source Links

Плагин для Redmine, который добавляет в карточку задачи блок **«Внешний источник»** — таблицу внешних ссылок на Jira, YouTrack, другой Redmine, BookStack, Alfresco, Confluence, Telegram, MAX, Gitlab, GitHub, YouTube и пользовательские источники.

Плагин не синхронизирует статусы и не ходит в API внешних систем. Он хранит источник, тему и ссылку, отображает иконку источника и пишет изменения в журнал задачи.

Автор: **Konovalov Semyon**

## Возможности

- подключение/отключение на уровне проекта через **Настройки проекта → Модули**;
- права доступа по ролям:
  - просмотр внешних источников;
  - управление внешними источниками;
- блок **«Внешний источник»** в карточке задачи;
- фиксированные источники с SVG-иконками:
  - Jira;
  - YouTrack;
  - Redmine(внешний);
  - BookStack;
  - Alfresco;
  - Confluence;
  - Telegram;
  - MAX;
  - Gitlab;
  - GitHub;
  - YouTube;
- пользовательские типы источников через настройки плагина;
- добавление и удаление внешних источников;
- REST API JSON;
- поиск по теме и ссылке прямо в блоке задачи;
- drag&drop сортировка строк;
- копирование ссылки одним кликом;
- предпросмотр favicon сайта при вводе URL;
- журнал изменений задачи: кто добавил, изменил, удалил или отсортировал внешний источник;
- локализация RU/EN;
- совместимость с Redmine 5.1.x и подготовка под Redmine 6.x.

## Установка

```bash
cd /path/to/redmine/plugins
unzip redmine_external_issue_links_v1_0.zip

cd /path/to/redmine
bundle exec rake redmine:plugins:migrate RAILS_ENV=production
sudo systemctl restart redmine
```

## Включение в проекте

1. Открыть проект.
2. Перейти в **Настройки → Модули**.
3. Включить модуль **Внешний источник**.
4. Перейти в **Администрирование → Роли и права**.
5. Включить права:
   - **Просмотр внешних источников**;
   - **Управление внешними источниками**.

## Настройка пользовательских источников

Администрирование → Плагины → Redmine External Source Links → Настроить.

Пример YAML:

```yaml
- key: sharepoint
  label: SharePoint
  icon: external.svg
- key: support_portal
  label: Support Portal
  icon: external.svg
```

Если нужна своя иконка, положите SVG в:

```text
plugins/redmine_external_issue_links/assets/images/source_icons/
```

и укажите имя файла в `icon`.

## REST API

API поддерживает стандартную авторизацию Redmine API key.

### Получить внешние источники задачи

```http
GET /issues/:issue_id/external_issue_links.json
```

### Добавить внешний источник

```http
POST /issues/:issue_id/external_issue_links.json
Content-Type: application/json

{
  "external_issue_link": {
    "source_type": "jira",
    "subject": "Ошибка 500 при авторизации",
    "url": "https://jira.example.com/browse/AUTH-123"
  }
}
```

### Получить одну запись

```http
GET /external_issue_links/:id.json
```

### Изменить запись

```http
PUT /external_issue_links/:id.json
Content-Type: application/json

{
  "external_issue_link": {
    "source_type": "github",
    "subject": "Pull request with fix",
    "url": "https://github.com/org/repo/pull/1"
  }
}
```

### Удалить запись

```http
DELETE /external_issue_links/:id.json
```

### Изменить порядок

```http
PATCH /issues/:issue_id/external_issue_links/sort.json
Content-Type: application/json

{
  "external_issue_link_ids": ["5", "3", "9"]
}
```

## Обновление с версии 0.2.0

Заменить папку плагина и выполнить миграции:

```bash
cd /path/to/redmine
bundle exec rake redmine:plugins:migrate RAILS_ENV=production
sudo systemctl restart redmine
```

Миграция переведёт поле `source_name` в `source_type` и сохранит существующие ссылки.

## Удаление

```bash
cd /path/to/redmine
bundle exec rake redmine:plugins:migrate NAME=redmine_external_issue_links VERSION=0 RAILS_ENV=production
rm -rf plugins/redmine_external_issue_links
sudo systemctl restart redmine
```

## Примечание по совместимости

Плагин использует стандартные механизмы Redmine: project modules, permissions, hooks, Rails controllers, ActiveRecord migrations и issue journals. Для Redmine 6.x может потребоваться проверка на конкретной сборке, но код не использует приватные monkey-patch API, кроме минимального добавления `has_many` к `Issue`.
