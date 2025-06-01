
import { useState } from 'react';
import { Copy, Download, Eye, Code2, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CodeDisplayProps {
  code: string;
  isProcessing: boolean;
}

export const CodeDisplay = ({ code, isProcessing }: CodeDisplayProps) => {
  const [activeTab, setActiveTab] = useState('code');

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    console.log('Code copied to clipboard');
  };

  const downloadCode = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-code.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isProcessing) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-800">
        <div className="text-center space-y-4">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
          <div className="space-y-2">
            <p className="text-lg font-medium text-white">AI is working...</p>
            <p className="text-sm text-gray-400">Generating your code solution</p>
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

  return (
    <div className="h-full flex flex-col bg-gray-800">
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h3 className="text-lg font-medium text-white">Generated Code</h3>
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
        <TabsList className="grid w-full grid-cols-3 bg-gray-700">
          <TabsTrigger value="code" className="flex items-center space-x-2">
            <Code2 className="h-4 w-4" />
            <span>Code</span>
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center space-x-2">
            <Eye className="h-4 w-4" />
            <span>Preview</span>
          </TabsTrigger>
          <TabsTrigger value="console" className="flex items-center space-x-2">
            <Terminal className="h-4 w-4" />
            <span>Console</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="code" className="flex-1 m-0">
          <div className="h-full bg-gray-900 p-4 overflow-auto">
            <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap">
              <code>{code}</code>
            </pre>
          </div>
        </TabsContent>

        <TabsContent value="preview" className="flex-1 m-0">
          <div className="h-full bg-white p-4 overflow-auto">
            <div className="text-center text-gray-600 mt-8">
              <p>Code preview would be rendered here</p>
              <p className="text-sm mt-2">For HTML/CSS/JS code execution</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="console" className="flex-1 m-0">
          <div className="h-full bg-black p-4 overflow-auto">
            <div className="font-mono text-green-400 text-sm">
              <p>$ Console output will appear here</p>
              <p>$ Ready for code execution...</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
