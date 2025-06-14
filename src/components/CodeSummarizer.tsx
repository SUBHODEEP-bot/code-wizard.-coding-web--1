
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { FileCode, Zap, BookOpen } from 'lucide-react';
import { CodeDisplay } from './CodeDisplay';
import { aiService } from '@/services/aiService';
import { toast } from '@/hooks/use-toast';

export const CodeSummarizer = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('');
  const [summaryType, setSummaryType] = useState('');
  const [summary, setSummary] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);

  const languages = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'PHP', 'Ruby'
  ];

  const summaryTypes = [
    'Brief Overview', 'Detailed Analysis', 'Technical Documentation', 'Code Review Summary', 'Architecture Overview', 'API Documentation'
  ];

  const handleSummarize = async () => {
    if (!code.trim() || !language || !summaryType) {
      toast({
        title: "Missing Information",
        description: "Please provide code, language, and summary type",
        variant: "destructive"
      });
      return;
    }

    setIsSummarizing(true);
    const prompt = `Create a ${summaryType.toLowerCase()} for this ${language} code:

Code:
${code}

Summary Type: ${summaryType}

Please provide:
${summaryType === 'Brief Overview' ? '1. What the code does in 2-3 sentences\n2. Key functions/components\n3. Main purpose' : ''}
${summaryType === 'Detailed Analysis' ? '1. Comprehensive functionality breakdown\n2. Data flow analysis\n3. Component interactions\n4. Performance considerations' : ''}
${summaryType === 'Technical Documentation' ? '1. API/function signatures\n2. Parameters and return types\n3. Usage examples\n4. Dependencies' : ''}
${summaryType === 'Code Review Summary' ? '1. Code quality assessment\n2. Potential issues\n3. Improvement suggestions\n4. Best practices compliance' : ''}
${summaryType === 'Architecture Overview' ? '1. System design patterns\n2. Component relationships\n3. Data flow architecture\n4. Scalability considerations' : ''}
${summaryType === 'API Documentation' ? '1. Endpoint descriptions\n2. Request/response formats\n3. Error handling\n4. Usage examples' : ''}

Make it clear, concise, and professional.`;

    try {
      const result = await aiService.processPrompt(prompt, 'code-summarizer', 'OpenAI');
      setSummary(result);
      toast({
        title: "Code Summarized",
        description: "Summary generated successfully",
        className: "bg-gray-900 border-green-500 text-green-400"
      });
    } catch (error) {
      console.error('Summarization failed:', error);
      toast({
        title: "Summarization Failed",
        description: "Failed to summarize the code. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <div className="flex h-full">
      <div className="w-1/2 border-r border-green-500/30 flex flex-col bg-gray-950/50">
        <div className="p-6 border-b border-green-500/20 bg-gradient-to-r from-gray-900 to-gray-800">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg">
              <FileCode className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-mono">CODE_SUMMARIZER</h2>
              <p className="text-sm text-gray-300 font-mono">Generate concise code summaries</p>
            </div>
          </div>
          <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 font-mono">
            <BookOpen className="h-3 w-3 mr-1" />
            OpenAI GPT-4
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
            <label className="block text-sm font-medium text-green-400 mb-2 font-mono">SUMMARY_TYPE</label>
            <Select value={summaryType} onValueChange={setSummaryType}>
              <SelectTrigger className="bg-gray-900/80 border-green-500/30 text-white font-mono">
                <SelectValue placeholder="Select summary type..." />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-green-500/30">
                {summaryTypes.map(type => (
                  <SelectItem key={type} value={type} className="text-white font-mono">
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-green-400 mb-2 font-mono">CODE_TO_SUMMARIZE</label>
            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your code here for summarization..."
              className="bg-gray-900/80 border-green-500/30 text-white font-mono min-h-[200px]"
            />
          </div>

          <Button
            onClick={handleSummarize}
            disabled={isSummarizing}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-mono"
          >
            {isSummarizing ? (
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <>
                <FileCode className="h-4 w-4 mr-2" />
                GENERATE_SUMMARY
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="flex-1">
        <CodeDisplay
          code={summary}
          isProcessing={isSummarizing}
          error={null}
          selectedLanguage={{ name: 'Code Summary', extension: 'md', icon: '📄', color: 'text-blue-400' }}
          selectedFeature="code-summarizer"
        />
      </div>
    </div>
  );
};
