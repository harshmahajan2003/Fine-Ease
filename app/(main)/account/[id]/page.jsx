import { Suspense } from "react";
import { getAccountWithTransactions } from "@/actions/accounts";
import { getUserSubscription } from "@/actions/subscription";
import { BarLoader } from "react-spinners";
import TransactionTable from "../_components/transaction-table";
import { notFound } from "next/navigation";
import { AccountChart } from "../_components/account-chart";
import { formatCurrency } from "@/lib/currency";

export const dynamic = "force-dynamic";

export default async function AccountPage({ params }) {
    const { id } = await params;
    const [accountData, subscription] = await Promise.all([
        getAccountWithTransactions(id),
        getUserSubscription(),
    ]);
    const currency = subscription?.currency || "INR";

    if (!accountData) {
        notFound();
    }

    const { transactions, ...account } = accountData;

    return (
        <div className="space-y-8 px-5">
            <div className="flex gap-4 items-end justify-between">
                <div>
                    <h1 className="text-5xl sm:text-6xl font-bold tracking-tight gradient-title capitalize">
                        {account.name}
                    </h1>
                    <p className="text-muted-foreground">
                        {account.type.charAt(0) + account.type.slice(1).toLowerCase()}{" "}
                        Account
                    </p>
                </div>

                <div className="text-right pb-2">
                    <div className="text-xl sm:text-2xl font-bold">
                        {formatCurrency(parseFloat(account.balance), currency)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                        {account._count.transactions} Transactions
                    </p>
                </div>
            </div>

            {/* Chart Section */}
            <Suspense
                fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea" />}
            >
                <AccountChart transactions={transactions} currency={currency} />
            </Suspense>

            {/* Transactions Table */}
            <Suspense
                fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea" />}
            >
                <TransactionTable transactions={transactions} currency={currency} />
            </Suspense>
        </div>
    );
}