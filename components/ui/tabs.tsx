import React from 'react';

interface TabsProps {
  activeTab: string;
  tabs: {
    id: string;
    label: string;
    count?: number;
  }[];
  onTabChange: (tabId: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ activeTab, tabs, onTabChange }) => {
  return (
    <div className="flex border-b mb-4">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === tab.id
              ? 'text-brand-default border-b-2 border-brand-default'
              : 'text-gray-600 hover:text-gray-900'
          }`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
          {typeof tab.count === 'number' && (
            <span 
              className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                activeTab === tab.id
                  ? 'bg-brand-default text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};