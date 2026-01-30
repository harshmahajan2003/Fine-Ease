import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="max-w-3xl mx-auto px-5">
            <div className="flex justify-center md:justify-normal mb-8">
                <Skeleton className="h-12 w-64" />
            </div>

            <div className="space-y-6">
                {/* AI Scanner Skeleton */}
                <Skeleton className="h-20 w-full rounded-lg" />

                {/* Type Skeleton */}
                <div className="space-y-2">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-10 w-full" />
                </div>

                {/* Amount and Account Skeleton */}
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </div>

                {/* Category Skeleton */}
                <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-10 w-full" />
                </div>

                {/* Date Skeleton */}
                <div className="space-y-2">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-10 w-full" />
                </div>

                {/* Description Skeleton */}
                <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                </div>

                {/* Action Buttons Skeleton */}
                <div className="flex justify-end gap-4">
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 w-40" />
                </div>
            </div>
        </div>
    );
}
