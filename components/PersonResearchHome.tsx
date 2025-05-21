"use client";
import { useState, FormEvent, useEffect } from "react";
import Link from "next/link";
import LinkedInResults, { LinkedInResult } from "./linkedInResults/LinkedInResults";

export default function PersonResearcher() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isFetchingLinkedIn, setIsFetchingLinkedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [linkedInResults, setLinkedInResults] = useState<LinkedInResult[]>([]);
  const [linkedInProfile, setLinkedInProfile] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handle form submission for search
  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      handleSearch();
    }
  };

  // Search for LinkedIn profiles
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setErrors({ form: "Please enter a search query" });
      return;
    }

    setIsFetchingLinkedIn(true);
    setErrors({});
    setLinkedInResults([]);
    setLinkedInProfile(null);

    try {
      console.log(`Searching for LinkedIn profiles with query: ${searchQuery}`);
      
      // Make request to the new API endpoint
      const response = await fetch('/api/fetchLinkedInResults', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ searchQuery }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch LinkedIn profiles');
      }
      
      const data = await response.json();
      
      // API now returns filtered and formatted results
      const profiles: LinkedInResult[] = data.results;
      
      console.log(`Found ${profiles.length} LinkedIn profiles`);
      setLinkedInResults(profiles);
      
    } catch (error) {
      console.error('Error fetching LinkedIn profiles:', error);
      setErrors({ form: "Error fetching LinkedIn profiles. Please try again." });
    } finally {
      setIsFetchingLinkedIn(false);
    }
  };

  // Clear search results
  const clearResults = () => {
    setLinkedInResults([]);
    setLinkedInProfile(null);
  };

  // Main Research Function
  const handleResearch = async (e: FormEvent) => {
    e.preventDefault();

    if (!linkedInProfile) {
      setErrors({ form: "Please select a LinkedIn profile first" });
      return;
    }

    // Find the selected profile
    const selectedProfile = linkedInResults.find(profile => profile.id === linkedInProfile);
    
    if (!selectedProfile) {
      setErrors({ form: "Selected profile not found. Please try again." });
      return;
    }

    console.log(`Researching profile: ${selectedProfile.name}`);
    console.log(`Profile headline: ${selectedProfile.headline}`);
    console.log(`Profile URL: ${selectedProfile.url}`);

    setIsGenerating(true);
    setErrors({});
    setLinkedInResults([]);

    try {
      // Run all API calls in parallel with the selected LinkedIn profile
      const promises = [
        new Promise(resolve => setTimeout(resolve, 1000)), // Simulate API call
      ];

      await Promise.allSettled(promises);
      console.log("Research completed successfully");
    } catch (error) {
      console.error("Error during research:", error);
      setErrors({ form: "An error occurred during research. Please try again." });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-5xl p-6 z-10 mb-20 mt-6">
      <h1 className="md:text-6xl text-4xl pb-5 font-medium opacity-0 animate-fade-up [animation-delay:200ms]">
        <span className="text-brand-default">Person </span>
        Researcher
      </h1>

      <p className="text-black mb-12 opacity-0 animate-fade-up [animation-delay:400ms]">
        Search for any person and see what the internet knows about them. 
      </p>

      <div className="space-y-6 mb-20">
        {/* Search Form */}
        <form onSubmit={handleSearchSubmit} className="w-full">
          <div className="flex gap-2">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter Person Query (e.g., Will Bryk, Exa CEO)"
              className="flex-grow bg-white p-3 border box-border outline-none rounded-sm ring-2 ring-brand-default resize-none opacity-0 animate-fade-up [animation-delay:600ms]"
              disabled={isFetchingLinkedIn}
            />
            <button
              type="submit"
              className={`text-white font-semibold px-4 py-2 rounded-sm transition-opacity opacity-0 animate-fade-up [animation-delay:600ms] ${
                isFetchingLinkedIn ? 'bg-gray-400' : 'bg-brand-default'
              }`}
              disabled={isFetchingLinkedIn || !searchQuery.trim()}
            >
              {isFetchingLinkedIn ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>
        
        {/* Results with Clear Button */}
        {linkedInResults.length > 0 && (
          <div className="relative">
            <LinkedInResults 
              results={linkedInResults}
              selectedProfileId={linkedInProfile}
              onProfileSelect={(profileId) => setLinkedInProfile(profileId)}
              isLoading={isFetchingLinkedIn}
            />
            <button
              onClick={clearResults}
              className="absolute top-0 right-0 text-sm text-red-500 hover:text-red-700"
            >
              Clear Results
            </button>
          </div>
        )}
        
        {/* Research Button - Only shown when there are results */}
        {linkedInResults.length > 0 && (
          <form onSubmit={handleResearch}>
            <button
              type="submit"
              className={`w-full text-white font-semibold px-2 py-2 rounded-sm transition-opacity opacity-0 animate-fade-up [animation-delay:800ms] min-h-[50px] ${
                isGenerating ? 'bg-gray-400' : linkedInProfile ? 'bg-brand-default ring-2 ring-brand-default' : 'bg-gray-400'
              } transition-colors`}
              disabled={isGenerating || !linkedInProfile}
            >
              {isGenerating ? 'Researching...' : 'Research Person'}
            </button>
          </form>
        )}

        <div className="flex items-center justify-end gap-2 sm:gap-3 pt-4 opacity-0 animate-fade-up [animation-delay:1000ms]">
          <span className="text-gray-800">Powered by</span>
          <a 
            href="https://exa.ai" 
            target="_blank" 
            rel="origin"
            className="hover:opacity-80 transition-opacity"
          >
            <img src="/exa_logo.png" alt="Exa Logo" className="h-6 sm:h-7 object-contain" />
          </a>
        </div>
      </div>

      {Object.entries(errors).map(([key, message]) => (
        <div key={key} className="mt-4 mb-4 p-3 bg-red-100 border border-red-400 text-red-700">
          {message}
        </div>
      ))}

      <div className="flex-grow"></div>
        <footer className="fixed bottom-0 left-0 right-0 w-full py-4 bg-secondary-default border-t opacity-0 animate-fade-up [animation-delay:1200ms]">
          <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-center sm:gap-6 px-4">
            <Link 
              href="https://github.com/exa-labs/company-researcher"
              target="_blank"
              rel="origin"
              className="text-gray-600 hover:underline cursor-pointer text-center"
            >
              Clone this open source project here
            </Link>
            <span className="text-gray-400 hidden sm:inline">|</span>
            <Link 
                href="https://exa.ai" 
                target="_blank" 
                rel="origin"
                className="hover:opacity-80 transition-opacity hidden sm:inline"
              >
            <div className="flex items-center gap-2">
              <span className="text-gray-600 hover:text-gray-600 hover:underline">Powered by</span>
                <img src="/exa_logo.png" alt="Exa Logo" className="h-5 object-contain" />
            </div>
            </Link>
          </div>
        </footer>
    </div>  
  );
}