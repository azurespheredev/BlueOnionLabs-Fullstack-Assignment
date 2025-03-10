class Api::V1::JournalEntriesController < ApplicationController
  def index
    if params[:group_by] == "year" && params[:year].present?
      year = params[:year].to_i
      entries = JournalEntry.where(year: year)
      results = aggregate_by_year(entries, year)
    elsif params[:month].present? && params[:year].present?
      month = params[:month].to_i
      year = params[:year].to_i
      entries = JournalEntry.where(month: month, year: year)
      results = format_entries(entries)
    else
      entries = JournalEntry.all
      results = format_entries(entries)
    end

    sorted_results = results.sort_by { |result| extract_sortable_date(result[:journal_entry_date]) }

    if sorted_results.any?
      render json: { results: sorted_results }
    else
      render json: { error: "No data found." }, status: :not_found
    end
  end

  def latest
    entry = JournalEntry.order(year: :desc, month: :desc).first

    if entry
      render json: { month: entry.month, year: entry.year }
    else
      render json: { error: "No journal entries found." }, status: :not_found
    end
  end

  private

  def format_entries(entries)
    entries.map do |entry|
      {
        journal_entry_date: Date.new(entry.year, entry.month, -1).strftime("%m/%d/%y"),
        entries: [
          { account: "Accounts Receivable", debit: entry.revenue.to_f, credit: nil, description: "Cash expected for orders" },
          { account: "Revenue", debit: nil, credit: entry.revenue.to_f, description: "Revenue for orders" },
          { account: "Accounts Receivable", debit: entry.shipping_revenue.to_f, credit: nil, description: "Cash expected for shipping" },
          { account: "Shipping Revenue", debit: nil, credit: entry.shipping_revenue.to_f, description: "Revenue for shipping" },
          { account: "Accounts Receivable", debit: entry.tax_payable.to_f, credit: nil, description: "Cash expected for taxes" },
          { account: "Sales Tax Payable", debit: nil, credit: entry.tax_payable.to_f, description: "Tax payable" },
          { account: "Cash", debit: entry.payments_received.to_f, credit: nil, description: "Cash received" },
          { account: "Accounts Receivable", debit: nil, credit: entry.accounts_receivable.to_f, description: "Removal of expectation of cash" }
        ],
        totals: {
          debit_total: (entry.accounts_receivable + entry.payments_received).to_f,
          credit_total: (entry.accounts_receivable + entry.payments_received).to_f
        }
      }
    end
  end

  def aggregate_by_year(entries, year)
    return [] if entries.empty?

    total_revenue = entries.sum(&:revenue)
    total_shipping = entries.sum(&:shipping_revenue)
    total_tax = entries.sum(&:tax_payable)
    total_payments = entries.sum(&:payments_received)
    total_accounts_receivable = total_revenue + total_shipping + total_tax

    [
      {
        journal_entry_date: "Yearly Summary for #{year}",
        entries: [
          { account: "Accounts Receivable", debit: total_revenue, credit: nil, description: "Total revenue expected for #{year}" },
          { account: "Revenue", debit: nil, credit: total_revenue, description: "Total revenue for #{year}" },
          { account: "Accounts Receivable", debit: total_shipping, credit: nil, description: "Total shipping revenue expected for #{year}" },
          { account: "Shipping Revenue", debit: nil, credit: total_shipping, description: "Total shipping revenue for #{year}" },
          { account: "Accounts Receivable", debit: total_tax, credit: nil, description: "Total tax expected for #{year}" },
          { account: "Sales Tax Payable", debit: nil, credit: total_tax, description: "Total tax payable for #{year}" },
          { account: "Cash", debit: total_payments, credit: nil, description: "Total cash received for #{year}" },
          { account: "Accounts Receivable", debit: nil, credit: total_accounts_receivable, description: "Removal of expectation of cash for #{year}" }
        ],
        totals: {
          debit_total: (total_accounts_receivable + total_payments),
          credit_total: (total_accounts_receivable + total_payments)
        }
      }
    ]
  end

  def extract_sortable_date(date_string)
    if date_string.include?("Yearly Summary for")
      year = date_string.scan(/\d{4}/).first.to_i
      Date.new(year, 12, 31)
    else
      Date.strptime(date_string, "%m/%d/%y") rescue Date.today
    end
  end
end
