
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Eye, CheckCircle2 } from 'lucide-react';
import { CodeDisplay } from './CodeDisplay';
import { aiService } from '@/services/aiService';
import { toast } from '@/hooks/use-toast';

export const CodeReviewAssistant = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('');
  const [reviewFocus, setReviewFocus] = useState('');
  const [context, setContext] = useState('');
  const [reviewReport, setReviewReport] = useState('');
  const [isReviewing, setIsReviewing] = useState(false);

  const languages = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'PHP', 'Ruby'
  ];

  const reviewFocuses = [
    'Code Quality', 'Performance', 'Security', 'Best Practices', 'Architecture', 'Comprehensive Review'
  ];

  const handleReview = async () => {
    if (!code.trim() || !language) {
      toast({
        title: "Missing Information",
        description: "Please provide code and select language",
        variant: "destructive"
      });
      return;
    }

    setIsReviewing(true);
    const prompt = `Perform a comprehensive code review on this ${language} code:

Code to review:
${code}

${reviewFocus ? `Focus area: ${reviewFocus}` : 'Comprehensive review'}
${context ? `Additional context: ${context}` : ''}

Please provide a detailed code review covering:

1. **Code Quality Assessment:**
   - Readability and maintainability
   - Naming conventions
   - Code organization and structure
   - Documentation and comments

2. **Performance Analysis:**
   - Efficiency concerns
   - Resource usage
   - Optimization opportunities
   - Algorithmic improvements

3. **Best Practices Compliance:**
   - Language-specific conventions
   - Design patterns usage
   - Error handling
   - Code reusability

4. **Security Review:**
   - Potential vulnerabilities
   - Input validation
   - Data handling
   - Authentication/authorization

5. **Architecture & Design:**
   - Code architecture
   - Separation of concerns
   - Modularity
   - Scalability considerations

6. **Specific Recommendations:**
   - Immediate fixes needed
   - Refactoring suggestions
   - Alternative approaches
   - Priority levels for improvements

7. **Overall Assessment:**
   - Code quality score (1-10)
   - Strengths and weaknesses
   - Deployment readiness
   - Next steps

Provide actionable feedback with specific examples and code suggestions.`;

    try {
      const result = await aiService.processPrompt(prompt, 'code-reviewer', 'Both');
      setReviewReport(result);
      toast({
        title: "Review Complete",
        description: "Code review has been generated successfully",
        className: "bg-gray-900 border-green-500 text-green-400"
      });
    } catch (error) {
      console.error('Code review failed:', error);
      toast({
        title: "Review Failed",
        description: "Failed to complete code review. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsReviewing(false);
    }
  };

  return (
    <div className="flex h-full">
      <div className="w-1/2 border-r border-green-500/30 flex flex-col bg-gray-950/50">
        <div className="p-6 border-b border-green-500/20 bg-gradient-to-r from-gray-900 to-gray-800">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-orange-600 to-yellow-600 rounded-lg">
              <Search className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-mono">CODE_REVIEW_ASSISTANT</h2>
              <p className="text-sm text-gray-300 font-mono">Get detailed code reviews and suggestions</p>
            </div>
          </div>
          <Badge className="bg-gradient-to-r from-orange-600 to-yellow-600 text-white border-0 font-mono">
            <Eye className="h-3 w-3 mr-1" />
            Multi-AI Review
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
            <label className="block text-sm font-medium text-green-400 mb-2 font-mono">REVIEW_FOCUS</label>
            <Select value={reviewFocus} onValueChange={setReviewFocus}>
              <SelectTrigger className="bg-gray-900/80 border-green-500/30 text-white font-mono">
                <SelectValue placeholder="Select review focus (optional)..." />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-green-500/30">
                {reviewFocuses.map(focus => (
                  <SelectItem key={focus} value={focus} className="text-white font-mono">
                    {focus}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-green-400 mb-2 font-mono">PROJECT_CONTEXT</label>
            <Textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Describe the project context, requirements, or specific concerns..."
              className="bg-gray-900/80 border-green-500/30 text-white font-mono min-h-[80px]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-green-400 mb-2 font-mono">CODE_TO_REVIEW</label>
            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your code here for review..."
              className="bg-gray-900/80 border-green-500/30 text-white font-mono min-h-[200px]"
            />
          </div>

          <Button
            onClick={handleReview}
            disabled={isReviewing}
            className="w-full bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-500 hover:to-yellow-500 text-white font-mono"
          >
            {isReviewing ? (
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                REVIEW_CODE
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="flex-1">
        <CodeDisplay
          code={reviewReport}
          isProcessing={isReviewing}
          error={null}
          selectedLanguage={{ name: 'Code Review', extension: 'md', icon: '👁️', color: 'text-orange-400' }}
          selectedFeature="code-reviewer"
        />
      </div>
    </div>
  );
};
