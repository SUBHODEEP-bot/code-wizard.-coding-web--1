
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Brain, Eye } from 'lucide-react';
import { CodeDisplay } from './CodeDisplay';
import { aiService } from '@/services/aiService';
import { toast } from '@/hooks/use-toast';

export const CodeExplainer = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('');
  const [explanation, setExplanation] = useState('');
  const [isExplaining, setIsExplaining] = useState(false);

  const languages = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'PHP', 'Ruby'
  ];

  const handleExplain = async () => {
    if (!code.trim() || !language) {
      toast({
        title: "Missing Information",
        description: "Please provide code and select language",
        variant: "destructive"
      });
      return;
    }

    setIsExplaining(true);
    const prompt = `Explain this ${language} code in detail:

Code:
${code}

Please provide:
1. High-level overview of what the code does
2. Line-by-line explanation of key parts
3. Data flow and logic explanation
4. Variables and functions purpose
5. Potential improvements or optimizations
6. Common use cases and applications

Make the explanation clear and educational.`;

    try {
      // Use OpenAI for best explanations
      const result = await aiService.processPrompt(prompt, 'code-explanation', 'OpenAI');
      setExplanation(result);
      toast({
        title: "Code Explained",
        description: "Detailed explanation generated",
        className: "bg-gray-900 border-green-500 text-green-400"
      });
    } catch (error) {
      console.error('Explanation failed:', error);
      toast({
        title: "Explanation Failed",
        description: "Failed to explain the code. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsExplaining(false);
    }
  };

  return (
    <div className="flex h-full">
      <div className="w-1/2 border-r border-green-500/30 flex flex-col bg-gray-950/50">
        <div className="p-6 border-b border-green-500/20 bg-gradient-to-r from-gray-900 to-gray-800">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-mono">CODE_EXPLAINER</h2>
              <p className="text-sm text-gray-300 font-mono">Understand code logic and functionality</p>
            </div>
          </div>
          <Badge className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-0 font-mono">
            <Brain className="h-3 w-3 mr-1" />
            Multi-AI (Optimized)
          </Badge>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-green-400 mb-2 font-mono">PROGRAMMING_LANGUAGE</label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="bg-gray-900/80 border-green-500/30 text-white font-mono">
                <SelectValue placeholder="Select language..." />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-green-500/30">
                {languages.map(lang => (
                  <SelectItem key={lang} value={lang} className="text-white font-mono">
                    {lang}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-green-400 mb-2 font-mono">CODE_TO_EXPLAIN</label>
            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your code here for explanation..."
              className="bg-gray-900/80 border-green-500/30 text-white font-mono min-h-[200px]"
            />
          </div>

          <Button
            onClick={handleExplain}
            disabled={isExplaining}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-mono"
          >
            {isExplaining ? (
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <>
                <BookOpen className="h-4 w-4 mr-2" />
                EXPLAIN_CODE
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="flex-1">
        <CodeDisplay
          code={explanation}
          isProcessing={isExplaining}
          error={null}
          selectedLanguage={{ name: 'Code Explanation', extension: 'md', icon: '📖', color: 'text-blue-400' }}
          selectedFeature="code-explanation"
        />
      </div>
    </div>
  );
};
