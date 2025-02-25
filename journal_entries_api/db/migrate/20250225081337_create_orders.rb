class CreateOrders < ActiveRecord::Migration[8.0]
  def change
    create_table :orders do |t|
      t.integer :order_id
      t.datetime :ordered_at
      t.string :item_type
      t.decimal :price_per_item
      t.integer :quantity
      t.decimal :shipping
      t.decimal :tax_rate

      t.timestamps
    end
  end
end
