"use server";

import { db } from "@/lib/prisma";
import { subDays } from "date-fns";

const ACCOUNT_ID = "acco6cb83411-950b-4651-a30c-67a36b480d05unt-id"
const USER_ID = "38e72e0b-0aa9-4d96-94d3-1332599ce30e-id"

const CATEGORIES = {
    INCOME: [
        { name: "salary", range: [10000, 20000] },
        { name: "freelance", range: [5000, 10000] },
        { name: "side hustle", range: [2000, 5000] },
        { name: "gift", range: [1000, 2000] },
        { name: "bonus", range: [5000, 10000] },

    ],
    EXPENSE: [
        { name: "rent", range: [5000, 10000] },
        { name: "utilities", range: [2000, 5000] },
        { name: "groceries", range: [1000, 2000] },
        { name: "transport", range: [500, 1000] },
        { name: "health", range: [500, 1000] },
        { name: "education", range: [500, 1000] },
        { name: "entertainment", range: [500, 1000] },
        { name: "shopping", range: [500, 1000] },
        { name: "travel", range: [500, 1000] },
        { name: "other", range: [500, 1000] },
    ],
};


function getRandomAmount(min, max) {
    return Math.floor(Math.random() * (max - min) + min).toFixed(2);
}



function getRandomCategory(type) {
    const categories = CATEGORIES[type];
    const randomIndex = Math.floor(Math.random() * categories.length);
    const amount = getRandomAmount(categories[randomIndex].range[0], categories[randomIndex].range[1]);
    return { name: categories[randomIndex].name, amount: amount };
}

export async function seedTransactions() {
    try {
        // Fetch the first user from the database
        const user = await db.user.findFirst();

        if (!user) {
            return { success: false, error: "No user found in database. Please create a user first." };
        }

        // Fetch the first account for this user
        let account = await db.account.findFirst({
            where: { userId: user.id }
        });

        // If no account exists, create a default one (optional, but good for seeding)
        if (!account) {
            account = await db.account.create({
                data: {
                    name: "Default Account",
                    type: "CURRENT",
                    userId: user.id,
                    balance: 0,
                    isDefault: true
                }
            });
        }

        const ACCOUNT_ID = account.id;
        const USER_ID = user.id;

        const transactions = [];
        let totalBalance = 0; // Initialize with current balance or 0? 
        // Note: Seeding usually assumes fresh data or appends.
        // If appending, we might disrupt existing balance calculation unless we are careful.
        // For now, let's treat it as adding to 0, and then we add this total to the account balance.

        for (let i = 90; i >= 0; i--) {
            const date = subDays(new Date(), i);
            const transactionPerDay = Math.floor(Math.random() * 3) + 1;

            for (let j = 0; j < transactionPerDay; j++) {
                const type = Math.random() < 0.4 ? "INCOME" : "EXPENSE";
                const { name: category, amount } = getRandomCategory(type);

                const transaction = {
                    id: crypto.randomUUID(),
                    type,
                    amount,
                    description: `${type === "INCOME" ? "Income" : "Paid for"} ${category}`,
                    date,
                    category,
                    status: "COMPLETED", // Fixed casing from "Completed" to match Schema enum if needed, Schema says TransactionStatus which has COMPLETED. Check Schema.
                    // Schema enum TransactionStatus: PENDING, COMPLETED, FAILED
                    // Prisma is usually case sensitive for enums. 
                    // Wait, schema says COMPLETED (all caps). The code said "Completed".
                    // Let's fix this to "COMPLETED".
                    createdAt: date,
                    updatedAt: date,
                    accountId: ACCOUNT_ID,
                    userId: USER_ID,
                };

                totalBalance += type === "INCOME" ? parseFloat(amount) : -parseFloat(amount);
                transactions.push(transaction);
            }
        }

        await db.$transaction(async (tx) => {
            // 1. Create transactions
            await tx.transaction.createMany({
                data: transactions.map(t => ({
                    ...t,
                    status: "COMPLETED" // Ensure enum match
                })),
            });

            // 2. Update account balance
            // We should increment the existing balance, not overwrite it?
            // Or if this is a fresh seed, overwrite.
            // But if we just overwrite with 'totalBalance' calculated from *these* transactions, 
            // the account balance will ignore any previous transactions if they existed.
            // Since this is a dev seed script, maybe incrementing is safer?

            await tx.account.update({
                where: { id: ACCOUNT_ID },
                data: {
                    balance: {
                        increment: totalBalance
                    }
                },
            });
        });

        return {
            success: true,
            message: `Created ${transactions.length} transactions`
        };

    } catch (error) {
        console.error("Error seeding transactions:", error);
        return { success: false, error: error.message };
    }
}
