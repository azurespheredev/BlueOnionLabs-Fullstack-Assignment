class JournalEntry < ApplicationRecord
  validates :month, :year, presence: true
  validates :revenue, :shipping_revenue, :tax_payable, :payments_received, presence: true, numericality: true
end
