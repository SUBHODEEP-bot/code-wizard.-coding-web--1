
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Languages, Globe } from 'lucide-react';
import { CodeDisplay } from './CodeDisplay';
import { aiService } from '@/services/aiService';
import { toast } from '@/hooks/use-toast';

export const MultilingualComments = () => {
  const [code, setCode] = useState('');
  const [programmingLanguage, setProgrammingLanguage] = useState('');
  const [commentLanguage, setCommentLanguage] = useState('');
  const [commentStyle, setCommentStyle] = useState('');
  const [commentedCode, setCommentedCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const programmingLanguages = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'PHP', 'Ruby'
  ];

  const commentLanguages = [
    'English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Korean', 'Arabic', 'Hindi', 'Portuguese', 'Russian', 'Italian'
  ];

  const commentStyles = [
    'Detailed', 'Concise', 'Educational', 'Professional', 'Beginner-Friendly', 'Technical'
  ];

  const handleAddComments = async () => {
    if (!code.trim() || !programmingLanguage || !commentLanguage) {
      toast({
        title: "Missing Information",
        description: "Please provide code, programming language, and comment language",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    const prompt = `Add ${commentLanguage} comments to this ${programmingLanguage} code:

Code:
${code}

Comment Requirements:
- Language: ${commentLanguage}
- Style: ${commentStyle || 'Professional'}
- Add inline comments explaining logic
- Add block comments for functions/classes
- Explain complex algorithms and data structures
- Make comments clear and helpful for developers

Please maintain the original code structure and add appropriate comments in ${commentLanguage}.`;

    try {
      const result = await aiService.processPrompt(prompt, 'multilingual-comments', 'OpenAI');
      setCommentedCode(result);
      toast({
        title: "Comments Added",
        description: `Comments added in ${commentLanguage}`,
        className: "bg-gray-900 border-green-500 text-green-400"
      });
    } catch (error) {
      console.error('Comment generation failed:', error);
      toast({
        title: "Comment Generation Failed",
        description: "Failed to add comments. Please try again.",
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
            <div className="p-2 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg">
              <MessageSquare className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-mono">MULTILINGUAL_COMMENTS</h2>
              <p className="text-sm text-gray-300 font-mono">Add comments in different languages</p>
            </div>
          </div>
          <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 font-mono">
            <Globe className="h-3 w-3 mr-1" />
            OpenAI GPT-4
          </Badge>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-green-400 mb-2 font-mono">PROGRAMMING_LANGUAGE</label>
            <Select value={programmingLanguage} onValueChange={setProgrammingLanguage}>
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
            <Select value={commentLanguage} onValueChange={setCommentLanguage}>
              <SelectTrigger className="bg-gray-900/80 border-green-500/30 text-white font-mono">
                <SelectValue placeholder="Select comment language..." />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-green-500/30">
                {commentLanguages.map(lang => (
                  <SelectItem key={lang} value={lang} className="text-white font-mono">
                    {lang}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-green-400 mb-2 font-mono">COMMENT_STYLE</label>
            <Select value={commentStyle} onValueChange={setCommentStyle}>
              <SelectTrigger className="bg-gray-900/80 border-green-500/30 text-white font-mono">
                <SelectValue placeholder="Select comment style (optional)..." />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-green-500/30">
                {commentStyles.map(style => (
                  <SelectItem key={style} value={style} className="text-white font-mono">
                    {style}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-green-400 mb-2 font-mono">CODE_TO_COMMENT</label>
            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your code here..."
              className="bg-gray-900/80 border-green-500/30 text-white font-mono min-h-[200px]"
            />
          </div>

          <Button
            onClick={handleAddComments}
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-mono"
          >
            {isProcessing ? (
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <>
                <MessageSquare className="h-4 w-4 mr-2" />
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
          selectedLanguage={{ name: 'Commented Code', extension: programmingLanguage.toLowerCase(), icon: '💬', color: 'text-purple-400' }}
          selectedFeature="multilingual-comments"
        />
      </div>
    </div>
  );
};
