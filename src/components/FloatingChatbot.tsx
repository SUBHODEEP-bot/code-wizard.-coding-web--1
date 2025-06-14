
import React, { useState } from 'react';
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
    
    try {
      const result = await aiService.processPrompt(
        `User question: ${message}\n\nPlease provide a helpful and concise answer about this website or general assistance.`,
        'pair-programming',
        'Auto'
      );
      setResponse(result);
      
      toast({
        title: "Response Generated",
        description: "AI assistant has responded to your query",
        className: "bg-gray-900 border-blue-500 text-blue-400"
      });
    } catch (error) {
      console.error('Chatbot error:', error);
      toast({
        title: "Error",
        description: "Failed to get response from AI assistant",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClearChat = () => {
    setMessage('');
    setResponse('');
  };

  return (
    <>
      {/* Floating Chatbot Icon */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group relative transition-all duration-300 hover:scale-110 active:scale-95"
          aria-label="Open AI Chatbot"
        >
          <div className="relative">
            <ChatbotIcon 
              size={80} 
              className="drop-shadow-lg group-hover:drop-shadow-xl transition-all duration-300" 
            />
            {/* Pulse animation */}
            <div className="absolute inset-0 rounded-full bg-blue-400 opacity-20 animate-ping"></div>
          </div>
        </button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 max-w-[calc(100vw-2rem)] animate-scale-in">
          <Card className="bg-white border-2 border-blue-200 shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg p-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <ChatbotIcon size={24} />
                  AI Assistant
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-blue-400 h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="p-4 max-h-96 overflow-y-auto">
              <div className="space-y-4">
                {/* Welcome Message */}
                {!response && !message && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-800">
                      👋 Hi! I'm your AI assistant. Ask me anything about this website or any coding questions!
                    </p>
                  </div>
                )}

                {/* User Message */}
                {message && (
                  <div className="flex justify-end">
                    <div className="bg-blue-500 text-white p-2 rounded-lg max-w-[80%] text-sm">
                      {message}
                    </div>
                  </div>
                )}

                {/* AI Response */}
                {response && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 p-2 rounded-lg max-w-[80%] text-sm">
                      <div className="whitespace-pre-wrap">{response}</div>
                    </div>
                  </div>
                )}

                {/* Processing Indicator */}
                {isProcessing && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 p-2 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                        Thinking...
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>

            {/* Input Area */}
            <div className="p-3 border-t border-gray-200">
              <div className="flex gap-2">
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-1 min-h-[40px] resize-none text-sm"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <div className="flex flex-col gap-1">
                  <Button
                    onClick={handleSendMessage}
                    disabled={isProcessing || !message.trim()}
                    size="sm"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3"
                  >
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                  {response && (
                    <Button
                      onClick={handleClearChat}
                      variant="outline"
                      size="sm"
                      className="px-2 text-xs"
                    >
                      Clear
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};
