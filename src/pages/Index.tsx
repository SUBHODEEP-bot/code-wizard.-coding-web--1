
import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { PromptInput } from '@/components/PromptInput';
import { CodeDisplay } from '@/components/CodeDisplay';
import { FeatureCard } from '@/components/FeatureCard';
import { LanguageSelector, programmingLanguages, ProgrammingLanguage } from '@/components/LanguageSelector';
import { LanguageTranslator } from '@/components/LanguageTranslator';
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
    
    // Don't clear code for core module features if code already exists
    const coreFeatures = ['prompt-to-code', 'code-explanation', 'code-review', 'bug-fixing', 'code-optimization', 'refactoring'];
    if (!coreFeatures.includes(selectedFeature) || !code) {
      setCode('');
    }

    try {
      let enhancedPrompt = '';
      
      if (selectedFeature === 'code-explanation' && code) {
        enhancedPrompt = `Explain this ${selectedLanguage.name} code in detail:\n\n${code}\n\nAdditional context: ${prompt}`;
      } else if (selectedFeature === 'code-review' && code) {
        enhancedPrompt = `Review this ${selectedLanguage.name} code and provide feedback:\n\n${code}\n\nSpecific areas to focus on: ${prompt}`;
      } else if (selectedFeature === 'bug-fixing' && code) {
        enhancedPrompt = `Find and fix bugs in this ${selectedLanguage.name} code:\n\n${code}\n\nIssue description: ${prompt}`;
      } else if (selectedFeature === 'code-optimization' && code) {
        enhancedPrompt = `Optimize this ${selectedLanguage.name} code for better performance:\n\n${code}\n\nOptimization goals: ${prompt}`;
      } else if (selectedFeature === 'refactoring' && code) {
        enhancedPrompt = `Refactor this ${selectedLanguage.name} code to improve readability and maintainability:\n\n${code}\n\nRefactoring requirements: ${prompt}`;
      } else {
        enhancedPrompt = `${prompt}\n\nPlease provide the solution in ${selectedLanguage.name} programming language. Use proper ${selectedLanguage.name} syntax and best practices.`;
      }
      
      const result = await aiService.processPrompt(
        enhancedPrompt, 
        selectedFeature, 
        currentFeature.apiProvider
      );
      
      setCode(result);
      toast({
        title: "SUCCESS: Code Processed",
        description: `Processed ${selectedLanguage.name} code using ${currentFeature.apiProvider}`,
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

  // Check if current feature is language translator
  const isLanguageTranslator = selectedFeature === 'translator';

  return (
    <div className="flex h-screen bg-black text-green-400 relative overflow-hidden">
      {/* Matrix-style background effect */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 via-transparent to-blue-900/20"></div>
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-green-400/50 to-transparent animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-full h-2 bg-gradient-to-r from-transparent via-blue-400/50 to-transparent animate-pulse"></div>
      </div>

      <Sidebar 
        selectedFeature={selectedFeature} 
        onFeatureSelect={setSelectedFeature}
        selectedLanguage={selectedLanguage}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Hacker-style header */}
        <header className="bg-gray-950 border-b border-green-500/30 p-4 shadow-lg relative flex-shrink-0">
          <div className="absolute inset-0 bg-gradient-to-r from-green-900/10 to-blue-900/10"></div>
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-gradient-to-br from-green-600 to-blue-600 rounded-lg shadow-lg border border-green-400/30">
                <Code className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white font-mono tracking-wider">
                  <span className="text-green-400">AI</span>_CODER_<span className="text-blue-400">NEXUS</span>
                </h1>
                <HackerTerminal text="NEURAL_NETWORK_ACTIVE" isActive={true} />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {!isLanguageTranslator && (
                <LanguageSelector 
                  selectedLanguage={selectedLanguage}
                  onLanguageChange={setSelectedLanguage}
                  compact={true}
                />
              )}
              <div className="flex items-center space-x-2 px-3 py-1 bg-gray-900 border border-green-500/30 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
                <span className="text-xs text-green-400 font-mono">NEURAL_APIS_ONLINE</span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-1 bg-gray-900 border border-blue-500/30 rounded-lg">
                <Shield className="h-4 w-4 text-blue-400" />
                <span className="text-xs text-blue-400 font-mono">SECURE_CONNECTION</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        {isLanguageTranslator ? (
          <div className="flex-1 overflow-hidden">
            <LanguageTranslator />
          </div>
        ) : (
          <div className="flex-1 flex overflow-hidden min-h-0">
            {/* Left Panel - Enhanced with hacker styling and proper scrolling */}
            <div className="w-1/2 border-r border-green-500/30 flex flex-col bg-gray-950/50 backdrop-blur-sm overflow-hidden">
              <div className="p-6 border-b border-green-500/20 bg-gradient-to-r from-gray-900 to-gray-800 flex-shrink-0">
                <FeatureCard selectedFeature={selectedFeature} selectedLanguage={selectedLanguage} />
              </div>
              
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="p-6 relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-green-400/10 to-transparent rounded-full blur-xl"></div>
                  <PromptInput 
                    onSubmit={handlePromptSubmit}
                    isProcessing={isProcessing}
                    selectedFeature={selectedFeature}
                    selectedLanguage={selectedLanguage}
                    existingCode={code}
                  />
                </div>
              </div>
            </div>

            {/* Right Panel - Code display with hacker theme and proper scrolling */}
            <div className="flex-1 flex flex-col bg-gray-950/70 backdrop-blur-sm overflow-hidden">
              <CodeDisplay 
                code={code}
                isProcessing={isProcessing}
                error={error}
                selectedLanguage={selectedLanguage}
                selectedFeature={selectedFeature}
              />
            </div>
          </div>
        )}

        {/* Status bar */}
        <div className="h-8 bg-gray-950 border-t border-green-500/30 flex items-center justify-between px-4 text-xs font-mono flex-shrink-0">
          <div className="flex items-center space-x-4">
            <span className="text-green-400">STATUS: OPERATIONAL</span>
            {!isLanguageTranslator && (
              <span className="text-blue-400">LANG: {selectedLanguage.name.toUpperCase()}</span>
            )}
            <span className="text-purple-400">MODEL: MULTI_NEURAL</span>
          </div>
          <div className="flex items-center space-x-2">
            <Cpu className="h-3 w-3 text-green-400" />
            <span className="text-green-400">CPU: 100%</span>
            <Network className="h-3 w-3 text-blue-400" />
            <span className="text-blue-400">NET: SECURE</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
