
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Layers, Download, Copy, Folder } from 'lucide-react';
import { CodeDisplay } from './CodeDisplay';
import { aiService } from '@/services/aiService';
import { toast } from '@/hooks/use-toast';

export const ProjectScaffold = () => {
  const [projectType, setProjectType] = useState('');
  const [description, setDescription] = useState('');
  const [features, setFeatures] = useState('');
  const [techStack, setTechStack] = useState('');
  const [scaffoldCode, setScaffoldCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const projectTypes = [
    { value: 'web-app', label: 'Web Application' },
    { value: 'mobile-app', label: 'Mobile App Structure' },
    { value: 'api', label: 'API Server' },
    { value: 'library', label: 'Library/Package' },
    { value: 'desktop-app', label: 'Desktop Application' }
  ];

  const handleGenerate = async () => {
    if (!projectType || !description) {
      toast({
        title: "Missing Information",
        description: "Please select project type and add description",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    const prompt = `Generate a complete project scaffold for a ${projectTypes.find(p => p.value === projectType)?.label}:

Project Description: ${description}
Features Required: ${features || 'Basic functionality'}
Tech Stack: ${techStack || 'Modern best practices'}

Please provide:
1. Complete folder structure
2. Configuration files (package.json, etc.)
3. Main application files
4. Basic routing/navigation
5. Essential components
6. Documentation (README.md)

Make it production-ready with proper structure and best practices.`;

    try {
      const result = await aiService.processPrompt(prompt, 'scaffold-generator', 'Gemini');
      setScaffoldCode(result);
      toast({
        title: "Scaffold Generated",
        description: "Project structure has been created successfully",
        className: "bg-gray-900 border-green-500 text-green-400"
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate project scaffold",
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
            <div className="p-2 bg-gradient-to-br from-green-600 to-blue-600 rounded-lg">
              <Layers className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-mono">PROJECT_SCAFFOLD_GENERATOR</h2>
              <p className="text-sm text-gray-300 font-mono">Create complete project structures</p>
            </div>
          </div>
          <Badge className="bg-gradient-to-r from-green-600 to-blue-600 text-white border-0 font-mono">
            <Folder className="h-3 w-3 mr-1" />
            Gemini AI
          </Badge>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
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
            <label className="block text-sm font-medium text-green-400 mb-2 font-mono">PROJECT_DESCRIPTION</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your project requirements..."
              className="bg-gray-900/80 border-green-500/30 text-white font-mono min-h-[100px]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-green-400 mb-2 font-mono">KEY_FEATURES</label>
            <Textarea
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
              placeholder="List main features (authentication, dashboard, API, etc.)"
              className="bg-gray-900/80 border-green-500/30 text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-green-400 mb-2 font-mono">TECH_STACK</label>
            <Textarea
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
              placeholder="Specify technologies (React, Node.js, MongoDB, etc.)"
              className="bg-gray-900/80 border-green-500/30 text-white font-mono"
            />
          </div>

          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 text-white font-mono"
          >
            {isGenerating ? (
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <>
                <Layers className="h-4 w-4 mr-2" />
                GENERATE_SCAFFOLD
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="flex-1">
        <CodeDisplay
          code={scaffoldCode}
          isProcessing={isGenerating}
          error={null}
          selectedLanguage={{ name: 'Project Structure', extension: 'txt', icon: '📁', color: 'text-blue-400' }}
          selectedFeature="scaffold-generator"
        />
      </div>
    </div>
  );
};
