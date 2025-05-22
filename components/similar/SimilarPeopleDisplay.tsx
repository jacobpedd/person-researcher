"use client";
import { ProfileResult } from "../PersonResearchHome";

interface SimilarPeopleDisplayProps {
  similarPeople: ProfileResult[] | null;
  isLoading: boolean;
}

export default function SimilarPeopleDisplay({ similarPeople, isLoading }: SimilarPeopleDisplayProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">🧑‍🤝‍🧑 Similar People</h3>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-48 bg-gray-100 rounded-lg p-4 animate-pulse">
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-3 bg-gray-300 rounded mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!similarPeople || similarPeople.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">🧑‍🤝‍🧑 Similar People</h3>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {similarPeople.map((person) => (
          <div key={person.id} className="flex-shrink-0 w-48 bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
            <a href={person.url} target="_blank" rel="noopener noreferrer" className="block">
              <h4 className="font-medium text-gray-900 mb-1 truncate">{person.name}</h4>
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{person.headline}</p>
              <div className="flex items-center gap-1">
                {person.source === "linkedin" ? (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">LinkedIn</span>
                ) : (
                  <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">Wikipedia</span>
                )}
              </div>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}