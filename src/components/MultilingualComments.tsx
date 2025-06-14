
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Globe, Languages, FileText } from 'lucide-react';
import { CodeDisplay } from './CodeDisplay';
import { aiService } from '@/services/aiService';
import { toast } from '@/hooks/use-toast';
import { useSoundEffects } from '@/hooks/useSoundEffects';

export const MultilingualComments = () => {
  const [code, setCode] = useState('');
  const [programmingLanguage, setProgrammingLanguage] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('');
  const [commentedCode, setCommentedCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const { playMechanicalSound } = useSoundEffects();

  const programmingLanguages = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'PHP', 'Ruby'
  ];

  const spokenLanguages = [
    'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Russian', 'Chinese', 'Japanese', 'Korean', 'Arabic', 'Hindi'
  ];

  const handleAddComments = async () => {
    if (!code.trim() || !programmingLanguage || !targetLanguage) {
      toast({
        title: "Missing Information",
        description: "Please provide code, programming language, and target language",
        variant: "destructive"
      });
      return;
    }

    playMechanicalSound();
    setIsProcessing(true);
    
    const prompt = `Add comprehensive comments to this ${programmingLanguage} code in ${targetLanguage} language:

Code:
${code}

Please:
1. Add detailed comments explaining the logic in ${targetLanguage}
2. Comment complex algorithms and data structures
3. Explain function purposes and parameters
4. Add inline comments for tricky code sections
5. Include header comments for classes/modules
6. Maintain proper formatting and indentation
7. Use appropriate comment syntax for ${programmingLanguage}

Make the comments educational and helpful for developers who speak ${targetLanguage}.`;

    try {
      const result = await aiService.processPrompt(prompt, 'multilingual-comments', 'Gemini');
      setCommentedCode(result);
      toast({
        title: "Comments Added",
        description: `Code commented in ${targetLanguage}`,
        className: "bg-gray-900 border-green-500 text-green-400"
      });
    } catch (error) {
      console.error('Comment generation failed:', error);
      toast({
        title: "Processing Failed",
        description: "Failed to add multilingual comments",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex h-full">
      <div className="w-1/2 border-r border-green-500/30 flex flex-col bg-gray-950/50">
        <div className="p-6 border-b border-green-500/20 bg-gradient-to-r from-gray-900 to-gray-800">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-lg">
              <Globe className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-mono">MULTILINGUAL_COMMENTS</h2>
              <p className="text-sm text-gray-300 font-mono">Add comments in any language</p>
            </div>
          </div>
          <Badge className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white border-0 font-mono">
            <Languages className="h-3 w-3 mr-1" />
            Gemini AI
          </Badge>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-green-400 mb-2 font-mono">PROGRAMMING_LANGUAGE</label>
            <Select value={programmingLanguage} onValueChange={(value) => {
              playMechanicalSound();
              setProgrammingLanguage(value);
            }}>
              <SelectTrigger className="bg-gray-900/80 border-green-500/30 text-white font-mono">
                <SelectValue placeholder="Select programming language..." />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-green-500/30">
                {programmingLanguages.map(lang => (
                  <SelectItem key={lang} value={lang} className="text-white font-mono">
                    {lang}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-green-400 mb-2 font-mono">COMMENT_LANGUAGE</label>
            <Select value={targetLanguage} onValueChange={(value) => {
              playMechanicalSound();
              setTargetLanguage(value);
            }}>
              <SelectTrigger className="bg-gray-900/80 border-green-500/30 text-white font-mono">
                <SelectValue placeholder="Select comment language..." />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-green-500/30">
                {spokenLanguages.map(lang => (
                  <SelectItem key={lang} value={lang} className="text-white font-mono">
                    {lang}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-green-400 mb-2 font-mono">SOURCE_CODE</label>
            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your code here to add multilingual comments..."
              className="bg-gray-900/80 border-green-500/30 text-white font-mono min-h-[200px]"
            />
          </div>

          <Button
            onClick={handleAddComments}
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono"
          >
            {isProcessing ? (
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <>
                <FileText className="h-4 w-4 mr-2" />
                ADD_COMMENTS
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="flex-1">
        <CodeDisplay
          code={commentedCode}
          isProcessing={isProcessing}
          error={null}
          selectedLanguage={{ name: 'Commented Code', extension: programmingLanguage.toLowerCase(), icon: '🌐', color: 'text-cyan-400' }}
          selectedFeature="multilingual-comments"
        />
      </div>
    </div>
  );
};
