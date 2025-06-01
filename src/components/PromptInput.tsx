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
  selectedLanguage: { name: string };
}

export const PromptInput = ({ onSubmit, isProcessing, selectedFeature, selectedLanguage }: PromptInputProps) => {
  const [prompt, setPrompt] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const currentFeature = features.find(f => f.id === selectedFeature);
  const placeholder = `Enter your ${selectedLanguage.name} coding request...`;

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
    `Write a ${selectedLanguage.name} function to...`,
    `Debug this ${selectedLanguage.name} error...`,
    `Explain how this ${selectedLanguage.name} code...`,
    `Refactor this ${selectedLanguage.name} code...`
  ];

  return (
    <div className="space-y-4 relative">
      <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-blue-400/10 to-transparent rounded-full blur-lg"></div>
      
      <div className="relative z-10">
        <label className="block text-sm font-medium text-green-400 mb-2 font-mono tracking-wide">
          NEURAL_INPUT_INTERFACE
        </label>
        <div className="relative">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full min-h-[120px] bg-gray-900/80 border-green-500/30 text-white placeholder-gray-500 resize-none pr-24 font-mono backdrop-blur-sm focus:border-green-400 focus:ring-1 focus:ring-green-400"
            disabled={isProcessing}
          />
          <div className="absolute bottom-3 right-3 flex space-x-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={toggleVoiceInput}
              className={`p-2 font-mono ${isListening ? 'text-red-400 hover:text-red-300 bg-red-900/20' : 'text-green-400 hover:text-green-300 bg-green-900/20'} border border-current/30`}
              disabled={isProcessing}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={!prompt.trim() || isProcessing}
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 text-white border-0 font-mono shadow-lg"
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

      {/* Enhanced Quick Prompts */}
      <div className="relative z-10">
        <label className="block text-sm font-medium text-green-400 mb-2 font-mono tracking-wide">
          QUICK_PROTOCOLS
        </label>
        <div className="grid grid-cols-2 gap-2">
          {quickPrompts.map((quickPrompt, index) => (
            <button
              key={index}
              onClick={() => setPrompt(quickPrompt)}
              className="p-3 text-xs text-left bg-gray-900/80 hover:bg-gray-800 border border-green-500/30 rounded-lg transition-all duration-200 font-mono hover:border-green-400 hover:shadow-lg backdrop-blur-sm"
              disabled={isProcessing}
            >
              <span className="text-green-400 mr-2">&gt;</span>
              {quickPrompt}
            </button>
          ))}
        </div>
      </div>

      {/* Enhanced AI Status */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-900/80 to-gray-800/80 border border-green-500/30 rounded-lg backdrop-blur-sm relative z-10">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Sparkles className="h-5 w-5 text-yellow-400 animate-pulse" />
            <div className="absolute inset-0 bg-yellow-400 rounded-full blur-sm opacity-30 animate-ping"></div>
          </div>
          <span className="text-sm text-gray-300 font-mono">NEURAL_MODELS_STATUS</span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-xs font-mono">
            <span className="text-green-400">LANG:</span>
            <span className="text-white ml-1">{selectedLanguage.name}</span>
          </div>
          <div className="text-xs text-green-400 font-mono flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>{currentFeature?.apiProvider} ACTIVE</span>
          </div>
        </div>
      </div>
    </div>
  );
};
