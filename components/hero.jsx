"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const HeroSection = () => {
    return (
        <div className="pb-20 px-4 ">
            <div>
                <h1>
                    Track Your Finanace <br /> with Intelligence
                </h1>
                <p>
                    An Ai-powered personal finance manager that helps you track your expenses, save more, and invest wisely.
                </p>
                <div>
                    <Link href="/dashboard">
                        <Button size="lg" className="px-8">
                            Get Started
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default HeroSection