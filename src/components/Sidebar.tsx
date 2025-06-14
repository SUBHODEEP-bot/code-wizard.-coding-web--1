
import { useState } from 'react';
import { ChevronRight, ChevronDown, Terminal, Cpu, Shield, BookOpen } from 'lucide-react';
import { features } from '@/data/features';
import { ProgrammingLanguage } from './LanguageSelector';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './LanguageSwitcher';

interface SidebarProps {
  selectedFeature: string;
  onFeatureSelect: (feature: string) => void;
  selectedLanguage: ProgrammingLanguage;
}

export const Sidebar = ({ selectedFeature, onFeatureSelect, selectedLanguage }: SidebarProps) => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['core', 'advanced', 'interactive', 'ai-learner']);
  const { t } = useTranslation();

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
      name: t('CORE_MODULES'),
      icon: Cpu,
      features: features.filter(f => f.category === 'core')
    },
    {
      id: 'advanced',
      name: t('ADVANCED_PROTOCOLS'),
      icon: Shield,
      features: features.filter(f => f.category === 'advanced')
    },
    {
      id: 'interactive',
      name: t('NEURAL_INTERFACE'),
      icon: Terminal,
      features: features.filter(f => f.category === 'interactive')
    },
    {
      id: 'ai-learner',
      name: t('AI_CODE_LEARNER'),
      icon: BookOpen,
      features: features.filter(f => f.category === 'ai-learner')
    }
  ];

  return (
    <div className="w-80 bg-gray-950 border-r border-green-500/30 flex flex-col relative overflow-hidden">
      {/* Matrix-style background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-b from-green-900/30 to-transparent"></div>
      </div>

      <div className="p-4 border-b border-green-500/30 bg-gradient-to-r from-gray-900 to-gray-800 relative z-10">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-white mb-2 font-mono tracking-wider">
              <span className="text-green-400">{t('AI_NEURAL_MODULES')}</span>
            </h2>
            <p className="text-sm text-gray-300 font-mono">{t('Select your coding protocol')}</p>
          </div>
          <LanguageSwitcher />
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs text-green-400 font-mono">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
            <span>{t('NEURAL_NETWORKS_ACTIVE')}</span>
          </div>
          <div className="text-xs text-blue-400 font-mono">
            {selectedLanguage.icon} {selectedLanguage.name}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 custom-scrollbar relative z-10">
        {categories.map(category => (
          <div key={category.id} className="mb-4">
            <button
              onClick={() => toggleCategory(category.id)}
              className="w-full flex items-center justify-between p-3 text-left text-sm font-medium text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-gray-800 hover:to-gray-700 rounded-lg transition-all duration-200 border border-transparent hover:border-green-500/30 font-mono"
            >
              <div className="flex items-center space-x-2">
                <category.icon className="h-4 w-4 text-green-400" />
                <span>{category.name}</span>
              </div>
              {expandedCategories.includes(category.id) ? (
                <ChevronDown className="h-4 w-4 text-green-400" />
              ) : (
                <ChevronRight className="h-4 w-4 text-green-400" />
              )}
            </button>
            
            {expandedCategories.includes(category.id) && (
              <div className="mt-2 space-y-1 pl-2">
                {category.features.map(feature => (
                  <button
                    key={feature.id}
                    onClick={() => onFeatureSelect(feature.id)}
                    className={`w-full flex items-center space-x-3 p-3 text-left text-sm rounded-lg transition-all duration-200 font-mono relative overflow-hidden ${
                      selectedFeature === feature.id
                        ? 'bg-gradient-to-r from-green-600/20 to-blue-600/20 text-white border border-green-400/50 shadow-lg'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/50 border border-transparent hover:border-green-500/20'
                    }`}
                  >
                    {selectedFeature === feature.id && (
                      <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-blue-400/10 animate-pulse"></div>
                    )}
                    <feature.icon className={`h-4 w-4 flex-shrink-0 relative z-10 ${
                      selectedFeature === feature.id ? 'text-green-400' : 'text-gray-500'
                    }`} />
                    <div className="flex-1 min-w-0 relative z-10">
                      <div className="truncate">{feature.name}</div>
                      <div className={`text-xs truncate ${
                        selectedFeature === feature.id ? 'text-blue-400' : 'text-gray-600'
                      }`}>
                        {feature.apiProvider}
                      </div>
                    </div>
                    {selectedFeature === feature.id && (
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse relative z-10"></div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* System info footer */}
      <div className="p-3 border-t border-green-500/30 bg-gray-900/80 relative z-10">
        <div className="text-xs font-mono space-y-1">
          <div className="flex justify-between text-green-400">
            <span>{t('SYS_STATUS')}:</span>
            <span>{t('OPERATIONAL')}</span>
          </div>
          <div className="flex justify-between text-blue-400">
            <span>{t('PROTOCOLS')}:</span>
            <span>{features.length} {t('LOADED')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
