"use client";
import { useState, FormEvent, useEffect } from "react";
import Link from "next/link";
import LinkedInResults from "./linkedInResults/LinkedInResults";

interface LinkedInResult {
  id: string;
  name: string;
  headline: string;
  profileUrl: string;
}

export default function PersonResearcher() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isFetchingLinkedIn, setIsFetchingLinkedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [linkedInResults, setLinkedInResults] = useState<LinkedInResult[]>([]);
  const [linkedInProfile, setLinkedInProfile] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Add debounce effect for searching
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearch();
      }
    }, 500); // 500ms debounce

    return () => {
      clearTimeout(debounceTimeout);
    };
  }, [searchQuery]);

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
      
      // Temporary: Mock API response until the endpoint is created
      // In a real implementation, this would be:
      // const response = await fetch(`/api/searchlinkedin?query=${encodeURIComponent(searchQuery)}`);
      
      // Mock data for development
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockProfiles: LinkedInResult[] = [
        { id: "1", name: "John Doe", headline: "CEO at Example Inc", profileUrl: "https://linkedin.com/in/johndoe" },
        { id: "2", name: "Jane Smith", headline: "CTO at Tech Company", profileUrl: "https://linkedin.com/in/janesmith" },
        { id: "3", name: "Alice Johnson", headline: "Product Manager at Startup", profileUrl: "https://linkedin.com/in/alicejohnson" }
      ];
      
      console.log(`Found ${mockProfiles.length} candidate profiles`);
      setLinkedInResults(mockProfiles);
      
    } catch (error) {
      console.error('Error fetching LinkedIn profiles:', error);
      setErrors({ form: "Error fetching LinkedIn profiles. Please try again." });
    } finally {
      setIsFetchingLinkedIn(false);
    }
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

    console.log(`Researching profile: ${selectedProfile.name} (${selectedProfile.headline})`);
    console.log(`Profile URL: ${selectedProfile.profileUrl}`);

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
        <div className="w-full">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter Person Query (e.g., Will Bryk, Exa CEO)"
            className="w-full bg-white p-3 border box-border outline-none rounded-sm ring-2 ring-brand-default resize-none opacity-0 animate-fade-up [animation-delay:600ms]"
            disabled={isFetchingLinkedIn}
          />
        </div>
        
        <LinkedInResults 
          results={linkedInResults}
          selectedProfileId={linkedInProfile}
          onProfileSelect={(profileId) => setLinkedInProfile(profileId)}
          isLoading={isFetchingLinkedIn}
        />
        
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