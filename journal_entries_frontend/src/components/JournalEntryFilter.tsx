import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { JournalFilter } from "../types/journalEntries";
import { MonthsEnum } from "../enums/journalEntries";

interface JournalEntryFilterProps {
  filter: JournalFilter;
  handlers: {
    handleMonthChange: (event: SelectChangeEvent<number>) => void;
    handleYearChange: (event: SelectChangeEvent<number>) => void;
  };
}

const JournalEntryFilter = ({ filter, handlers }: JournalEntryFilterProps) => {
  return (
    <Box sx={{ display: "flex", gap: 2, width: "100%", maxWidth: 400 }}>
      <FormControl fullWidth>
        <InputLabel id="journal-entries-filter-month">{"Month"}</InputLabel>
        <Select
          labelId="journal-entries-filter-month"
          id="journal-entry-month-select"
          value={filter.month}
          label="Month"
          onChange={handlers.handleMonthChange}
        >
          {Object.keys(MonthsEnum)
            .filter((key) => isNaN(Number(key)))
            .map((month) => (
              <MenuItem key={month} value={MonthsEnum[month as keyof typeof MonthsEnum]}>
                {month}
              </MenuItem>
            ))}
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel id="journal-entries-filter-year">{"Year"}</InputLabel>
        <Select
          labelId="journal-entries-filter-year"
          id="journal-entry-year-select"
          value={filter.year}
          label="Year"
          onChange={handlers.handleYearChange}
        >
          {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map((year) => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default JournalEntryFilter;
