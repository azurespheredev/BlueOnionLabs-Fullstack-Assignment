class AddOrderReferenceToPayments < ActiveRecord::Migration[8.0]
  def change
    unless column_exists?(:payments, :order_id)
      add_reference :payments, :order, null: false, foreign_key: true
    end
  end
end
