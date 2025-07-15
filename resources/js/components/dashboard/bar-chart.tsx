import { Bar, BarChart, CartesianAxis, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface BarChartComponentProps {
    data: Array<{
        name: string
        count: number
    }>
    color?: string
    title?: string
    loading?: boolean
}

export const BarChartComponent = ({ data, color = '#3b82f6', title, loading = false }: BarChartComponentProps) => {

    if (loading) {
        return (
            <div className="mx-auto w-full max-w-sm rounded-md">
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

    if (!data || data.length === 0) {
        return (
            <div className="w-full h-80 flex items-center justify-center">
                <div className="text-center text-gray-500">
                    <p>No data available</p>
                    {title && <p className="text-sm mt-1">{title}</p>}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        height={100}
                        interval={0}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill={color} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}