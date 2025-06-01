
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProgrammingLanguage } from './LanguageSelector';
import { Terminal, Zap, Shield, Cpu, Network, Code } from 'lucide-react';

interface CoreDashboardProps {
  coreFeatures: Array<{
    id: string;
    name: string;
    description: string;
    icon: any;
    apiProvider: string;
    category: string;
    tips?: string;
  }>;
  selectedFeature: string;
  onFeatureSelect: (feature: string) => void;
  selectedLanguage: ProgrammingLanguage;
}

export const CoreDashboard = ({
  coreFeatures,
  selectedFeature,
  onFeatureSelect,
  selectedLanguage
}: CoreDashboardProps) => {
  const currentFeature = coreFeatures.find(f => f.id === selectedFeature);

  return (
    <div className="space-y-6 relative">
      {/* Cyberpunk background effects */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-green-400/20 to-transparent rounded-full blur-xl"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-400/15 to-transparent rounded-full blur-lg"></div>
      
      {/* Header */}
      <div className="flex items-start space-x-4 relative z-10">
        <div className="p-3 bg-gradient-to-br from-green-600/90 to-blue-600/90 rounded-xl border border-green-400/40 shadow-2xl neon-green">
          <Code className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-white font-mono tracking-wider glitch-text">
            CORE_<span className="text-green-400">NEURAL</span>_MODULES
          </h2>
          <p className="text-sm text-gray-300 mt-1 font-mono">
            Advanced AI-powered coding assistance protocols
          </p>
        </div>
      </div>

      {/* Feature Selection Grid */}
      <div className="grid grid-cols-3 gap-3 relative z-10">
        {coreFeatures.map((feature) => (
          <button
            key={feature.id}
            onClick={() => onFeatureSelect(feature.id)}
            className={`p-4 rounded-xl border transition-all duration-300 font-mono group relative overflow-hidden ${
              selectedFeature === feature.id
                ? 'bg-gradient-to-br from-green-600/30 to-blue-600/30 border-green-400/60 shadow-lg neon-green'
                : 'bg-gray-900/60 border-gray-600/40 hover:border-green-500/40 hover:bg-gray-800/60'
            }`}
          >
            {selectedFeature === feature.id && (
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-blue-400/10 animate-pulse"></div>
            )}
            <div className="relative z-10 flex flex-col items-center space-y-2">
              <feature.icon className={`h-5 w-5 ${
                selectedFeature === feature.id ? 'text-green-400' : 'text-gray-400 group-hover:text-green-400'
              }`} />
              <span className={`text-xs text-center leading-tight ${
                selectedFeature === feature.id ? 'text-white' : 'text-gray-300 group-hover:text-white'
              }`}>
                {feature.name}
              </span>
              {selectedFeature === feature.id && (
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Selected Feature Details */}
      {currentFeature && (
        <div className="bg-gradient-to-r from-gray-900/80 to-gray-800/80 border border-green-500/30 rounded-xl p-5 backdrop-blur-sm relative z-10">
          <div className="flex items-start space-x-4">
            <div className="p-2 bg-gradient-to-br from-green-600/80 to-blue-600/80 rounded-lg border border-green-400/30">
              <currentFeature.icon className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white font-mono">{currentFeature.name}</h3>
              <p className="text-sm text-gray-300 font-mono">{currentFeature.description}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            <Badge className="bg-gradient-to-r from-green-600 to-blue-600 text-white border-0 font-mono">
              <Zap className="h-3 w-3 mr-1" />
              {currentFeature.apiProvider}
            </Badge>
            <Badge className="bg-gray-800 border-green-500/30 text-green-400 font-mono">
              <Terminal className="h-3 w-3 mr-1" />
              CORE_MODULE
            </Badge>
            <Badge className={`bg-gray-900 border-green-400/30 ${selectedLanguage.color} font-mono`}>
              <span className="mr-1">{selectedLanguage.icon}</span>
              {selectedLanguage.name}
            </Badge>
          </div>

          {currentFeature.tips && (
            <div className="mt-4 p-3 bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-600/40 rounded-lg backdrop-blur-sm">
              <h4 className="text-sm font-medium text-yellow-400 mb-1 font-mono flex items-center">
                <Shield className="h-3 w-3 mr-1" />
                NEURAL_OPTIMIZATION:
              </h4>
              <p className="text-sm text-yellow-200 font-mono">{currentFeature.tips}</p>
            </div>
          )}

          {/* Advanced metrics */}
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="bg-gray-900/60 border border-green-500/20 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Cpu className="h-3 w-3 text-green-400" />
                <span className="text-xs text-green-400 font-mono">PROCESSING</span>
              </div>
              <div className="text-xs text-white font-mono mt-1">REAL-TIME</div>
            </div>
            <div className="bg-gray-900/60 border border-blue-500/20 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Network className="h-3 w-3 text-blue-400" />
                <span className="text-xs text-blue-400 font-mono">ACCURACY</span>
              </div>
              <div className="text-xs text-white font-mono mt-1">99.9%</div>
            </div>
            <div className="bg-gray-900/60 border border-purple-500/20 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Zap className="h-3 w-3 text-purple-400" />
                <span className="text-xs text-purple-400 font-mono">LATENCY</span>
              </div>
              <div className="text-xs text-white font-mono mt-1">&lt;100MS</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
