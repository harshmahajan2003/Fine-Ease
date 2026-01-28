import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/prisma";
import { SupportForm } from "./_components/support-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, Lock, Headphones, Mail, Clock, Shield } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SupportPage() {
    const { userId } = await auth();

    if (!userId) {
        redirect("/sign-in");
    }

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
        select: {
            isPremium: true,
            name: true,
            email: true,
        },
    });

    // Premium gate
    if (!user?.isPremium) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-2xl mx-auto text-center">
                    <div className="bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-2xl p-12 border border-green-200">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
                            <Lock className="h-8 w-8 text-green-600" />
                        </div>
                        <h1 className="text-3xl font-bold gradient-title mb-4">
                            Priority Support
                        </h1>
                        <p className="text-gray-600 mb-8">
                            Get dedicated support from our team with faster response times
                            and priority handling of your requests.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            <div className="bg-white p-4 rounded-lg border">
                                <Clock className="h-6 w-6 text-green-600 mx-auto mb-2" />
                                <p className="text-sm font-medium">24hr Response</p>
                            </div>
                            <div className="bg-white p-4 rounded-lg border">
                                <Headphones className="h-6 w-6 text-green-600 mx-auto mb-2" />
                                <p className="text-sm font-medium">Direct Access</p>
                            </div>
                            <div className="bg-white p-4 rounded-lg border">
                                <Shield className="h-6 w-6 text-green-600 mx-auto mb-2" />
                                <p className="text-sm font-medium">Priority Queue</p>
                            </div>
                        </div>

                        <Link href="/pricing">
                            <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                                <Sparkles className="mr-2 h-4 w-4" />
                                Upgrade to Premium
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-blue-500 mb-4">
                        <Headphones className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold gradient-title mb-2">
                        Priority Support
                    </h1>
                    <p className="text-gray-600">
                        As a premium member, you get priority access to our support team
                    </p>
                </div>

                {/* Benefits */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                        <Clock className="h-6 w-6 text-green-600 mx-auto mb-2" />
                        <p className="text-sm font-medium text-green-700">24hr Response</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                        <Mail className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                        <p className="text-sm font-medium text-blue-700">Direct Email</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg text-center">
                        <Shield className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                        <p className="text-sm font-medium text-purple-700">Priority Queue</p>
                    </div>
                </div>

                {/* Support Form */}
                <SupportForm userName={user.name} userEmail={user.email} />

                {/* Direct Email Option */}
                <div className="mt-8 text-center p-6 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-600 mb-2">Or email us directly at</p>
                    <a
                        href="mailto:fineease2026@gmail.com"
                        className="text-lg font-medium text-blue-600 hover:underline"
                    >
                        fineease2026@gmail.com
                    </a>
                </div>
            </div>
        </div>
    );
}
