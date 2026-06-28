class ExternalIssueLink < ActiveRecord::Base
  belongs_to :issue
  belongs_to :author, class_name: 'User', optional: true
  belongs_to :updated_by, class_name: 'User', optional: true

  validates :issue, :source_type, :subject, :url, presence: true
  validates :source_type, inclusion: { in: ->(_) { RedmineExternalIssueLinks::SourceRegistry.valid_keys + ['external'] } }
  validates :subject, length: { maximum: 255 }
  validates :url, length: { maximum: 2048 }, uniqueness: { scope: :issue_id }
  validates :position, numericality: { only_integer: true, greater_than_or_equal_to: 0 }, allow_nil: true
  validate :url_must_be_http_or_https

  before_validation :normalize_fields
  before_create :set_default_position

  scope :search, ->(query) {
    query = query.to_s.strip
    query.present? ? where('LOWER(subject) LIKE LOWER(?) OR LOWER(url) LIKE LOWER(?)', "%#{sanitize_sql_like(query)}%", "%#{sanitize_sql_like(query)}%") : all
  }

  def source_label
    RedmineExternalIssueLinks::SourceRegistry.label(source_type)
  end

  def source_icon
    RedmineExternalIssueLinks::SourceRegistry.icon(source_type)
  end

  def favicon_url
    uri = URI.parse(url.to_s)
    return nil unless uri.is_a?(URI::HTTP) || uri.is_a?(URI::HTTPS)

    "#{uri.scheme}://#{uri.host}/favicon.ico"
  rescue URI::InvalidURIError
    nil
  end

  def as_json(options = {})
    super({ only: [:id, :issue_id, :source_type, :subject, :url, :position, :created_at, :updated_at],
            methods: [:source_label, :favicon_url] }.merge(options))
  end

  private

  def normalize_fields
    self.source_type = source_type.to_s.strip
    self.subject = subject.to_s.strip
    self.url = url.to_s.strip
  end

  def set_default_position
    return if position.present? || issue.blank?
    return unless ActiveRecord::Base.connection.data_source_exists?('external_issue_links')

    self.position = (issue.external_issue_links.maximum(:position) || 0) + 1
  end

  def url_must_be_http_or_https
    return if url.blank?

    uri = URI.parse(url)
    errors.add(:url, :invalid) unless uri.is_a?(URI::HTTP) || uri.is_a?(URI::HTTPS)
  rescue URI::InvalidURIError
    errors.add(:url, :invalid)
  end
end
