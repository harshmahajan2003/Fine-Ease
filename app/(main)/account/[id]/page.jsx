import React from 'react'
import { getAccountWithTransactions } from '@/actions/accounts';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import TransactionTable from '../_components/transaction-table';
import { BarLoader } from 'react-spinners';
import { Card, CardContent } from '@/components/ui/card';



const AccountsPage = async ({ params }) => {
    const { id } = await params;
    const accountData = await getAccountWithTransactions(id);

    if (!accountData) {
        notFound();
    }

    const { transactions, ...account } = accountData.data;

    return (
        <div className="space-y-8">
            <div className="flex gap-4 items-end justify-between">
                <div>
                    <h1 className="text-5xl font-bold tracking-tight gradient-title capitalize">{account.name}</h1>
                    <p className="text-muted-foreground">{account.type.charAt(0).toUpperCase() + account.type.slice(1).toLowerCase()} Account</p>
                </div>
                <div className="text-right pb-2">
                    <div className="text-xl sm:text-2xl font-bold">₹{parseFloat(account.balance).toFixed(2)}  </div>
                    <p className="text-xs sm:text-sm text-muted-foreground">{account._count.transactions} Transactions</p>
                </div>
            </div>

            {/* Transaction Table */}

            <Suspense
                fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea" />}
            >
                <TransactionTable transactions={transactions} />
            </Suspense>

            <div>
            </div>
        </div>
    )
}

export default AccountsPage

