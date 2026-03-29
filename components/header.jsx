import React from "react";
import { Button } from "./ui/button";
import { PenBox, LayoutDashboard, Sparkles, Crown, BarChart3, Headphones } from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { checkUser } from "@/lib/check-user";
import Image from "next/image";
import { getUserSubscription } from "@/actions/subscription";
import { CurrencySelector } from "@/components/currency-selector";
import { MobileNav } from "@/components/mobile-nav";

const Header = async () => {
  await checkUser();

  let isPremium = false;
  let currency = "INR";
  try {
    const subscription = await getUserSubscription();
    isPremium = subscription?.isPremium || false;
    currency = subscription?.currency || "INR";
  } catch (error) {
    // User not authenticated, ignore
  }

  return (
    <header className="fixed top-0 w-full bg-white shadow-sm z-50 border-b border-gray-100">
      <nav className="container mx-auto px-4 py-2 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={"/logo.png"}
            alt="Fine Ease Logo"
            width={200}
            height={60}
            className="h-12 md:h-16 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop Navigation Links - Hidden on mobile */}
        <div className="hidden md:flex items-center space-x-4">
          <SignedOut>
            <a href="#features" className="text-gray-600 hover:text-blue-600">
              Features
            </a>
            <a href="#testimonials" className="text-gray-600 hover:text-blue-600">
              Testimonials
            </a>
          </SignedOut>
        </div>

        {/* Desktop Action Buttons - Hidden on mobile */}
        <div className="hidden md:flex items-center space-x-3">
          <SignedIn>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard">
                <LayoutDashboard size={16} />
                <span className="ml-1">Dashboard</span>
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="border-purple-300 text-purple-600 hover:bg-purple-50" asChild>
              <Link href="/pricing">
                <Sparkles size={16} />
                <span className="ml-1">Premium</span>
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="border-blue-300 text-blue-600 hover:bg-blue-50" asChild>
              <Link href="/analytics">
                <BarChart3 size={16} />
                <span className="ml-1">Analytics</span>
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="border-green-300 text-green-600 hover:bg-green-50" asChild>
              <Link href="/support">
                <Headphones size={16} />
                <span className="ml-1">Support</span>
              </Link>
            </Button>
            <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white" asChild>
              <Link href="/transaction/create">
                <PenBox size={16} />
                <span className="ml-1">Add Transaction</span>
              </Link>
            </Button>
          </SignedIn>
          <SignedOut>
            <SignInButton forceRedirectUrl="/dashboard">
              <Button variant="outline">Login</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <div className="flex items-center gap-2">
              <CurrencySelector currentCurrency={currency} isPremium={isPremium} />
              {isPremium && (
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <Crown className="h-3 w-3" />
                  PRO
                </div>
              )}
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-9 h-9",
                  },
                }}
              />
            </div>
          </SignedIn>
        </div>

        {/* Mobile Navigation - SIMPLIFIED */}
        <div className="flex md:hidden items-center gap-3">
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8",
                },
              }}
            />
            <MobileNav isPremium={isPremium} />
          </SignedIn>
          <SignedOut>
            <SignInButton forceRedirectUrl="/dashboard">
              <Button variant="outline" size="sm">Login</Button>
            </SignInButton>
          </SignedOut>
        </div>
      </nav>
    </header>
  );
};

export default Header;
