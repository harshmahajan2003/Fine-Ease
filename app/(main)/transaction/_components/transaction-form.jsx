"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Loader2, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CreateAccountDrawer } from "@/components/create-account-drawer";
import { cn } from "@/lib/utils";
import { createTransaction, updateTransaction } from "@/actions/transaction";
import { transactionSchema } from "@/app/lib/schema";
import { ReceiptScanner } from "./recipt-scanner";
import { formatCurrency } from "@/lib/currency";

export function AddTransactionForm({
    accounts,
    categories,
    editMode = false,
    initialData = null,
    isPremium = false,
    currency = "INR",
}) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const editId = searchParams.get("edit");

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
        getValues,
        reset,
    } = useForm({
        resolver: zodResolver(transactionSchema),
        defaultValues:
            editMode && initialData
                ? {
                    type: initialData.type,
                    amount: initialData.amount.toString(),
                    description: initialData.description,
                    accountId: initialData.accountId,
                    category: initialData.category,
                    date: new Date(initialData.date),
                    isRecurring: initialData.isRecurring,
                    ...(initialData.recurringInterval && {
                        recurringInterval: initialData.recurringInterval,
                    }),
                }
                : {
                    type: "EXPENSE",
                    amount: "",
                    description: "",
                    accountId: accounts.find((ac) => ac.isDefault)?.id || accounts[0]?.id || "",
                    date: new Date(),
                    isRecurring: false,
                },
    });

    const {
        loading: transactionLoading,
        fn: transactionFn,
        data: transactionResult,
    } = useFetch(editMode ? updateTransaction : createTransaction);

    const onSubmit = (data) => {
        const formData = {
            ...data,
            amount: parseFloat(data.amount),
        };

        if (editMode) {
            transactionFn(editId, formData);
        } else {
            transactionFn(formData);
        }
    };

    const handleScanComplete = (scannedData) => {
        if (scannedData) {
            setValue("amount", scannedData.amount.toString());
            setValue("date", new Date(scannedData.date));
            if (scannedData.description) {
                setValue("description", scannedData.description);
            }
            if (scannedData.category) {
                // Normalize the category from AI (handle spaces, hyphens, case)
                const normalizedCategory = scannedData.category
                    .toLowerCase()
                    .replace(/\s+/g, "-")
                    .replace(/_/g, "-");

                // Find matching category from the available categories
                const matchedCategory = categories.find(
                    (cat) =>
                        cat.id === normalizedCategory ||
                        cat.id === scannedData.category.toLowerCase() ||
                        cat.name.toLowerCase() === scannedData.category.toLowerCase()
                );

                if (matchedCategory) {
                    setValue("category", matchedCategory.id);
                } else {
                    // Default to "other-expense" if no match found
                    setValue("category", "other-expense");
                }
            }
            toast.success("Receipt scanned successfully");
        }
    };

    useEffect(() => {
        if (transactionResult?.success && !transactionLoading) {
            toast.success(
                editMode
                    ? "Transaction updated successfully"
                    : "Transaction created successfully"
            );
            reset();
            router.push(`/account/${transactionResult.data.accountId}`);
        }
    }, [transactionResult, transactionLoading, editMode]);

    const type = watch("type");
    const isRecurring = watch("isRecurring");
    const date = watch("date");

    const filteredCategories = categories.filter(
        (category) => category.type === type
    );

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Receipt Scanner - Premium Feature */}
            {!editMode && (
                isPremium ? (
                    <ReceiptScanner onScanComplete={handleScanComplete} />
                ) : (
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Sparkles className="h-5 w-5 text-purple-600" />
                            <div>
                                <p className="font-medium text-gray-900">AI Receipt Scanner</p>
                                <p className="text-sm text-gray-500">Upgrade to Premium to scan receipts automatically</p>
                            </div>
                        </div>
                        <Link href="/pricing">
                            <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 text-white">
                                Upgrade
                            </Button>
                        </Link>
                    </div>
                )
            )}

            {/* Type */}
            <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <Select
                    onValueChange={(value) => setValue("type", value)}
                    defaultValue={type}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="EXPENSE">Expense</SelectItem>
                        <SelectItem value="INCOME">Income</SelectItem>
                    </SelectContent>
                </Select>
                {errors.type && (
                    <p className="text-sm text-red-500">{errors.type.message}</p>
                )}
            </div>

            {/* Amount and Account */}
            <div className="grid gap-4 md:gap-6 md:grid-cols-2">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Amount</label>
                    <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...register("amount")}
                    />
                    {errors.amount && (
                        <p className="text-sm text-red-500">{errors.amount.message}</p>
                    )}
                </div>

                {/* Only show account selector if multiple accounts */}
                {accounts.length > 1 ? (
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Account</label>
                        <Select
                            onValueChange={(value) => setValue("accountId", value)}
                            defaultValue={getValues("accountId")}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select account" />
                            </SelectTrigger>
                            <SelectContent>
                                {accounts.map((account) => (
                                    <SelectItem key={account.id} value={account.id}>
                                        {account.name} ({formatCurrency(parseFloat(account.balance), currency)})
                                    </SelectItem>
                                ))}
                                <CreateAccountDrawer>
                                    <Button
                                        variant="outline"
                                        className="relative flex w-full cursor-pointer select-none items-center justify-center rounded-sm py-2 text-sm font-medium outline-none hover:bg-slate-100 hover:text-primary transition-colors border-dashed border-2"
                                    >
                                        + Create New Account
                                    </Button>
                                </CreateAccountDrawer>
                            </SelectContent>
                        </Select>
                        {errors.accountId && (
                            <p className="text-sm text-red-500">{errors.accountId.message}</p>
                        )}
                    </div>
                ) : accounts.length === 1 ? (
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Account</label>
                        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md border">
                            <span className="text-sm font-medium">{accounts[0].name}</span>
                            <span className="text-xs text-muted-foreground">
                                ({formatCurrency(parseFloat(accounts[0].balance), currency)})
                            </span>
                        </div>
                    </div>
                ) : null}
            </div>

            {/* Category */}
            <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select
                    onValueChange={(value) => setValue("category", value)}
                    defaultValue={getValues("category")}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                        {filteredCategories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                                {category.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.category && (
                    <p className="text-sm text-red-500">{errors.category.message}</p>
                )}
            </div>

            {/* Date */}
            <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className={cn(
                                "w-full pl-3 text-left font-normal",
                                !date && "text-muted-foreground"
                            )}
                        >
                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-white" align="start">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={(date) => setValue("date", date)}
                            disabled={(date) =>
                                date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
                {errors.date && (
                    <p className="text-sm text-red-500">{errors.date.message}</p>
                )}
            </div>

            {/* Description */}
            <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Input placeholder="Enter description" {...register("description")} />
                {errors.description && (
                    <p className="text-sm text-red-500">{errors.description.message}</p>
                )}
            </div>

            {/* Recurring Toggle */}
            <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                    <label className="text-base font-medium">Recurring Transaction</label>
                    <div className="text-sm text-muted-foreground">
                        Set up a recurring schedule for this transaction
                    </div>
                </div>
                <Switch
                    checked={isRecurring}
                    onCheckedChange={(checked) => setValue("isRecurring", checked)}
                />
            </div>

            {/* Recurring Interval */}
            {isRecurring && (
                <div className="space-y-2">
                    <label className="text-sm font-medium">Recurring Interval</label>
                    <Select
                        onValueChange={(value) => setValue("recurringInterval", value)}
                        defaultValue={getValues("recurringInterval")}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select interval" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="DAILY">Daily</SelectItem>
                            <SelectItem value="WEEKLY">Weekly</SelectItem>
                            <SelectItem value="MONTHLY">Monthly</SelectItem>
                            <SelectItem value="YEARLY">Yearly</SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.recurringInterval && (
                        <p className="text-sm text-red-500">
                            {errors.recurringInterval.message}
                        </p>
                    )}
                </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    className="bg-gradient-to-br from-blue-600 to-purple-600 hover:opacity-90 animate-gradient text-white font-bold"
                    disabled={transactionLoading}
                >
                    {transactionLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {editMode ? "Updating..." : "Creating..."}
                        </>
                    ) : editMode ? (
                        "Update Transaction"
                    ) : (
                        "Create Transaction"
                    )}
                </Button>
            </div>
        </form>
    );
}