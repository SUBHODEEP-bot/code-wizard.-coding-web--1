
import { useState, useRef } from 'react';
import { Send, Mic, MicOff, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { features } from '@/data/features';
import { toast } from '@/hooks/use-toast';

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  isProcessing: boolean;
  selectedFeature: string;
}

export const PromptInput = ({ onSubmit, isProcessing, selectedFeature }: PromptInputProps) => {
  const [prompt, setPrompt] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const currentFeature = features.find(f => f.id === selectedFeature);
  const placeholder = currentFeature?.examplePrompt || 'Enter your coding request...';

  const handleSubmit = () => {
    if (prompt.trim() && !isProcessing) {
      onSubmit(prompt.trim());
      setPrompt('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const toggleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: "Voice input not supported",
        description: "Your browser doesn't support voice input",
        variant: "destructive",
      });
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    } else {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        toast({
          title: "Listening...",
          description: "Speak your coding request",
        });
      };

      recognition.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setPrompt(prev => prev + ' ' + finalTranscript);
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          title: "Voice input error",
          description: "Failed to process voice input",
          variant: "destructive",
        });
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    }
  };

  const quickPrompts = [
    "Write a function to...",
    "Debug this error...",
    "Explain how...",
    "Refactor this code..."
  ];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Your Prompt
        </label>
        <div className="relative">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full min-h-[120px] bg-gray-700 border-gray-600 text-white placeholder-gray-400 resize-none pr-24"
            disabled={isProcessing}
          />
          <div className="absolute bottom-3 right-3 flex space-x-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={toggleVoiceInput}
              className={`p-2 ${isListening ? 'text-red-400 hover:text-red-300' : 'text-gray-400 hover:text-gray-300'}`}
              disabled={isProcessing}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={!prompt.trim() || isProcessing}
              className="bg-blue-600 hover:bg-blue-700 text-white"
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

      {/* Quick Prompts */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Quick Prompts
        </label>
        <div className="grid grid-cols-2 gap-2">
          {quickPrompts.map((quickPrompt, index) => (
            <button
              key={index}
              onClick={() => setPrompt(quickPrompt)}
              className="p-2 text-xs text-left bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg transition-colors"
              disabled={isProcessing}
            >
              {quickPrompt}
            </button>
          ))}
        </div>
      </div>

      {/* AI Enhancement Status */}
      <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-4 w-4 text-yellow-400" />
          <span className="text-sm text-gray-300">AI Models</span>
        </div>
        <div className="text-xs text-green-400">
          {currentFeature?.apiProvider} Active
        </div>
      </div>
    </div>
  );
};
