require 'yaml'

module RedmineExternalIssueLinks
  class SourceRegistry
    BUILTIN_SOURCES = [
      { key: 'jira', label: 'Jira', icon: 'jira.svg' },
      { key: 'redmine_external', label: 'Redmine(внешний)', icon: 'redmine_external.ico' },
      { key: 'bookstack', label: 'BookStack', icon: 'bookstack.png' },
      { key: 'alfresco', label: 'Alfresco', icon: 'alfresco.png' },
      { key: 'confluence', label: 'Confluence', icon: 'confluence.svg' },
      { key: 'telegram', label: 'Telegram', icon: 'telegram.svg' },
      { key: 'max', label: 'MAX', icon: 'max.png' },
      { key: 'gitlab', label: 'GitLab', icon: 'gitlab.png' },
      { key: 'github', label: 'GitHub', icon: 'github.png' },
      { key: 'bitbucket', label: 'BitBucket', icon: 'bitbucket.svg' },
      { key: 'youtube', label: 'YouTube', icon: 'youtube.svg' },
      { key: 'other', label: 'Other', icon: 'other.svg' }
    ].freeze

    class << self
      def all
        BUILTIN_SOURCES + custom_sources
      end

      def options
        all.map { |source| [source[:label], source[:key]] }
      end

      def find(key)
        all.find { |source| source[:key].to_s == key.to_s } || external_source
      end

      def label(key)
        find(key)[:label]
      end

      def icon(key)
        find(key)[:icon].presence || 'external.svg'
      end

      def valid_keys
        all.map { |source| source[:key].to_s }
      end

      def icon_map
        all.each_with_object({}) do |source, memo|
          memo[source[:key].to_s] = source[:icon].presence || 'external.svg'
        end
      end

      def external_source
        { key: 'external', label: 'Other', icon: 'other.svg' }
      end

      def custom_sources
        raw = Setting.plugin_redmine_external_issue_links['custom_sources'].to_s
        return [] if raw.strip.blank?

        rows = YAML.safe_load(raw, permitted_classes: [], aliases: false) rescue []
        Array(rows).filter_map.with_index do |row, index|
          next unless row.is_a?(Hash)

          key = row['key'].presence || row[:key].presence || "custom_#{index + 1}"
          label = row['label'].presence || row[:label].presence || key
          icon = row['icon'].presence || row[:icon].presence || 'external.svg'
          { key: key.to_s.parameterize(separator: '_'), label: label.to_s, icon: icon.to_s }
        end
      end
    end
  end
end
