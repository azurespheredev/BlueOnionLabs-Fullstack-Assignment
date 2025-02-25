class CreateJournalEntries < ActiveRecord::Migration[8.0]
  def change
    create_table :journal_entries do |t|
      t.integer :month
      t.integer :year
      t.decimal :revenue
      t.decimal :shipping_revenue
      t.decimal :tax_payable
      t.decimal :payments_received

      t.timestamps
    end
  end
end
