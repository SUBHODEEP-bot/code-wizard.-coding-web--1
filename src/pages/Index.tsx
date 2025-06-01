
import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { PromptInput } from '@/components/PromptInput';
import { CodeDisplay } from '@/components/CodeDisplay';
import { FeatureCard } from '@/components/FeatureCard';
import { ApiKeyModal } from '@/components/ApiKeyModal';
import { Code, Sparkles, Mic, Brain } from 'lucide-react';

const Index = () => {
  const [selectedFeature, setSelectedFeature] = useState('prompt-to-code');
  const [code, setCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showApiModal, setShowApiModal] = useState(false);

  const handlePromptSubmit = async (prompt: string) => {
    console.log('Processing prompt:', prompt, 'for feature:', selectedFeature);
    setIsProcessing(true);
    // Simulate API processing
    setTimeout(() => {
      setCode(`// Generated code for: ${prompt}\nfunction example() {\n  console.log("Hello, World!");\n  return true;\n}`);
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar 
        selectedFeature={selectedFeature} 
        onFeatureSelect={setSelectedFeature}
        onApiKeysClick={() => setShowApiModal(true)}
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
                <p className="text-sm text-gray-400">Powered by Gemini & OpenAI</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 text-sm text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Connected</span>
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
            />
          </div>
        </div>
      </div>

      <ApiKeyModal 
        isOpen={showApiModal}
        onClose={() => setShowApiModal(false)}
      />
    </div>
  );
};

export default Index;
