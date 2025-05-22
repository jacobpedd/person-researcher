"use client";
import { useState, FormEvent, useEffect } from "react";
import Link from "next/link";
import ProfileResults from "./profileResults/ProfileResults";
import SummaryDisplay from "./summary/SummaryDisplay";
import type { SearchResponse } from "exa-js";

export interface ProfileResult {
  id: string;
  name: string;
  headline: string;
  url: string;
  text: string;
  source: "linkedin" | "wikipedia";
}

export default function PersonResearcher() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [linkedInResults, setLinkedInResults] = useState<ProfileResult[] | null>(null);
  const [wikipediaResults, setWikipediaResults] = useState<ProfileResult[] | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<ProfileResult | null>(null);
  const [activeTab, setActiveTab] = useState<"linkedin" | "wikipedia">("linkedin");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [exaSearchResults, setExaSearchResults] = useState<SearchResponse<{
    text: true;
    type: string;
    numResults: number;
    summary: true;
  }> | null>(null);
  const [summaryResult, setSummaryResult] = useState<string | null>(null);

  // Handle form submission for search
  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      handleSearch();
    }
  };

  // Search for profiles (both LinkedIn and Wikipedia)
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setErrors({ form: "Please enter a search query" });
      return;
    }

    setIsSearching(true);
    setErrors({});
    setLinkedInResults([]);
    setWikipediaResults([]);
    setSelectedProfile(null);

    try {
      console.log(`Searching for profiles with query: ${searchQuery}`);
      
      // Fetch both LinkedIn and Wikipedia profiles in parallel
      const [linkedInResponse, wikipediaResponse] = await Promise.all([
        fetch('/api/fetchLinkedInResults', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ searchQuery }),
        }),
        fetch('/api/fetchWikipedia', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ searchQuery }),
        })
      ]);
      
      if (!linkedInResponse.ok) {
        throw new Error('Failed to fetch LinkedIn profiles');
      }
      
      if (!wikipediaResponse.ok) {
        throw new Error('Failed to fetch Wikipedia articles');
      }
      
      const linkedInData = await linkedInResponse.json();
      const wikipediaData = await wikipediaResponse.json();
      
      console.log(`Found ${linkedInData.results.length} LinkedIn profiles and ${wikipediaData.results.length} Wikipedia articles`);
      
      setLinkedInResults(linkedInData.results);
      setWikipediaResults(wikipediaData.results);
      
      // If one tab has no results but the other does, automatically switch to the tab with results
      if (linkedInData.results.length === 0 && wikipediaData.results.length > 0) {
        setActiveTab("wikipedia");
      } else if (wikipediaData.results.length === 0 && linkedInData.results.length > 0) {
        setActiveTab("linkedin");
      }
      
    } catch (error) {
      console.error('Error fetching profiles:', error);
      setErrors({ form: "Error fetching profiles. Please try again." });
    } finally {
      setIsSearching(false);
    }
  };

  // Clear search results
  const clearResults = () => {
    setLinkedInResults(null);
    setWikipediaResults(null);
    setSelectedProfile(null);
    setSummaryResult(null);
    setExaSearchResults(null);
  };

  // Function to fetch Exa search results
  const fetchExaSearchResults = async (query: string) => {
    try {
      const response = await fetch('/api/fetchExaSearch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ searchQuery: query }),
      });

      if (!response.ok) throw new Error('Failed to fetch Exa search results');
      
      const data = await response.json();
      setExaSearchResults(data.results);
      console.log('Exa search results loaded:', data.results);
      return data.results;
    } catch (error) {
      console.error('Error fetching Exa search results:', error);
      throw error;
    }
  };

  // Function to fetch summary
  const fetchSummary = async (
    query: string, 
    profile: ProfileResult, 
    exaResults: SearchResponse<{
      text: true;
      type: string;
      numResults: number;
      summary: true;
    }>
  ) => {
    try {
      const response = await fetch('/api/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          searchQuery: query,
          profileResult: profile,
          exaResults: exaResults
        }),
      });

      if (!response.ok) throw new Error('Failed to fetch summary');
      
      const data = await response.json();
      setSummaryResult(data.summary || data.message);
      console.log('Summary results loaded:', data);
      return data;
    } catch (error) {
      console.error('Error fetching summary:', error);
      throw error;
    }
  };

  // Main Research Function
  const handleResearch = async (e: FormEvent) => {
    e.preventDefault();

    if (!selectedProfile) {
      setErrors({ form: "Please select a profile first" });
      return;
    }

    console.log(`Researching profile: ${selectedProfile.name}`);
    console.log(`Profile headline: ${selectedProfile.headline}`);
    console.log(`Profile URL: ${selectedProfile.url}`);
    console.log(`Profile source: ${selectedProfile.source}`);

    setIsGenerating(true);
    setErrors({});

    try {
      // Fetch Exa search results
      const exaResults = await fetchExaSearchResults(selectedProfile.name);
      
      // Throw error if exaResults is null
      if (!exaResults) {
        throw new Error("Failed to fetch search results");
      }
      
      // Populate report sections in parallel
      const promises = [
        await fetchSummary(searchQuery, selectedProfile, exaResults)
      ];
      
      // Wait for any parallel promises to complete
      if (promises.length > 0) {
        await Promise.allSettled(promises);
      }
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
              disabled={isSearching}
            />
            <button
              type="submit"
              className={`text-white font-semibold px-4 py-2 rounded-sm transition-opacity opacity-0 animate-fade-up [animation-delay:600ms] ${
                isSearching ? 'bg-gray-400' : 'bg-brand-default'
              }`}
              disabled={isSearching || !searchQuery.trim()}
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>
        
        {/* Results Area */}
        {(linkedInResults !== null || wikipediaResults !== null || isSearching) && (
          <ProfileResults
            linkedInResults={linkedInResults}
            wikipediaResults={wikipediaResults}
            selectedProfile={selectedProfile}
            onProfileSelect={setSelectedProfile}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            isSearching={isSearching}
            onClearResults={clearResults}
          />
        )}
        
        {/* Research Button - Only shown when there are results */}
        {((linkedInResults !== null && linkedInResults.length > 0) || 
          (wikipediaResults !== null && wikipediaResults.length > 0)) && (
          <form onSubmit={handleResearch}>
            <button
              type="submit"
              className={`w-full text-white font-semibold px-2 py-2 rounded-sm transition-opacity opacity-0 animate-fade-up [animation-delay:800ms] min-h-[50px] ${
                isGenerating ? 'bg-gray-400' : selectedProfile ? 'bg-brand-default ring-2 ring-brand-default' : 'bg-gray-400'
              } transition-colors`}
              disabled={isGenerating || !selectedProfile}
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

      
      {(isGenerating || summaryResult) && (
        <SummaryDisplay 
          summary={summaryResult} 
          isLoading={isGenerating} 
        />
      )}

      <div className="flex-grow"></div>
        <footer className="fixed bottom-0 left-0 right-0 w-full py-4 bg-secondary-default border-t opacity-0 animate-fade-up [animation-delay:1200ms]">
          <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-center sm:gap-6 px-4">
            <Link 
              href="https://github.com/exa-labs/person-researcher"
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