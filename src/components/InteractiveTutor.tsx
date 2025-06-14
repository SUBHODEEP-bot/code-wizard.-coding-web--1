
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, BookOpen, Lightbulb, ArrowRight } from 'lucide-react';
import { CodeDisplay } from './CodeDisplay';
import { aiService } from '@/services/aiService';
import { toast } from '@/hooks/use-toast';

export const InteractiveTutor = () => {
  const [topic, setTopic] = useState('');
  const [language, setLanguage] = useState('');
  const [skillLevel, setSkillLevel] = useState('');
  const [specificQuestion, setSpecificQuestion] = useState('');
  const [tutorialContent, setTutorialContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const languages = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'PHP', 'Ruby'
  ];

  const skillLevels = [
    'Beginner', 'Intermediate', 'Advanced', 'Expert'
  ];

  const topics = [
    'Variables and Data Types', 'Functions and Methods', 'Object-Oriented Programming', 
    'Data Structures', 'Algorithms', 'Design Patterns', 'Web Development',
    'Database Integration', 'API Development', 'Testing', 'Performance Optimization',
    'Security Best Practices', 'Async Programming', 'Error Handling'
  ];

  const handleGenerateTutorial = async () => {
    if (!topic.trim() || !language || !skillLevel) {
      toast({
        title: "Missing Information",
        description: "Please select topic, language, and skill level",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    const prompt = `Create an interactive coding tutorial for:

Topic: ${topic}
Programming Language: ${language}
Skill Level: ${skillLevel}
${specificQuestion ? `Specific Question: ${specificQuestion}` : ''}

Please create a comprehensive tutorial that includes:

1. **Introduction and Learning Objectives**
   - Clear explanation of what the student will learn
   - Prerequisites and background knowledge needed

2. **Concept Explanation**
   - Break down the topic into digestible parts
   - Use analogies and real-world examples
   - Explain the "why" behind concepts

3. **Code Examples**
   - Start with simple examples
   - Progress to more complex scenarios
   - Include well-commented code in ${language}
   - Show common patterns and best practices

4. **Hands-on Exercises**
   - Interactive coding challenges
   - Step-by-step problems to solve
   - Gradual difficulty progression

5. **Common Mistakes and Debugging**
   - Typical errors beginners make
   - How to identify and fix problems
   - Best practices to avoid issues

6. **Real-world Applications**
   - Where and when to use these concepts
   - Industry examples and use cases
   - Next steps for further learning

7. **Practice Problems**
   - Coding challenges to reinforce learning
   - Solutions with explanations

Adapt the complexity and depth to the ${skillLevel} level. Make it engaging, interactive, and educational.`;

    try {
      const result = await aiService.processPrompt(prompt, 'coding-tutor', 'Gemini');
      setTutorialContent(result);
      toast({
        title: "Tutorial Generated",
        description: `${skillLevel} level tutorial for ${topic} created`,
        className: "bg-gray-900 border-green-500 text-green-400"
      });
    } catch (error) {
      console.error('Tutorial generation failed:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate tutorial content",
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
            <div className="p-2 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-mono">INTERACTIVE_TUTOR</h2>
              <p className="text-sm text-gray-300 font-mono">Personalized coding education</p>
            </div>
          </div>
          <Badge className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-0 font-mono">
            <BookOpen className="h-3 w-3 mr-1" />
            Gemini Educational AI
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
            <label className="block text-sm font-medium text-green-400 mb-2 font-mono">SKILL_LEVEL</label>
            <Select value={skillLevel} onValueChange={setSkillLevel}>
              <SelectTrigger className="bg-gray-900/80 border-green-500/30 text-white font-mono">
                <SelectValue placeholder="Select your skill level..." />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-green-500/30">
                {skillLevels.map(level => (
                  <SelectItem key={level} value={level} className="text-white font-mono">
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-green-400 mb-2 font-mono">LEARNING_TOPIC</label>
            <Select value={topic} onValueChange={setTopic}>
              <SelectTrigger className="bg-gray-900/80 border-green-500/30 text-white font-mono">
                <SelectValue placeholder="Select topic to learn..." />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-green-500/30">
                {topics.map(topicItem => (
                  <SelectItem key={topicItem} value={topicItem} className="text-white font-mono">
                    {topicItem}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-green-400 mb-2 font-mono">SPECIFIC_QUESTION</label>
            <Textarea
              value={specificQuestion}
              onChange={(e) => setSpecificQuestion(e.target.value)}
              placeholder="Any specific questions or areas you want to focus on? (optional)"
              className="bg-gray-900/80 border-green-500/30 text-white font-mono min-h-[80px]"
            />
          </div>

          <Button
            onClick={handleGenerateTutorial}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-mono"
          >
            {isGenerating ? (
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <>
                <Lightbulb className="h-4 w-4 mr-2" />
                GENERATE_TUTORIAL
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="flex-1">
        <CodeDisplay
          code={tutorialContent}
          isProcessing={isGenerating}
          error={null}
          selectedLanguage={{ name: 'Interactive Tutorial', extension: 'md', icon: '🎓', color: 'text-emerald-400' }}
          selectedFeature="coding-tutor"
        />
      </div>
    </div>
  );
};
