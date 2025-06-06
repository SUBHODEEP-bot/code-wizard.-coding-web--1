import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Zap, TrendingUp, Gauge } from 'lucide-react';
import { CodeDisplay } from './CodeDisplay';
import { aiService } from '@/services/aiService';
import { toast } from '@/hooks/use-toast';

export const CodeOptimizer = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('');
  const [optimizationType, setOptimizationType] = useState('');
  const [optimizedCode, setOptimizedCode] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);

  const languages = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'PHP', 'Ruby'
  ];

  const optimizationTypes = [
    'Performance', 'Memory Usage', 'Readability', 'Algorithm Efficiency', 'Database Queries', 'General Optimization'
  ];

  const playMechanicalKeyboardSound = () => {
    // Mechanical keyboard click sound - sharp, crisp
    const audio = new Audio('data:audio/wav;base64,UklGRk4EAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YSoEAACBhYqFbF1hdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhB');
    audio.volume = 0.3;
    audio.play().catch(() => {});
  };

  const handleOptimize = async () => {
    if (!code.trim() || !language) {
      toast({
        title: "Missing Information",
        description: "Please provide code and select language",
        variant: "destructive"
      });
      return;
    }

    playMechanicalKeyboardSound();
    setIsOptimizing(true);
    const prompt = `Optimize this ${language} code for ${optimizationType || 'general performance'}:

Code:
${code}

Please:
1. Identify performance bottlenecks and inefficiencies
2. Provide optimized version with improvements
3. Explain what optimizations were made and why
4. Compare before/after performance characteristics
5. Suggest best practices for this type of code
6. Maintain code functionality while improving efficiency

Focus on: ${optimizationType || 'overall optimization'}`;

    try {
      const result = await aiService.processPrompt(prompt, 'code-optimization', 'Gemini');
      setOptimizedCode(result);
      toast({
        title: "Code Optimized",
        description: "Performance improvements have been applied",
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
            <div className="p-2 bg-gradient-to-br from-green-600 to-teal-600 rounded-lg">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-mono">CODE_OPTIMIZER</h2>
              <p className="text-sm text-gray-300 font-mono">Enhance performance and efficiency</p>
            </div>
          </div>
          <Badge className="bg-gradient-to-r from-green-600 to-teal-600 text-white border-0 font-mono">
            <Gauge className="h-3 w-3 mr-1" />
            Gemini AI
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
            <label className="block text-sm font-medium text-green-400 mb-2 font-mono">OPTIMIZATION_FOCUS</label>
            <Select value={optimizationType} onValueChange={setOptimizationType}>
              <SelectTrigger className="bg-gray-900/80 border-green-500/30 text-white font-mono">
                <SelectValue placeholder="Select optimization type (optional)..." />
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
            className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500 text-white font-mono"
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
          selectedLanguage={{ name: 'Optimized Code', extension: language.toLowerCase(), icon: '⚡', color: 'text-green-400' }}
          selectedFeature="code-optimization"
        />
      </div>
    </div>
  );
};
