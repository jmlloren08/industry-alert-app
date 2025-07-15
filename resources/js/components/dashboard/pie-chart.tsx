import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = [
    '#3b82f6',
    '#ef4444',
    '#10b981',
    '#f59e0b',
    '#8b5cf6',
    '#f97316',
    '#06b6d4',
    '#84cc16',
];

interface PieChartComponentProps {
    data: Array<{
        name: string
        count: number
    }>
    title?: string
    loading?: boolean
}

export const PieChartComponent = ({ data, title, loading = false }: PieChartComponentProps) => {

    const chartData = data.map((item, index) => ({
        ...item,
        fill: COLORS[index % COLORS.length],
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

    if (!data || !Array.isArray(data) || data.length === 0) {
        <div className="w-full h-80 flex items-center justify-center">
            <div className="text-center text-gray-500">
                <p>No data available</p>
                {title && <p className="text-sm mt-1">{title}</p>}
            </div>
        </div>
    }

    return (
        <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}