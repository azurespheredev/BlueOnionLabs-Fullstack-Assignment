class Order < ApplicationRecord
  has_many :payments, dependent: :destroy

  def total
    (price_per_item * quantity) + shipping + (price_per_item * quantity * tax_rate)
  end
end
