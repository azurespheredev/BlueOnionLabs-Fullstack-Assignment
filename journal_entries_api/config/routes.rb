Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :journal_entries, only: [ :index ] do
        collection do
          get :latest
        end
      end
    end
  end

  # Health check route for uptime monitoring
  get "up" => "rails/health#show", as: :rails_health_check

  root "api/v1/journal_entries#index"
end
