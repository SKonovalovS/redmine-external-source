resources :issues, only: [] do
  resources :external_issue_links, only: [:index, :create] do
    collection do
      patch :sort
      post :sort
      get :fetch_title
    end
  end
end

resources :external_issue_links, only: [:show, :update, :destroy]
