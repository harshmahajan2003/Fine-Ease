import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/prisma";

export async function POST(req) {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    let event;

    // If webhook secret is not set (development), skip signature verification
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
        try {
            event = JSON.parse(body);
        } catch (error) {
            return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
        }
    } else {
        try {
            event = stripe.webhooks.constructEvent(
                body,
                signature,
                process.env.STRIPE_WEBHOOK_SECRET
            );
        } catch (error) {
            console.error("Webhook signature verification failed:", error.message);
            return NextResponse.json(
                { error: `Webhook Error: ${error.message}` },
                { status: 400 }
            );
        }
    }

    try {
        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object;
                const userId = session.metadata?.userId;

                if (userId && session.subscription) {
                    // Get subscription details
                    const subscription = await stripe.subscriptions.retrieve(
                        session.subscription
                    );

                    await db.user.update({
                        where: { id: userId },
                        data: {
                            isPremium: true,
                            subscriptionId: session.subscription,
                            subscriptionEnd: new Date(
                                subscription.current_period_end * 1000
                            ),
                        },
                    });

                    console.log(`User ${userId} upgraded to premium`);
                }
                break;
            }

            case "customer.subscription.updated": {
                const subscription = event.data.object;
                const user = await db.user.findFirst({
                    where: { subscriptionId: subscription.id },
                });

                if (user) {
                    const isActive = subscription.status === "active";
                    await db.user.update({
                        where: { id: user.id },
                        data: {
                            isPremium: isActive,
                            subscriptionEnd: new Date(
                                subscription.current_period_end * 1000
                            ),
                        },
                    });
                }
                break;
            }

            case "customer.subscription.deleted": {
                const subscription = event.data.object;
                const user = await db.user.findFirst({
                    where: { subscriptionId: subscription.id },
                });

                if (user) {
                    await db.user.update({
                        where: { id: user.id },
                        data: {
                            isPremium: false,
                            subscriptionId: null,
                            subscriptionEnd: null,
                        },
                    });

                    console.log(`User ${user.id} subscription cancelled`);
                }
                break;
            }

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error("Webhook handler error:", error);
        return NextResponse.json(
            { error: "Webhook handler failed" },
            { status: 500 }
        );
    }
}
