require "test_helper"

class Api::V1::JournalEntriesControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get api_v1_journal_entries_index_url
    assert_response :success
  end
end
