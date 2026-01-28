import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { PricingCard } from "./_components/pricing-card";

export const dynamic = "force-dynamic";

export default async function PricingPage() {
    const { userId } = await auth();

    if (!userId) {
        redirect("/sign-in");
    }

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
        select: {
            isPremium: true,
            subscriptionEnd: true,
            subscriptionId: true,
        },
    });

    // Check Stripe subscription status
    let cancelAtPeriodEnd = false;
    if (user?.subscriptionId) {
        try {
            const subscription = await stripe.subscriptions.retrieve(user.subscriptionId);
            cancelAtPeriodEnd = subscription.cancel_at_period_end;
        } catch (error) {
            console.error("Error fetching Stripe subscription:", error);
        }
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold gradient-title mb-4">
                    Choose Your Plan
                </h1>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                    Unlock powerful features to manage your finances like a pro
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Free Plan */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Free</h2>
                        <div className="mt-4">
                            <span className="text-4xl font-bold">₹0</span>
                            <span className="text-gray-500">/month</span>
                        </div>
                    </div>

                    <ul className="space-y-4 mb-8">
                        <li className="flex items-center gap-3">
                            <span className="text-green-500">✓</span>
                            <span>Unlimited accounts</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="text-green-500">✓</span>
                            <span>Unlimited transactions</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="text-green-500">✓</span>
                            <span>Budget tracking</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="text-green-500">✓</span>
                            <span>Monthly reports</span>
                        </li>
                        <li className="flex items-center gap-3 text-gray-400">
                            <span>✗</span>
                            <span>AI Receipt Scanner</span>
                        </li>
                        <li className="flex items-center gap-3 text-gray-400">
                            <span>✗</span>
                            <span>Priority support</span>
                        </li>
                    </ul>

                    <button
                        disabled
                        className="w-full py-3 px-6 rounded-lg border-2 border-gray-300 text-gray-500 font-medium cursor-not-allowed"
                    >
                        Current Plan
                    </button>
                </div>

                {/* Premium Plan */}
                <PricingCard
                    isPremium={user?.isPremium || false}
                    subscriptionEnd={user?.subscriptionEnd}
                    cancelAtPeriodEnd={cancelAtPeriodEnd}
                />
            </div>
        </div>
    );
}
