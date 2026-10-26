import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

/** 글자 한 줄 높이의 60% 막대 스켈레톤 */
function SkeletonText({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton-text"
      className={cn("flex h-lh items-center", className)}
      {...props}
    >
      <Skeleton className="h-3/5 w-full" />
    </div>
  )
}

export { Skeleton, SkeletonText }
