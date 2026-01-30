import { Suspense } from "react";
import { getUserAccounts } from "@/actions/dashboard";
import { getDashboardData } from "@/actions/dashboard";
import { getCurrentBudget } from "@/actions/budget";
import { getUserSubscription } from "@/actions/subscription";
import AccountCard from "./_components/account-card";
import { CreateAccountDrawer } from "@/components/create-account-drawer";
import { BudgetProgress } from "./_components/budget-progress";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { DashboardOverview } from "./_components/transaction-overview";
import { PremiumSuccessBanner } from "./_components/premium-success-banner";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
    const [accounts, transactions, subscription] = await Promise.all([
        getUserAccounts(),
        getDashboardData(),
        getUserSubscription(),
    ]);
    const currency = subscription?.currency || "INR";

    const defaultAccount = accounts?.find((account) => account.isDefault);

    // Get budget for default account
    const budgetData = await getCurrentBudget(defaultAccount?.id);

    return (
        <div className="space-y-4 md:space-y-8">
            {/* Page Title */}
            <h1 className="text-xl md:text-3xl font-bold gradient-title">
                📊 Dashboard
            </h1>

            {/* Premium Success Banner */}
            <Suspense fallback={null}>
                <PremiumSuccessBanner />
            </Suspense>

            {/* Budget Progress */}
            <BudgetProgress
                initialBudget={budgetData?.budget}
                currentExpenses={budgetData?.currentExpenses || 0}
                currency={currency}
            />

            {/* Dashboard Overview */}
            <DashboardOverview
                accounts={accounts}
                transactions={transactions || []}
                currency={currency}
            />

            {/* Accounts Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <CreateAccountDrawer>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer border-dashed">
                        <CardContent className="flex flex-col items-center justify-center text-muted-foreground h-full pt-5">
                            <Plus className="h-10 w-10 mb-2" />
                            <p className="text-sm font-medium">Add New Account</p>
                        </CardContent>
                    </Card>
                </CreateAccountDrawer>
                {accounts.length > 0 &&
                    accounts?.map((account) => (
                        <AccountCard key={account.id} account={account} currency={currency} />
                    ))}
            </div>
        </div>
    );
}