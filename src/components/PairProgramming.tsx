
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Users, MessageCircle, Code2 } from 'lucide-react';
import { CodeDisplay } from './CodeDisplay';
import { aiService } from '@/services/aiService';
import { toast } from '@/hooks/use-toast';

interface ConversationMessage {
  role: 'user' | 'ai';
  message: string;
  code?: string;
}

export const PairProgramming = () => {
  const [language, setLanguage] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [currentMessage, setCurrentMessage] = useState('');
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [currentCode, setCurrentCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const languages = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'PHP', 'Ruby'
  ];

  const startSession = () => {
    if (!language || !projectDescription.trim()) {
      toast({
        title: "Missing Information",
        description: "Please select language and describe your project",
        variant: "destructive"
      });
      return;
    }

    const welcomeMessage: ConversationMessage = {
      role: 'ai',
      message: `Hi! I'm your AI pair programming partner. Let's work together on your ${language} project: "${projectDescription}". What would you like to start with? I can help you with:\n\n• Planning the architecture\n• Writing functions step by step\n• Debugging issues\n• Code review and optimization\n• Best practices guidance\n\nWhat's our first task?`
    };

    setConversation([welcomeMessage]);
  };

  const sendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage: ConversationMessage = {
      role: 'user',
      message: currentMessage
    };

    setConversation(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsProcessing(true);

    const conversationHistory = conversation.map(msg => 
      `${msg.role.toUpperCase()}: ${msg.message}`
    ).join('\n\n');

    const prompt = `You are an AI pair programming partner working on a ${language} project: "${projectDescription}".

Previous conversation:
${conversationHistory}

Current user message: ${currentMessage}

Current code state:
${currentCode || 'No code written yet'}

Please respond as a helpful pair programming partner. If the user asks for code, provide it. If they want to discuss approach, be conversational. Always be encouraging and collaborative.

If providing code, format it properly and explain your choices. If the user wants to modify existing code, show the changes clearly.`;

    try {
      const result = await aiService.processPrompt(prompt, 'pair-programming', 'DeepSeek');
      
      // Extract code if present (look for code blocks)
      const codeMatch = result.match(/```[\w]*\n([\s\S]*?)\n```/);
      const newCode = codeMatch ? codeMatch[1] : '';
      
      if (newCode) {
        setCurrentCode(newCode);
      }

      const aiMessage: ConversationMessage = {
        role: 'ai',
        message: result,
        code: newCode || undefined
      };

      setConversation(prev => [...prev, aiMessage]);
      
      toast({
        title: "AI Partner Response",
        description: "Your pair programming partner has responded",
        className: "bg-gray-900 border-green-500 text-green-400"
      });
    } catch (error) {
      console.error('Pair programming failed:', error);
      toast({
        title: "Communication Failed",
        description: "Failed to communicate with AI partner. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const clearSession = () => {
    setConversation([]);
    setCurrentCode('');
    setCurrentMessage('');
  };

  return (
    <div className="flex h-full">
      <div className="w-1/2 border-r border-green-500/30 flex flex-col bg-gray-950/50">
        <div className="p-6 border-b border-green-500/20 bg-gradient-to-r from-gray-900 to-gray-800">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-lg">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-mono">AI_PAIR_PROGRAMMING</h2>
              <p className="text-sm text-gray-300 font-mono">Interactive coding sessions with AI</p>
            </div>
          </div>
          <Badge className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white border-0 font-mono">
            <MessageCircle className="h-3 w-3 mr-1" />
            DeepSeek AI
          </Badge>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {conversation.length === 0 ? (
            <>
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
                <label className="block text-sm font-medium text-green-400 mb-2 font-mono">PROJECT_DESCRIPTION</label>
                <Textarea
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  placeholder="Describe what you want to build..."
                  className="bg-gray-900/80 border-green-500/30 text-white font-mono min-h-[100px]"
                />
              </div>

              <Button
                onClick={startSession}
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono"
              >
                <Users className="h-4 w-4 mr-2" />
                START_PAIR_SESSION
              </Button>
            </>
          ) : (
            <>
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {conversation.map((msg, index) => (
                  <div key={index} className={`p-3 rounded-lg ${
                    msg.role === 'user' 
                      ? 'bg-blue-900/30 border border-blue-500/30 ml-4' 
                      : 'bg-green-900/30 border border-green-500/30 mr-4'
                  }`}>
                    <div className="text-xs font-mono mb-1 text-gray-400">
                      {msg.role === 'user' ? 'YOU' : 'AI_PARTNER'}
                    </div>
                    <div className="text-sm text-white font-mono whitespace-pre-wrap">
                      {msg.message}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <Input
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  placeholder="Type your message to AI partner..."
                  className="bg-gray-900/80 border-green-500/30 text-white font-mono"
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                
                <div className="flex space-x-2">
                  <Button
                    onClick={sendMessage}
                    disabled={isProcessing || !currentMessage.trim()}
                    className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono"
                  >
                    {isProcessing ? (
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      <>
                        <MessageCircle className="h-4 w-4 mr-2" />
                        SEND
                      </>
                    )}
                  </Button>
                  
                  <Button
                    onClick={clearSession}
                    variant="outline"
                    className="border-green-500/30 text-green-400 hover:bg-green-500/10 font-mono"
                  >
                    RESET
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex-1">
        <CodeDisplay
          code={currentCode}
          isProcessing={isProcessing}
          error={null}
          selectedLanguage={{ name: language || 'Code', extension: language?.toLowerCase() || 'txt', icon: '👥', color: 'text-cyan-400' }}
          selectedFeature="pair-programming"
        />
      </div>
    </div>
  );
};
