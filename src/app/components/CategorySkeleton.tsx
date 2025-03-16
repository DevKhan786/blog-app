import { Skeleton } from "@/components/ui/skeleton";

const CategorySkeleton = () => (
  <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
    <Skeleton className="h-48 w-full" />
    <div className="p-4">
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2 mb-4" />
      <div className="flex justify-between items-center">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-8 w-16" />
      </div>
    </div>
  </div>
);

export default CategorySkeleton;
