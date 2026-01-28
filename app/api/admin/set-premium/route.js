import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

// Temporary route to manually set user as premium (for testing)
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
                isPremium: true,
                subscriptionEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            },
        });

        return NextResponse.json({
            success: true,
            message: "🎉 You are now a Premium user! Refresh the page to see changes.",
            isPremium: user.isPremium,
            subscriptionEnd: user.subscriptionEnd,
        });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export { GET as POST };
