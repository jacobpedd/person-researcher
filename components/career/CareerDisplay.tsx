"use client";
import React from 'react';
import { Skeleton } from '../ui/skeleton';

export interface TimelineEvent {
  title: string;
  dateRange: string;
  description: string;
}

export interface CareerData {
  skills: string[];
  timeline: TimelineEvent[];
}

interface CareerDisplayProps {
  careerData: CareerData | null;
  isLoading: boolean;
}

const CareerSkeleton = () => (
  <div className="animate-fade-up">
    <div className="mb-6 pb-2 border-b">
      <Skeleton className="h-8 w-48" />
    </div>
    
    {/* Skills skeleton */}
    <div className="mb-6">
      <Skeleton className="h-6 w-36 mb-3" />
      <div className="flex flex-wrap gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
          <Skeleton key={`skill-${item}`} className="h-8 w-20 rounded-full" />
        ))}
      </div>
    </div>
    
    {/* Timeline skeleton */}
    <div>
      <Skeleton className="h-6 w-36 mb-3" />
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute h-full w-0.5 bg-gray-200 left-2.5 top-0 z-0"></div>
        
        <div className="space-y-10">
          {[1, 2, 3, 4].map((item) => (
            <div key={`timeline-${item}`} className="flex items-start">
              {/* Timeline node container */}
              <div className="relative flex-shrink-0 w-5 mr-5">
                <div className="w-5 h-5 rounded-full bg-gray-200 border-2 border-white"></div>
              </div>
              
              {/* Content */}
              <div className="flex-1">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/3 mb-3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const CareerDisplay: React.FC<CareerDisplayProps> = ({ careerData, isLoading }) => {
  const [showAllTimelineItems, setShowAllTimelineItems] = React.useState(false);
  
  // Default to showing first 3 timeline items
  const displayedTimelineItems = React.useMemo(() => {
    if (!careerData?.timeline) return [];
    return showAllTimelineItems 
      ? careerData.timeline 
      : careerData.timeline.slice(0, 3);
  }, [careerData?.timeline, showAllTimelineItems]);
  
  // Determine if we need a "Show more" button
  const hasMoreItems = React.useMemo(() => {
    return careerData?.timeline && careerData.timeline.length > 3;
  }, [careerData?.timeline]);
  
  // Toggle function for show more/less
  const toggleTimelineItems = () => {
    setShowAllTimelineItems(!showAllTimelineItems);
  };
  
  return (
    <div className="mt-6">
      {isLoading ? (
        <div className="p-4 rounded">
          <CareerSkeleton />
        </div>
      ) : (
        <div className="p-4 bg-white rounded shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">💼 Career</h2>
          
          {/* Skills section */}
          {careerData?.skills && careerData.skills.length > 0 ? (
            <div className="mb-6">
              <h3 className="text-xl font-medium mb-3 text-gray-700">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {careerData.skills.map((skill, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
          
          {/* Timeline section */}
          {careerData?.timeline && careerData.timeline.length > 0 ? (
            <div>
              <h3 className="text-xl font-medium mb-3 text-gray-700">Timeline</h3>
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute h-full w-0.5 bg-gray-300 left-2.5 top-0 z-0"></div>
                
                <div className="space-y-10">
                  {displayedTimelineItems.map((event, index) => (
                    <div key={index} className="flex items-start">
                      {/* Timeline node container */}
                      <div className="relative flex-shrink-0 w-5 mr-5 mt-1">
                        <div className="w-5 h-5 rounded-full bg-blue-500 border-2 border-white shadow-md"></div>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-800">{event.title}</h4>
                        <p className="text-sm text-gray-500 mb-2">{event.dateRange}</p>
                        <p className="text-gray-700">{event.description}</p>
                      </div>
                    </div>
                  ))}
                  
                  {/* Show more/less button */}
                  {hasMoreItems && (
                    <div className="flex items-center mt-2">
                      <div className="flex-shrink-0 w-5 mr-5"></div>
                      <button 
                        onClick={toggleTimelineItems}
                        className="text-blue-500 hover:text-blue-700 text-sm font-medium flex items-center transition-colors duration-200"
                      >
                        {showAllTimelineItems ? 'Show less' : 'Show more'}
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className={`h-4 w-4 ml-1 transition-transform duration-200 ${showAllTimelineItems ? 'rotate-180' : ''}`} 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : null}
          
          {(!careerData?.skills || careerData.skills.length === 0) && 
           (!careerData?.timeline || careerData.timeline.length === 0) && (
            <p className="text-gray-600 italic">No career information available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CareerDisplay;