
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { aiService } from "@/services/aiService";
import { toast } from "@/hooks/use-toast";
import { Code } from "lucide-react";

const languageList = [
  "Python", "JavaScript", "TypeScript", "Java", "C#", "C++", "Go", "Rust", "PHP", "Ruby", "Swift", "Kotlin"
];

export const AICodeLearner = () => {
  const [language, setLanguage] = useState<string>("");
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAskAI = async () => {
    if (!language || !question.trim()) {
      toast({
        title: "Missing info",
        description: "Please select a programming language and enter a question.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    setAnswer("");
    try {
      const prompt = `The user wants to learn: ${language}. Question: ${question}. Provide a clear, educational and beginner-friendly explanation, with code and best practices.`;
      const aiAnswer = await aiService.processPrompt(prompt, 'ai-code-learner', 'Both');
      setAnswer(aiAnswer);
      toast({
        title: "AI Answer Ready",
        description: `Code help for ${language}`,
        className: "bg-gray-900 border-green-500 text-green-400",
      });
    } catch (error) {
      toast({
        title: "AI Error",
        description: "The AI failed to answer. Try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full">
      <div className="w-1/2 border-r border-green-500/30 flex flex-col bg-gray-950/50">
        <div className="p-6 border-b border-green-500/20 bg-gradient-to-r from-gray-900 to-gray-800 flex items-center space-x-3 mb-4">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-green-600 rounded-lg">
            <Code className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-lg font-bold text-white font-mono">AI Code Learner</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-green-400 mb-2 font-mono">CHOOSE_LANGUAGE</label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="bg-gray-900/80 border-green-500/30 text-white font-mono">
                <SelectValue placeholder="Select language..." />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-green-500/30">
                {languageList.map((lang) => (
                  <SelectItem key={lang} value={lang} className="text-white font-mono">{lang}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-green-400 mb-2 font-mono">YOUR_QUESTION</label>
            <Textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={`E.g. "How do I write a for loop in ${language || 'Python'}?"`}
              className="bg-gray-900/80 border-green-500/30 text-white font-mono min-h-[80px]"
              disabled={isLoading}
            />
          </div>
          <Button onClick={handleAskAI} disabled={isLoading} className="w-full bg-gradient-to-r from-blue-500 to-green-600 hover:from-blue-400 hover:to-green-500 text-white font-mono">
            {isLoading ? "Asking AI..." : "ASK AI"}
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-6 bg-gray-950 text-white">
        {!answer && !isLoading && (
          <div className="text-center text-lg text-gray-400 font-mono py-10">
            Ask a coding question to the AI and get step-by-step code explanations!
          </div>
        )}
        {answer && (
          <pre className="whitespace-pre-wrap bg-gray-900 text-green-400 p-4 rounded shadow overflow-x-auto">
            {answer}
          </pre>
        )}
        {isLoading && (
          <div className="text-center py-10 text-blue-400 font-mono animate-pulse">
            AI is thinking...
          </div>
        )}
      </div>
    </div>
  );
};
