
import { 
  Code, 
  Search, 
  Bug, 
  RefreshCw, 
  Languages, 
  FileSearch,
  Layers,
  AlertCircle,
  Lightbulb,
  Palette,
  Shield,
  GraduationCap,
  TestTube,
  BarChart3,
  FileText,
  Mic,
  FileCode,
  MessageSquare,
  Zap,
  Users
} from 'lucide-react';

export interface Feature {
  id: string;
  name: string;
  description: string;
  icon: any;
  category: 'core' | 'advanced' | 'interactive';
  apiProvider: 'Gemini' | 'OpenAI' | 'DeepSeek' | 'Auto' | 'Both';
  examplePrompt: string;
  tips?: string;
}

export const features: Feature[] = [
  // Core Features
  {
    id: 'prompt-to-code',
    name: 'Prompt to Code',
    description: 'Generate code from natural language descriptions',
    icon: Code,
    category: 'core',
    apiProvider: 'DeepSeek',
    examplePrompt: 'Write a Python function to check if a number is prime.',
    tips: 'Be specific about the programming language and requirements'
  },
  {
    id: 'code-explanation',
    name: 'Code Explanation',
    description: 'Get detailed explanations of how code works',
    icon: FileText,
    category: 'core',
    apiProvider: 'OpenAI',
    examplePrompt: 'Explain how this JavaScript function calculates the Fibonacci sequence.',
    tips: 'Paste your code and ask for specific aspects you want explained'
  },
  {
    id: 'debugger',
    name: 'Code Debugger',
    description: 'Find and fix bugs in your code',
    icon: Bug,
    category: 'core',
    apiProvider: 'DeepSeek',
    examplePrompt: 'Find bugs in this C++ code and suggest corrections.',
    tips: 'Include error messages and expected vs actual behavior'
  },
  {
    id: 'refactoring',
    name: 'Code Refactoring',
    description: 'Improve code structure and performance',
    icon: RefreshCw,
    category: 'core',
    apiProvider: 'DeepSeek',
    examplePrompt: 'Refactor this bubble sort algorithm for better performance and readability.',
    tips: 'Specify what aspects you want to improve (performance, readability, maintainability)'
  },
  {
    id: 'translator',
    name: 'Language Translator',
    description: 'Convert code between programming languages',
    icon: Languages,
    category: 'core',
    apiProvider: 'DeepSeek',
    examplePrompt: 'Translate this Java code to equivalent Python code.',
    tips: 'Mention any specific libraries or patterns to use in the target language'
  },
  {
    id: 'snippet-search',
    name: 'Code Snippet Search',
    description: 'Find relevant code examples and snippets',
    icon: FileSearch,
    category: 'core',
    apiProvider: 'OpenAI',
    examplePrompt: 'Show me examples of REST API calls in Node.js.',
    tips: 'Be specific about the framework and use case'
  },

  // Advanced Features
  {
    id: 'scaffold-generator',
    name: 'Project Scaffold',
    description: 'Generate complete project structures',
    icon: Layers,
    category: 'advanced',
    apiProvider: 'DeepSeek',
    examplePrompt: 'Generate a basic React app with a user login system and routing.',
    tips: 'Specify the tech stack and key features you need'
  },
  {
    id: 'error-explainer',
    name: 'Error Explainer',
    description: 'Understand and resolve error messages',
    icon: AlertCircle,
    category: 'advanced',
    apiProvider: 'OpenAI',
    examplePrompt: 'Explain this Python error: IndexError: list index out of range.',
    tips: 'Include the full error stack trace for better analysis'
  },
  {
    id: 'library-suggester',
    name: 'Library Suggester',
    description: 'Get recommendations for libraries and frameworks',
    icon: Lightbulb,
    category: 'advanced',
    apiProvider: 'Gemini',
    examplePrompt: 'Which JavaScript libraries are best for data visualization?',
    tips: 'Mention your specific requirements and constraints'
  },
  {
    id: 'style-formatter',
    name: 'Code Formatter',
    description: 'Format code according to style guides',
    icon: Palette,
    category: 'advanced',
    apiProvider: 'DeepSeek',
    examplePrompt: 'Format this JavaScript code to follow the Airbnb style guide.',
    tips: 'Specify which style guide or formatting rules to follow'
  },
  {
    id: 'security-scanner',
    name: 'Security Scanner',
    description: 'Detect security vulnerabilities in code',
    icon: Shield,
    category: 'advanced',
    apiProvider: 'Gemini',
    examplePrompt: 'Check this PHP code for possible SQL injection vulnerabilities.',
    tips: 'Include context about how the code is used in your application'
  },
  {
    id: 'test-generator',
    name: 'Unit Test Generator',
    description: 'Generate comprehensive unit tests',
    icon: TestTube,
    category: 'advanced',
    apiProvider: 'DeepSeek',
    examplePrompt: 'Generate unit tests for this Python function using unittest.',
    tips: 'Specify the testing framework and coverage requirements'
  },
  {
    id: 'complexity-analyzer',
    name: 'Complexity Analyzer',
    description: 'Analyze algorithm complexity and performance',
    icon: BarChart3,
    category: 'advanced',
    apiProvider: 'Gemini',
    examplePrompt: 'What is the time complexity of merge sort?',
    tips: 'Ask about both time and space complexity for complete analysis'
  },
  {
    id: 'code-reviewer',
    name: 'Code Review Assistant',
    description: 'Get detailed code reviews and suggestions',
    icon: Search,
    category: 'advanced',
    apiProvider: 'OpenAI',
    examplePrompt: 'Review this pull request and suggest improvements for code quality.',
    tips: 'Provide context about the project and what the code is supposed to do'
  },

  // Interactive Features
  {
    id: 'voice-assistant',
    name: 'Voice Command Coding',
    description: 'Code using voice commands',
    icon: Mic,
    category: 'interactive',
    apiProvider: 'OpenAI',
    examplePrompt: 'Create a Python script to download images from URLs.',
    tips: 'Speak clearly and use specific technical terms'
  },
  {
    id: 'code-summarizer',
    name: 'Code Summarizer',
    description: 'Get concise summaries of code functionality',
    icon: FileCode,
    category: 'interactive',
    apiProvider: 'OpenAI',
    examplePrompt: 'Summarize what this block of C# code does in 3 sentences.',
    tips: 'Specify the level of detail you want in the summary'
  },
  {
    id: 'multilingual-comments',
    name: 'Multilingual Comments',
    description: 'Add comments in different languages',
    icon: MessageSquare,
    category: 'interactive',
    apiProvider: 'OpenAI',
    examplePrompt: 'Add detailed comments to this Java code in Bengali.',
    tips: 'Specify the target language and comment style preferences'
  },
  {
    id: 'complexity-optimizer',
    name: 'Complexity Optimizer',
    description: 'Optimize code for better performance',
    icon: Zap,
    category: 'interactive',
    apiProvider: 'DeepSeek',
    examplePrompt: 'Optimize this nested loop to reduce time complexity.',
    tips: 'Mention specific performance bottlenecks you want to address'
  },
  {
    id: 'pair-programming',
    name: 'AI Pair Programming',
    description: 'Interactive coding sessions with AI assistance',
    icon: Users,
    category: 'interactive',
    apiProvider: 'Both',
    examplePrompt: 'Help me implement a binary search tree with insert and delete functions.',
    tips: 'Ask questions as you code and request step-by-step guidance'
  },
  {
    id: 'coding-tutor',
    name: 'Interactive Tutor',
    description: 'Learn programming concepts with guided examples',
    icon: GraduationCap,
    category: 'interactive',
    apiProvider: 'OpenAI',
    examplePrompt: 'Teach me recursion with simple examples and exercises.',
    tips: 'Specify your current skill level and learning goals'
  }
];
