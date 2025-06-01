
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { ProgrammingLanguage } from './LanguageSelector';
import { Terminal, Zap, Shield, Cpu, Network, Code, Play, Copy } from 'lucide-react';

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
    <ScrollArea className="h-full w-full">
      <div className="space-y-6 relative p-4 h-full">
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

        {/* Selected Feature Details with Tabs */}
        {currentFeature && (
          <div className="bg-gradient-to-r from-gray-900/80 to-gray-800/80 border border-green-500/30 rounded-xl backdrop-blur-sm relative z-10">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-gray-900/50 border-b border-green-500/20">
                <TabsTrigger value="overview" className="font-mono text-xs data-[state=active]:bg-green-600/20 data-[state=active]:text-green-400">
                  OVERVIEW
                </TabsTrigger>
                <TabsTrigger value="input" className="font-mono text-xs data-[state=active]:bg-green-600/20 data-[state=active]:text-green-400">
                  INPUT
                </TabsTrigger>
                <TabsTrigger value="metrics" className="font-mono text-xs data-[state=active]:bg-green-600/20 data-[state=active]:text-green-400">
                  METRICS
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="p-5 space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-gradient-to-br from-green-600/80 to-blue-600/80 rounded-lg border border-green-400/30">
                    <currentFeature.icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white font-mono">{currentFeature.name}</h3>
                    <p className="text-sm text-gray-300 font-mono">{currentFeature.description}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
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
                  <div className="p-3 bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-600/40 rounded-lg backdrop-blur-sm">
                    <h4 className="text-sm font-medium text-yellow-400 mb-1 font-mono flex items-center">
                      <Shield className="h-3 w-3 mr-1" />
                      NEURAL_OPTIMIZATION:
                    </h4>
                    <p className="text-sm text-yellow-200 font-mono">{currentFeature.tips}</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="input" className="p-5 space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-green-400 font-mono flex items-center">
                      <Terminal className="h-3 w-3 mr-1" />
                      NEURAL_INPUT_INTERFACE
                    </h4>
                    <div className="flex space-x-2">
                      <Button size="sm" className="bg-green-600/20 border border-green-500/40 text-green-400 hover:bg-green-600/30 font-mono">
                        <Play className="h-3 w-3 mr-1" />
                        EXECUTE
                      </Button>
                      <Button size="sm" className="bg-blue-600/20 border border-blue-500/40 text-blue-400 hover:bg-blue-600/30 font-mono">
                        <Copy className="h-3 w-3 mr-1" />
                        COPY
                      </Button>
                    </div>
                  </div>

                  <div className="relative">
                    <Textarea
                      placeholder={`Enter your ${currentFeature.name.toLowerCase()} prompt for ${selectedLanguage.name}...`}
                      className="min-h-[120px] bg-gray-900/80 border-green-500/30 text-green-100 font-mono text-sm resize-none focus:border-green-400/60 custom-scrollbar"
                      rows={6}
                    />
                    <div className="absolute bottom-2 right-2 flex items-center space-x-2">
                      <span className="text-xs text-gray-500 font-mono">CTRL+ENTER</span>
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <label className="text-xs text-green-400 font-mono">COMPLEXITY_LEVEL</label>
                      <select className="w-full bg-gray-900/80 border border-green-500/30 rounded-lg px-3 py-2 text-green-100 font-mono text-sm">
                        <option>BEGINNER</option>
                        <option>INTERMEDIATE</option>
                        <option>ADVANCED</option>
                        <option>EXPERT</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-green-400 font-mono">OUTPUT_FORMAT</label>
                      <select className="w-full bg-gray-900/80 border border-green-500/30 rounded-lg px-3 py-2 text-green-100 font-mono text-sm">
                        <option>CODE_ONLY</option>
                        <option>WITH_COMMENTS</option>
                        <option>FULL_EXPLANATION</option>
                        <option>TUTORIAL_MODE</option>
                      </select>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="metrics" className="p-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-green-400 font-mono flex items-center">
                      <Cpu className="h-3 w-3 mr-1" />
                      PERFORMANCE_METRICS
                    </h4>
                    <div className="space-y-2">
                      <div className="bg-gray-900/60 border border-green-500/20 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-green-400 font-mono">PROCESSING</span>
                          <span className="text-xs text-white font-mono">REAL-TIME</span>
                        </div>
                      </div>
                      <div className="bg-gray-900/60 border border-blue-500/20 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-blue-400 font-mono">ACCURACY</span>
                          <span className="text-xs text-white font-mono">99.9%</span>
                        </div>
                      </div>
                      <div className="bg-gray-900/60 border border-purple-500/20 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-purple-400 font-mono">LATENCY</span>
                          <span className="text-xs text-white font-mono">&lt;100MS</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-blue-400 font-mono flex items-center">
                      <Network className="h-3 w-3 mr-1" />
                      NEURAL_ANALYTICS
                    </h4>
                    <div className="space-y-2">
                      <div className="bg-gray-900/60 border border-green-500/20 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-green-400 font-mono">SUCCESS_RATE</span>
                          <span className="text-xs text-white font-mono">98.7%</span>
                        </div>
                      </div>
                      <div className="bg-gray-900/60 border border-yellow-500/20 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-yellow-400 font-mono">AVG_TOKENS</span>
                          <span className="text-xs text-white font-mono">2.4K</span>
                        </div>
                      </div>
                      <div className="bg-gray-900/60 border border-purple-500/20 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-purple-400 font-mono">MODEL_TEMP</span>
                          <span className="text-xs text-white font-mono">0.7</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};
