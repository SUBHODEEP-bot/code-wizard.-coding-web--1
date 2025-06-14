
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Zap, Target, TrendingUp } from 'lucide-react';
import { CodeDisplay } from './CodeDisplay';
import { aiService } from '@/services/aiService';
import { toast } from '@/hooks/use-toast';

export const ComplexityOptimizer = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('');
  const [optimizationType, setOptimizationType] = useState('');
  const [optimizedCode, setOptimizedCode] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);

  const languages = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'PHP', 'Ruby'
  ];

  const optimizationTypes = [
    'Time Complexity', 'Space Complexity', 'Memory Usage', 'Algorithm Efficiency', 'Loop Optimization', 'Data Structure Optimization'
  ];

  const handleOptimize = async () => {
    if (!code.trim() || !language || !optimizationType) {
      toast({
        title: "Missing Information",
        description: "Please provide code, language, and optimization type",
        variant: "destructive"
      });
      return;
    }

    setIsOptimizing(true);
    const prompt = `Optimize this ${language} code for better ${optimizationType.toLowerCase()}:

Code:
${code}

Optimization Focus: ${optimizationType}

Please:
1. Analyze current complexity (Big O notation)
2. Identify performance bottlenecks
3. Provide optimized version with better complexity
4. Explain the optimization techniques used
5. Compare before/after performance
6. Suggest alternative algorithms if applicable

Focus specifically on improving ${optimizationType.toLowerCase()}.`;

    try {
      const result = await aiService.processPrompt(prompt, 'complexity-optimizer', 'DeepSeek');
      setOptimizedCode(result);
      toast({
        title: "Code Optimized",
        description: `Optimized for ${optimizationType.toLowerCase()}`,
        className: "bg-gray-900 border-green-500 text-green-400"
      });
    } catch (error) {
      console.error('Optimization failed:', error);
      toast({
        title: "Optimization Failed",
        description: "Failed to optimize the code. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="flex h-full">
      <div className="w-1/2 border-r border-green-500/30 flex flex-col bg-gray-950/50">
        <div className="p-6 border-b border-green-500/20 bg-gradient-to-r from-gray-900 to-gray-800">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-yellow-600 to-orange-600 rounded-lg">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-mono">COMPLEXITY_OPTIMIZER</h2>
              <p className="text-sm text-gray-300 font-mono">Optimize code for better performance</p>
            </div>
          </div>
          <Badge className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white border-0 font-mono">
            <TrendingUp className="h-3 w-3 mr-1" />
            DeepSeek AI
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
            <label className="block text-sm font-medium text-green-400 mb-2 font-mono">OPTIMIZATION_TYPE</label>
            <Select value={optimizationType} onValueChange={setOptimizationType}>
              <SelectTrigger className="bg-gray-900/80 border-green-500/30 text-white font-mono">
                <SelectValue placeholder="Select optimization focus..." />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-green-500/30">
                {optimizationTypes.map(type => (
                  <SelectItem key={type} value={type} className="text-white font-mono">
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-green-400 mb-2 font-mono">CODE_TO_OPTIMIZE</label>
            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your code here for optimization..."
              className="bg-gray-900/80 border-green-500/30 text-white font-mono min-h-[200px]"
            />
          </div>

          <Button
            onClick={handleOptimize}
            disabled={isOptimizing}
            className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white font-mono"
          >
            {isOptimizing ? (
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                OPTIMIZE_CODE
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="flex-1">
        <CodeDisplay
          code={optimizedCode}
          isProcessing={isOptimizing}
          error={null}
          selectedLanguage={{ name: 'Optimized Code', extension: language.toLowerCase(), icon: '⚡', color: 'text-yellow-400' }}
          selectedFeature="complexity-optimizer"
        />
      </div>
    </div>
  );
};
