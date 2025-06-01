
import { useState } from 'react';
import { Copy, Download, Eye, Code2, Terminal, AlertCircle, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';

interface CodeDisplayProps {
  code: string;
  isProcessing: boolean;
  error?: string | null;
  selectedLanguage?: { name: string; extension: string; color: string; icon: string };
  selectedFeature?: string;
}

export const CodeDisplay = ({ code, isProcessing, error, selectedLanguage, selectedFeature }: CodeDisplayProps) => {
  const [activeTab, setActiveTab] = useState('code');

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast({
        title: "Copied!",
        description: "Code copied to clipboard successfully",
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Failed to copy code to clipboard",
        variant: "destructive",
      });
    }
  };

  const downloadCode = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-generated-code-${Date.now()}${selectedLanguage?.extension || '.txt'}`;
    a.click();
    URL.revokeObjectURL(url);
    toast({
      title: "Downloaded!",
      description: "Code file downloaded successfully",
    });
  };

  const detectLanguage = (code: string): string => {
    if (code.includes('def ') || code.includes('import ')) return 'python';
    if (code.includes('function ') || code.includes('const ') || code.includes('let ')) return 'javascript';
    if (code.includes('public class') || code.includes('import java')) return 'java';
    if (code.includes('#include') || code.includes('int main')) return 'cpp';
    if (code.includes('<?php')) return 'php';
    return 'text';
  };

  const getFeatureDisplayName = (featureId: string) => {
    const featureNames: { [key: string]: string } = {
      'prompt-to-code': 'CODE_GENERATION',
      'code-explanation': 'CODE_EXPLANATION',
      'code-review': 'CODE_REVIEW',
      'bug-fixing': 'BUG_ANALYSIS',
      'code-optimization': 'OPTIMIZATION',
      'refactoring': 'REFACTORING'
    };
    return featureNames[featureId] || 'PROCESSING';
  };

  if (isProcessing) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/10 to-blue-900/10"></div>
        <div className="text-center space-y-6 relative z-10">
          <div className="relative">
            <div className="animate-spin h-12 w-12 border-4 border-green-500 border-t-transparent rounded-full mx-auto"></div>
            <div className="absolute inset-0 bg-green-400 rounded-full blur-md opacity-30 animate-ping"></div>
          </div>
          <div className="space-y-3">
            <p className="text-xl font-medium text-white font-mono">NEURAL_PROCESSING...</p>
            <p className="text-sm text-green-400 font-mono">
              {selectedFeature ? getFeatureDisplayName(selectedFeature) : 'COMPILING'} {selectedLanguage?.name} solution with advanced AI models
            </p>
            <div className="flex justify-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 to-transparent"></div>
        <div className="text-center space-y-4 max-w-md relative z-10 p-4">
          <div className="relative">
            <div className="p-4 bg-gradient-to-br from-red-900/40 to-red-800/40 rounded-full w-fit mx-auto border border-red-500/30">
              <AlertCircle className="h-8 w-8 text-red-400" />
            </div>
            <div className="absolute inset-0 bg-red-400 rounded-full blur-lg opacity-20 animate-pulse"></div>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-white font-mono">SYSTEM_ERROR_DETECTED</h3>
            <p className="text-sm text-red-400 break-words font-mono bg-red-900/20 p-3 rounded border border-red-500/30 max-h-32 overflow-y-auto custom-scrollbar">{error}</p>
            <p className="text-xs text-gray-500 font-mono">RETRY_PROTOCOL_RECOMMENDED</p>
          </div>
        </div>
      </div>
    );
  }

  if (!code) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/10 to-blue-900/10"></div>
        <div className="text-center space-y-4 max-w-md relative z-10">
          <div className="relative">
            <div className="p-4 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full w-fit mx-auto border border-green-500/30">
              <Code2 className="h-8 w-8 text-green-400" />
            </div>
            <div className="absolute inset-0 bg-green-400 rounded-full blur-lg opacity-20 animate-pulse"></div>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-white font-mono">NEURAL_INTERFACE_READY</h3>
            <p className="text-sm text-green-400 font-mono">
              Initialize coding protocol with {selectedLanguage?.name || 'preferred'} language
            </p>
            <p className="text-xs text-gray-400 font-mono">
              Use core modules to generate, explain, review, debug, optimize, or refactor code
            </p>
          </div>
        </div>
      </div>
    );
  }

  const language = selectedLanguage?.name.toLowerCase() || detectLanguage(code);

  return (
    <div className="h-full flex flex-col bg-gray-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-green-900/5 to-blue-900/5"></div>
      
      <div className="flex items-center justify-between p-4 border-b border-green-500/30 bg-gray-900/80 backdrop-blur-sm relative z-10 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <Terminal className="h-5 w-5 text-green-400" />
          <h3 className="text-lg font-medium text-white font-mono">
            {selectedFeature ? getFeatureDisplayName(selectedFeature) : 'COMPILED_OUTPUT'}
          </h3>
          <div className="flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-green-600/20 to-blue-600/20 border border-green-400/30 rounded">
            <span className="text-sm">{selectedLanguage?.icon}</span>
            <span className="text-xs font-mono text-green-400">
              {selectedLanguage?.name.toUpperCase() || language.toUpperCase()}
            </span>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={copyToClipboard}
            className="text-green-400 hover:text-green-300 hover:bg-green-900/20 border border-green-500/30 font-mono"
          >
            <Copy className="h-4 w-4 mr-1" />
            COPY
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={downloadCode}
            className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 border border-blue-500/30 font-mono"
          >
            <Download className="h-4 w-4 mr-1" />
            EXPORT
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col relative z-10 overflow-hidden">
        <TabsList className="grid w-full grid-cols-2 bg-gray-900/80 backdrop-blur-sm border-b border-green-500/30 flex-shrink-0">
          <TabsTrigger 
            value="code" 
            className="flex items-center space-x-2 font-mono data-[state=active]:bg-green-600/20 data-[state=active]:text-green-400"
          >
            <Code2 className="h-4 w-4" />
            <span>SOURCE_CODE</span>
          </TabsTrigger>
          <TabsTrigger 
            value="analysis" 
            className="flex items-center space-x-2 font-mono data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-400"
          >
            <Eye className="h-4 w-4" />
            <span>ANALYSIS</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="code" className="flex-1 m-0 overflow-hidden">
          <div className="h-full bg-black/50 p-4 overflow-auto custom-scrollbar backdrop-blur-sm">
            <pre className="text-sm text-green-300 font-mono whitespace-pre-wrap leading-relaxed">
              <code>{code}</code>
            </pre>
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="flex-1 m-0 overflow-hidden">
          <div className="h-full bg-gray-950/80 p-4 overflow-auto custom-scrollbar backdrop-blur-sm">
            <div className="space-y-4">
              <div className="bg-gray-900/80 border border-green-500/30 p-4 rounded-lg">
                <h4 className="text-sm font-semibold text-green-400 mb-3 font-mono">SYSTEM_ANALYSIS</h4>
                <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                  <div>
                    <span className="text-blue-400">LANGUAGE:</span>
                    <span className="text-white ml-2">{selectedLanguage?.name || language}</span>
                  </div>
                  <div>
                    <span className="text-blue-400">LINES:</span>
                    <span className="text-white ml-2">{code.split('\n').length}</span>
                  </div>
                  <div>
                    <span className="text-blue-400">CHARACTERS:</span>
                    <span className="text-white ml-2">{code.length}</span>
                  </div>
                  <div>
                    <span className="text-blue-400">FILE_EXT:</span>
                    <span className="text-white ml-2">{selectedLanguage?.extension || '.txt'}</span>
                  </div>
                  <div>
                    <span className="text-blue-400">FEATURE:</span>
                    <span className="text-white ml-2">{selectedFeature?.toUpperCase().replace('-', '_') || 'GENERAL'}</span>
                  </div>
                  <div>
                    <span className="text-blue-400">WORDS:</span>
                    <span className="text-white ml-2">{code.split(/\s+/).length}</span>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-600/30 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Shield className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm text-yellow-400 font-mono">CORE_MODULE_NOTICE</span>
                </div>
                <p className="text-sm text-yellow-200 font-mono">
                  This code can be processed with any core module feature. Switch between explanation, review, debugging, optimization, and refactoring to work with the same code.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
