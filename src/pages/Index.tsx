
import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { PromptInput } from '@/components/PromptInput';
import { CodeDisplay } from '@/components/CodeDisplay';
import { FeatureCard } from '@/components/FeatureCard';
import { Code } from 'lucide-react';
import { features } from '@/data/features';
import { aiService } from '@/services/aiService';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [selectedFeature, setSelectedFeature] = useState('prompt-to-code');
  const [code, setCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePromptSubmit = async (prompt: string) => {
    const currentFeature = features.find(f => f.id === selectedFeature);
    if (!currentFeature) return;

    console.log('Processing prompt:', prompt, 'for feature:', selectedFeature);
    setIsProcessing(true);
    setError(null);
    setCode('');

    try {
      const result = await aiService.processPrompt(
        prompt, 
        selectedFeature, 
        currentFeature.apiProvider
      );
      
      setCode(result);
      toast({
        title: "Success!",
        description: "Code generated successfully using AI",
      });
    } catch (error) {
      console.error('Error processing prompt:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar 
        selectedFeature={selectedFeature} 
        onFeatureSelect={setSelectedFeature}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-gray-800 border-b border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Code className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">AI Coder Assistant</h1>
                <p className="text-sm text-gray-400">Powered by OpenAI & Gemini</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 text-sm text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Live APIs Connected</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Feature Info & Input */}
          <div className="w-1/2 border-r border-gray-700 flex flex-col">
            <div className="p-6 border-b border-gray-700">
              <FeatureCard selectedFeature={selectedFeature} />
            </div>
            
            <div className="flex-1 p-6">
              <PromptInput 
                onSubmit={handlePromptSubmit}
                isProcessing={isProcessing}
                selectedFeature={selectedFeature}
              />
            </div>
          </div>

          {/* Right Panel - Code Display */}
          <div className="flex-1 flex flex-col">
            <CodeDisplay 
              code={code}
              isProcessing={isProcessing}
              error={error}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
