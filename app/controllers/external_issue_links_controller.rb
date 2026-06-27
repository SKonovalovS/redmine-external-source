class ExternalIssueLinksController < ApplicationController
  accept_api_auth :index, :show, :create, :update, :destroy

  before_action :find_issue, only: [:index, :create, :sort]
  before_action :find_external_issue_link, only: [:show, :update, :destroy]
  before_action :authorize_view_external_issue_links, only: [:index, :show]
  before_action :authorize_manage_external_issue_links, only: [:create, :update, :destroy, :sort]

  helper :external_issue_links

  def index
    @external_issue_links = @issue.external_issue_links.search(params[:q]).order(:position, :id)

    respond_to do |format|
      format.html { redirect_to issue_path(@issue) }
      format.json { render json: { external_issue_links: @external_issue_links.as_json } }
    end
  end

  def show
    respond_to do |format|
      format.html { redirect_to issue_path(@external_issue_link.issue) }
      format.json { render json: { external_issue_link: @external_issue_link.as_json } }
    end
  end


  def create
    @external_issue_link = @issue.external_issue_links.build(external_issue_link_params)
    @external_issue_link.author = User.current
    @external_issue_link.updated_by = User.current

    if @external_issue_link.save
      add_issue_journal(@issue, l(:journal_external_issue_link_added, subject: @external_issue_link.subject, source: @external_issue_link.source_label))
      respond_success(@issue, :notice_external_issue_link_created, :created)
    else
      respond_error(@external_issue_link)
    end
  end

  def update
    @issue = @external_issue_link.issue
    if @external_issue_link.update(external_issue_link_params.merge(updated_by: User.current))
      add_issue_journal(@issue, l(:journal_external_issue_link_updated, subject: @external_issue_link.subject, source: @external_issue_link.source_label))
      respond_success(@issue, :notice_external_issue_link_updated, :ok)
    else
      respond_error(@external_issue_link)
    end
  end

  def destroy
    issue = @external_issue_link.issue
    subject = @external_issue_link.subject
    source = @external_issue_link.source_label
    @external_issue_link.destroy
    add_issue_journal(issue, l(:journal_external_issue_link_deleted, subject: subject, source: source))
    respond_success(issue, :notice_external_issue_link_deleted, :ok)
  end

  def sort
    ids = Array(params[:external_issue_link_ids] || params[:ids])
    ActiveRecord::Base.transaction do
      @issue.external_issue_links.where(id: ids).each do |link|
        index = ids.index(link.id.to_s)
        link.update_column(:position, index + 1) if index
      end
    end

    add_issue_journal(@issue, l(:journal_external_issue_links_sorted))

    respond_to do |format|
      format.html { request.xhr? ? head(:ok) : redirect_to(issue_path(@issue)) }
      format.json { render json: { success: true } }
      format.any { head :ok }
    end
  end

  private


  def find_issue
    @issue = Issue.find(params[:issue_id])
    @project = @issue.project
  rescue ActiveRecord::RecordNotFound
    render_404
  end

  def find_external_issue_link
    @external_issue_link = ExternalIssueLink.find(params[:id])
    @issue = @external_issue_link.issue
    @project = @issue.project
  rescue ActiveRecord::RecordNotFound
    render_404
  end

  def authorize_view_external_issue_links
    deny_access unless @project.module_enabled?(:external_issue_links) &&
                       User.current.allowed_to?(:view_external_issue_links, @project)
  end

  def authorize_manage_external_issue_links
    deny_access unless @project.module_enabled?(:external_issue_links) &&
                       User.current.allowed_to?(:manage_external_issue_links, @project)
  end

  def external_issue_link_params
    params.require(:external_issue_link).permit(:source_type, :subject, :url, :position)
  end

  def add_issue_journal(issue, notes)
    return unless issue.respond_to?(:init_journal)

    issue.init_journal(User.current, notes)
    issue.save(validate: false)
  rescue StandardError => e
    Rails.logger.warn("[redmine_external_issue_links] journal write failed: #{e.class}: #{e.message}")
  end

  def respond_success(issue, notice_key, status)
    respond_to do |format|
      format.html do
        flash[:notice] = l(notice_key)
        redirect_to issue_path(issue)
      end
      format.json { render json: { success: true, external_issue_link: @external_issue_link&.as_json }, status: status }
    end
  end

  def respond_error(record)
    respond_to do |format|
      format.html do
        flash[:error] = record.errors.full_messages.join(', ')
        redirect_to issue_path(@issue || record.issue)
      end
      format.json { render json: { success: false, errors: record.errors.full_messages }, status: :unprocessable_entity }
    end
  end
end
