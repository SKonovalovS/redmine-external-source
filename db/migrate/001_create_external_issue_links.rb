class CreateExternalIssueLinks < ActiveRecord::Migration[6.1]
  def up
    unless table_exists?(:external_issue_links)
      create_table :external_issue_links do |t|
        t.integer :issue_id, null: false
        t.string :source_type, null: false, limit: 80
        t.string :subject, null: false, limit: 255
        t.string :url, null: false, limit: 2048
        t.integer :position, null: false, default: 0
        t.integer :author_id
        t.integer :updated_by_id
        t.timestamps null: false
      end
    else
      add_column :external_issue_links, :issue_id, :integer unless column_exists?(:external_issue_links, :issue_id)
      add_column :external_issue_links, :source_type, :string, limit: 80 unless column_exists?(:external_issue_links, :source_type)
      add_column :external_issue_links, :subject, :string, limit: 255 unless column_exists?(:external_issue_links, :subject)
      add_column :external_issue_links, :url, :string, limit: 2048 unless column_exists?(:external_issue_links, :url)
      add_column :external_issue_links, :position, :integer, default: 0 unless column_exists?(:external_issue_links, :position)
      add_column :external_issue_links, :author_id, :integer unless column_exists?(:external_issue_links, :author_id)
      add_column :external_issue_links, :updated_by_id, :integer unless column_exists?(:external_issue_links, :updated_by_id)
      add_timestamps :external_issue_links, null: true unless column_exists?(:external_issue_links, :created_at) && column_exists?(:external_issue_links, :updated_at)
    end

    add_index :external_issue_links, :issue_id unless index_exists?(:external_issue_links, :issue_id)

    unless index_exists?(:external_issue_links, [:issue_id, :url], name: 'idx_external_issue_links_issue_url')
      add_index :external_issue_links, [:issue_id, :url], unique: true, name: 'idx_external_issue_links_issue_url'
    end

    unless index_exists?(:external_issue_links, [:issue_id, :position], name: 'idx_external_issue_links_issue_position')
      add_index :external_issue_links, [:issue_id, :position], name: 'idx_external_issue_links_issue_position'
    end
  end

  def down
    return unless table_exists?(:external_issue_links)

    remove_index :external_issue_links, name: 'idx_external_issue_links_issue_position' if index_exists?(:external_issue_links, [:issue_id, :position], name: 'idx_external_issue_links_issue_position')
    remove_index :external_issue_links, name: 'idx_external_issue_links_issue_url' if index_exists?(:external_issue_links, [:issue_id, :url], name: 'idx_external_issue_links_issue_url')
    remove_index :external_issue_links, column: :issue_id if index_exists?(:external_issue_links, :issue_id)

    drop_table :external_issue_links if table_exists?(:external_issue_links)
  end
end
