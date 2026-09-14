import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import { Separator } from "./ui/separator";

// skeleton pencarian tiket
export function FlightCardSkeleton() {
  return (
    <Card
      className="w-full animate-pulse border-dashed"
      data-testid="flight-skeleton"
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
        <Skeleton className="h-4 w-24 mt-1" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between py-2">
          <div className="flex flex-col items-center gap-2">
            <Skeleton className="h-7 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex flex-col items-center px-4 gap-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="w-24 my-1" />
            <Skeleton className="h-3 w-12" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <Skeleton className="h-7 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <Separator className="my-4" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-6 w-32" />
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-10 w-full rounded-md" />
      </CardFooter>
    </Card>
  );
}

export function SeatPickerSkeleton() {
  return (
    <Card
      className="w-full animate-pulse border-dashed"
      data-testid="seat-skeleton"
    >
      <CardHeader>
        <Skeleton className="h-6 w-48" />
        <div className="flex items-center gap-4 mt-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-24" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-center gap-2 mb-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-8 rounded" />
          ))}
        </div>
        {Array.from({ length: 6 }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="flex justify-center gap-2 items-center"
          >
            <Skeleton className="h-4 w-4 mr-2" />
            {Array.from({ length: 6 }).map((_, colIndex) => (
              <Skeleton key={colIndex} className="h-8 w-8 rounded" />
            ))}
          </div>
        ))}
        <Skeleton className="h-10 w-full mt-4 rounded-md" />
      </CardContent>
    </Card>
  );
}
