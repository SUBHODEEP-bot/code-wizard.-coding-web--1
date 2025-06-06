import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Code, Wrench } from 'lucide-react';
import { CodeDisplay } from './CodeDisplay';
import { aiService } from '@/services/aiService';
import { toast } from '@/hooks/use-toast';

export const CodeRefactorer = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('');
  const [refactorType, setRefactorType] = useState('');
  const [refactoredCode, setRefactoredCode] = useState('');
  const [isRefactoring, setIsRefactoring] = useState(false);

  const languages = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'PHP', 'Ruby'
  ];

  const refactorTypes = [
    'Readability', 'Modularity', 'Design Patterns', 'Clean Architecture', 'SOLID Principles', 'General Refactoring'
  ];

  const playMechanicalKeyboardSound = () => {
    // Mechanical keyboard click sound - sharp, crisp
    const audio = new Audio('data:audio/wav;base64,UklGRk4EAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YSoEAACBhYqFbF1hdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhB');
    audio.volume = 0.3;
    audio.play().catch(() => {});
  };

  const handleRefactor = async () => {
    if (!code.trim() || !language) {
      toast({
        title: "Missing Information",
        description: "Please provide code and select language",
        variant: "destructive"
      });
      return;
    }

    playMechanicalKeyboardSound();
    setIsRefactoring(true);
    const prompt = `Refactor this ${language} code for better ${refactorType || 'readability and maintainability'}:

Code:
${code}

Please:
1. Improve code structure and organization
2. Apply best practices and design patterns
3. Enhance readability and maintainability
4. Reduce code duplication and complexity
5. Add appropriate comments and documentation
6. Maintain original functionality

Focus on: ${refactorType || 'general code quality improvements'}`;

    try {
      const result = await aiService.processPrompt(prompt, 'refactoring', 'DeepSeek');
      setRefactoredCode(result);
      toast({
        title: "Code Refactored",
        description: "Code structure has been improved",
        className: "bg-gray-900 border-green-500 text-green-400"
      });
    } catch (error) {
      console.error('Refactoring failed:', error);
      toast({
        title: "Refactoring Failed",
        description: "Failed to refactor the code. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsRefactoring(false);
    }
  };

  return (
    <div className="flex h-full">
      <div className="w-1/2 border-r border-green-500/30 flex flex-col bg-gray-950/50">
        <div className="p-6 border-b border-green-500/20 bg-gradient-to-r from-gray-900 to-gray-800">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-purple-600 to-violet-600 rounded-lg">
              <RefreshCw className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-mono">CODE_REFACTORER</h2>
              <p className="text-sm text-gray-300 font-mono">Improve structure and maintainability</p>
            </div>
          </div>
          <Badge className="bg-gradient-to-r from-purple-600 to-violet-600 text-white border-0 font-mono">
            <Wrench className="h-3 w-3 mr-1" />
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
            <label className="block text-sm font-medium text-green-400 mb-2 font-mono">REFACTOR_FOCUS</label>
            <Select value={refactorType} onValueChange={setRefactorType}>
              <SelectTrigger className="bg-gray-900/80 border-green-500/30 text-white font-mono">
                <SelectValue placeholder="Select refactoring type (optional)..." />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-green-500/30">
                {refactorTypes.map(type => (
                  <SelectItem key={type} value={type} className="text-white font-mono">
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-green-400 mb-2 font-mono">CODE_TO_REFACTOR</label>
            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your code here for refactoring..."
              className="bg-gray-900/80 border-green-500/30 text-white font-mono min-h-[200px]"
            />
          </div>

          <Button
            onClick={handleRefactor}
            disabled={isRefactoring}
            className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white font-mono"
          >
            {isRefactoring ? (
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                REFACTOR_CODE
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="flex-1">
        <CodeDisplay
          code={refactoredCode}
          isProcessing={isRefactoring}
          error={null}
          selectedLanguage={{ name: 'Refactored Code', extension: language.toLowerCase(), icon: '🔄', color: 'text-purple-400' }}
          selectedFeature="refactoring"
        />
      </div>
    </div>
  );
};
