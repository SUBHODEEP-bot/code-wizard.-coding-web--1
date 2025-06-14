import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Bug, Zap, Target } from 'lucide-react';
import { CodeDisplay } from './CodeDisplay';
import { aiService } from '@/services/aiService';
import { toast } from '@/hooks/use-toast';

export const BugFixer = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('');
  const [bugDescription, setBugDescription] = useState('');
  const [fixedCode, setFixedCode] = useState('');
  const [isFixing, setIsFixing] = useState(false);

  const languages = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'PHP', 'Ruby'
  ];

  const handleFix = async () => {
    if (!code.trim() || !language) {
      toast({
        title: "Missing Information",
        description: "Please provide code and select language",
        variant: "destructive"
      });
      return;
    }

    setIsFixing(true);
    const prompt = `Find and fix bugs in this ${language} code:

Code:
${code}

${bugDescription ? `Bug description: ${bugDescription}` : ''}

Please:
1. Identify all potential bugs and issues
2. Provide the corrected code
3. Explain what was wrong and how it was fixed
4. Add comments where fixes were made
5. Suggest additional improvements for robustness
6. Test cases to verify the fix

Provide clean, working code with explanations.`;

    try {
      // Use Gemini for code fixing
      const result = await aiService.processPrompt(prompt, 'bug-fixing', 'Gemini');
      setFixedCode(result);
      toast({
        title: "Bugs Fixed",
        description: "Code has been debugged and corrected",
        className: "bg-gray-900 border-green-500 text-green-400"
      });
    } catch (error) {
      console.error('Bug fixing failed:', error);
      toast({
        title: "Fixing Failed",
        description: "Failed to fix the bugs. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsFixing(false);
    }
  };

  return (
    <div className="flex h-full">
      <div className="w-1/2 border-r border-green-500/30 flex flex-col bg-gray-950/50">
        <div className="p-6 border-b border-green-500/20 bg-gradient-to-r from-gray-900 to-gray-800">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-red-600 to-pink-600 rounded-lg">
              <Bug className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-mono">BUG_FIXER</h2>
              <p className="text-sm text-gray-300 font-mono">Identify and fix code issues</p>
            </div>
          </div>
          <Badge className="bg-gradient-to-r from-red-600 to-pink-600 text-white border-0 font-mono">
            <Target className="h-3 w-3 mr-1" />
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
            <label className="block text-sm font-medium text-green-400 mb-2 font-mono">BUG_DESCRIPTION</label>
            <Textarea
              value={bugDescription}
              onChange={(e) => setBugDescription(e.target.value)}
              placeholder="Describe the bug or expected behavior (optional)..."
              className="bg-gray-900/80 border-green-500/30 text-white font-mono min-h-[80px]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-green-400 mb-2 font-mono">BUGGY_CODE</label>
            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your buggy code here..."
              className="bg-gray-900/80 border-green-500/30 text-white font-mono min-h-[200px]"
            />
          </div>

          <Button
            onClick={handleFix}
            disabled={isFixing}
            className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white font-mono"
          >
            {isFixing ? (
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <>
                <Bug className="h-4 w-4 mr-2" />
                FIX_BUGS
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="flex-1">
        <CodeDisplay
          code={fixedCode}
          isProcessing={isFixing}
          error={null}
          selectedLanguage={{ name: 'Fixed Code', extension: language.toLowerCase(), icon: '🐛', color: 'text-red-400' }}
          selectedFeature="bug-fixing"
        />
      </div>
    </div>
  );
};
