
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { TestTube, Code, CheckCircle } from 'lucide-react';
import { CodeDisplay } from './CodeDisplay';
import { aiService } from '@/services/aiService';
import { toast } from '@/hooks/use-toast';

export const UnitTestGenerator = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('');
  const [testFramework, setTestFramework] = useState('');
  const [testCoverage, setTestCoverage] = useState('');
  const [generatedTests, setGeneratedTests] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const languageFrameworks = {
    'JavaScript': ['Jest', 'Mocha', 'Jasmine', 'Vitest'],
    'TypeScript': ['Jest', 'Vitest', 'Mocha'],
    'Python': ['pytest', 'unittest', 'nose2'],
    'Java': ['JUnit 5', 'TestNG', 'Mockito'],
    'C#': ['NUnit', 'xUnit', 'MSTest'],
    'Go': ['testing', 'Testify'],
    'Rust': ['built-in tests', 'proptest'],
    'PHP': ['PHPUnit', 'Codeception'],
    'Ruby': ['RSpec', 'Test::Unit', 'Minitest']
  };

  const coverageTypes = [
    'Basic functionality', 'Edge cases', 'Error handling', 'Integration tests', 'Comprehensive (all above)'
  ];

  const handleGenerate = async () => {
    if (!code.trim() || !language || !testFramework) {
      toast({
        title: "Missing Information",
        description: "Please provide code, language, and test framework",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    const prompt = `Generate comprehensive unit tests for this ${language} code using ${testFramework}:

Code to test:
${code}

Test coverage requirements: ${testCoverage || 'Comprehensive coverage'}

Please generate:
1. Unit tests covering all functions/methods
2. Tests for edge cases and boundary conditions
3. Error handling and exception tests
4. Mock objects where necessary
5. Setup and teardown methods if needed
6. Test data and fixtures
7. Comments explaining test scenarios

Follow ${testFramework} best practices and conventions.
Include test descriptions and organize tests logically.
Aim for high code coverage and meaningful assertions.`;

    try {
      const result = await aiService.processPrompt(prompt, 'test-generator', 'Gemini');
      setGeneratedTests(result);
      toast({
        title: "Tests Generated",
        description: "Unit tests have been generated successfully",
        className: "bg-gray-900 border-green-500 text-green-400"
      });
    } catch (error) {
      console.error('Test generation failed:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate unit tests. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-full">
      <div className="w-1/2 border-r border-green-500/30 flex flex-col bg-gray-950/50">
        <div className="p-6 border-b border-green-500/20 bg-gradient-to-r from-gray-900 to-gray-800">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg">
              <TestTube className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-mono">UNIT_TEST_GENERATOR</h2>
              <p className="text-sm text-gray-300 font-mono">Generate comprehensive unit tests</p>
            </div>
          </div>
          <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white border-0 font-mono">
            <CheckCircle className="h-3 w-3 mr-1" />
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
                {Object.keys(languageFrameworks).map(lang => (
                  <SelectItem key={lang} value={lang} className="text-white font-mono">
                    {lang}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-green-400 mb-2 font-mono">TEST_FRAMEWORK</label>
            <Select value={testFramework} onValueChange={setTestFramework}>
              <SelectTrigger className="bg-gray-900/80 border-green-500/30 text-white font-mono">
                <SelectValue placeholder="Select test framework..." />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-green-500/30">
                {language && languageFrameworks[language as keyof typeof languageFrameworks]?.map(framework => (
                  <SelectItem key={framework} value={framework} className="text-white font-mono">
                    {framework}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-green-400 mb-2 font-mono">TEST_COVERAGE</label>
            <Select value={testCoverage} onValueChange={setTestCoverage}>
              <SelectTrigger className="bg-gray-900/80 border-green-500/30 text-white font-mono">
                <SelectValue placeholder="Select coverage type..." />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-green-500/30">
                {coverageTypes.map(type => (
                  <SelectItem key={type} value={type} className="text-white font-mono">
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-green-400 mb-2 font-mono">CODE_TO_TEST</label>
            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your code here to generate tests..."
              className="bg-gray-900/80 border-green-500/30 text-white font-mono min-h-[200px]"
            />
          </div>

          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-mono"
          >
            {isGenerating ? (
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <>
                <TestTube className="h-4 w-4 mr-2" />
                GENERATE_TESTS
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="flex-1">
        <CodeDisplay
          code={generatedTests}
          isProcessing={isGenerating}
          error={null}
          selectedLanguage={{ name: 'Unit Tests', extension: language.toLowerCase(), icon: '🧪', color: 'text-green-400' }}
          selectedFeature="test-generator"
        />
      </div>
    </div>
  );
};
