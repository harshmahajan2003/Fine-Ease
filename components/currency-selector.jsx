"use client";

import { useState, useTransition } from "react";
import { Globe, Lock, Check, Sparkles, Crown } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { CURRENCIES, DEFAULT_CURRENCY } from "@/lib/currency";
import { toast } from "sonner";
import { updateUserCurrency } from "@/actions/subscription";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

// Currency flags/colors for visual distinction
const CURRENCY_COLORS = {
    INR: "from-orange-500 to-green-500",
    USD: "from-green-500 to-green-700",
    EUR: "from-blue-500 to-blue-700",
    GBP: "from-red-500 to-blue-900",
    JPY: "from-red-500 to-white",
    AUD: "from-blue-600 to-yellow-500",
    CAD: "from-red-600 to-red-700",
};

export function CurrencySelector({ currentCurrency = DEFAULT_CURRENCY, isPremium = false }) {
    const [currency, setCurrency] = useState(currentCurrency);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleCurrencyChange = (newCurrency) => {
        if (!isPremium && newCurrency !== DEFAULT_CURRENCY) {
            toast.error("Multi-currency is a premium feature", {
                description: "Upgrade to Premium to unlock all currencies!",
                action: {
                    label: "Upgrade",
                    onClick: () => router.push("/pricing"),
                },
            });
            return;
        }

        if (newCurrency === currency) return;

        startTransition(async () => {
            try {
                await updateUserCurrency(newCurrency);
                setCurrency(newCurrency);
                toast.success(`Currency changed to ${CURRENCIES[newCurrency].name}`, {
                    icon: CURRENCIES[newCurrency].symbol,
                });
                router.refresh();
            } catch (error) {
                toast.error("Failed to update currency");
                console.error(error);
            }
        });
    };

    const currentCurrencyData = CURRENCIES[currency] || CURRENCIES[DEFAULT_CURRENCY];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                        "gap-2 relative group transition-all duration-200",
                        isPending && "opacity-50"
                    )}
                    disabled={isPending}
                >
                    <div className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center text-white text-sm font-bold",
                        "bg-gradient-to-br shadow-sm",
                        CURRENCY_COLORS[currency] || "from-gray-500 to-gray-700"
                    )}>
                        {currentCurrencyData.symbol}
                    </div>
                    {!isPremium && (
                        <Lock className="h-3 w-3 text-muted-foreground absolute -top-1 -right-1" />
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-2 bg-white shadow-lg border">
                {/* Header */}
                <DropdownMenuLabel className="flex items-center gap-2 text-xs text-muted-foreground font-normal pb-2">
                    <Globe className="h-3 w-3" />
                    Select Currency
                    {isPremium && (
                        <span className="ml-auto flex items-center gap-1 text-purple-600">
                            <Crown className="h-3 w-3" />
                            <span className="text-[10px] font-semibold">PRO</span>
                        </span>
                    )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {/* Currency list */}
                <div className="max-h-[280px] overflow-y-auto py-1">
                    {Object.values(CURRENCIES).map((curr) => {
                        const isSelected = currency === curr.code;
                        const isLocked = !isPremium && curr.code !== DEFAULT_CURRENCY;

                        return (
                            <DropdownMenuItem
                                key={curr.code}
                                onClick={() => handleCurrencyChange(curr.code)}
                                className={cn(
                                    "flex items-center gap-3 px-2 py-2.5 rounded-lg cursor-pointer transition-all my-0.5",
                                    isSelected && "bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200",
                                    isLocked && "opacity-60 hover:opacity-80"
                                )}
                            >
                                {/* Currency icon */}
                                <div className={cn(
                                    "w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-sm",
                                    "bg-gradient-to-br",
                                    CURRENCY_COLORS[curr.code] || "from-gray-500 to-gray-700"
                                )}>
                                    {curr.symbol}
                                </div>

                                {/* Currency info */}
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium text-sm">{curr.name}</div>
                                    <div className="text-xs text-muted-foreground">{curr.code}</div>
                                </div>

                                {/* Status indicators */}
                                {isSelected && (
                                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                                        <Check className="h-3 w-3 text-white" />
                                    </div>
                                )}
                                {isLocked && !isSelected && (
                                    <div className="flex items-center gap-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-[10px] font-semibold px-2 py-1 rounded-full">
                                        <Sparkles className="h-2.5 w-2.5" />
                                        PRO
                                    </div>
                                )}
                            </DropdownMenuItem>
                        );
                    })}
                </div>

                {/* Footer for free users */}
                {!isPremium && (
                    <>
                        <DropdownMenuSeparator />
                        <div
                            className="p-2 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg mt-1 cursor-pointer hover:from-purple-100 hover:to-blue-100 transition-colors"
                            onClick={() => router.push("/pricing")}
                        >
                            <div className="flex items-center gap-2 text-xs">
                                <Crown className="h-4 w-4 text-purple-600" />
                                <span className="font-medium text-purple-900">Unlock all currencies</span>
                            </div>
                            <p className="text-[10px] text-purple-600 mt-0.5 ml-6">
                                Upgrade to Premium for full access
                            </p>
                        </div>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

