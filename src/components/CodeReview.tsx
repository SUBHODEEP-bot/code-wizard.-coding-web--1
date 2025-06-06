
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Eye, CheckCircle } from 'lucide-react';
import { CodeDisplay } from './CodeDisplay';
import { aiService } from '@/services/aiService';
import { toast } from '@/hooks/use-toast';

export const CodeReview = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('');
  const [reviewFocus, setReviewFocus] = useState('');
  const [reviewResult, setReviewResult] = useState('');
  const [isReviewing, setIsReviewing] = useState(false);

  const languages = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'PHP', 'Ruby'
  ];

  const reviewFocusAreas = [
    'Security', 'Performance', 'Best Practices', 'Code Quality', 'Architecture', 'General Review'
  ];

  const playMechanicalKeyboardSound = () => {
    // Mechanical keyboard click sound - sharp, crisp
    const audio = new Audio('data:audio/wav;base64,UklGRk4EAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YSoEAACBhYqFbF1hdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhB');
    audio.volume = 0.3;
    audio.play().catch(() => {});
  };

  const handleReview = async () => {
    if (!code.trim() || !language) {
      toast({
        title: "Missing Information",
        description: "Please provide code and select language",
        variant: "destructive"
      });
      return;
    }

    playMechanicalKeyboardSound();
    setIsReviewing(true);
    const prompt = `Review this ${language} code focusing on ${reviewFocus || 'general quality'}:

Code:
${code}

Please provide:
1. Overall code quality assessment
2. Specific issues and improvements
3. Security vulnerabilities (if any)
4. Performance considerations
5. Best practices recommendations
6. Code maintainability evaluation
7. Suggestions for optimization

Focus area: ${reviewFocus || 'comprehensive review'}`;

    try {
      const result = await aiService.processPrompt(prompt, 'code-review', 'Both');
      setReviewResult(result);
      toast({
        title: "Review Complete",
        description: "Code review has been generated",
        className: "bg-gray-900 border-green-500 text-green-400"
      });
    } catch (error) {
      console.error('Review failed:', error);
      toast({
        title: "Review Failed",
        description: "Failed to review the code. Please try again.",
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
              <h2 className="text-xl font-bold text-white font-mono">CODE_REVIEWER</h2>
              <p className="text-sm text-gray-300 font-mono">Analyze and improve code quality</p>
            </div>
          </div>
          <Badge className="bg-gradient-to-r from-orange-600 to-yellow-600 text-white border-0 font-mono">
            <CheckCircle className="h-3 w-3 mr-1" />
            Multi-AI
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
                {reviewFocusAreas.map(area => (
                  <SelectItem key={area} value={area} className="text-white font-mono">
                    {area}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
          code={reviewResult}
          isProcessing={isReviewing}
          error={null}
          selectedLanguage={{ name: 'Code Review', extension: 'md', icon: '🔍', color: 'text-orange-400' }}
          selectedFeature="code-review"
        />
      </div>
    </div>
  );
};
