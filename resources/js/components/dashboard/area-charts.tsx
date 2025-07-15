import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface AreaChartComponentProps {
    data: any
    loading?: boolean
}

export const AreaChartComponent = ({ data, loading = false }: AreaChartComponentProps) => {

    const chartdata = data.labels?.map((label: string, index: number) => ({
        name: label,
        alerts: data.values?.[index] || 0,
    }));

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

    if (!chartdata || chartdata.length === 0) {
        return (
            <div className="w-full h-80 flex items-center justify-center">
                <div className="text-center text-gray-500">
                    <p>No data available</p>
                </div>
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartdata}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                    type="monotone"
                    dataKey="alerts"
                    stroke="#3b82f6"
                    fill="rgba(59, 130, 246, 0.2)"
                    strokeWidth={2}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}