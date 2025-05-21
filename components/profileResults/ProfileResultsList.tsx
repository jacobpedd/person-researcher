import React, { useState } from 'react';
import { Skeleton } from '../ui/skeleton';
import Link from 'next/link';
import { ProfileResult } from '../PersonResearchHome';

interface ProfileResultsListProps {
  results: ProfileResult[] | null;
  selectedProfile: ProfileResult | null;
  onProfileSelect: (profile: ProfileResult) => void;
  isLoading: boolean;
  source: "linkedin" | "wikipedia";
}

const ProfileResultsSkeleton = ({ source }: { source: "linkedin" | "wikipedia" }) => (
  <div className="mt-4 animate-fade-up">
    <h3 className="text-lg font-medium mb-4">Fetching {source === "linkedin" ? "LinkedIn Profiles" : "Wikipedia Articles"}...</h3>
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

const ProfileResultsList: React.FC<ProfileResultsListProps> = ({ 
  results, 
  selectedProfile, 
  onProfileSelect,
  isLoading,
  source
}) => {
  const [showAll, setShowAll] = useState(false);
  
  if (isLoading) {
    return <ProfileResultsSkeleton source={source} />;
  }

  if (!results || results.length === 0) {
    return null;
  }
  
  const displayResults = showAll ? results : results.slice(0, 3);
  const hasMoreResults = results.length > 3;
  const sourceLabel = source === "linkedin" ? "LinkedIn Profile" : "Wikipedia Article";
  const headerText = source === "linkedin" ? "Select a LinkedIn Profile:" : "Select a Wikipedia Article:";

  return (
    <div className="mt-4 animate-fade-up">
      <h3 className="text-lg font-medium mb-3">{headerText}</h3>
      <div className="space-y-3">
        {displayResults.map((profile) => (
          <div 
            key={profile.id} 
            className={`p-3 border rounded-sm cursor-pointer bg-white shadow-sm relative ${
              selectedProfile?.id === profile.id ? 'border-brand-default bg-brand-50' : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onProfileSelect(profile)}
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
                {sourceLabel} ↗
              </Link>
            </div>
          </div>
        ))}
        
        {hasMoreResults && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="w-full text-sm text-gray-500 hover:text-gray-700 py-2 text-center border border-gray-200 rounded-sm bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            {showAll ? "Show Less" : "Show More Results"}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileResultsList;