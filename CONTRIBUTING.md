# Contributing

Thanks for your interest in contributing to **Redmine External Source Links**.

## Development setup

1. Clone Redmine.
2. Clone this plugin into the Redmine `plugins` directory using the exact directory name:

```bash
git clone https://github.com/SKonovalovS/redmine-external-source.git plugins/redmine_external_issue_links
```

3. Install dependencies and run migrations:

```bash
bundle install
RAILS_ENV=development bundle exec rake db:migrate
RAILS_ENV=development bundle exec rake redmine:plugins:migrate
```

4. Start Redmine and enable the project module **External source**.

## Pull requests

Please keep pull requests focused and include:

- a clear description of the change;
- screenshots or GIFs for UI changes;
- migration notes if database changes are included;
- compatibility notes for Redmine 5.0, 5.1, and 6.x.

## Commit style

Use concise, descriptive commit messages, for example:

```text
Fix drag and drop sorting request
Add edit action for external sources
Update README badges
```

## Release process

1. Update `init.rb` version.
2. Update `CHANGELOG.md`.
3. Commit and push to `main`.
4. Create a tag, for example `v1.3.0`.
5. GitHub Actions builds and attaches the ZIP package to the release.
