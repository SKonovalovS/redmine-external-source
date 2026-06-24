module RedmineExternalIssueLinks
  class Hooks < Redmine::Hook::ViewListener
    render_on :view_issues_show_description_bottom,
              partial: 'hooks/redmine_external_issue_links/external_issue_links'
  end
end
