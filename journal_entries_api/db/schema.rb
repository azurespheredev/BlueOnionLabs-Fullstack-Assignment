# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_02_25_084710) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "journal_entries", force: :cascade do |t|
    t.integer "month"
    t.integer "year"
    t.decimal "revenue"
    t.decimal "shipping_revenue"
    t.decimal "tax_payable"
    t.decimal "payments_received"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.decimal "accounts_receivable"
  end

  create_table "orders", force: :cascade do |t|
    t.integer "order_id"
    t.datetime "ordered_at"
    t.string "item_type"
    t.decimal "price_per_item"
    t.integer "quantity"
    t.decimal "shipping"
    t.decimal "tax_rate"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "payments", force: :cascade do |t|
    t.bigint "order_id", null: false
    t.string "payment_id"
    t.decimal "amount"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["order_id"], name: "index_payments_on_order_id"
  end

  add_foreign_key "payments", "orders"
end
