"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Check, X } from "lucide-react";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateBudget } from "@/actions/budget";
import { formatCurrency } from "@/lib/currency";

export function BudgetProgress({ initialBudget, currentExpenses, currency = "INR" }) {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [newBudget, setNewBudget] = useState(
        initialBudget?.amount?.toString() || ""
    );
    // Local state to track the current budget (for immediate UI update)
    const [budget, setBudget] = useState(initialBudget);

    const {
        loading: isLoading,
        fn: updateBudgetFn,
        data: updatedBudget,
        error,
    } = useFetch(updateBudget);

    const percentUsed = budget
        ? (currentExpenses / budget.amount) * 100
        : 0;

    const handleUpdateBudget = async () => {
        const amount = parseFloat(newBudget);

        if (isNaN(amount) || amount <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }

        await updateBudgetFn(amount);
    };

    const handleCancel = () => {
        setNewBudget(budget?.amount?.toString() || "");
        setIsEditing(false);
    };

    // Update local budget state when server update succeeds
    useEffect(() => {
        if (updatedBudget?.success && updatedBudget?.data) {
            setIsEditing(false);
            // Update local budget state immediately
            setBudget(updatedBudget.data);
            setNewBudget(updatedBudget.data.amount.toString());
            toast.success("Budget updated successfully");
            // Also refresh server data in background
            router.refresh();
        }
    }, [updatedBudget, router]);

    // Sync with initialBudget prop if it changes (from server refresh)
    useEffect(() => {
        if (initialBudget) {
            setBudget(initialBudget);
            setNewBudget(initialBudget.amount?.toString() || "");
        }
    }, [initialBudget]);

    useEffect(() => {
        if (error) {
            toast.error(error.message || "Failed to update budget");
        }
    }, [error]);

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex-1">
                    <CardTitle className="text-sm font-medium">
                        Monthly Budget (Default Account)
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                        {isEditing ? (
                            <div className="flex items-center gap-2">
                                <Input
                                    type="number"
                                    value={newBudget}
                                    onChange={(e) => setNewBudget(e.target.value)}
                                    className="w-32"
                                    placeholder="Enter amount"
                                    autoFocus
                                    disabled={isLoading}
                                />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleUpdateBudget}
                                    disabled={isLoading}
                                >
                                    <Check className="h-4 w-4 text-green-500" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleCancel}
                                    disabled={isLoading}
                                >
                                    <X className="h-4 w-4 text-red-500" />
                                </Button>
                            </div>
                        ) : (
                            <>
                                <CardDescription>
                                    {budget
                                        ? `${formatCurrency(currentExpenses, currency)} of ${formatCurrency(budget.amount, currency)} spent`
                                        : "No budget set"}
                                </CardDescription>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsEditing(true)}
                                    className="h-6 w-6"
                                >
                                    <Pencil className="h-3 w-3" />
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {budget && (
                    <div className="space-y-2">
                        <Progress
                            value={percentUsed}
                            indicatorClassName={
                                percentUsed >= 90
                                    ? "bg-red-500"
                                    : percentUsed >= 75
                                        ? "bg-yellow-500"
                                        : "bg-green-500"
                            }
                        />
                        <p className="text-xs text-muted-foreground text-right">
                            {percentUsed.toFixed(1)}% used
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
