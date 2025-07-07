import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver';

export interface ExportColumn {
    header: string
    accessor: string
    cell?: (value: any) => string
}

export const exportToExcel = (
    data: any[],
    columns: ExportColumn[],
    filename: string = 'export'
) => {
    const exportData = data.map((row) => {
        const exportRow: any = {};
        columns.forEach((col) => {
            const value = getNestedValue(row, col.accessor);
            exportRow[col.header] = col.cell ? col.cell(value) : value || '';
        });
        return exportRow;
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `${filename}.xlsx`);
}

export const exportToCSV = (
    data: any[],
    columns: ExportColumn[],
    filename: string = 'export'
) => {
    const exportData = data.map((row) => {
        const exportRow: any = {};
        columns.forEach((col) => {
            const value = getNestedValue(row, col.accessor);
            exportRow[col.header] = col.cell ? col.cell(value) : value || '';
        });
        return exportRow;
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const csv = XLSX.utils.sheet_to_csv(worksheet);

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${filename}.csv`);
}

export const exportToPDF = (
    data: any[],
    columns: ExportColumn[],
    filename: string = 'export',
    title: string = 'Data Export',
) => {

    const doc = new jsPDF('landscape', 'pt', 'legal');

    // Add title
    doc.setFontSize(16);
    doc.text(title, 14, 15);

    // Prepate table data
    const tableColumns = columns.map((col) => col.header);
    const tableRows = data.map((row) =>
        columns.map((col) => {
            const value = getNestedValue(row, col.accessor);
            let cellValue = col.cell ? col.cell(value) : value || '';

            if (typeof cellValue === 'string' && cellValue.length > 50) {
                cellValue = cellValue.substring(0, 47) + '...';
            }

            return String(cellValue);
        })
    );

    // column styles for industry alerts
    const columnStyles: { [key: number]: any } = {};

    // column widths based on content type
    columns.forEach((col, index) => {
        switch (col.accessor) {
            case 'number':
                columnStyles[index] = { cellWidth: 50 };
                break;
            case 'source.name':
                columnStyles[index] = { cellWidth: 50 };
                break;
            case 'incident_date':
                columnStyles[index] = { cellWidth: 75 };
                break;
            case 'description':
                columnStyles[index] = { cellWidth: 150 };
                break;
            case 'hyperlink_url':
                columnStyles[index] = { cellWidth: 75 };
                break;
            case 'regulations':
                columnStyles[index] = { cellWidth: 150 };
                break;
            case 'organization.name':
                columnStyles[index] = { cellWidth: 75 };
                break;
            case 'site.name':
                columnStyles[index] = { cellWidth: 75 };
                break;
            case 'plant_type.name':
                columnStyles[index] = { cellWidth: 75 };
                break;
            case 'plant_make.name':
                columnStyles[index] = { cellWidth: 75 };
            case 'plant_model.name':
                columnStyles[index] = { cellWidth: 50 };
                break;
            case ' hazards':
                columnStyles[index] = { cellWidth: 50 };
                break;
            default:
                columnStyles[index] = { cellWidth: 'auto' };
        }
    });

    autoTable(doc, {
        head: [tableColumns],
        body: tableRows,
        startY: 25,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [41, 128, 185] },
        columnStyles: columnStyles,
        margin: { top: 25, bottom: 14, left: 14, right: 14 },
        tableWidth: 'auto',
        theme: 'striped',
        alternateRowStyles: { fillColor: [245, 245, 245] },
        didDrawPage: (data) => {
            const pageCount = doc.getNumberOfPages();
            doc.setFontSize(8);
            doc.text(`Page ${data.pageNumber} of ${pageCount}`, data.settings.margin.left, doc.internal.pageSize.height - 10);
        }
    });

    doc.save(`${filename}.pdf`);
}

// Helper function to get nested object values
const getNestedValue = (
    obj: any,
    path: string
): any => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
}