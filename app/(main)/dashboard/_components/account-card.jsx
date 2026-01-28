"use client";

import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ArrowUpRight, ArrowDownLeft, Trash2 } from "lucide-react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";
import { useEffect } from "react";
import { updateDefaultAccount, deleteAccount } from "@/actions/accounts";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/currency";

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

const AccountCard = ({ account, currency = "INR" }) => {
    const { name, type, balance, isDefault, id } = account;
    const router = useRouter();


    const {
        loading: updateDefaultLoading,
        fn: updateDefaultFn,
        data: updatedAccount,
        error,
    } = useFetch(updateDefaultAccount);

    const {
        loading: deleteLoading,
        fn: deleteFn,
        data: deleteResult,
        error: deleteError,
    } = useFetch(deleteAccount);

    const handleDefaultChange = async (event) => {
        if (event?.preventDefault) {
            event.preventDefault();
        }

        if (isDefault) {
            toast.warning("you need to select another account as default first");
            return;
        }

        await updateDefaultFn(id);
    };

    const handleDelete = async (event) => {
        if (isDefault) {
            toast.warning("Cannot delete default account. Set another account as default first.");
            return;
        }
        await deleteFn(id);
    };


    useEffect(() => {
        if (updatedAccount?.success) {
            toast.success("Default account updated successfully");
            router.refresh();
        }
    }, [updatedAccount, updateDefaultLoading]);

    useEffect(() => {
        if (deleteResult?.success) {
            toast.success("Account deleted successfully");
            router.refresh(); // Refresh the page to show updated list
        }
    }, [deleteResult]);

    useEffect(() => {
        if (deleteError) {
            toast.error("Failed to delete account");
        }
    }, [deleteError]);

    return (
        <Card className="hover:shadow-md transition-shadow group relative">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium capitalize">
                    {name}
                </CardTitle>
                <div className="flex items-center gap-2">
                    <div
                        className="flex items-center gap-1 group/switch cursor-pointer"
                        onClick={handleDefaultChange}
                    >
                        <span className={`text-xs ${isDefault ? "text-green-600 font-medium" : "text-muted-foreground group-hover/switch:text-foreground"}`}>
                            {isDefault ? "Default" : "Set Default"}
                        </span>
                        <Switch
                            checked={isDefault}
                            disabled={updateDefaultLoading}
                            className={isDefault ? "data-[state=checked]:bg-green-500" : ""}
                        />
                    </div>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100"
                                disabled={deleteLoading || isDefault}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-white">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-destructive font-black text-2xl">
                                    <div className="flex items-center gap-2">
                                        <Trash2 className="h-6 w-6 text-red-600 animate-bounce" />
                                        DELETE ACCOUNT?
                                    </div>
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-base font-medium text-gray-700 py-4">
                                    <span className="block mb-2 text-red-600 font-bold border-l-4 border-red-600 pl-3 bg-red-50 p-2 rounded-r-md">
                                        ⚠️ WARNING: THIS IS PERMANENT!
                                    </span>
                                    This action cannot be undone. This will permanently delete your account
                                    <span className="font-bold text-black"> "{name}" </span>
                                    and remove your data from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel className="font-bold hover:bg-gray-100">Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 font-bold px-8 shadow-lg shadow-red-200">
                                    YES, DELETE IT
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </CardHeader>
            <Link href={`/account/${id}`}>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {formatCurrency(parseFloat(balance), currency)}
                    </div>
                    <p className="text-xs text-muted-foreground capitalize">
                        {type.charAt(0).toUpperCase() + type.slice(1)} Account
                    </p>
                </CardContent>
                <CardFooter className="flex justify-between text-sm text-muted-foreground">
                    <div className="flex items-center">
                        <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
                        Income
                    </div>
                    <div className="flex items-center">
                        <ArrowDownLeft className="mr-1 h-4 w-4 text-red-500" />
                        Expense
                    </div>
                </CardFooter>
            </Link>
        </Card>
    );
};

export default AccountCard;
