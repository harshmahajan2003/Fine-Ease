"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

export async function getAnalyticsData() {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
        include: {
            accounts: true,
            transactions: {
                orderBy: { date: "desc" },
            },
        },
    });

    if (!user) throw new Error("User not found");
    if (!user.isPremium) throw new Error("Analytics is a premium feature");

    const transactions = user.transactions;
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Calculate monthly data for last 6 months
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
        const month = new Date(currentYear, currentMonth - i, 1);
        const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
        const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0);

        const monthTransactions = transactions.filter((t) => {
            const date = new Date(t.date);
            return date >= monthStart && date <= monthEnd;
        });

        const income = monthTransactions
            .filter((t) => t.type === "INCOME")
            .reduce((sum, t) => sum + t.amount.toNumber(), 0);

        const expenses = monthTransactions
            .filter((t) => t.type === "EXPENSE")
            .reduce((sum, t) => sum + t.amount.toNumber(), 0);

        monthlyData.push({
            month: month.toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
            income,
            expenses,
            savings: income - expenses,
        });
    }

    // Category breakdown for current month
    const currentMonthTransactions = transactions.filter((t) => {
        const date = new Date(t.date);
        return (
            date.getMonth() === currentMonth &&
            date.getFullYear() === currentYear &&
            t.type === "EXPENSE"
        );
    });

    const categoryBreakdown = {};
    currentMonthTransactions.forEach((t) => {
        if (!categoryBreakdown[t.category]) {
            categoryBreakdown[t.category] = 0;
        }
        categoryBreakdown[t.category] += t.amount.toNumber();
    });

    const categoryData = Object.entries(categoryBreakdown)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);

    // Total calculations
    const totalIncome = monthlyData.reduce((sum, m) => sum + m.income, 0);
    const totalExpenses = monthlyData.reduce((sum, m) => sum + m.expenses, 0);
    const totalSavings = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? (totalSavings / totalIncome) * 100 : 0;

    // Current month totals
    const currentMonthIncome = monthlyData[5]?.income || 0;
    const currentMonthExpenses = monthlyData[5]?.expenses || 0;
    const currentMonthSavings = currentMonthIncome - currentMonthExpenses;

    // Previous month comparison
    const prevMonthIncome = monthlyData[4]?.income || 0;
    const prevMonthExpenses = monthlyData[4]?.expenses || 0;

    const incomeChange = prevMonthIncome > 0
        ? ((currentMonthIncome - prevMonthIncome) / prevMonthIncome) * 100
        : 0;
    const expenseChange = prevMonthExpenses > 0
        ? ((currentMonthExpenses - prevMonthExpenses) / prevMonthExpenses) * 100
        : 0;

    return {
        monthlyData,
        categoryData,
        summary: {
            totalIncome,
            totalExpenses,
            totalSavings,
            savingsRate,
            currentMonthIncome,
            currentMonthExpenses,
            currentMonthSavings,
            incomeChange,
            expenseChange,
        },
        currency: user.currency || "INR",
    };
}
