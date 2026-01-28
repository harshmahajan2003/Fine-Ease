"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/currency";

export function SavingsRate({ summary, currency }) {
    const rate = summary.savingsRate;
    const circumference = 2 * Math.PI * 45;
    const strokeDashoffset = circumference - (Math.min(Math.max(rate, 0), 100) / 100) * circumference;

    const getColor = (rate) => {
        if (rate >= 30) return { stroke: "#22c55e", bg: "bg-green-100", text: "text-green-600" };
        if (rate >= 20) return { stroke: "#84cc16", bg: "bg-lime-100", text: "text-lime-600" };
        if (rate >= 10) return { stroke: "#f59e0b", bg: "bg-amber-100", text: "text-amber-600" };
        if (rate >= 0) return { stroke: "#f97316", bg: "bg-orange-100", text: "text-orange-600" };
        return { stroke: "#ef4444", bg: "bg-red-100", text: "text-red-600" };
    };

    const colors = getColor(rate);

    const getGrade = (rate) => {
        if (rate >= 30) return { grade: "Excellent", emoji: "🌟" };
        if (rate >= 20) return { grade: "Great", emoji: "👏" };
        if (rate >= 10) return { grade: "Good", emoji: "👍" };
        if (rate >= 0) return { grade: "Needs Work", emoji: "💪" };
        return { grade: "In Debt", emoji: "⚠️" };
    };

    const gradeInfo = getGrade(rate);

    return (
        <Card className="col-span-1">
            <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    💎 Savings Rate
                </CardTitle>
                <p className="text-sm text-gray-500">Percentage of income saved (6 months)</p>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col items-center">
                    {/* Circular Progress */}
                    <div className="relative w-40 h-40">
                        <svg className="w-full h-full transform -rotate-90">
                            {/* Background circle */}
                            <circle
                                cx="80"
                                cy="80"
                                r="45"
                                stroke="#e5e7eb"
                                strokeWidth="10"
                                fill="none"
                            />
                            {/* Progress circle */}
                            <circle
                                cx="80"
                                cy="80"
                                r="45"
                                stroke={colors.stroke}
                                strokeWidth="10"
                                fill="none"
                                strokeLinecap="round"
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                                className="transition-all duration-1000 ease-out"
                            />
                        </svg>
                        {/* Center text */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className={`text-3xl font-bold ${colors.text}`}>
                                {rate.toFixed(1)}%
                            </span>
                            <span className="text-sm text-gray-500">saved</span>
                        </div>
                    </div>

                    {/* Grade Badge */}
                    <div className={`mt-4 px-4 py-2 rounded-full ${colors.bg}`}>
                        <span className={`font-medium ${colors.text}`}>
                            {gradeInfo.emoji} {gradeInfo.grade}
                        </span>
                    </div>

                    {/* Stats */}
                    <div className="mt-6 w-full space-y-3">
                        <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                            <span className="text-sm text-gray-600">Total Income</span>
                            <span className="font-medium text-green-600">
                                {formatCurrency(summary.totalIncome, currency)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                            <span className="text-sm text-gray-600">Total Expenses</span>
                            <span className="font-medium text-red-600">
                                {formatCurrency(summary.totalExpenses, currency)}
                            </span>
                        </div>
                        <div className={`flex justify-between items-center p-3 rounded-lg ${summary.totalSavings >= 0 ? 'bg-blue-50' : &apos;bg-red-50&apos;}`}>
                            <span className="text-sm text-gray-600">Net Savings</span>
                            <span className={`font-medium ${summary.totalSavings >= 0 ? 'text-blue-600' : &apos;text-red-600&apos;}`}>
                                {formatCurrency(summary.totalSavings, currency)}
                            </span>
                        </div>
                    </div>

                    {/* Tip */}
                    <div className="mt-4 text-center text-sm text-gray-500">
                        💡 Aim for 20%+ savings rate for financial health
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

