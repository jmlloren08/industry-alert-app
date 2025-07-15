import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface KpiBlockProps {
    title: string
    value: number
    trend: {
        percentage: number
        direction: 'up' | 'down' | 'stable'
        text: string
    }
    subtitle: string
    loading?: boolean
}

export const KPIBlock = ({
    title,
    value,
    trend,
    subtitle,
    loading = false
}: KpiBlockProps) => {

    const getTrendColor = () => {
        switch (trend?.direction) {
            case 'up':
                return 'text-green-500';
            case 'down':
                return 'text-red-500';
            case 'stable':
                return 'text-yellow-500';
            default:
                return 'text-gray-500';
        }
    }

    const getTrendIcon = () => {
        switch (trend?.direction) {
            case 'up':
                return <TrendingUp className="w-4 h-4 inline ml-1" />;
            case 'down':
                return <TrendingDown className="w-4 h-4 inline ml-1" />;
            case 'stable':
                return <Minus className="w-4 h-4 inline ml-1" />;
            default:
                return null;
        }
    }

    if (loading) {
        return (
            <div className="mx-auto w-full rounded-md border border-gray-200 p-4">
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

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <div className={`text-[8px] flex items-center ${getTrendColor()}`}>
                    {trend?.text}
                    {getTrendIcon()}
                </div>
                <div className="text-[8px] text-muted-foreground">{subtitle}</div>
            </CardContent>
        </Card>
    );
}