"use client";

import { useState } from "react";
import { Menu, X, LayoutDashboard, Sparkles, BarChart3, Headphones, PenBox } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function MobileNav({ isPremium }) {
    const [isOpen, setIsOpen] = useState(false);

    const navItems = [
        { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard", color: "text-gray-600" },
        { href: "/pricing", icon: Sparkles, label: "Premium", color: "text-purple-600" },
        { href: "/analytics", icon: BarChart3, label: "Analytics", color: "text-blue-600" },
        { href: "/support", icon: Headphones, label: "Support", color: "text-green-600" },
        { href: "/transaction/create", icon: PenBox, label: "Add Transaction", color: "text-white", primary: true },
    ];

    return (
        <div className="md:hidden">
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
                className="relative z-50"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/50 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="fixed top-16 left-0 right-0 bg-white border-b shadow-lg z-40 animate-in slide-in-from-top duration-200">
                        <nav className="container mx-auto py-4 px-4 space-y-2">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${item.primary
                                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                                            : "hover:bg-gray-100"
                                        }`}
                                >
                                    <item.icon size={20} className={item.primary ? "text-white" : item.color} />
                                    <span className={`font-medium ${item.primary ? "text-white" : "text-gray-700"}`}>
                                        {item.label}
                                    </span>
                                </Link>
                            ))}
                        </nav>
                    </div>
                </>
            )}
        </div>
    );
}
