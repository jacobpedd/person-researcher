"use client";
import React from 'react';
import { Skeleton } from '../ui/skeleton';

export interface FunFact {
  fact: string;
  source?: string;
}

interface FunFactsDisplayProps {
  funFacts: FunFact[] | null;
  isLoading: boolean;
}

const FunFactsSkeleton = () => (
  <div className="animate-fade-up">
    <div className="mb-6 pb-2 border-b">
      <Skeleton className="h-8 w-48" />
    </div>
    <div className="space-y-4">
      {/* Fun Facts list items */}
      <div className="pl-5 space-y-3">
        <Skeleton className="h-6 w-[85%]" />
        <Skeleton className="h-6 w-[75%]" />
        <Skeleton className="h-6 w-[90%]" />
        <Skeleton className="h-6 w-[80%]" />
        <Skeleton className="h-6 w-[70%]" />
      </div>
    </div>
  </div>
);

const FunFactsDisplay: React.FC<FunFactsDisplayProps> = ({ funFacts, isLoading }) => {
  return (
    <div className="mt-6">
      {isLoading ? (
        <div className="p-4 rounded overflow-auto max-h-[600px]">
          <FunFactsSkeleton />
        </div>
      ) : (
        <div className="p-4 bg-white rounded shadow-md overflow-auto max-h-[600px]">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">✨ Fun Facts</h2>
          <div className="prose max-w-none text-gray-700 leading-relaxed">
            {funFacts && funFacts.length > 0 ? (
              <ul className="list-disc pl-5 space-y-3">
                {funFacts.map((fact, index) => (
                  <li key={index} className="text-lg text-gray-700">
                    {fact.fact}
                    {fact.source && (
                      <span className="text-sm text-gray-500 ml-1">
                        — {fact.source}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 italic">No fun facts available.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FunFactsDisplay;