import React from 'react';
import { Skeleton } from '../ui/skeleton';

interface LinkedInResult {
  id: string;
  name: string;
  headline: string;
  profileUrl: string;
}

interface LinkedInResultsProps {
  results: LinkedInResult[];
  selectedProfileId: string | null;
  onProfileSelect: (profileId: string) => void;
  isLoading: boolean;
}

const LinkedInResultsSkeleton = () => (
  <div className="mt-4 animate-fade-up">
    <h3 className="text-lg font-medium mb-4">Fetching LinkedIn Profiles...</h3>
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

const LinkedInResults: React.FC<LinkedInResultsProps> = ({ 
  results, 
  selectedProfileId, 
  onProfileSelect,
  isLoading
}) => {
  if (isLoading) {
    return <LinkedInResultsSkeleton />;
  }

  if (results.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 animate-fade-up">
      <h3 className="text-lg font-medium mb-3">Select a LinkedIn Profile:</h3>
      <div className="space-y-3">
        {results.map((profile) => (
          <div 
            key={profile.id} 
            className={`p-3 border rounded-sm cursor-pointer bg-white shadow-sm ${
              selectedProfileId === profile.id ? 'border-brand-default bg-brand-50' : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onProfileSelect(profile.id)}
          >
            <div className="font-medium">{profile.name}</div>
            <div className="text-sm text-gray-600">{profile.headline}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LinkedInResults;