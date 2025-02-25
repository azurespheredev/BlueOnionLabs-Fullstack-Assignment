class Api::V1::JournalEntriesController < ApplicationController
  def index
    if params[:month].present? && params[:year].present?
      month = params[:month].to_i
      year = params[:year].to_i
      entries = JournalEntry.where(month: month, year: year)
    else
      entries = JournalEntry.all
    end

    results = entries.map do |entry|
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

    sorted_results = results.sort_by { |result| Date.strptime(result[:journal_entry_date], "%m/%d/%Y") }

    if sorted_results.any?
      render json: { results: sorted_results }
    else
      render json: { error: "No data found." }, status: :not_found
    end
  end
end
