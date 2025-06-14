
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
      const enhancedPrompt = `You are an intelligent AI assistant created by Subhodeep Pal for his advanced coding learning platform. Your purpose is to help users understand and use this website effectively.

Website Name: AI Coder Nexus (Neural Coding Interface)
Creator: Subhodeep Pal
Goal: Help users learn coding faster using AI tools, voice command coding, and intelligent module-based interfaces.

🧠 ACTIVE FEATURES:

1. **Prompt to Code** (Gemini + Python Core)
   - Converts natural language prompts into working code.
   - Users must specify language and requirement.

2. **Code Explanation** (OpenAI)
   - Explains code line by line for better understanding.

3. **Code Debugger** (Gemini)
   - Finds and explains bugs in code.

4. **Code Refactoring** (Gemini)
   - Cleans and improves user's code.

5. **Language Translator** (Gemini)
   - Converts code comments or instructions into other languages.

6. **Project Scaffold Generator** (Gemini AI)
   - Builds full project structure from project type and features.
   - Accepts description and key features to generate base code.

7. **Voice Command Coding** (OpenAI + Speech API)
   - Converts user voice into code using OpenAI + JavaScript/Python interpreter.
   - Has voice-to-text and code execution feature.

8. **Error Explainer** (OpenAI)
   - Explains programming errors in human-friendly language.

9. **Library Suggester** (Gemini)
   - Suggests libraries based on user's task.

10. **Code Formatter** (Gemini)
    - Auto-formats messy code into standard clean code.

11. **Security Scanner** (Gemini)
    - Checks for potential vulnerabilities in code.

12. **Unit Test Generator** (Gemini)
    - Generates unit tests for user's functions or classes.

13. **Complexity Analyzer** (Gemini)
    - Shows time/space complexity of a code block.

14. **Code Snippet Search** (OpenAI)
    - Finds relevant code snippets for specific tasks.

15. **Multilingual Comments** (OpenAI)
    - Adds comments to code in multiple languages.

16. **AI Pair Programming** (Both Gemini & OpenAI)
    - Works as a live AI programming buddy.

17. **Interactive Coding Tutor** (OpenAI)
    - Teaches users in real-time with Q&A and correction.

📌 SYSTEM BEHAVIOR RULES:

- Always respond only about the features and functionality of Subhodeep Pal's coding website.
- If a user asks a coding-related question, check which module matches best and suggest it.
- If user asks something outside the website's scope, politely respond:
  "I'm your coding assistant for this platform. Please ask anything related to the features you see here."

💬 Example Queries You Should Answer:
- "How can I generate code from voice?"
- "Which module helps in debugging?"
- "What is Project Scaffold Generator?"
- "Can I translate my code comments to Hindi?"

Use a friendly, concise tone that feels futuristic, technical, and accessible to beginners and intermediate developers.

User question: ${message}

Please provide a helpful response about this coding learning platform and its features.`;

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
        setResponse(`I apologize, but I'm currently experiencing high demand. However, I can still help you! Here are some key features of our AI Coder Nexus platform:

🚀 **Available Tools:**
• **Prompt to Code** - Convert natural language to code
• **Code Debugger** - Find and fix bugs in your code
• **Project Scaffold Generator** - Generate full project structures
• **Voice Command Coding** - Code using voice commands
• **Code Refactoring** - Clean and optimize your existing code

📝 **How to get started:**
1. Click "LAUNCH INTERFACE" to access the main coding tools
2. Choose the feature that matches your needs
3. Follow the prompts for each specific tool

💡 **Popular features:**
- Use "Prompt to Code" for generating code from descriptions
- Try "Code Explanation" to understand complex code
- Use "Voice Assistant" for hands-free coding

Feel free to ask about any specific feature you'd like to explore!`);
        
        toast({
          title: "Service Temporarily Limited",
          description: "Using fallback responses. Full service will resume shortly.",
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
      {/* Floating Chatbot Icon */}
      <div className="fixed bottom-6 right-6 z-[9999]">
        <button onClick={() => setIsOpen(!isOpen)} className={`group relative transition-all duration-300 hover:scale-110 active:scale-95 ${animateBot ? 'animate-bounce-soft' : ''}`} aria-label="Open AI Chatbot">
          <div className="relative">
            <ChatbotIcon size={104} className="drop-shadow-lg group-hover:drop-shadow-xl transition-all duration-300" isWaving={animateBot} />
            {/* Pulse animation - disabled during initial animation */}
            <div className={`absolute inset-0 rounded-full bg-blue-400 opacity-20 ${animateBot ? '' : 'animate-ping'}`}></div>
          </div>
        </button>
      </div>

      {/* Chat Window */}
      {isOpen && <div className="fixed bottom-24 right-6 z-[9999] w-80 max-w-[calc(100vw-2rem)] animate-scale-in">
          <Card className="bg-white border-2 border-blue-200 shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg p-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <ChatbotIcon size={24} isWaving={false} />
                  AI Coder Nexus Assistant
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="text-white hover:bg-blue-400 h-6 w-6 p-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="p-4 max-h-96 overflow-y-auto">
              <div className="space-y-4">
                {/* Welcome Message */}
                {!response && !message && <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-800">🚀 Welcome to AI Coder Nexus! I'm your intelligent coding assistant.</p>
                    <ul className="text-xs text-blue-700 mt-2 space-y-1">
                      <li>• Voice Command Coding</li>
                      <li>• Code Explanation & Debugging</li>
                      <li>• Project Scaffold Generation</li>
                      <li>• AI Pair Programming</li>
                      <li>• And 13+ more coding features!</li>
                    </ul>
                    <p className="text-xs text-blue-600 mt-2">Ask me about any feature you'd like to explore! 🤖</p>
                  </div>}

                {/* User Message */}
                {message && <div className="flex justify-end">
                    <div className="bg-blue-500 text-white p-2 rounded-lg max-w-[80%] text-sm">
                      {message}
                    </div>
                  </div>}

                {/* AI Response */}
                {response && <div className="flex justify-start">
                    <div className="bg-gray-100 p-2 rounded-lg max-w-[80%] text-sm">
                      <div className="whitespace-pre-wrap">{response}</div>
                    </div>
                  </div>}

                {/* Processing Indicator */}
                {isProcessing && <div className="flex justify-start">
                    <div className="bg-gray-100 p-2 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                        Processing...
                      </div>
                    </div>
                  </div>}
              </div>
            </CardContent>

            {/* Input Area */}
            <div className="p-3 border-t border-gray-200">
              <div className="flex gap-2">
                <Textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Ask about coding features, voice commands, or any platform tool..." className="flex-1 min-h-[40px] resize-none text-sm" onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }} />
                <div className="flex flex-col gap-1">
                  <Button onClick={handleSendMessage} disabled={isProcessing || !message.trim()} size="sm" className="bg-blue-500 hover:bg-blue-600 text-white px-3">
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
