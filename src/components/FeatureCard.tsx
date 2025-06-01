
import { Badge } from '@/components/ui/badge';
import { features } from '@/data/features';

interface FeatureCardProps {
  selectedFeature: string;
}

export const FeatureCard = ({ selectedFeature }: FeatureCardProps) => {
  const feature = features.find(f => f.id === selectedFeature);

  if (!feature) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-start space-x-3">
        <div className="p-2 bg-blue-600 rounded-lg">
          <feature.icon className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-white">{feature.name}</h2>
          <p className="text-sm text-gray-400 mt-1">{feature.description}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary" className="bg-blue-600 text-white">
          {feature.apiProvider}
        </Badge>
        <Badge variant="outline" className="border-gray-600 text-gray-300">
          {feature.category}
        </Badge>
      </div>

      <div className="p-3 bg-gray-700 rounded-lg">
        <h4 className="text-sm font-medium text-gray-300 mb-2">Example Prompt:</h4>
        <p className="text-sm text-gray-400 italic">"{feature.examplePrompt}"</p>
      </div>

      {feature.tips && (
        <div className="p-3 bg-yellow-900/20 border border-yellow-800 rounded-lg">
          <h4 className="text-sm font-medium text-yellow-400 mb-1">💡 Tip:</h4>
          <p className="text-sm text-yellow-200">{feature.tips}</p>
        </div>
      )}
    </div>
  );
};
