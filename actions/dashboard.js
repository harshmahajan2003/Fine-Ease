"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { accountSchema } from "@/app/lib/schema";
import { revalidatePath } from "next/cache";


const serializeTransaction = (obj) => {
    const serialized = { ...obj };

    if (obj.balance) {
        serialized.balance = obj.balance.toNumber();
    }

    if (obj.amount) {
        serialized.amount = obj.amount.toNumber();
    }

    return serialized;
};

export async function createAccount(data) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
        });

        if (!user) {
            throw new Error("User not found");
        }

        // Validate data
        const validatedData = accountSchema.parse(data);

        // Convert balance to float before saving (Prisma Decimal expects string or number, but best to be explicit if coming from input)
        // actually Zod schema says string. Prisma Decimal loves strings.
        const balanceFloat = parseFloat(validatedData.balance);
        if (isNaN(balanceFloat)) {
            throw new Error("Invalid balance amount");
        }

        // If this account is default, unset other defaults
        if (validatedData.isDefault) {
            await db.account.updateMany({
                where: { userId: user.id, isDefault: true },
                data: { isDefault: false },
            });
        }

        const account = await db.account.create({
            data: {
                ...validatedData,
                balance: balanceFloat,
                userId: user.id,
                isDefault: validatedData.isDefault,
            },
        });

        const serializedAccount = serializeTransaction(account);

        revalidatePath("/dashboard");
        return { success: true, data: serializedAccount };

    } catch (error) {
        throw new Error(error.message);
    }
}


export async function getUserAccount(){
    const {userId} = await auth();
    if(!userId){
        throw new Error("Unauthorized");
    }

    const user = await db.user.findUnique({
        where: {clerkUserId: userId},
    });

    if(!user){
        throw new Error("User not found");
    }

    const accounts = await db.account.findMany({
        where: {userId: user.id},
        orderBy: {createdAt: "desc"},
        include:{
            _count:{
                select:{
                    transactions: true
                },
            },
        },
    });

    const serializedAccounts = accounts.map(serializeTransaction);

    return serializedAccounts;  

}