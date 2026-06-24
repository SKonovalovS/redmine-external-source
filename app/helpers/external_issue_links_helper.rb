module ExternalIssueLinksHelper
  def external_issue_link_icon(link)
    image_tag "source_icons/#{link.source_icon}", plugin: 'redmine_external_issue_links', class: 'external-source-icon', alt: link.source_label
  end
end
