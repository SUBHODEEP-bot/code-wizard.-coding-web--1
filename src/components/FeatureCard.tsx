
import { Badge } from '@/components/ui/badge';
import { features } from '@/data/features';
import { ProgrammingLanguage } from './LanguageSelector';
import { Terminal, Zap, Shield } from 'lucide-react';

interface FeatureCardProps {
  selectedFeature: string;
  selectedLanguage: ProgrammingLanguage;
}

export const FeatureCard = ({ selectedFeature, selectedLanguage }: FeatureCardProps) => {
  const feature = features.find(f => f.id === selectedFeature);

  if (!feature) return null;

  return (
    <div className="space-y-4 relative">
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-green-400/20 to-transparent rounded-full blur-lg"></div>
      
      <div className="flex items-start space-x-3 relative z-10">
        <div className="p-2 bg-gradient-to-br from-green-600/80 to-blue-600/80 rounded-lg border border-green-400/30 shadow-lg">
          <feature.icon className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-white font-mono tracking-wide">{feature.name}</h2>
          <p className="text-sm text-gray-300 mt-1 font-mono">{feature.description}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge className="bg-gradient-to-r from-green-600 to-blue-600 text-white border-0 font-mono">
          <Zap className="h-3 w-3 mr-1" />
          {feature.apiProvider}
        </Badge>
        <Badge className="bg-gray-800 border-green-500/30 text-green-400 font-mono">
          <Terminal className="h-3 w-3 mr-1" />
          {feature.category.toUpperCase()}
        </Badge>
        <Badge className={`bg-gray-900 border-green-400/30 ${selectedLanguage.color} font-mono`}>
          <span className="mr-1">{selectedLanguage.icon}</span>
          {selectedLanguage.name}
        </Badge>
      </div>

      <div className="p-4 bg-gray-900/80 border border-green-500/30 rounded-lg backdrop-blur-sm">
        <h4 className="text-sm font-medium text-green-400 mb-2 font-mono flex items-center">
          <Terminal className="h-3 w-3 mr-1" />
          EXAMPLE_PROMPT:
        </h4>
        <p className="text-sm text-gray-300 italic font-mono bg-black/50 p-2 rounded border-l-2 border-green-400">
          "{feature.examplePrompt}"
        </p>
      </div>

      {feature.tips && (
        <div className="p-3 bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-600/30 rounded-lg backdrop-blur-sm">
          <h4 className="text-sm font-medium text-yellow-400 mb-1 font-mono flex items-center">
            <Shield className="h-3 w-3 mr-1" />
            OPTIMIZATION_TIP:
          </h4>
          <p className="text-sm text-yellow-200 font-mono">{feature.tips}</p>
        </div>
      )}
    </div>
  );
};
