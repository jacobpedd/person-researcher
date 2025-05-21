import React from 'react';
import ProfileResultsList from './ProfileResultsList';
import { Tabs } from '../ui/tabs';
import { ProfileResult } from '../PersonResearchHome';

interface ProfileResultsProps {
  linkedInResults: ProfileResult[] | null;
  wikipediaResults: ProfileResult[] | null;
  selectedProfile: ProfileResult | null;
  onProfileSelect: (profile: ProfileResult) => void;
  activeTab: "linkedin" | "wikipedia";
  onTabChange: (tab: "linkedin" | "wikipedia") => void;
  isSearching: boolean;
  onClearResults: () => void;
}

const ProfileResults: React.FC<ProfileResultsProps> = ({
  linkedInResults,
  wikipediaResults,
  selectedProfile,
  onProfileSelect,
  activeTab,
  onTabChange,
  isSearching,
  onClearResults
}) => {
  return (
    <div className="relative">
      {/* Tab Navigation */}
      <div className="flex justify-between items-center">
        <Tabs 
          activeTab={activeTab}
          tabs={[
            { 
              id: "linkedin", 
              label: isSearching ? "LinkedIn (Loading...)" : "LinkedIn", 
              count: isSearching ? undefined : linkedInResults?.length || 0 
            },
            { 
              id: "wikipedia", 
              label: isSearching ? "Wikipedia (Loading...)" : "Wikipedia", 
              count: isSearching ? undefined : wikipediaResults?.length || 0 
            }
          ]}
          onTabChange={(tabId) => onTabChange(tabId as "linkedin" | "wikipedia")}
        />
        {!isSearching && (
          <button
            onClick={onClearResults}
            className="text-sm text-red-500 hover:text-red-700"
          >
            Clear Results
          </button>
        )}
      </div>

      {/* Tab Content */}
      {activeTab === "linkedin" ? (
        isSearching ? (
          <ProfileResultsList 
            results={[]}
            selectedProfile={null}
            onProfileSelect={() => {}}
            isLoading={true}
            source="linkedin"
          />
        ) : linkedInResults && linkedInResults.length > 0 ? (
          <ProfileResultsList 
            results={linkedInResults}
            selectedProfile={selectedProfile}
            onProfileSelect={onProfileSelect}
            isLoading={false}
            source="linkedin"
          />
        ) : linkedInResults !== null && (
          <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-sm">
            <p className="text-gray-700 text-center">No LinkedIn profiles found for your search. Try another query or check the Wikipedia tab.</p>
          </div>
        )
      ) : (
        isSearching ? (
          <ProfileResultsList 
            results={[]}
            selectedProfile={null}
            onProfileSelect={() => {}}
            isLoading={true}
            source="wikipedia"
          />
        ) : wikipediaResults && wikipediaResults.length > 0 ? (
          <ProfileResultsList 
            results={wikipediaResults}
            selectedProfile={selectedProfile}
            onProfileSelect={onProfileSelect}
            isLoading={false}
            source="wikipedia"
          />
        ) : wikipediaResults !== null && (
          <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-sm">
            <p className="text-gray-700 text-center">No Wikipedia articles found for your search. Try another query or check the LinkedIn tab.</p>
          </div>
        )
      )}
    </div>
  );
};

export default ProfileResults;