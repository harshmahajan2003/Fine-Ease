"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend,
} from "recharts";
import { formatCurrency } from "@/lib/currency";

const COLORS = [
    "#8b5cf6", // violet
    "#06b6d4", // cyan
    "#f59e0b", // amber
    "#ef4444", // red
    "#22c55e", // green
    "#ec4899", // pink
    "#3b82f6", // blue
    "#f97316", // orange
];

export function CategoryBreakdown({ data, currency }) {
    const total = data.reduce((sum, item) => sum + item.value, 0);

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const item = payload[0];
            const percentage = ((item.value / total) * 100).toFixed(1);
            return (
                <div className="bg-white p-3 border rounded-lg shadow-lg">
                    <p className="font-medium text-gray-900 capitalize">{item.name}</p>
                    <p className="text-sm text-gray-600">
                        {formatCurrency(item.value, currency)} ({percentage}%)
                    </p>
                </div>
            );
        }
        return null;
    };

    const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        if (percent < 0.05) return null; // Don't show label for < 5%
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={12}
                fontWeight="bold"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    if (data.length === 0) {
        return (
            <Card className="col-span-1">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">🥧 Category Breakdown</CardTitle>
                    <p className="text-sm text-gray-500">This month's expenses by category</p>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] flex items-center justify-center text-gray-500">
                        No expense data for this month
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="col-span-1">
            <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    🥧 Category Breakdown
                </CardTitle>
                <p className="text-sm text-gray-500">This month's expenses by category</p>
            </CardHeader>
            <CardContent>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={renderCustomLabel}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend
                                formatter={(value) => (
                                    <span className="capitalize text-sm">{value}</span>
                                )}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                {/* Category List */}
                <div className="mt-4 space-y-2 max-h-[150px] overflow-y-auto">
                    {data.slice(0, 5).map((item, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                />
                                <span className="capitalize">{item.name.replace(/-/g, ' ')}</span>
                            </div>
                            <span className="font-medium">
                                {formatCurrency(item.value, currency)}
                            </span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
