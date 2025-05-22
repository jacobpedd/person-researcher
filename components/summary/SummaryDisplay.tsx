"use client";
import { Skeleton } from '../ui/skeleton';

interface SummaryDisplayProps {
  summary: string | null;
  isLoading: boolean;
  isResearching?: boolean;
}

const SummarySkeleton = () => (
  <div className="animate-fade-up">
    <div className="mb-6 pb-2 border-b">
      <Skeleton className="h-8 w-48" />
    </div>
    <div className="space-y-2">
      {/* Single paragraph */}
      <Skeleton className="h-6 w-[80%]" />
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-6 w-[90%]" />
      <Skeleton className="h-6 w-[85%]" />
    </div>
  </div>
);

export default function SummaryDisplay({ summary, isLoading }: SummaryDisplayProps) {
  return (
    <div className="mt-6">
      {isLoading ? (
        <div className="p-4 rounded overflow-auto max-h-[600px]">
          <SummarySkeleton />
        </div>
      ) : (
        <div className="p-4 bg-white rounded shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">📝 Summary</h2>
          <div className="prose max-w-none text-gray-700 leading-relaxed">
            {summary && summary.split('\n').map((paragraph, index) => (
              paragraph.trim() ? (
                <p key={index} className="mb-5 text-lg">{paragraph}</p>
              ) : (
                <br key={index} />
              )
            ))}
          </div>
        </div>
      )}
    </div>
  );
}