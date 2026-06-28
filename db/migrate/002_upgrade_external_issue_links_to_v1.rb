class UpgradeExternalIssueLinksToV1 < ActiveRecord::Migration[6.1]
  SOURCE_MAP = {
    'Jira' => 'jira',
    'YouTrack' => 'youtrack',
    'Redmine(внешний)' => 'redmine_external',
    'BookStack' => 'bookstack',
    'Alfresco' => 'alfresco',
    'Confluence' => 'confluence',
    'Telegram' => 'telegram',
    'MAX' => 'max',
    'Gitlab' => 'gitlab',
    'GitLab' => 'gitlab',
    'GitHub' => 'github',
    'BitBucket' => 'bitbucket',
    'Bitbucket' => 'bitbucket',
    'YouTube' => 'youtube',
    'Other' => 'other'
  }.freeze

  def up
    return unless table_exists?(:external_issue_links)

    if column_exists?(:external_issue_links, :tracker_name) && !column_exists?(:external_issue_links, :source_name)
      rename_column :external_issue_links, :tracker_name, :source_name
    end

    remove_column :external_issue_links, :external_key if column_exists?(:external_issue_links, :external_key)

    unless column_exists?(:external_issue_links, :source_type)
      add_column :external_issue_links, :source_type, :string, limit: 80
      execute "UPDATE external_issue_links SET source_type = 'external'"
    end

    if column_exists?(:external_issue_links, :source_name)
      SOURCE_MAP.each do |label, key|
        execute sanitize_sql(["UPDATE external_issue_links SET source_type = ? WHERE source_name = ?", key, label])
      end
      execute "UPDATE external_issue_links SET source_type = 'external' WHERE source_type IS NULL OR source_type = ''"
      remove_column :external_issue_links, :source_name
    end

    add_column :external_issue_links, :position, :integer, null: false, default: 0 unless column_exists?(:external_issue_links, :position)
    add_column :external_issue_links, :updated_by_id, :integer unless column_exists?(:external_issue_links, :updated_by_id)

    unless index_exists?(:external_issue_links, [:issue_id, :position], name: 'idx_external_issue_links_issue_position')
      add_index :external_issue_links, [:issue_id, :position], name: 'idx_external_issue_links_issue_position'
    end
  end

  def down
    return unless table_exists?(:external_issue_links)

    if index_exists?(:external_issue_links, name: 'idx_external_issue_links_issue_position')
      remove_index :external_issue_links, name: 'idx_external_issue_links_issue_position'
    end

    add_column :external_issue_links, :source_name, :string, limit: 60 unless column_exists?(:external_issue_links, :source_name)

    if column_exists?(:external_issue_links, :source_type)
      execute "UPDATE external_issue_links SET source_name = source_type WHERE source_name IS NULL OR source_name = ''" if column_exists?(:external_issue_links, :source_name)
      remove_column :external_issue_links, :source_type
    end

    remove_column :external_issue_links, :position if column_exists?(:external_issue_links, :position)
    remove_column :external_issue_links, :updated_by_id if column_exists?(:external_issue_links, :updated_by_id)
  end

  private

  def sanitize_sql(array)
    ActiveRecord::Base.send(:sanitize_sql_array, array)
  end
end
