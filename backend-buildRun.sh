cd journal_entries_api
bundle install
rails db:create
rails db:migrate
rails runner "CsvImporter.import_orders"
rails server