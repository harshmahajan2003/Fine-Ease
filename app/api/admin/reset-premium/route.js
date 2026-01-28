import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

// Temporary route to reset premium status (for testing)
// DELETE THIS IN PRODUCTION
export async function GET(req) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized - Please login first" }, { status: 401 });
        }

        const user = await db.user.update({
            where: { clerkUserId: userId },
            data: {
                isPremium: false,
                subscriptionId: null,
                subscriptionEnd: null,
            },
        });

        return NextResponse.json({
            success: true,
            message: "Premium status reset! You can now test the payment flow again.",
            isPremium: user.isPremium,
        });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
