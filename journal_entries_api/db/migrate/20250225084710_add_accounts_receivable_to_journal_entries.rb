class AddAccountsReceivableToJournalEntries < ActiveRecord::Migration[8.0]
  def change
    add_column :journal_entries, :accounts_receivable, :decimal
  end
end
