import { Download, FileImage, FileSpreadsheet, FileText } from "lucide-react"
import { Button } from "../ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { ExportColumn, exportToCSV, exportToExcel, exportToPDF } from "./export-to"

interface DataTableToolbarProps {
    data: any[]
    exportColumns: ExportColumn[]
    filename?: string
    title?: string
}

export function DataTableToolbar({
    data,
    exportColumns,
    filename = 'export',
    title = 'Data Export',
}: DataTableToolbarProps) {

    const handleExcelExport = () => {
        exportToExcel(
            data,
            exportColumns,
            filename,
        );
    }

    const handleCSVExport = () => {
        exportToCSV(
            data,
            exportColumns,
            filename
        );
    }

    const handlePDFExport = () => {
        exportToPDF(
            data,
            exportColumns,
            filename,
            title
        );
    }

    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                            <Download />
                            Export
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                        <DropdownMenuItem onClick={handleExcelExport}>
                            <FileSpreadsheet />
                            Export to Excel
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleCSVExport}>
                            <FileText />
                            Export to CSV
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handlePDFExport}>
                            <FileImage />
                            Export to PDF
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
};