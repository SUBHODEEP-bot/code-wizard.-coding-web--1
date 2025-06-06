import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, Activity } from 'lucide-react';
import { CodeDisplay } from './CodeDisplay';
import { aiService } from '@/services/aiService';
import { toast } from '@/hooks/use-toast';

export const ComplexityAnalyzer = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('');
  const [analysisType, setAnalysisType] = useState('');
  const [complexityReport, setComplexityReport] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const languages = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'PHP', 'Ruby'
  ];

  const analysisTypes = [
    'Time Complexity', 'Space Complexity', 'Cyclomatic Complexity', 'Big O Analysis', 'Complete Analysis'
  ];

  const handleAnalyze = async () => {
    if (!code.trim() || !language) {
      toast({
        title: "Missing Information",
        description: "Please provide code and select language",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    const prompt = `Perform a comprehensive complexity analysis on this ${language} code:

Code:
${code}

${analysisType ? `Focus on: ${analysisType}` : 'Perform complete complexity analysis'}

Please analyze and provide:

1. **Time Complexity Analysis:**
   - Big O notation for each function/method
   - Best, average, and worst-case scenarios
   - Loop analysis and nested operations

2. **Space Complexity Analysis:**
   - Memory usage patterns
   - Auxiliary space requirements
   - Stack space for recursive functions

3. **Cyclomatic Complexity:**
   - Code complexity score
   - Decision points and branching
   - Maintainability assessment

4. **Performance Optimization Suggestions:**
   - Bottlenecks identification
   - Alternative algorithms
   - Data structure improvements
   - Specific optimization techniques

5. **Scalability Analysis:**
   - How performance scales with input size
   - Memory scaling characteristics
   - Practical performance implications

6. **Comparative Analysis:**
   - Compare with optimal solutions
   - Industry standard benchmarks
   - Alternative approaches

Provide clear explanations, visual representations where helpful, and actionable recommendations.`;

    try {
      const result = await aiService.processPrompt(prompt, 'complexity-analyzer', 'DeepSeek');
      setComplexityReport(result);
      toast({
        title: "Analysis Complete",
        description: "Complexity analysis has been generated",
        className: "bg-gray-900 border-green-500 text-green-400"
      });
    } catch (error) {
      console.error('Complexity analysis failed:', error);
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze complexity. Please try again.",
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
            <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-mono">COMPLEXITY_ANALYZER</h2>
              <p className="text-sm text-gray-300 font-mono">Analyze algorithm complexity and performance</p>
            </div>
          </div>
          <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 font-mono">
            <Activity className="h-3 w-3 mr-1" />
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
            <label className="block text-sm font-medium text-green-400 mb-2 font-mono">ANALYSIS_TYPE</label>
            <Select value={analysisType} onValueChange={setAnalysisType}>
              <SelectTrigger className="bg-gray-900/80 border-green-500/30 text-white font-mono">
                <SelectValue placeholder="Select analysis focus (optional)..." />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-green-500/30">
                {analysisTypes.map(type => (
                  <SelectItem key={type} value={type} className="text-white font-mono">
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-green-400 mb-2 font-mono">CODE_TO_ANALYZE</label>
            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your algorithm or code here for complexity analysis..."
              className="bg-gray-900/80 border-green-500/30 text-white font-mono min-h-[200px]"
            />
          </div>

          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-mono"
          >
            {isAnalyzing ? (
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <>
                <BarChart3 className="h-4 w-4 mr-2" />
                ANALYZE_COMPLEXITY
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="flex-1">
        <CodeDisplay
          code={complexityReport}
          isProcessing={isAnalyzing}
          error={null}
          selectedLanguage={{ name: 'Complexity Analysis', extension: 'md', icon: '📊', color: 'text-blue-400' }}
          selectedFeature="complexity-analyzer"
        />
      </div>
    </div>
  );
};
