import React from "react";
import { Box, SelectChangeEvent } from "@mui/material";
import JournalEntryFilter from "./components/JournalEntryFilter";
import { JournalFilter } from "./types/journalEntries";
import { MonthsEnum } from "./enums/journalEntries";

export default function App() {
  const [filter, setFilter] = React.useState<JournalFilter>({
    month: MonthsEnum.January,
    year: new Date().getFullYear(),
  });

  const filterChangeHandlers = {
    handleMonthChange: (event: SelectChangeEvent<number>) => {
      setFilter({ ...filter, month: Number(event.target.value) });
    },
    handleYearChange: (event: SelectChangeEvent<number>) => {
      setFilter({ ...filter, year: Number(event.target.value) });
    },
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", width: "100%", maxWidth: 1024, mx: 4 }}>
      <h1>{"Blue Onion Labs Journey Entry"}</h1>

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <JournalEntryFilter filter={filter} handlers={filterChangeHandlers} />
      </Box>
    </Box>
  );
}
