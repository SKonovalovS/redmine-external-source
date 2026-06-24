module RedmineExternalIssueLinks
  module IssuePatch
    def self.included(base)
      base.class_eval do
        has_many :external_issue_links, -> { order(:position, :id) }, dependent: :destroy
      end
    end
  end
end

unless Issue.included_modules.include?(RedmineExternalIssueLinks::IssuePatch)
  Issue.include RedmineExternalIssueLinks::IssuePatch
end
