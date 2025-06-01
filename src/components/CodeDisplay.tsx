
import { useState } from 'react';
import { Copy, Download, Eye, Code2, Terminal, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';

interface CodeDisplayProps {
  code: string;
  isProcessing: boolean;
  error?: string | null;
}

export const CodeDisplay = ({ code, isProcessing, error }: CodeDisplayProps) => {
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
    a.download = `ai-generated-code-${Date.now()}.txt`;
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

  if (isProcessing) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-800">
        <div className="text-center space-y-4">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
          <div className="space-y-2">
            <p className="text-lg font-medium text-white">AI is working...</p>
            <p className="text-sm text-gray-400">Processing your request with advanced AI models</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-800">
        <div className="text-center space-y-4 max-w-md">
          <div className="p-4 bg-red-900/20 rounded-full w-fit mx-auto">
            <AlertCircle className="h-8 w-8 text-red-400" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-white">Error Processing Request</h3>
            <p className="text-sm text-red-400 break-words">{error}</p>
            <p className="text-xs text-gray-500">Please try again or check your API configuration</p>
          </div>
        </div>
      </div>
    );
  }

  if (!code) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-800">
        <div className="text-center space-y-4 max-w-md">
          <div className="p-4 bg-gray-700 rounded-full w-fit mx-auto">
            <Code2 className="h-8 w-8 text-gray-400" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-white">Ready to code</h3>
            <p className="text-sm text-gray-400">
              Enter a prompt on the left to get started with AI-powered coding assistance
            </p>
          </div>
        </div>
      </div>
    );
  }

  const language = detectLanguage(code);

  return (
    <div className="h-full flex flex-col bg-gray-800">
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-medium text-white">Generated Code</h3>
          <span className="px-2 py-1 text-xs bg-blue-600 text-white rounded">
            {language.toUpperCase()}
          </span>
        </div>
        <div className="flex space-x-2">
          <Button size="sm" variant="ghost" onClick={copyToClipboard}>
            <Copy className="h-4 w-4 mr-1" />
            Copy
          </Button>
          <Button size="sm" variant="ghost" onClick={downloadCode}>
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-2 bg-gray-700">
          <TabsTrigger value="code" className="flex items-center space-x-2">
            <Code2 className="h-4 w-4" />
            <span>Code</span>
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center space-x-2">
            <Eye className="h-4 w-4" />
            <span>Analysis</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="code" className="flex-1 m-0">
          <div className="h-full bg-gray-900 p-4 overflow-auto">
            <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap leading-relaxed">
              <code>{code}</code>
            </pre>
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="flex-1 m-0">
          <div className="h-full bg-gray-800 p-4 overflow-auto">
            <div className="space-y-4">
              <div className="bg-gray-700 p-3 rounded-lg">
                <h4 className="text-sm font-semibold text-white mb-2">Code Analysis</h4>
                <p className="text-xs text-gray-300">
                  Language: <span className="text-blue-400">{language}</span>
                </p>
                <p className="text-xs text-gray-300">
                  Lines: <span className="text-blue-400">{code.split('\n').length}</span>
                </p>
                <p className="text-xs text-gray-300">
                  Characters: <span className="text-blue-400">{code.length}</span>
                </p>
              </div>
              <div className="bg-blue-900/20 border border-blue-800 p-3 rounded-lg">
                <p className="text-sm text-blue-200">
                  💡 This code was generated by AI. Please review and test thoroughly before using in production.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
