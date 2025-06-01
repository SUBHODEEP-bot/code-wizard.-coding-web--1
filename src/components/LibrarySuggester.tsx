
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Package, Star, Download } from 'lucide-react';
import { CodeDisplay } from './CodeDisplay';
import { aiService } from '@/services/aiService';
import { toast } from '@/hooks/use-toast';

export const LibrarySuggester = () => {
  const [projectType, setProjectType] = useState('');
  const [requirements, setRequirements] = useState('');
  const [language, setLanguage] = useState('');
  const [constraints, setConstraints] = useState('');
  const [suggestions, setSuggestions] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const projectTypes = [
    { value: 'web-frontend', label: 'Web Frontend' },
    { value: 'web-backend', label: 'Web Backend' },
    { value: 'mobile-app', label: 'Mobile App' },
    { value: 'desktop-app', label: 'Desktop App' },
    { value: 'data-science', label: 'Data Science' },
    { value: 'machine-learning', label: 'Machine Learning' },
    { value: 'game-dev', label: 'Game Development' },
    { value: 'api-service', label: 'API Service' }
  ];

  const languages = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'C++', 'Go', 'Rust', 'PHP', 'Ruby', 'Swift', 'Kotlin'
  ];

  const handleAnalyze = async () => {
    if (!requirements || !language) {
      toast({
        title: "Missing Information",
        description: "Please provide requirements and select language",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    const prompt = `Suggest the best libraries and frameworks for this project:

Project Type: ${projectTypes.find(p => p.value === projectType)?.label || 'General'}
Programming Language: ${language}
Requirements: ${requirements}
${constraints ? `Constraints: ${constraints}` : ''}

Please provide:
1. Top 5-7 recommended libraries/frameworks with:
   - Library name and version
   - Brief description
   - Why it's suitable for this project
   - Installation command
   - Basic usage example
   - Pros and cons
   - Community support and maintenance status

2. Alternative options for each category
3. Best practices for integration
4. Performance considerations
5. Learning curve assessment

Focus on actively maintained, well-documented libraries with good community support.`;

    try {
      const result = await aiService.processPrompt(prompt, 'library-suggester', 'Both');
      setSuggestions(result);
      toast({
        title: "Libraries Suggested",
        description: "Comprehensive library recommendations provided",
        className: "bg-gray-900 border-green-500 text-green-400"
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Failed to generate library suggestions",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex h-full">
      <div className="w-1/2 border-r border-green-500/30 flex flex-col bg-gray-950/50">
        <div className="p-6 border-b border-green-500/20 bg-gradient-to-r from-gray-900 to-gray-800">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-yellow-600 to-orange-600 rounded-lg">
              <Lightbulb className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-mono">LIBRARY_SUGGESTER</h2>
              <p className="text-sm text-gray-300 font-mono">Get recommendations for libraries and frameworks</p>
            </div>
          </div>
          <Badge className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white border-0 font-mono">
            <Package className="h-3 w-3 mr-1" />
            Multi-AI Analysis
          </Badge>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-green-400 mb-2 font-mono">PROGRAMMING_LANGUAGE *</label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="bg-gray-900/80 border-green-500/30 text-white font-mono">
                <SelectValue placeholder="Select programming language..." />
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
            <label className="block text-sm font-medium text-green-400 mb-2 font-mono">PROJECT_TYPE</label>
            <Select value={projectType} onValueChange={setProjectType}>
              <SelectTrigger className="bg-gray-900/80 border-green-500/30 text-white font-mono">
                <SelectValue placeholder="Select project type..." />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-green-500/30">
                {projectTypes.map(type => (
                  <SelectItem key={type.value} value={type.value} className="text-white font-mono">
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-green-400 mb-2 font-mono">PROJECT_REQUIREMENTS *</label>
            <Textarea
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              placeholder="Describe what you want to build (UI components, database, authentication, API, etc.)"
              className="bg-gray-900/80 border-green-500/30 text-white font-mono min-h-[120px]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-green-400 mb-2 font-mono">CONSTRAINTS</label>
            <Textarea
              value={constraints}
              onChange={(e) => setConstraints(e.target.value)}
              placeholder="Any constraints (bundle size, performance, learning curve, team experience, etc.)"
              className="bg-gray-900/80 border-green-500/30 text-white font-mono"
            />
          </div>

          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white font-mono"
          >
            {isAnalyzing ? (
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <>
                <Lightbulb className="h-4 w-4 mr-2" />
                GET_RECOMMENDATIONS
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="flex-1">
        <CodeDisplay
          code={suggestions}
          isProcessing={isAnalyzing}
          error={null}
          selectedLanguage={{ name: 'Library Recommendations', icon: '📦', color: 'text-yellow-400' }}
          selectedFeature="library-suggester"
        />
      </div>
    </div>
  );
};
