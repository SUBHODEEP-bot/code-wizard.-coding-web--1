
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Search, Code, Lightbulb } from 'lucide-react';
import { CodeDisplay } from './CodeDisplay';
import { aiService } from '@/services/aiService';
import { toast } from '@/hooks/use-toast';

export const ErrorExplainer = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [stackTrace, setStackTrace] = useState('');
  const [codeContext, setCodeContext] = useState('');
  const [language, setLanguage] = useState('');
  const [explanation, setExplanation] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!errorMessage.trim()) {
      toast({
        title: "Missing Error Message",
        description: "Please provide the error message to analyze",
        variant: "destructive"
      });
      return;
    }

    console.log('Starting error analysis with OpenAI...');
    setIsAnalyzing(true);
    
    const prompt = `Analyze and explain this error in detail:

Error Message: ${errorMessage}
${stackTrace ? `Stack Trace: ${stackTrace}` : ''}
${codeContext ? `Code Context: ${codeContext}` : ''}
${language ? `Programming Language: ${language}` : ''}

Please provide:
1. What this error means in simple terms
2. Common causes of this error
3. Step-by-step solution to fix it
4. Code examples showing the fix
5. Best practices to prevent this error in future
6. Related errors that might occur

Make it comprehensive but easy to understand.`;

    try {
      // Use OpenAI for best error explanations
      const result = await aiService.processPrompt(prompt, 'error-explainer', 'OpenAI');
      setExplanation(result);
      toast({
        title: "Error Analyzed",
        description: "Detailed explanation and solution provided",
        className: "bg-gray-900 border-green-500 text-green-400"
      });
    } catch (error) {
      console.error('Error analysis failed:', error);
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze the error. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex h-full">
      <div className="w-1/2 border-r border-green-500/30 flex flex-col bg-gray-950/50">
        <div className="p-6 border-b border-green-500/20 bg-gradient-to-r from-gray-900 to-gray-800">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-red-600 to-orange-600 rounded-lg">
              <AlertCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-mono">ERROR_EXPLAINER</h2>
              <p className="text-sm text-gray-300 font-mono">Understand and resolve error messages</p>
            </div>
          </div>
          <Badge className="bg-gradient-to-r from-red-600 to-orange-600 text-white border-0 font-mono">
            <Search className="h-3 w-3 mr-1" />
            OpenAI GPT-4
          </Badge>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-green-400 mb-2 font-mono">ERROR_MESSAGE *</label>
            <Textarea
              value={errorMessage}
              onChange={(e) => setErrorMessage(e.target.value)}
              placeholder="Paste your error message here..."
              className="bg-gray-900/80 border-green-500/30 text-white font-mono min-h-[80px]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-green-400 mb-2 font-mono">PROGRAMMING_LANGUAGE</label>
            <Input
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              placeholder="JavaScript, Python, Java, etc."
              className="bg-gray-900/80 border-green-500/30 text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-green-400 mb-2 font-mono">STACK_TRACE</label>
            <Textarea
              value={stackTrace}
              onChange={(e) => setStackTrace(e.target.value)}
              placeholder="Full stack trace (if available)..."
              className="bg-gray-900/80 border-green-500/30 text-white font-mono min-h-[100px]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-green-400 mb-2 font-mono">CODE_CONTEXT</label>
            <Textarea
              value={codeContext}
              onChange={(e) => setCodeContext(e.target.value)}
              placeholder="Relevant code that's causing the error..."
              className="bg-gray-900/80 border-green-500/30 text-white font-mono min-h-[100px]"
            />
          </div>

          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-mono"
          >
            {isAnalyzing ? (
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <>
                <AlertCircle className="h-4 w-4 mr-2" />
                ANALYZE_ERROR
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="flex-1">
        <CodeDisplay
          code={explanation}
          isProcessing={isAnalyzing}
          error={null}
          selectedLanguage={{ name: 'Error Analysis', extension: 'md', icon: '🔍', color: 'text-red-400' }}
          selectedFeature="error-explainer"
        />
      </div>
    </div>
  );
};
