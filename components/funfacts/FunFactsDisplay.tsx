"use client";
import React from 'react';
import { Skeleton } from '../ui/skeleton';

export interface FunFact {
  fact: string;
  source?: string;
  sourceUrl?: string;
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
    <div className="prose max-w-none">
      <ul className="list-disc pl-5 space-y-3">
        {[1, 2, 3, 4, 5].map((item) => (
          <li key={item} className="flex items-start">
            <div className="w-full">
              <Skeleton className="h-6 w-[85%]" />
              <Skeleton className="h-4 w-[40%] mt-1" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const FunFactsDisplay: React.FC<FunFactsDisplayProps> = ({ funFacts, isLoading }) => {
  return (
    <div className="mt-6">
      {isLoading ? (
        <div className="p-4 rounded">
          <FunFactsSkeleton />
        </div>
      ) : (
        <div className="p-4 bg-white rounded shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">✨ Fun Facts</h2>
          <div className="prose max-w-none text-gray-700 leading-relaxed">
            {funFacts && funFacts.length > 0 ? (
              <ul className="list-disc pl-5 space-y-3">
                {funFacts.map((fact, index) => (
                  <li key={index} className="text-lg text-gray-700">
                    {fact.fact}
                    {fact.source && (
                      <span className="text-sm text-gray-500 ml-1">
                        — {fact.sourceUrl ? (
                          <a 
                            href={fact.sourceUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hover:underline text-blue-500"
                          >
                            {fact.source}
                          </a>
                        ) : (
                          fact.source
                        )}
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