
import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { PromptInput } from '@/components/PromptInput';
import { CodeDisplay } from '@/components/CodeDisplay';
import { FeatureCard } from '@/components/FeatureCard';
import { CoreDashboard } from '@/components/CoreDashboard';
import { LanguageSelector, programmingLanguages, ProgrammingLanguage } from '@/components/LanguageSelector';
import { HackerTerminal } from '@/components/HackerTerminal';
import { Code, Zap, Shield, Cpu, Network } from 'lucide-react';
import { features } from '@/data/features';
import { aiService } from '@/services/aiService';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [selectedFeature, setSelectedFeature] = useState('prompt-to-code');
  const [selectedLanguage, setSelectedLanguage] = useState<ProgrammingLanguage>(programmingLanguages[0]);
  const [code, setCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePromptSubmit = async (prompt: string) => {
    const currentFeature = features.find(f => f.id === selectedFeature);
    if (!currentFeature) return;

    console.log('Processing prompt:', prompt, 'for feature:', selectedFeature, 'in language:', selectedLanguage.name);
    setIsProcessing(true);
    setError(null);
    setCode('');

    try {
      const enhancedPrompt = `${prompt}\n\nPlease provide the solution in ${selectedLanguage.name} programming language. Use proper ${selectedLanguage.name} syntax and best practices.`;
      
      const result = await aiService.processPrompt(
        enhancedPrompt, 
        selectedFeature, 
        currentFeature.apiProvider
      );
      
      setCode(result);
      toast({
        title: "SUCCESS: Code Generated",
        description: `Generated ${selectedLanguage.name} code using ${currentFeature.apiProvider}`,
        className: "bg-gray-900 border-green-500 text-green-400",
      });
    } catch (error) {
      console.error('Error processing prompt:', error);
      const errorMessage = error instanceof Error ? error.message : 'SYSTEM ERROR: Unknown failure detected';
      setError(errorMessage);
      toast({
        title: "ERROR: Processing Failed",
        description: errorMessage,
        variant: "destructive",
        className: "bg-red-900 border-red-500 text-red-400",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const coreFeatures = features.filter(f => f.category === 'core');
  const isCoreFeature = coreFeatures.some(f => f.id === selectedFeature);

  return (
    <div className="flex h-screen bg-black text-green-400 relative overflow-hidden">
      {/* Enhanced Matrix background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/30 via-transparent to-blue-900/30"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-400/70 to-transparent animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400/70 to-transparent animate-pulse"></div>
        <div className="hacker-grid absolute inset-0"></div>
      </div>

      <Sidebar 
        selectedFeature={selectedFeature} 
        onFeatureSelect={setSelectedFeature}
        selectedLanguage={selectedLanguage}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Enhanced hacker header */}
        <header className="bg-gray-950/95 border-b border-green-500/40 p-4 shadow-2xl backdrop-blur-md relative z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-green-900/20 to-blue-900/20"></div>
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-green-600 to-blue-600 rounded-xl shadow-2xl border border-green-400/50 neon-green">
                <Code className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white font-mono tracking-wider glitch-text">
                  <span className="text-green-400">AI</span>_CODER_<span className="text-blue-400">NEXUS</span>
                </h1>
                <HackerTerminal text="NEURAL_NETWORK_ACTIVE::READY_FOR_DEPLOYMENT" isActive={true} />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <LanguageSelector 
                selectedLanguage={selectedLanguage}
                onLanguageChange={setSelectedLanguage}
                compact={true}
              />
              <div className="flex items-center space-x-2 px-4 py-2 bg-gray-900/80 border border-green-500/40 rounded-xl backdrop-blur-sm neon-green">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
                <span className="text-xs text-green-400 font-mono">MULTI_NEURAL_APIS</span>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 bg-gray-900/80 border border-blue-500/40 rounded-xl backdrop-blur-sm neon-blue">
                <Shield className="h-4 w-4 text-blue-400" />
                <span className="text-xs text-blue-400 font-mono">QUANTUM_ENCRYPTED</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main interface with fixed height and scrolling */}
        <div className="flex-1 flex overflow-hidden min-h-0">
          {/* Left Panel */}
          <div className="w-1/2 border-r border-green-500/40 flex flex-col bg-gray-950/70 backdrop-blur-md relative">
            <div className="absolute inset-0 circuit-pattern opacity-5"></div>
            
            <div className="p-6 border-b border-green-500/30 bg-gradient-to-r from-gray-900/90 to-gray-800/90 backdrop-blur-sm relative z-10">
              {isCoreFeature ? (
                <CoreDashboard 
                  coreFeatures={coreFeatures}
                  selectedFeature={selectedFeature}
                  onFeatureSelect={setSelectedFeature}
                  selectedLanguage={selectedLanguage}
                />
              ) : (
                <FeatureCard selectedFeature={selectedFeature} selectedLanguage={selectedLanguage} />
              )}
            </div>
            
            <div className="flex-1 p-6 relative z-10 overflow-y-auto custom-scrollbar">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-green-400/15 to-transparent rounded-full blur-2xl"></div>
              <PromptInput 
                onSubmit={handlePromptSubmit}
                isProcessing={isProcessing}
                selectedFeature={selectedFeature}
                selectedLanguage={selectedLanguage}
              />
            </div>
          </div>

          {/* Right Panel */}
          <div className="flex-1 flex flex-col bg-gray-950/80 backdrop-blur-md relative">
            <div className="absolute inset-0 hacker-grid opacity-5"></div>
            <CodeDisplay 
              code={code}
              isProcessing={isProcessing}
              error={error}
              selectedLanguage={selectedLanguage}
            />
          </div>
        </div>

        {/* Enhanced status bar with better visibility */}
        <div className="h-10 bg-gray-950/95 border-t border-green-500/40 flex items-center justify-between px-6 text-xs font-mono backdrop-blur-md relative z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/50 to-gray-800/50"></div>
          <div className="flex items-center space-x-6 relative z-10">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400">STATUS: OPERATIONAL</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-blue-400">LANG: {selectedLanguage.name.toUpperCase()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-purple-400">MODEL: {features.find(f => f.id === selectedFeature)?.apiProvider || 'MULTI_NEURAL'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-yellow-400">PROTOCOLS: {features.length} LOADED</span>
            </div>
          </div>
          <div className="flex items-center space-x-4 relative z-10">
            <div className="flex items-center space-x-2">
              <Cpu className="h-3 w-3 text-green-400" />
              <span className="text-green-400">CPU: 100%</span>
            </div>
            <div className="flex items-center space-x-2">
              <Network className="h-3 w-3 text-blue-400" />
              <span className="text-blue-400">NET: QUANTUM_SECURE</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="h-3 w-3 text-yellow-400" />
              <span className="text-yellow-400">POWER: NEURAL_CORE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
