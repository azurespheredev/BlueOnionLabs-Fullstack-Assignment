import React from "react";
import { Alert, Box, Button, IconButton, SelectChangeEvent, Skeleton } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import JournalEntryFilter from "./components/JournalEntryFilter";
import JournalEntryTable from "./components/JournalEntryTable";
import { APIResponse, JournalEntry, JournalEntryReport, JournalFilter } from "./types/journalEntries";
import { DownloadFileType, MonthsEnum } from "./enums/journalEntries";
import { downloadAsCSV, downloadAsExcel } from "./services/journalEntries";

const BASE_API_URL = "http://localhost:3000/api/v1";

export default function App() {
  const [filter, setFilter] = React.useState<JournalFilter | null>(null);
  const [groupByYear, setGroupByYear] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [isDownload, setIsDownload] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string>("");
  const [report, setReport] = React.useState<JournalEntryReport>({
    journal_entry_date: "",
    entries: [],
    totals: {
      debit_total: 0,
      credit_total: 0,
    },
  });

  const filterChangeHandlers = {
    handleMonthChange: (event: SelectChangeEvent<number>) => {
      setFilter({ ...filter!, month: Number(event.target.value) });
    },
    handleYearChange: (event: SelectChangeEvent<number>) => {
      setFilter({ ...filter!, year: Number(event.target.value) });
    },
  };

  // Fetch a single journal entry from the API
  const fetchJournalEntries = async (selectedMonth?: number, selectedYear?: number) => {
    if (!filter) return;

    setIsLoading(true);

    const url = groupByYear
      ? `${BASE_API_URL}/journal_entries?group_by=year&year=${selectedYear ?? filter.year}`
      : `${BASE_API_URL}/journal_entries?month=${selectedMonth ?? filter.month}&year=${selectedYear ?? filter.year}`;

    const response = await fetch(url);
    const data: APIResponse = await response.json();

    if (data.error) {
      setErrorMessage(data.error);
    }

    if (data.results) {
      setReport(data.results[0]);
      setErrorMessage("");
    }

    setIsLoading(false);
  };

  const fetchLatestJournalEntry = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`${BASE_API_URL}/journal_entries/latest`);
      const data = await response.json();

      if (data.error) {
        setErrorMessage(data.error);
      } else {
        setFilter({ month: data.month, year: data.year });
        fetchJournalEntries(data.month, data.year);
      }
    } catch (error) {
      setErrorMessage("Error fetching latest journal entry.");
    }
  };

  const downloadResults = async (format: DownloadFileType) => {
    setIsDownload(true);

    // Fetch all journal entries from the API
    const response = await fetch(`${BASE_API_URL}/journal_entries`);
    const data: APIResponse = await response.json();

    if (data.error) {
      window.alert(data.error);
    }

    if (data.results) {
      // Format the data for downloading as a file
      const formattedData = data.results.flatMap((result: JournalEntryReport) => [
        [`${result.journal_entry_date} Journal Entry:`],
        ["Account", "Debit", "Credit", "Description"],
        ...result.entries.map((entry: JournalEntry) => [
          entry.account,
          entry.debit ? parseFloat(entry.debit.toString()).toFixed(2) : "",
          entry.credit ? parseFloat(entry.credit.toString()).toFixed(2) : "",
          entry.description,
        ]),
        [
          "Total",
          result.totals.debit_total.toFixed(2),
          result.totals.credit_total.toFixed(2),
          "Ensuring journal balance",
        ],
        // add a gap of 2 rows
        [],
        [],
      ]);

      if (format === DownloadFileType.CSV) {
        downloadAsCSV(formattedData);
      } else if (format === DownloadFileType.EXCEL) {
        downloadAsExcel(formattedData);
      }
    }

    setIsDownload(false);
  };

  React.useEffect(() => {
    fetchLatestJournalEntry();
  }, []);

  React.useEffect(() => {
    if (filter) {
      fetchJournalEntries();
    }
  }, [filter, groupByYear]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", width: "100%", maxWidth: 1024, mx: 4 }}>
      <h1>{"Blue Onion Labs Journey Entry"}</h1>

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        {filter && <JournalEntryFilter filter={filter} handlers={filterChangeHandlers} />}

        <Button variant="contained" onClick={() => setGroupByYear(!groupByYear)}>
          {groupByYear ? "Group By Month" : "Group By Year"}
        </Button>

        <IconButton size="large" onClick={() => fetchJournalEntries()}>
          <RefreshIcon />
        </IconButton>
      </Box>

      <Box sx={{ mt: 2 }}>
        {isLoading ? (
          <Box sx={{ mt: -2 }}>
            {Array.from({ length: 9 }).map((_, index: number) => (
              <Skeleton key={index} animation="wave" sx={{ height: 80, mb: -3 }} />
            ))}
          </Box>
        ) : errorMessage ? (
          <Alert severity="error">{errorMessage}</Alert>
        ) : (
          <JournalEntryTable data={report} downloadResults={downloadResults} isDownload={isDownload} />
        )}
      </Box>
    </Box>
  );
}
