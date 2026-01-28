"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { formatCurrency } from "@/lib/currency";

export function IncomeExpenseChart({ data, currency }) {
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const income = payload.find(p => p.dataKey === "income")?.value || 0;
            const expenses = payload.find(p => p.dataKey === "expenses")?.value || 0;
            const net = income - expenses;

            return (
                <div className="bg-white p-3 border rounded-lg shadow-lg">
                    <p className="font-medium text-gray-900">{label}</p>
                    <p className="text-sm text-green-600">
                        Income: {formatCurrency(income, currency)}
                    </p>
                    <p className="text-sm text-red-600">
                        Expenses: {formatCurrency(expenses, currency)}
                    </p>
                    <hr className="my-1" />
                    <p className={`text-sm font-medium ${net >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                        Net: {formatCurrency(net, currency)}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <Card className="col-span-1">
            <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    💰 Income vs Expenses
                </CardTitle>
                <p className="text-sm text-gray-500">Monthly comparison</p>
            </CardHeader>
            <CardContent>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} barGap={4}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                            <YAxis
                                tick={{ fontSize: 12 }}
                                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Bar
                                dataKey="income"
                                name="Income"
                                fill="#22c55e"
                                radius={[4, 4, 0, 0]}
                            />
                            <Bar
                                dataKey="expenses"
                                name="Expenses"
                                fill="#ef4444"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
