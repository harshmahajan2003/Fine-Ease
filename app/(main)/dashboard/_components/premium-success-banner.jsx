"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { X, Sparkles, CheckCircle2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PremiumSuccessBanner() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [show, setShow] = useState(false);
    const [receiptUrl, setReceiptUrl] = useState(null);

    useEffect(() => {
        if (searchParams.get("success") === "true") {
            setShow(true);
            const receipt = searchParams.get("receipt");
            if (receipt) {
                setReceiptUrl(decodeURIComponent(receipt));
            }
        }
    }, [searchParams]);

    const handleClose = () => {
        setShow(false);
        // Remove the success param from URL
        router.replace("/dashboard", { scroll: false });
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-300">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white text-center relative">
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 hover:bg-white/20 rounded-full p-1 transition"
                    >
                        <X className="h-5 w-5" />
                    </button>
                    <div className="bg-white/20 rounded-full p-4 inline-block mb-4">
                        <Sparkles className="h-8 w-8" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">
                        Welcome to Premium! 🎉
                    </h2>
                    <p className="text-purple-100">
                        Thank you for upgrading your account
                    </p>
                </div>

                {/* Features Unlocked */}
                <div className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">
                        You&apos;ve unlocked:
                    </h3>
                    <ul className="space-y-3">
                        <li className="flex items-center gap-3">
                            <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                            <span className="text-gray-700">
                                <strong>AI Receipt Scanner</strong> - Automatically extract transaction data from receipts
                            </span>
                        </li>
                        <li className="flex items-center gap-3">
                            <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                            <span className="text-gray-700">
                                <strong>Advanced Analytics</strong> - Detailed spending insights
                            </span>
                        </li>
                        <li className="flex items-center gap-3">
                            <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                            <span className="text-gray-700">
                                <strong>Export to CSV/PDF</strong> - Download your financial data
                            </span>
                        </li>
                        <li className="flex items-center gap-3">
                            <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                            <span className="text-gray-700">
                                <strong>Priority Support</strong> - Get help when you need it
                            </span>
                        </li>
                    </ul>

                    {/* Receipt Download Button */}
                    {receiptUrl && (
                        <a
                            href={receiptUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block mt-4"
                        >
                            <Button
                                variant="outline"
                                className="w-full border-purple-300 text-purple-600 hover:bg-purple-50"
                            >
                                <Download className="mr-2 h-4 w-4" />
                                Download Payment Receipt
                            </Button>
                        </a>
                    )}

                    <Button
                        onClick={handleClose}
                        className="w-full mt-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 text-white"
                    >
                        Start Using Premium Features
                    </Button>
                </div>
            </div>
        </div>
    );
}
