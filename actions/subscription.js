"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { revalidatePath } from "next/cache";

export async function getUserSubscription() {
    const { userId } = await auth();
    if (!userId) return null;

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
        select: {
            isPremium: true,
            subscriptionId: true,
            subscriptionEnd: true,
            currency: true,
        },
    });

    return user;
}

export async function getUserCurrency() {
    const { userId } = await auth();
    if (!userId) return "INR";

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
        select: { currency: true, isPremium: true },
    });

    return user?.currency || "INR";
}

export async function updateUserCurrency(currencyCode) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");
    if (!user.isPremium) throw new Error("Multi-currency is a premium feature");

    const validCurrencies = ["INR", "USD", "EUR", "GBP", "JPY", "AUD", "CAD"];
    if (!validCurrencies.includes(currencyCode)) {
        throw new Error("Invalid currency code");
    }

    await db.user.update({
        where: { clerkUserId: userId },
        data: { currency: currencyCode },
    });

    revalidatePath("/dashboard");
    revalidatePath("/account");

    return { success: true, currency: currencyCode };
}

export async function cancelSubscription() {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
        });

        if (!user) throw new Error("User not found");

        if (!user.subscriptionId) {
            throw new Error("No active subscription");
        }

        // Cancel the subscription at period end
        await stripe.subscriptions.update(user.subscriptionId, {
            cancel_at_period_end: true,
        });

        revalidatePath("/dashboard");
        revalidatePath("/pricing");

        return { success: true, message: "Subscription will be cancelled at the end of the billing period" };
    } catch (error) {
        console.error("Cancel subscription error:", error);
        throw new Error(error.message);
    }
}

export async function cancelSubscriptionImmediately() {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
        });

        if (!user) throw new Error("User not found");

        if (!user.subscriptionId) {
            throw new Error("No active subscription");
        }

        // Cancel the subscription immediately (no refund)
        await stripe.subscriptions.cancel(user.subscriptionId);

        // Update user's premium status in database
        await db.user.update({
            where: { clerkUserId: userId },
            data: {
                isPremium: false,
                subscriptionId: null,
                subscriptionEnd: null,
            },
        });

        revalidatePath("/dashboard");
        revalidatePath("/pricing");

        return { success: true, message: "Subscription cancelled immediately" };
    } catch (error) {
        console.error("Cancel subscription immediately error:", error);
        throw new Error(error.message);
    }
}

export async function resumeSubscription() {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
        });

        if (!user) throw new Error("User not found");

        if (!user.subscriptionId) {
            throw new Error("No active subscription");
        }

        // Resume the subscription
        await stripe.subscriptions.update(user.subscriptionId, {
            cancel_at_period_end: false,
        });

        revalidatePath("/dashboard");
        revalidatePath("/pricing");

        return { success: true, message: "Subscription resumed successfully" };
    } catch (error) {
        console.error("Resume subscription error:", error);
        throw new Error(error.message);
    }
}
