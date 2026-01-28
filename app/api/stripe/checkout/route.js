import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/prisma";

export async function POST(req) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Check if user is already premium
        if (user.isPremium) {
            return NextResponse.json(
                { error: "You already have an active premium subscription" },
                { status: 400 }
            );
        }

        // Check if user already has a Stripe customer ID
        let customerId = user.stripeCustomerId;

        if (!customerId) {
            // Create a new Stripe customer
            const customer = await stripe.customers.create({
                email: user.email,
                name: user.name || undefined,
                metadata: {
                    userId: user.id,
                    clerkUserId: userId,
                },
            });
            customerId = customer.id;

            // Save the customer ID to the database
            await db.user.update({
                where: { id: user.id },
                data: { stripeCustomerId: customerId },
            });
        }

        // Create a checkout session for ₹99/month subscription
        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            mode: "subscription",
            // Let Stripe automatically show available payment methods for India
            billing_address_collection: "required", // Required for Indian regulations
            line_items: [
                {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: "Fine Ease Premium",
                            description: "Unlock AI Receipt Scanner and premium features",
                        },
                        unit_amount: 9900, // ₹99 in paise
                        recurring: {
                            interval: "month",
                        },
                    },
                    quantity: 1,
                },
            ],
            success_url: `${req.headers.get("origin")}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.get("origin")}/pricing?canceled=true`,
            metadata: {
                userId: user.id,
            },
        });

        return NextResponse.json({ url: session.url });
    } catch (error) {
        console.error("Stripe checkout error:", error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}
