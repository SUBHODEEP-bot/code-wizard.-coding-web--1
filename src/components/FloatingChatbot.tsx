
import React, { useState, useEffect } from 'react';
import { ChatbotIcon } from './ChatbotIcon';
import { X, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { aiService } from '@/services/aiService';

export const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [animateBot, setAnimateBot] = useState(false);

  useEffect(() => {
    const animationPlayedSessionKey = 'chatbotHomeAnimationPlayed_v1';
    const hasAnimationPlayed = sessionStorage.getItem(animationPlayedSessionKey);
    if (!hasAnimationPlayed) {
      setAnimateBot(true);
      sessionStorage.setItem(animationPlayedSessionKey, 'true');
      const timer = setTimeout(() => {
        setAnimateBot(false);
      }, 20000); // 20 seconds

      return () => clearTimeout(timer);
    }
  }, []);

  const handleSendMessage = async () => {
    if (!message.trim()) {
      toast({
        title: "Empty Message",
        description: "Please enter a message to send",
        variant: "destructive"
      });
      return;
    }
    setIsProcessing(true);
    setResponse(''); // Clear previous response
    try {
      const enhancedPrompt = `You are an intelligent AI assistant created by Subhodeep Pal for his advanced AI-powered coding learning platform called "AI Coder Nexus" (Neural Coding Interface).

🧑‍💻 **CREATOR INFORMATION:**
- **Website Creator:** Subhodeep Pal (Full Stack Developer & AI Enthusiast)
- **Platform Name:** AI Coder Nexus (Neural Coding Interface)
- **Mission:** Revolutionize coding education through AI-powered tools and intelligent interfaces
- **Vision:** Make coding accessible, faster, and more intuitive for developers worldwide

🚀 **PLATFORM OVERVIEW:**
AI Coder Nexus is a comprehensive, next-generation coding learning platform that combines artificial intelligence with modern web technologies to create an unparalleled coding experience. The platform features a sleek, dark-themed interface with neural network-inspired design elements and advanced AI capabilities.

🔧 **TECHNICAL ARCHITECTURE:**
- **Frontend:** React 18 with TypeScript for type safety
- **Styling:** Tailwind CSS with custom animations and gradients
- **UI Components:** Shadcn/ui component library for consistent design
- **AI Integration:** Dual AI system (OpenAI GPT-4.1 + Google Gemini)
- **Icons:** Lucide React for modern, scalable icons
- **Routing:** React Router for seamless navigation
- **State Management:** TanStack Query for server state
- **Build Tool:** Vite for fast development and optimized builds

🧠 **17 ACTIVE AI-POWERED FEATURES:**

**1. Prompt to Code** (Gemini + Python Core)
   - Converts natural language descriptions into functional code
   - Supports multiple programming languages
   - Users specify language and requirements for precise output

**2. Code Explanation** (OpenAI GPT-4.1)
   - Provides line-by-line code analysis and explanations
   - Breaks down complex algorithms and logic
   - Educational approach for better understanding

**3. Code Debugger** (Gemini AI)
   - Identifies bugs and errors in code
   - Explains why errors occur and how to fix them
   - Provides debugging strategies and best practices

**4. Code Refactoring** (Gemini AI)
   - Cleans and optimizes existing code
   - Improves code structure and readability
   - Maintains functionality while enhancing performance

**5. Language Translator** (Gemini AI)
   - Converts code between different programming languages
   - Translates comments and documentation
   - Maintains code logic across language boundaries

**6. Project Scaffold Generator** (Gemini AI)
   - Creates complete project structures from descriptions
   - Generates boilerplate code and configuration files
   - Supports various frameworks and project types

**7. Voice Command Coding** (OpenAI + Speech API)
   - Converts voice commands into executable code
   - Features voice-to-text transcription
   - Includes code execution and testing capabilities

**8. Error Explainer** (OpenAI GPT-4.1)
   - Translates technical error messages into human-friendly language
   - Provides context and solutions for common errors
   - Educational approach to error resolution

**9. Library Suggester** (Gemini AI)
   - Recommends appropriate libraries and frameworks
   - Based on project requirements and use cases
   - Includes installation and usage instructions

**10. Code Formatter** (Gemini AI)
    - Automatically formats messy or inconsistent code
    - Applies standard coding conventions
    - Supports multiple programming languages

**11. Security Scanner** (Gemini AI)
    - Identifies potential security vulnerabilities
    - Provides security best practices and recommendations
    - Helps prevent common security pitfalls

**12. Unit Test Generator** (Gemini AI)
    - Creates comprehensive unit tests for functions and classes
    - Supports multiple testing frameworks
    - Ensures code reliability and maintainability

**13. Complexity Analyzer** (Gemini AI)
    - Analyzes time and space complexity of algorithms
    - Provides Big O notation explanations
    - Suggests optimization strategies

**14. Code Snippet Search** (OpenAI GPT-4.1)
    - Finds relevant code examples for specific tasks
    - Provides multiple implementation approaches
    - Includes explanations and use cases

**15. Multilingual Comments** (OpenAI GPT-4.1)
    - Adds code comments in multiple languages
    - Supports international development teams
    - Maintains code documentation standards

**16. AI Pair Programming** (Dual AI: Gemini & OpenAI)
    - Acts as an intelligent coding partner
    - Provides real-time suggestions and feedback
    - Collaborative problem-solving approach

**17. Interactive Coding Tutor** (OpenAI GPT-4.1)
    - Provides personalized coding education
    - Real-time Q&A and correction system
    - Adaptive learning based on user progress

🎨 **USER INTERFACE FEATURES:**
- **Dark Theme:** Professional, eye-friendly dark interface
- **Neural Network Graphics:** AI-inspired visual elements
- **Responsive Design:** Works seamlessly on all devices
- **Smooth Animations:** Enhanced user experience with CSS transitions
- **Intuitive Navigation:** Easy access to all features
- **Real-time Feedback:** Instant responses and processing indicators

🔒 **SECURITY & RELIABILITY:**
- Secure API key management
- Error handling and fallback systems
- Rate limiting and quota management
- Data privacy and protection measures

📊 **PERFORMANCE OPTIMIZATIONS:**
- Lazy loading for improved performance
- Code splitting for faster load times
- Optimized AI model selection
- Caching strategies for better response times

🎯 **TARGET AUDIENCE:**
- Beginner programmers learning to code
- Intermediate developers improving skills
- Professional developers seeking AI assistance
- Students and educators in computer science
- Anyone interested in AI-powered development tools

💡 **UNIQUE SELLING POINTS:**
- Dual AI system for comprehensive coverage
- Voice-controlled coding capabilities
- 17 specialized coding tools in one platform
- Created by experienced developer Subhodeep Pal
- Cutting-edge technology stack
- Educational focus with practical applications

📌 **SYSTEM BEHAVIOR RULES:**
- Always respond about the platform's features and functionality
- If asked about the creator, mention Subhodeep Pal
- For coding questions, suggest the most relevant AI tool
- Maintain a friendly, technical, and educational tone
- Guide users to appropriate features based on their needs

💬 **COMMON USER QUERIES TO HANDLE:**
- "Who made this website?" → Subhodeep Pal
- "How do I generate code from voice?" → Voice Command Coding feature
- "Which tool helps with debugging?" → Code Debugger
- "Can I translate code comments?" → Multilingual Comments
- "How do I get started?" → Guide to Launch Interface

🚀 **GETTING STARTED GUIDE:**
1. Click "LAUNCH INTERFACE" to access main features
2. Choose from 17 AI-powered coding tools
3. Enter your code or requirements
4. Select preferred AI provider (OpenAI/Gemini)
5. Get instant, intelligent assistance

User question: ${message}

Please provide a helpful, informative response about AI Coder Nexus, its features, creator Subhodeep Pal, or guide the user to the appropriate tool. Keep responses concise but comprehensive.`;

      // Try Gemini first as fallback for quota issues
      let result;
      try {
        result = await aiService.processPrompt(enhancedPrompt, 'pair-programming', 'Gemini');
      } catch (geminiError) {
        console.log('Gemini failed, trying OpenAI as backup:', geminiError);
        // If Gemini fails, try OpenAI
        result = await aiService.processPrompt(enhancedPrompt, 'pair-programming', 'OpenAI');
      }
      
      setResponse(result);
      toast({
        title: "Response Generated",
        description: "AI assistant has responded to your query",
        className: "bg-gray-900 border-blue-500 text-blue-400"
      });
    } catch (error) {
      console.error('Chatbot error:', error);
      
      // Handle specific API quota errors
      if (error instanceof Error && error.message.includes('quota')) {
        setResponse(`I apologize, but I'm currently experiencing high demand. However, I can still help you! Here's what you need to know about **AI Coder Nexus**:

🧑‍💻 **Created by:** Subhodeep Pal (Full Stack Developer & AI Enthusiast)

🚀 **Available AI-Powered Tools:**
• **Prompt to Code** - Convert natural language to functional code
• **Code Debugger** - Find and fix bugs with AI assistance
• **Project Scaffold Generator** - Generate complete project structures
• **Voice Command Coding** - Code using voice commands with speech API
• **Code Refactoring** - Clean and optimize your existing code
• **AI Pair Programming** - Get real-time coding assistance
• **Interactive Coding Tutor** - Learn with personalized AI guidance

🎯 **Platform Highlights:**
- **17 specialized AI coding tools** in one platform
- **Dual AI system** (OpenAI GPT-4.1 + Google Gemini)
- **Voice-controlled coding** capabilities
- **Neural network-inspired** dark theme interface
- **Educational focus** with practical applications

📝 **How to get started:**
1. Click "LAUNCH INTERFACE" to access the main coding tools
2. Choose from 17 AI-powered features based on your needs
3. Follow the prompts for each specific tool
4. Get instant, intelligent coding assistance

💡 **Popular features to try:**
- Use "Prompt to Code" for generating code from descriptions
- Try "Code Explanation" to understand complex algorithms
- Use "Voice Assistant" for hands-free coding experience
- Explore "Project Scaffold" for quick project setup

Feel free to ask about any specific feature or how Subhodeep Pal designed this platform!`);
        
        toast({
          title: "Service Temporarily Limited",
          description: "Using enhanced fallback responses. Full service will resume shortly.",
          className: "bg-yellow-600 border-yellow-500 text-white"
        });
      } else {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        toast({
          title: "Error",
          description: `Failed to get response: ${errorMessage}`,
          variant: "destructive"
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClearChat = () => {
    setMessage('');
    setResponse('');
  };

  return <>
      {/* Floating Chatbot Icon - Increased size by 15% */}
      <div className="fixed bottom-6 right-6 z-[9999]">
        <button onClick={() => setIsOpen(!isOpen)} className={`group relative transition-all duration-300 hover:scale-110 active:scale-95 ${animateBot ? 'animate-bounce-soft' : ''}`} aria-label="Open AI Chatbot">
          <div className="relative">
            <ChatbotIcon size={120} className="drop-shadow-lg group-hover:drop-shadow-xl transition-all duration-300" isWaving={animateBot} />
            {/* Pulse animation - disabled during initial animation */}
            <div className={`absolute inset-0 rounded-full bg-blue-400 opacity-20 ${animateBot ? '' : 'animate-ping'}`}></div>
          </div>
        </button>
      </div>

      {/* Chat Window - Increased size by 15% */}
      {isOpen && <div className="fixed bottom-28 right-6 z-[9999] w-92 max-w-[calc(100vw-2rem)] animate-scale-in">
          <Card className="bg-white border-2 border-blue-200 shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg p-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <ChatbotIcon size={28} isWaving={false} />
                  AI Coder Nexus Assistant
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="text-white hover:bg-blue-400 h-6 w-6 p-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="p-5 max-h-[450px] overflow-y-auto">
              <div className="space-y-4">
                {/* Enhanced Welcome Message */}
                {!response && !message && <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border-l-4 border-blue-500">
                    <p className="text-sm text-blue-800 font-semibold">🚀 Welcome to AI Coder Nexus!</p>
                    <p className="text-xs text-blue-700 mt-1">Created by <strong>Subhodeep Pal</strong> - Your intelligent coding assistant</p>
                    <ul className="text-xs text-blue-700 mt-3 space-y-1">
                      <li>• <strong>17 AI-Powered Tools</strong> for coding excellence</li>
                      <li>• <strong>Voice Command Coding</strong> with speech recognition</li>
                      <li>• <strong>Dual AI System</strong> (OpenAI + Gemini)</li>
                      <li>• <strong>Project Scaffold Generation</strong></li>
                      <li>• <strong>Real-time Code Analysis</strong> & debugging</li>
                      <li>• <strong>AI Pair Programming</strong> assistant</li>
                    </ul>
                    <p className="text-xs text-blue-600 mt-3 font-medium">Ask me anything about the platform, features, or coding help! 🤖</p>
                  </div>}

                {/* User Message */}
                {message && <div className="flex justify-end">
                    <div className="bg-blue-500 text-white p-3 rounded-lg max-w-[80%] text-sm">
                      {message}
                    </div>
                  </div>}

                {/* AI Response */}
                {response && <div className="flex justify-start">
                    <div className="bg-gray-100 p-3 rounded-lg max-w-[80%] text-sm">
                      <div className="whitespace-pre-wrap">{response}</div>
                    </div>
                  </div>}

                {/* Processing Indicator */}
                {isProcessing && <div className="flex justify-start">
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                        Processing with AI...
                      </div>
                    </div>
                  </div>}
              </div>
            </CardContent>

            {/* Input Area - Slightly larger */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <Textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Ask about AI Coder Nexus features, Subhodeep Pal, coding help, or any platform tool..." className="flex-1 min-h-[45px] resize-none text-sm" onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }} />
                <div className="flex flex-col gap-1">
                  <Button onClick={handleSendMessage} disabled={isProcessing || !message.trim()} size="sm" className="bg-blue-500 hover:bg-blue-600 text-white px-3 h-11">
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                  {response && <Button onClick={handleClearChat} variant="outline" size="sm" className="px-2 text-xs">
                      Clear
                    </Button>}
                </div>
              </div>
            </div>
          </Card>
        </div>}
    </>;
};
