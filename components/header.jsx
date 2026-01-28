import React from "react";
import { Button } from "./ui/button";
import { PenBox, LayoutDashboard, Sparkles, Crown, BarChart3, Headphones } from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { checkUser } from "@/lib/check-user";
import Image from "next/image";
import { getUserSubscription } from "@/actions/subscription";
import { CurrencySelector } from "@/components/currency-selector";

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
      <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={"/logo.png"}
            alt="Fine Ease Logo"
            width={250}
            height={90}
            className="h-32 w-auto object-contain"
            priority
          />
        </Link>

        {/* Navigation Links - Different for signed in/out users */}
        <div className="hidden md:flex items-center space-x-8">
          <SignedOut>
            <a href="#features" className="text-gray-600 hover:text-blue-600">
              Features
            </a>
            <a
              href="#testimonials"
              className="text-gray-600 hover:text-blue-600"
            >
              Testimonials
            </a>
          </SignedOut>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-4">
          <SignedIn>
            <Link
              href="/dashboard"
              className="text-gray-600 hover:text-blue-600 flex items-center gap-2"
            >
              <Button variant="outline">
                <LayoutDashboard size={18} />
                <span className="hidden md:inline">Dashboard</span>
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" className="flex items-center gap-2 border-purple-300 text-purple-600 hover:bg-purple-50">
                <Sparkles size={18} />
                <span className="hidden md:inline">Premium</span>
              </Button>
            </Link>
            <Link href="/analytics">
              <Button variant="outline" className="flex items-center gap-2 border-blue-300 text-blue-600 hover:bg-blue-50">
                <BarChart3 size={18} />
                <span className="hidden md:inline">Analytics</span>
              </Button>
            </Link>
            <Link href="/support">
              <Button variant="outline" className="flex items-center gap-2 border-green-300 text-green-600 hover:bg-green-50">
                <Headphones size={18} />
                <span className="hidden md:inline">Support</span>
              </Button>
            </Link>
            <a href="/transaction/create">
              <Button className="flex items-center gap-2">
                <PenBox size={18} />
                <span className="hidden md:inline">Add Transaction</span>
              </Button>
            </a>
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
                    avatarBox: "w-10 h-10",
                  },
                }}
              />
            </div>
          </SignedIn>
        </div>
      </nav>
    </header>
  );
};

export default Header;