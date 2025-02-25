import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { DownloadFileType } from "../enums/journalEntries";

export function downloadAsCSV(data: (string | number)[][]) {
  const csvContent = data.map((row) => row.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, `journal_entries_${Date.now().toString()}.${DownloadFileType.CSV}`);
}

export function downloadAsExcel(data: (string | number)[][]) {
  const ws = XLSX.utils.aoa_to_sheet(data);

  // adjust columns width
  const maxLengths = data.reduce((acc, row) => {
    row.forEach((cell, i) => {
      const cellLength = cell ? cell.toString().length : 0;
      acc[i] = Math.max(acc[i] !== undefined ? Number(acc[i]) : 0, cellLength);
    });
    return acc;
  }, [] as number[]);

  ws["!cols"] = maxLengths.map((length) => ({ wch: Number(length) + 2 }));

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Journal Entry");
  const xlsxBuffer = XLSX.write(wb, { bookType: DownloadFileType.EXCEL, type: "array" });
  const blob = new Blob([xlsxBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, `journal_entries_${Date.now().toString()}.${DownloadFileType.EXCEL}`);
}
