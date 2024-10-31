import React from 'react';
import * as XLSX from 'xlsx';

const ExportToExcel = ({ data, fileName }) => {
    const handleExport = () => {
        // Create a new workbook and add a worksheet
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

        // Generate Excel file and download it
        XLSX.writeFile(wb, `${fileName}.xlsx`);
    };

    return (
        <button onClick={handleExport}>
            Export to Excel
        </button>
    );
};

export default ExportToExcel;
