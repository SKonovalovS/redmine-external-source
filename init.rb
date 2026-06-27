require_dependency File.expand_path('../lib/redmine_external_issue_links/issue_patch', __FILE__)
require_dependency File.expand_path('../lib/redmine_external_issue_links/hooks', __FILE__)
require_dependency File.expand_path('../lib/redmine_external_issue_links/source_registry', __FILE__)

Redmine::Plugin.register :redmine_external_issue_links do
  name 'Redmine External Source Links'
  author 'Konovalov Semyon'
  author_url 'https://github.com/SKonovalovS'
  description 'Adds external source links to Redmine issues with icons, ordering, journal notes and REST API. Plugin repository: https://github.com/SKonovalovS/redmine-external-source'
  url 'https://github.com/SKonovalovS/redmine-external-source'
  version '1.1.0'
  requires_redmine version_or_higher: '5.0.0'

  project_module :external_issue_links do
    permission :view_external_issue_links, { external_issue_links: [:index, :show] }, read: true
    permission :manage_external_issue_links, { external_issue_links: [:create, :update, :destroy, :sort] }, require: :member
  end

  settings default: {
    'custom_sources' => ''
  }, partial: 'external_issue_links/settings'
end
