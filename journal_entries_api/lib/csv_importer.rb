require "csv"

class CsvImporter
  def self.import_orders
    csv_path = Rails.root.join("storage", "data.csv")

    CSV.foreach(csv_path, headers: true) do |row|
      order = Order.find_or_create_by!(order_id: row["order_id"].to_i) do |o|
        o.ordered_at = DateTime.parse(row["ordered_at"])
        o.item_type = row["item_type"]
        o.price_per_item = row["price_per_item"].to_f
        o.quantity = row["quantity"].to_i
        o.shipping = row["shipping"].to_f
        o.tax_rate = row["tax_rate"].to_f
      end

      # Create or update payments
      Payment.find_or_create_by!(order: order, payment_id: row["payment_1_id"]) do |p|
        p.amount = row["payment_1_amount"].to_f
      end

      if row["payment_2_id"].present?
        Payment.find_or_create_by!(order: order, payment_id: row["payment_2_id"]) do |p|
          p.amount = row["payment_2_amount"].to_f
        end
      end
    end

    # Generate journal entries after importing orders
    import_journal_entries
  end

  def self.import_journal_entries
    grouped_orders = Order.includes(:payments).group_by { |o| [ o.ordered_at.year, o.ordered_at.month ] }

    grouped_orders.each do |(year, month), orders|
      revenue = orders.sum { |o| o.price_per_item * o.quantity }
      shipping_revenue = orders.sum(&:shipping)
      tax_payable = orders.sum { |o| (o.price_per_item * o.quantity) * o.tax_rate }
      payments_received = orders.flat_map(&:payments).sum(&:amount)
      total_accounts_receivable = revenue + shipping_revenue + tax_payable

      JournalEntry.find_or_create_by!(month: month, year: year) do |entry|
        entry.revenue = revenue
        entry.shipping_revenue = shipping_revenue
        entry.tax_payable = tax_payable
        entry.payments_received = payments_received
        entry.accounts_receivable = total_accounts_receivable
      end
    end
  end
end
