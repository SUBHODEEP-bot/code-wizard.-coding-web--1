
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Users, MessageCircle, Code2, Send } from 'lucide-react';
import { CodeDisplay } from './CodeDisplay';
import { aiService } from '@/services/aiService';
import { toast } from '@/hooks/use-toast';
import { useSoundEffects } from '@/hooks/useSoundEffects';

export const PairProgramming = () => {
  const [currentCode, setCurrentCode] = useState('');
  const [language, setLanguage] = useState('');
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<Array<{role: string, content: string, timestamp: string}>>([]);
  const [aiResponse, setAiResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const { playMechanicalSound } = useSoundEffects();

  const languages = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'PHP', 'Ruby'
  ];

  const handleSendMessage = async () => {
    if (!message.trim()) {
      toast({
        title: "Empty Message",
        description: "Please enter a message or question",
        variant: "destructive"
      });
      return;
    }

    playMechanicalSound();
    
    const newMessage = {
      role: 'user',
      content: message,
      timestamp: new Date().toLocaleTimeString()
    };
    
    setConversation(prev => [...prev, newMessage]);
    setIsProcessing(true);

    const prompt = `You are an AI pair programming partner. We're working on ${language} code together.

Current code we're working on:
${currentCode}

Previous conversation:
${conversation.slice(-5).map(msg => `${msg.role}: ${msg.content}`).join('\n')}

User message: ${message}

Please respond as a helpful programming partner who:
1. Provides constructive feedback and suggestions
2. Helps debug and improve the code
3. Suggests best practices and optimizations
4. Asks clarifying questions when needed
5. Offers alternative approaches
6. Provides explanations for complex concepts

Respond in a conversational, collaborative tone.`;

    try {
      const result = await aiService.processPrompt(prompt, 'pair-programming', 'OpenAI');
      
      const aiMessage = {
        role: 'ai',
        content: result,
        timestamp: new Date().toLocaleTimeString()
      };
      
      setConversation(prev => [...prev, aiMessage]);
      setAiResponse(result);
      setMessage('');
      
      toast({
        title: "AI Partner Response",
        description: "Your programming partner has responded",
        className: "bg-gray-900 border-green-500 text-green-400"
      });
    } catch (error) {
      console.error('Pair programming failed:', error);
      toast({
        title: "Communication Failed",
        description: "Failed to get response from AI partner",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const clearConversation = () => {
    playMechanicalSound();
    setConversation([]);
    setAiResponse('');
  };

  return (
    <div className="flex h-full">
      <div className="w-1/2 border-r border-green-500/30 flex flex-col bg-gray-950/50">
        <div className="p-6 border-b border-green-500/20 bg-gradient-to-r from-gray-900 to-gray-800">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-orange-600 to-red-600 rounded-lg">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-mono">AI_PAIR_PROGRAMMING</h2>
              <p className="text-sm text-gray-300 font-mono">Collaborative coding with AI partner</p>
            </div>
          </div>
          <Badge className="bg-gradient-to-r from-orange-600 to-red-600 text-white border-0 font-mono">
            <MessageCircle className="h-3 w-3 mr-1" />
            OpenAI Collaborative
          </Badge>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-green-400 mb-2 font-mono">PROGRAMMING_LANGUAGE</label>
            <Select value={language} onValueChange={(value) => {
              playMechanicalSound();
              setLanguage(value);
            }}>
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
            <label className="block text-sm font-medium text-green-400 mb-2 font-mono">CURRENT_CODE</label>
            <Textarea
              value={currentCode}
              onChange={(e) => setCurrentCode(e.target.value)}
              placeholder="Paste the code you're working on..."
              className="bg-gray-900/80 border-green-500/30 text-white font-mono min-h-[120px]"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-green-400 font-mono">CONVERSATION</label>
              <Button
                onClick={clearConversation}
                variant="outline"
                size="sm"
                className="text-xs font-mono border-gray-600 text-gray-400 hover:bg-gray-800"
              >
                CLEAR
              </Button>
            </div>
            <div className="bg-gray-900/80 border border-green-500/30 rounded-lg p-3 h-40 overflow-y-auto">
              {conversation.length === 0 ? (
                <p className="text-gray-500 text-sm font-mono">Start a conversation with your AI pair programming partner...</p>
              ) : (
                conversation.map((msg, index) => (
                  <div key={index} className={`mb-2 ${msg.role === 'user' ? 'text-green-400' : 'text-blue-400'}`}>
                    <span className="text-xs text-gray-500 font-mono">{msg.timestamp} - {msg.role.toUpperCase()}:</span>
                    <p className="text-sm font-mono break-words">{msg.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-green-400 mb-2 font-mono">YOUR_MESSAGE</label>
            <div className="flex space-x-2">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask your AI partner about the code, request help, or discuss implementation..."
                className="bg-gray-900/80 border-green-500/30 text-white font-mono flex-1"
                rows={3}
              />
              <Button
                onClick={handleSendMessage}
                disabled={isProcessing || !message.trim()}
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-mono px-4"
              >
                {isProcessing ? (
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1">
        <CodeDisplay
          code={aiResponse || conversation.map(msg => `${msg.role.toUpperCase()} (${msg.timestamp}):\n${msg.content}\n\n`).join('')}
          isProcessing={isProcessing}
          error={null}
          selectedLanguage={{ name: 'Pair Programming Session', extension: 'md', icon: '👥', color: 'text-orange-400' }}
          selectedFeature="pair-programming"
        />
      </div>
    </div>
  );
};
