import React from 'react';
import { Skeleton } from '../ui/skeleton';
import Link from 'next/link';
import { ProfileResult } from '../PersonResearchHome';

interface WikipediaResultsProps {
  results: ProfileResult[] | null;
  selectedProfileId: string | null;
  onProfileSelect: (profileId: string) => void;
  isLoading: boolean;
}

const WikipediaResultsSkeleton = () => (
  <div className="mt-4 animate-fade-up">
    <h3 className="text-lg font-medium mb-4">Fetching Wikipedia Articles...</h3>
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-3 border border-gray-200 rounded-sm bg-white shadow-sm">
          <Skeleton className="h-5 w-36 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
      ))}
    </div>
  </div>
);

const WikipediaResults: React.FC<WikipediaResultsProps> = ({ 
  results, 
  selectedProfileId, 
  onProfileSelect,
  isLoading
}) => {
  if (isLoading) {
    return <WikipediaResultsSkeleton />;
  }

  if (!results || results.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 animate-fade-up">
      <h3 className="text-lg font-medium mb-3">Select a Wikipedia Article:</h3>
      <div className="space-y-3">
        {results.slice(0, 3).map((profile) => (
          <div 
            key={profile.id} 
            className={`p-3 border rounded-sm cursor-pointer bg-white shadow-sm relative ${
              selectedProfileId === profile.id ? 'border-brand-default bg-brand-50' : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onProfileSelect(profile.id)}
          >
            <div className="font-medium">{profile.name}</div>
            <div className="text-sm text-gray-600">{profile.headline}</div>
            <div className="absolute top-3 right-3">
              <Link 
                href={profile.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-xs text-blue-600 hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                Wikipedia Article ↗
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WikipediaResults;