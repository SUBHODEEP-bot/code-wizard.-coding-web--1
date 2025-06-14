import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Palette, Code, Wand2 } from 'lucide-react';
import { CodeDisplay } from './CodeDisplay';
import { aiService } from '@/services/aiService';
import { toast } from '@/hooks/use-toast';

export const CodeFormatter = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('');
  const [styleGuide, setStyleGuide] = useState('');
  const [formattedCode, setFormattedCode] = useState('');
  const [isFormatting, setIsFormatting] = useState(false);

  const languages = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'PHP', 'Ruby'
  ];

  const styleGuides = [
    'Airbnb', 'Google', 'Standard', 'Prettier', 'ESLint', 'Black (Python)', 'PSR-12 (PHP)', 'Oracle (Java)'
  ];

  const handleFormat = async () => {
    if (!code.trim() || !language || !styleGuide) {
      toast({
        title: "Missing Information",
        description: "Please provide code, language, and style guide",
        variant: "destructive"
      });
      return;
    }

    setIsFormatting(true);
    const prompt = `Format this ${language} code according to the ${styleGuide} style guide:

Code:
${code}

Please:
1. Apply proper indentation and spacing
2. Follow ${styleGuide} naming conventions
3. Organize imports and declarations
4. Add or fix line breaks where needed
5. Ensure consistent formatting throughout
6. Explain the formatting changes made

Return the formatted code with explanations of changes.`;

    try {
      // Use Gemini for code formatting
      const result = await aiService.processPrompt(prompt, 'style-formatter', 'Gemini');
      setFormattedCode(result);
      toast({
        title: "Code Formatted",
        description: "Code has been formatted according to style guide",
        className: "bg-gray-900 border-green-500 text-green-400"
      });
    } catch (error) {
      console.error('Formatting failed:', error);
      toast({
        title: "Formatting Failed",
        description: "Failed to format the code. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsFormatting(false);
    }
  };

  return (
    <div className="flex h-full">
      <div className="w-1/2 border-r border-green-500/30 flex flex-col bg-gray-950/50">
        <div className="p-6 border-b border-green-500/20 bg-gradient-to-r from-gray-900 to-gray-800">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg">
              <Palette className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-mono">CODE_FORMATTER</h2>
              <p className="text-sm text-gray-300 font-mono">Format code according to style guides</p>
            </div>
          </div>
          <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 font-mono">
            <Wand2 className="h-3 w-3 mr-1" />
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
            <label className="block text-sm font-medium text-green-400 mb-2 font-mono">STYLE_GUIDE</label>
            <Select value={styleGuide} onValueChange={setStyleGuide}>
              <SelectTrigger className="bg-gray-900/80 border-green-500/30 text-white font-mono">
                <SelectValue placeholder="Select style guide..." />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-green-500/30">
                {styleGuides.map(guide => (
                  <SelectItem key={guide} value={guide} className="text-white font-mono">
                    {guide}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-green-400 mb-2 font-mono">CODE_TO_FORMAT</label>
            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your code here..."
              className="bg-gray-900/80 border-green-500/30 text-white font-mono min-h-[200px]"
            />
          </div>

          <Button
            onClick={handleFormat}
            disabled={isFormatting}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-mono"
          >
            {isFormatting ? (
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <>
                <Palette className="h-4 w-4 mr-2" />
                FORMAT_CODE
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="flex-1">
        <CodeDisplay
          code={formattedCode}
          isProcessing={isFormatting}
          error={null}
          selectedLanguage={{ name: 'Formatted Code', extension: language.toLowerCase(), icon: '🎨', color: 'text-purple-400' }}
          selectedFeature="style-formatter"
        />
      </div>
    </div>
  );
};
