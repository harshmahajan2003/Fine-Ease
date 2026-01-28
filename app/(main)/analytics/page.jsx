import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/prisma";
import { getAnalyticsData } from "@/actions/analytics";
import { SpendingTrends } from "./_components/spending-trends";
import { CategoryBreakdown } from "./_components/category-breakdown";
import { IncomeExpenseChart } from "./_components/income-expense-chart";
import { SavingsRate } from "./_components/savings-rate";
import { AnalyticsSummary } from "./_components/analytics-summary";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, Lock } from "lucide-react";

export default async function AnalyticsPage() {
    const { userId } = await auth();

    if (!userId) {
        redirect("/sign-in");
    }

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
        select: { isPremium: true },
    });

    // Premium gate
    if (!user?.isPremium) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-2xl mx-auto text-center">
                    <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-2xl p-12 border border-purple-200">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 mb-6">
                            <Lock className="h-8 w-8 text-purple-600" />
                        </div>
                        <h1 className="text-3xl font-bold gradient-title mb-4">
                            Advanced Analytics
                        </h1>
                        <p className="text-gray-600 mb-8">
                            Unlock powerful insights with spending trends, category breakdowns,
                            income vs expense analysis, and savings tracking.
                        </p>
                        <Link href="/pricing">
                            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                                <Sparkles className="mr-2 h-4 w-4" />
                                Upgrade to Premium
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Fetch analytics data
    let analyticsData;
    try {
        analyticsData = await getAnalyticsData();
    } catch (error) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="text-center text-red-500">
                    Failed to load analytics data. Please try again.
                </div>
            </div>
        );
    }

    const { monthlyData, categoryData, summary, currency } = analyticsData;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold gradient-title mb-2">
                    Advanced Analytics
                </h1>
                <p className="text-gray-600">
                    Deep insights into your financial health
                </p>
            </div>

            {/* Summary Cards */}
            <AnalyticsSummary summary={summary} currency={currency} />

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                {/* Spending Trends */}
                <SpendingTrends data={monthlyData} currency={currency} />

                {/* Category Breakdown */}
                <CategoryBreakdown data={categoryData} currency={currency} />

                {/* Income vs Expense */}
                <IncomeExpenseChart data={monthlyData} currency={currency} />

                {/* Savings Rate */}
                <SavingsRate summary={summary} currency={currency} />
            </div>
        </div>
    );
}
