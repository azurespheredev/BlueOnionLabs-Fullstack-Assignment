class CreatePayments < ActiveRecord::Migration[8.0]
  def change
    create_table :payments do |t|
      t.references :order, null: false, foreign_key: true
      t.string :payment_id
      t.decimal :amount

      t.timestamps
    end
  end
end
