class CreateExternalIssueLinks < ActiveRecord::Migration[6.1]
  def change
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

    add_index :external_issue_links, :issue_id
    add_index :external_issue_links, [:issue_id, :url], unique: true, name: 'idx_external_issue_links_issue_url'
    add_index :external_issue_links, [:issue_id, :position], name: 'idx_external_issue_links_issue_position'
  end
end
