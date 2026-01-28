"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, Crown, XCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { cancelSubscription, resumeSubscription, cancelSubscriptionImmediately } from "@/actions/subscription";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function PricingCard({ isPremium, subscriptionEnd, cancelAtPeriodEnd = false }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [cancelLoading, setCancelLoading] = useState(false);

    const handleUpgrade = async () => {
        if (isPremium) {
            toast.error("You are already a Premium user! 🎉", {
                description: "You already have access to all premium features.",
            });
            return;
        }

        setLoading(true);
        try {
            const response = await fetch("/api/stripe/checkout", {
                method: "POST",
            });

            const data = await response.json();

            if (data.error) {
                toast.error(data.error);
                setLoading(false);
                return;
            }

            if (data.url) {
                window.location.href = data.url;
            }
        } catch (error) {
            toast.error(error.message || "Failed to start checkout");
            setLoading(false);
        }
    };

    const handleCancel = async () => {
        setCancelLoading(true);
        try {
            const result = await cancelSubscription();
            toast.success("Subscription cancelled", {
                description: "You&apos;ll still have access until the end of your billing period.",
            });
            router.refresh();
        } catch (error) {
            toast.error(error.message || "Failed to cancel subscription");
        } finally {
            setCancelLoading(false);
        }
    };

    const handleResume = async () => {
        setCancelLoading(true);
        try {
            const result = await resumeSubscription();
            toast.success("Subscription resumed! 🎉", {
                description: "Your premium access will continue.",
            });
            router.refresh();
        } catch (error) {
            toast.error(error.message || "Failed to resume subscription");
        } finally {
            setCancelLoading(false);
        }
    };

    const handleCancelImmediately = async () => {
        setCancelLoading(true);
        try {
            const result = await cancelSubscriptionImmediately();
            toast.success("Subscription ended", {
                description: "Your premium access has been removed immediately.",
            });
            router.refresh();
        } catch (error) {
            toast.error(error.message || "Failed to end subscription");
        } finally {
            setCancelLoading(false);
        }
    };

    return (
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden">
            {/* Popular badge */}
            <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                <Crown className="h-4 w-4" />
                Popular
            </div>

            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
                    <Sparkles className="h-6 w-6" />
                    Premium
                </h2>
                <div className="mt-4">
                    <span className="text-4xl font-bold">₹99</span>
                    <span className="text-blue-100">/month</span>
                </div>
            </div>

            <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                    <span className="text-green-300">✓</span>
                    <span>Everything in Free</span>
                </li>
                <li className="flex items-center gap-3">
                    <span className="text-green-300">✓</span>
                    <span className="font-bold">AI Receipt Scanner</span>
                </li>
                <li className="flex items-center gap-3">
                    <span className="text-green-300">✓</span>
                    <span className="font-bold">Multi-Currency Support</span>
                </li>
                <li className="flex items-center gap-3">
                    <span className="text-green-300">✓</span>
                    <span>Advanced analytics</span>
                </li>
                <li className="flex items-center gap-3">
                    <span className="text-green-300">✓</span>
                    <span>Export to CSV/PDF</span>
                </li>
                <li className="flex items-center gap-3">
                    <span className="text-green-300">✓</span>
                    <span>Priority support</span>
                </li>
            </ul>

            {isPremium ? (
                <div className="space-y-3">
                    {cancelAtPeriodEnd ? (
                        <>
                            <div className="text-center text-sm bg-yellow-500/20 rounded-lg p-3">
                                <p className="text-yellow-200 font-medium">Subscription cancelled</p>
                                <p className="text-yellow-100 text-xs mt-1">
                                    Access ends on {subscriptionEnd ? format(new Date(subscriptionEnd), "PPP") : "N/A"}
                                </p>
                            </div>
                            <Button
                                onClick={handleResume}
                                disabled={cancelLoading}
                                className="w-full py-3 px-6 bg-green-500 hover:bg-green-600 text-white font-bold"
                            >
                                {cancelLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <RefreshCw className="mr-2 h-4 w-4" />
                                        Resume Subscription
                                    </>
                                )}
                            </Button>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="w-full text-red-200 hover:text-white hover:bg-red-500/20"
                                        disabled={cancelLoading}
                                    >
                                        <XCircle className="mr-2 h-4 w-4" />
                                        End Immediately (Lose Access Now)
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle className="text-red-600">⚠️ End Subscription Immediately?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            <strong className="text-red-600">Warning:</strong> This will immediately end your subscription and you will lose access to all premium features right now.
                                            <br /><br />
                                            You will NOT receive a refund for the remaining days. Are you absolutely sure?
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Keep Access Until {subscriptionEnd ? format(new Date(subscriptionEnd), "MMM d") : "Period End"}</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={handleCancelImmediately}
                                            className="bg-red-600 hover:bg-red-700"
                                        >
                                            Yes, End Now
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </>
                    ) : (
                        <>
                            <div className="text-center text-sm text-blue-100">
                                Your subscription renews on{" "}
                                {subscriptionEnd
                                    ? format(new Date(subscriptionEnd), "PPP")
                                    : "N/A"}
                            </div>
                            <Button
                                className="w-full py-3 px-6 bg-white text-purple-600 hover:bg-blue-50 font-bold"
                                disabled
                            >
                                <Crown className="mr-2 h-4 w-4" />
                                Current Plan
                            </Button>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="w-full text-blue-200 hover:text-white hover:bg-white/10"
                                        disabled={cancelLoading}
                                    >
                                        {cancelLoading ? (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        ) : (
                                            <XCircle className="mr-2 h-4 w-4" />
                                        )}
                                        Cancel Subscription
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Cancel Subscription?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Are you sure you want to cancel your Premium subscription?
                                            You&apos;ll still have access to all premium features until{" "}
                                            <strong>{subscriptionEnd ? format(new Date(subscriptionEnd), "PPP") : "the end of your billing period"}</strong>.
                                            You can resume your subscription anytime before that date.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={handleCancel}
                                            className="bg-red-500 hover:bg-red-600"
                                        >
                                            Yes, Cancel
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </>
                    )}
                </div>
            ) : (
                <Button
                    onClick={handleUpgrade}
                    disabled={loading}
                    className="w-full py-3 px-6 bg-white text-purple-600 hover:bg-blue-50 font-bold"
                >
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        <>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Upgrade to Premium
                        </>
                    )}
                </Button>
            )}
        </div>
    );
}
