"use client";
import { Skeleton } from '../ui/skeleton';
import { useState } from 'react';

interface RoastPraiseDisplayProps {
  roastContent: string | null;
  praiseContent: string | null;
  isLoading: boolean;
}

const RoastPraiseSkeleton = () => (
  <div className="animate-fade-up">
    <div className="mb-6 pb-2 border-b">
      <Skeleton className="h-8 w-48" />
    </div>
    <div className="space-y-2">
      <Skeleton className="h-6 w-[80%]" />
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-6 w-[90%]" />
      <Skeleton className="h-6 w-[85%]" />
    </div>
  </div>
);

export default function RoastPraiseDisplay({ roastContent, praiseContent, isLoading }: RoastPraiseDisplayProps) {
  const [mode, setMode] = useState<'roast' | 'praise'>('roast');

  const currentContent = mode === 'roast' ? roastContent : praiseContent;
  const emoji = mode === 'roast' ? '😈' : '😇';
  const title = mode === 'roast' ? 'Roast' : 'Praise';

  return (
    <div className="mt-6">
      {isLoading ? (
        <div className="p-4 rounded overflow-auto max-h-[600px]">
          <RoastPraiseSkeleton />
        </div>
      ) : (
        <div className="p-4 bg-white rounded shadow-md">
          <div className="flex items-center justify-between mb-4 pb-2 border-b">
            <h2 className="text-2xl font-semibold text-gray-800">
              {emoji} {title}
            </h2>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setMode('roast')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  mode === 'roast'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                😈 Roast
              </button>
              <button
                onClick={() => setMode('praise')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  mode === 'praise'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                😇 Praise
              </button>
            </div>
          </div>
          <div className="prose max-w-none text-gray-700 leading-relaxed">
            {currentContent && currentContent.split('\n').map((paragraph, index) => (
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