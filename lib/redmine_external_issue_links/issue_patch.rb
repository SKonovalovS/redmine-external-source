module RedmineExternalIssueLinks
  module IssuePatch
    def self.included(base)
      base.class_eval do
        has_many :external_issue_links, -> { order(:position, :id) }, dependent: :destroy

        def external_issue_links_table_available?
          ActiveRecord::Base.connection.data_source_exists?('external_issue_links')
        rescue StandardError
          false
        end
      end
    end
  end
end

unless Issue.included_modules.include?(RedmineExternalIssueLinks::IssuePatch)
  Issue.include RedmineExternalIssueLinks::IssuePatch
end
