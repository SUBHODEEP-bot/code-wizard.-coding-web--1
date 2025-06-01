
import { useState } from 'react';
import { ChevronRight, ChevronDown, Settings, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { features } from '@/data/features';

interface SidebarProps {
  selectedFeature: string;
  onFeatureSelect: (feature: string) => void;
  onApiKeysClick: () => void;
}

export const Sidebar = ({ selectedFeature, onFeatureSelect, onApiKeysClick }: SidebarProps) => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['core', 'advanced']);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const categories = [
    {
      id: 'core',
      name: 'Core Features',
      features: features.filter(f => f.category === 'core')
    },
    {
      id: 'advanced',
      name: 'Advanced Tools',
      features: features.filter(f => f.category === 'advanced')
    },
    {
      id: 'interactive',
      name: 'Interactive Features',
      features: features.filter(f => f.category === 'interactive')
    }
  ];

  return (
    <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-white mb-2">Features</h2>
        <p className="text-sm text-gray-400">Choose your coding assistant tool</p>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {categories.map(category => (
          <div key={category.id} className="mb-4">
            <button
              onClick={() => toggleCategory(category.id)}
              className="w-full flex items-center justify-between p-2 text-left text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            >
              <span>{category.name}</span>
              {expandedCategories.includes(category.id) ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
            
            {expandedCategories.includes(category.id) && (
              <div className="mt-1 space-y-1">
                {category.features.map(feature => (
                  <button
                    key={feature.id}
                    onClick={() => onFeatureSelect(feature.id)}
                    className={`w-full flex items-center space-x-3 p-3 text-left text-sm rounded-lg transition-colors ${
                      selectedFeature === feature.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    <feature.icon className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{feature.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-700">
        <Button
          onClick={onApiKeysClick}
          variant="outline"
          className="w-full justify-start bg-gray-700 border-gray-600 hover:bg-gray-600"
        >
          <Key className="h-4 w-4 mr-2" />
          API Keys
        </Button>
      </div>
    </div>
  );
};
