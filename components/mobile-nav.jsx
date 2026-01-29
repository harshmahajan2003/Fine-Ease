"use client";

import { useState } from "react";
import { Menu, X, LayoutDashboard, Sparkles, BarChart3, Headphones, PenBox, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function MobileNav({ isPremium }) {
    const [isOpen, setIsOpen] = useState(false);

    const navItems = [
        { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard", color: "text-blue-600" },
        { href: "/transaction/create", icon: PenBox, label: "Add Transaction", color: "text-white", primary: true },
        { href: "/pricing", icon: Sparkles, label: "Premium", color: "text-purple-600" },
        { href: "/analytics", icon: BarChart3, label: "Analytics", color: "text-indigo-600" },
        { href: "/support", icon: Headphones, label: "Support", color: "text-green-600" },
    ];

    return (
        <>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
                className="relative z-[60]"
                aria-label="Menu"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/50 z-[55]"
                        onClick={() => setIsOpen(false)}
                    />
                    {/* Menu Panel */}
                    <div className="fixed top-[60px] left-0 right-0 bg-white shadow-xl z-[60] border-b">
                        <nav className="py-2 px-4 space-y-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`flex items-center gap-3 p-4 rounded-xl transition-all active:scale-95 ${item.primary
                                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                                            : "hover:bg-gray-100 active:bg-gray-200"
                                        }`}
                                >
                                    <item.icon size={22} className={item.primary ? "text-white" : item.color} />
                                    <span className={`font-semibold text-base ${item.primary ? "text-white" : "text-gray-800"}`}>
                                        {item.label}
                                    </span>
                                </Link>
                            ))}
                        </nav>
                    </div>
                </>
            )}
        </>
    );
}
