"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendSupportEmail({ subject, message, priority }) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");
    if (!user.isPremium) throw new Error("Priority support is a premium feature");

    const priorityLabel = priority === "high" ? "🔴 HIGH" : priority === "medium" ? "🟡 MEDIUM" : "🟢 LOW";

    try {
        await resend.emails.send({
            from: "FineEase Support <onboarding@resend.dev>",
            to: "fineease2026@gmail.com",
            replyTo: user.email,
            subject: `[${priorityLabel}] ${subject}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px 10px 0 0;">
                        <h1 style="color: white; margin: 0;">🎫 Priority Support Request</h1>
                    </div>
                    <div style="background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb;">
                        <p><strong>From:</strong> ${user.name || "Premium User"}</p>
                        <p><strong>Email:</strong> ${user.email}</p>
                        <p><strong>Priority:</strong> ${priorityLabel}</p>
                        <p><strong>User ID:</strong> ${user.id}</p>
                        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
                        <p><strong>Subject:</strong> ${subject}</p>
                        <div style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb;">
                            <p style="white-space: pre-wrap;">${message}</p>
                        </div>
                    </div>
                    <div style="background: #1f2937; padding: 15px; border-radius: 0 0 10px 10px; text-align: center;">
                        <p style="color: #9ca3af; margin: 0; font-size: 12px;">
                            This is a priority support request from a Premium FineEase user.
                        </p>
                    </div>
                </div>
            `,
        });

        return { success: true, message: "Support request sent successfully!" };
    } catch (error) {
        console.error("Support email error:", error);
        throw new Error("Failed to send support request. Please try again.");
    }
}
