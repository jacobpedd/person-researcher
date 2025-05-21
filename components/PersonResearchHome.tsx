"use client";
import { useState, FormEvent } from "react";
import Link from "next/link";


export default function PersonResearcher() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [linkedInUrl, setLinkedInUrl] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Main Research Function
  const handleResearch = async (e: FormEvent) => {
    e.preventDefault();

    console.log(`Searching for: ${searchQuery}`);

    // if (!companyUrl) {
    //   setErrors({ form: "Please enter a company URL" });
    //   return;
    // }

    // const domainName = extractDomain(companyUrl);
    
    // if (!domainName) {
    //   setErrors({ form: "Please enter a valid company URL ('example.com')" });
    //   return;
    // }

    setIsGenerating(true);
    setErrors({});

    // Reset all states to null
    // setLinkedinData(null);

    try {
      // Run all API calls in parallel
      const promises = [
        setTimeout(() => {}, 1000), // Simulate API call
      ];

      await Promise.allSettled(promises);
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

      <form onSubmit={handleResearch} className="space-y-6 mb-20">
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Enter Person Query (e.g., Will Bryk, Exa CEO)"
          className="w-full bg-white p-3 border box-border outline-none rounded-sm ring-2 ring-brand-default resize-none opacity-0 animate-fade-up [animation-delay:600ms]"
        />
        <button
          type="submit"
          className={`w-full text-white font-semibold px-2 py-2 rounded-sm transition-opacity opacity-0 animate-fade-up [animation-delay:800ms] min-h-[50px] ${
            isGenerating ? 'bg-gray-400' : searchQuery.trim() ? 'bg-brand-default ring-2 ring-brand-default' : 'bg-gray-400'
          } transition-colors`}
          disabled={isGenerating || !searchQuery.trim()}
        >
          {isGenerating ? 'Researching...' : 'Research'}
        </button>

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
      </form>

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