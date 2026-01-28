import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { sendEmail } from "@/actions/send-email";
import PremiumWelcomeEmail from "@/emails/premium-welcome";

export default async function SuccessPage({ searchParams }) {
    const { userId } = await auth();

    if (!userId) {
        redirect("/sign-in");
    }

    const resolvedParams = await searchParams;
    const sessionId = resolvedParams?.session_id;
    let receiptUrl = null;

    if (sessionId) {
        try {
            // Retrieve the checkout session from Stripe with invoice expanded
            const session = await stripe.checkout.sessions.retrieve(sessionId, {
                expand: ["invoice"],
            });

            if (session.payment_status === "paid" && session.metadata?.userId) {
                // Get subscription details
                const subscription = await stripe.subscriptions.retrieve(
                    session.subscription
                );

                // Get the user
                const existingUser = await db.user.findUnique({
                    where: { id: session.metadata.userId },
                });

                // Get receipt/invoice URL from Stripe
                if (session.invoice) {
                    const invoice = typeof session.invoice === "string"
                        ? await stripe.invoices.retrieve(session.invoice)
                        : session.invoice;
                    receiptUrl = invoice.hosted_invoice_url || invoice.invoice_pdf || null;
                }

                if (existingUser) {
                    // Update user to premium (only if not already)
                    if (!existingUser.isPremium) {
                        await db.user.update({
                            where: { id: session.metadata.userId },
                            data: {
                                isPremium: true,
                                subscriptionId: session.subscription,
                                subscriptionEnd: new Date(
                                    subscription.current_period_end * 1000
                                ),
                            },
                        });
                    }

                    // Always send welcome email (use try-catch to not block)
                    try {
                        await sendEmail({
                            to: existingUser.email,
                            subject: "🎉 Welcome to Fine Ease Premium!",
                            react: PremiumWelcomeEmail({
                                userName: existingUser.name || "User",
                                receiptUrl: receiptUrl || "#",
                            }),
                        });
                        console.log("Welcome email sent to:", existingUser.email);
                    } catch (emailError) {
                        console.error("Failed to send email:", emailError);
                    }
                }
            }
        } catch (error) {
            console.error("Error processing payment success:", error);
        }
    }

    // Redirect to dashboard with success message and receipt URL
    const redirectUrl = receiptUrl
        ? `/dashboard?success=true&receipt=${encodeURIComponent(receiptUrl)}`
        : "/dashboard?success=true";

    redirect(redirectUrl);
}
