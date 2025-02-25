import {
  Box,
  Button,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  Paper,
  tableCellClasses,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { JournalEntry, JournalEntryReport } from "../types/journalEntries";
import { DownloadFileType } from "../enums/journalEntries";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

interface JournalEntriesTableProps {
  data: JournalEntryReport;
  downloadResults: (format: DownloadFileType) => Promise<void>;
  isDownload: boolean;
}

const JournalEntriesTable = ({ data, downloadResults, isDownload }: JournalEntriesTableProps) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <TableContainer component={Paper}>
        <Table aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>{"Account"}</StyledTableCell>
              <StyledTableCell>{"Debit"}</StyledTableCell>
              <StyledTableCell>{"Credit"}</StyledTableCell>
              <StyledTableCell>{"Description"}</StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data!.entries!.map((entry: JournalEntry, index: number) => (
              <StyledTableRow key={index}>
                <StyledTableCell component="th" scope="row">
                  {entry.account}
                </StyledTableCell>
                <StyledTableCell>{entry.debit}</StyledTableCell>
                <StyledTableCell>{entry.credit}</StyledTableCell>
                <StyledTableCell>{entry.description}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
        <Button variant="contained" onClick={() => downloadResults(DownloadFileType.CSV)} loading={isDownload}>
          {"Download As CSV"}
        </Button>

        <Button variant="contained" onClick={() => downloadResults(DownloadFileType.EXCEL)} loading={isDownload}>
          {"Download As Excel"}
        </Button>
      </Box>
    </Box>
  );
};

export default JournalEntriesTable;
