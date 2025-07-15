import { RecentAlert } from "@/types";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table"

interface RecentAlertsProps {
    alerts: RecentAlert[]
    loading?: boolean
}

export const RecentAlerts = ({ alerts, loading = false }: RecentAlertsProps) => {

    if (loading) {
        return (
            <div className="mx-auto w-full rounded-md">
                <div className="flex animate-pulse space-x-4">
                    <div className="flex-1 space-y-6 py-1">
                        <div className="h-2 rounded bg-gray-200"></div>
                        <div className="space-y-3">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-2 h-2 rounded bg-gray-200"></div>
                                <div className="col-span-1 h-2 rounded bg-gray-200"></div>
                            </div>
                            <div className="h-2 rounded bg-gray-200"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!alerts || alerts.length === 0) {
        <div className="flex items-center justify-center h-40">
            <div className="text-center text-gray-500">
                <p>No recent alerts available</p>
            </div>
        </div>
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableCell>Alert Number</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Incident Date</TableCell>
                </TableRow>
            </TableHeader>
            <TableBody>
                {alerts.map((alert, index) => (
                    <TableRow key={index}>
                        <TableCell>{alert.number}</TableCell>
                        <TableCell>{alert.description}</TableCell>
                        <TableCell>{new Date(alert.incident_date).toLocaleDateString('en-AU')}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}