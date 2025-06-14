
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { GraduationCap, BookOpen, Target, ChevronRight } from 'lucide-react';
import { CodeDisplay } from './CodeDisplay';
import { aiService } from '@/services/aiService';
import { toast } from '@/hooks/use-toast';

interface LessonStep {
  title: string;
  content: string;
  code?: string;
  exercise?: string;
}

export const InteractiveTutor = () => {
  const [topic, setTopic] = useState('');
  const [language, setLanguage] = useState('');
  const [skillLevel, setSkillLevel] = useState('');
  const [customTopic, setCustomTopic] = useState('');
  const [currentLesson, setCurrentLesson] = useState<LessonStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLearning, setIsLearning] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');

  const topics = [
    'Variables and Data Types', 'Functions and Methods', 'Loops and Iteration', 'Conditionals', 
    'Arrays and Lists', 'Object-Oriented Programming', 'Recursion', 'Data Structures', 
    'Algorithms', 'Error Handling', 'File I/O', 'Custom Topic'
  ];

  const languages = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'PHP', 'Ruby'
  ];

  const skillLevels = [
    'Absolute Beginner', 'Beginner', 'Intermediate', 'Advanced'
  ];

  const startLesson = async () => {
    const selectedTopic = topic === 'Custom Topic' ? customTopic : topic;
    
    if (!selectedTopic || !language || !skillLevel) {
      toast({
        title: "Missing Information",
        description: "Please select topic, language, and skill level",
        variant: "destructive"
      });
      return;
    }

    setIsLearning(true);
    const prompt = `Create an interactive programming lesson for ${skillLevel} level students.

Topic: ${selectedTopic}
Language: ${language}
Skill Level: ${skillLevel}

Create a step-by-step lesson with:
1. Concept introduction with clear explanation
2. Simple code examples with comments
3. Practical exercises for hands-on learning
4. Progressive difficulty
5. Real-world applications

Format as a structured lesson with multiple steps. Each step should build upon the previous one. Include code examples and small exercises.`;

    try {
      const result = await aiService.processPrompt(prompt, 'coding-tutor', 'OpenAI');
      
      // Parse the lesson into steps (simplified parsing)
      const steps: LessonStep[] = [
        {
          title: `${selectedTopic} - Introduction`,
          content: result,
          code: extractCodeFromText(result)
        }
      ];
      
      setCurrentLesson(steps);
      setCurrentStep(0);
      
      toast({
        title: "Lesson Started",
        description: `Interactive lesson on ${selectedTopic} is ready`,
        className: "bg-gray-900 border-green-500 text-green-400"
      });
    } catch (error) {
      console.error('Lesson generation failed:', error);
      toast({
        title: "Lesson Failed",
        description: "Failed to generate lesson. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLearning(false);
    }
  };

  const extractCodeFromText = (text: string): string => {
    const codeMatch = text.match(/```[\w]*\n([\s\S]*?)\n```/);
    return codeMatch ? codeMatch[1] : '';
  };

  const nextStep = () => {
    if (currentStep < currentLesson.length - 1) {
      setCurrentStep(currentStep + 1);
      setUserAnswer('');
    }
  };

  const generateExercise = async () => {
    if (!topic || !language) return;

    setIsLearning(true);
    const prompt = `Generate a practice exercise for ${topic} in ${language} at ${skillLevel} level.

Provide:
1. Clear problem statement
2. Expected input/output
3. Step-by-step hints
4. Solution with explanation

Make it educational and appropriately challenging.`;

    try {
      const result = await aiService.processPrompt(prompt, 'coding-tutor', 'OpenAI');
      
      const exerciseStep: LessonStep = {
        title: `${topic} - Practice Exercise`,
        content: result,
        code: extractCodeFromText(result),
        exercise: result
      };
      
      setCurrentLesson(prev => [...prev, exerciseStep]);
      setCurrentStep(currentLesson.length);
      
      toast({
        title: "Exercise Generated",
        description: "New practice exercise is ready",
        className: "bg-gray-900 border-green-500 text-green-400"
      });
    } catch (error) {
      console.error('Exercise generation failed:', error);
      toast({
        title: "Exercise Failed",
        description: "Failed to generate exercise. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLearning(false);
    }
  };

  const resetLesson = () => {
    setCurrentLesson([]);
    setCurrentStep(0);
    setUserAnswer('');
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
              <p className="text-sm text-gray-300 font-mono">Learn programming with guided examples</p>
            </div>
          </div>
          <Badge className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-0 font-mono">
            <BookOpen className="h-3 w-3 mr-1" />
            OpenAI GPT-4
          </Badge>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {currentLesson.length === 0 ? (
            <>
              <div>
                <label className="block text-sm font-medium text-green-400 mb-2 font-mono">LEARNING_TOPIC</label>
                <Select value={topic} onValueChange={setTopic}>
                  <SelectTrigger className="bg-gray-900/80 border-green-500/30 text-white font-mono">
                    <SelectValue placeholder="Select topic to learn..." />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-green-500/30">
                    {topics.map(t => (
                      <SelectItem key={t} value={t} className="text-white font-mono">
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {topic === 'Custom Topic' && (
                <div>
                  <label className="block text-sm font-medium text-green-400 mb-2 font-mono">CUSTOM_TOPIC</label>
                  <Input
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    placeholder="Enter your custom topic..."
                    className="bg-gray-900/80 border-green-500/30 text-white font-mono"
                  />
                </div>
              )}

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
                    <SelectValue placeholder="Select your level..." />
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

              <Button
                onClick={startLesson}
                disabled={isLearning}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-mono"
              >
                {isLearning ? (
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <>
                    <GraduationCap className="h-4 w-4 mr-2" />
                    START_LEARNING
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white font-mono">
                  LESSON PROGRESS: {currentStep + 1}/{currentLesson.length}
                </h3>
                <Button
                  onClick={resetLesson}
                  variant="outline"
                  size="sm"
                  className="border-green-500/30 text-green-400 hover:bg-green-500/10 font-mono"
                >
                  RESET
                </Button>
              </div>

              <div className="space-y-4">
                <div className="flex space-x-2">
                  <Button
                    onClick={generateExercise}
                    disabled={isLearning}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-mono"
                  >
                    <Target className="h-4 w-4 mr-2" />
                    PRACTICE_EXERCISE
                  </Button>
                  
                  {currentStep < currentLesson.length - 1 && (
                    <Button
                      onClick={nextStep}
                      className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-mono"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex-1">
        <CodeDisplay
          code={currentLesson[currentStep]?.content || ''}
          isProcessing={isLearning}
          error={null}
          selectedLanguage={{ 
            name: currentLesson[currentStep]?.title || 'Tutorial', 
            extension: 'md', 
            icon: '🎓', 
            color: 'text-emerald-400' 
          }}
          selectedFeature="coding-tutor"
        />
      </div>
    </div>
  );
};
