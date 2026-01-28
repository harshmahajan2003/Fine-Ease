"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Wallet, PiggyBank, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { formatCurrency } from "@/lib/currency";

export function AnalyticsSummary({ summary, currency }) {
    const cards = [
        {
            title: "Total Income (6 months)",
            value: summary.totalIncome,
            change: summary.incomeChange,
            icon: TrendingUp,
            color: "text-green-600",
            bgColor: "bg-green-100",
        },
        {
            title: "Total Expenses (6 months)",
            value: summary.totalExpenses,
            change: summary.expenseChange,
            icon: TrendingDown,
            color: "text-red-600",
            bgColor: "bg-red-100",
            invertChange: true,
        },
        {
            title: "Net Savings",
            value: summary.totalSavings,
            icon: PiggyBank,
            color: summary.totalSavings >= 0 ? "text-green-600" : "text-red-600",
            bgColor: summary.totalSavings >= 0 ? "bg-green-100" : "bg-red-100",
        },
        {
            title: "Savings Rate",
            value: summary.savingsRate,
            isPercentage: true,
            icon: Wallet,
            color: summary.savingsRate >= 20 ? "text-green-600" : summary.savingsRate >= 10 ? "text-yellow-600" : "text-red-600",
            bgColor: summary.savingsRate >= 20 ? "bg-green-100" : summary.savingsRate >= 10 ? "bg-yellow-100" : "bg-red-100",
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((card, index) => (
                <Card key={index} className="relative overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            {card.title}
                        </CardTitle>
                        <div className={`p-2 rounded-lg ${card.bgColor}`}>
                            <card.icon className={`h-4 w-4 ${card.color}`} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${card.color}`}>
                            {card.isPercentage
                                ? `${card.value.toFixed(1)}%`
                                : formatCurrency(card.value, currency)
                            }
                        </div>
                        {card.change !== undefined && (
                            <div className="flex items-center mt-1">
                                {card.invertChange ? (
                                    card.change > 0 ? (
                                        <>
                                            <ArrowUpRight className="h-3 w-3 text-red-500" />
                                            <span className="text-xs text-red-500">
                                                +{card.change.toFixed(1)}% vs last month
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <ArrowDownRight className="h-3 w-3 text-green-500" />
                                            <span className="text-xs text-green-500">
                                                {card.change.toFixed(1)}% vs last month
                                            </span>
                                        </>
                                    )
                                ) : (
                                    card.change >= 0 ? (
                                        <>
                                            <ArrowUpRight className="h-3 w-3 text-green-500" />
                                            <span className="text-xs text-green-500">
                                                +{card.change.toFixed(1)}% vs last month
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <ArrowDownRight className="h-3 w-3 text-red-500" />
                                            <span className="text-xs text-red-500">
                                                {card.change.toFixed(1)}% vs last month
                                            </span>
                                        </>
                                    )
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
