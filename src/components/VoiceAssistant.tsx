
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Volume2, Code } from 'lucide-react';
import { CodeDisplay } from './CodeDisplay';
import { aiService } from '@/services/aiService';
import { toast } from '@/hooks/use-toast';

export const VoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [language, setLanguage] = useState('JavaScript');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  const languages = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'PHP', 'Ruby'
  ];

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event: any) => {
        const voiceTranscript = event.results[0][0].transcript;
        setTranscript(voiceTranscript);
        handleVoiceCommand(voiceTranscript);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          title: "Voice Recognition Error",
          description: "Failed to recognize speech. Please try again.",
          variant: "destructive"
        });
      };

      setRecognition(recognitionInstance);
    } else {
      toast({
        title: "Voice Recognition Not Supported",
        description: "Your browser doesn't support speech recognition.",
        variant: "destructive"
      });
    }
  }, []);

  const startListening = () => {
    if (recognition) {
      setIsListening(true);
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  const handleVoiceCommand = async (voiceText: string) => {
    setIsProcessing(true);
    const prompt = `Convert this voice command to ${language} code:

Voice Command: "${voiceText}"

Please:
1. Interpret the natural language request
2. Generate clean, working ${language} code
3. Add appropriate comments
4. Follow best practices for ${language}
5. Make the code production-ready

Provide only the code with brief explanations.`;

    try {
      const result = await aiService.processPrompt(prompt, 'voice-assistant', 'DeepSeek');
      setGeneratedCode(result);
      toast({
        title: "Voice Command Processed",
        description: "Code generated from voice input",
        className: "bg-gray-900 border-green-500 text-green-400"
      });
    } catch (error) {
      console.error('Voice processing failed:', error);
      toast({
        title: "Processing Failed",
        description: "Failed to process voice command. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const clearTranscript = () => {
    setTranscript('');
    setGeneratedCode('');
  };

  return (
    <div className="flex h-full">
      <div className="w-1/2 border-r border-green-500/30 flex flex-col bg-gray-950/50">
        <div className="p-6 border-b border-green-500/20 bg-gradient-to-r from-gray-900 to-gray-800">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-green-600 to-teal-600 rounded-lg">
              <Mic className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-mono">VOICE_ASSISTANT</h2>
              <p className="text-sm text-gray-300 font-mono">Code using voice commands</p>
            </div>
          </div>
          <Badge className="bg-gradient-to-r from-green-600 to-teal-600 text-white border-0 font-mono">
            <Volume2 className="h-3 w-3 mr-1" />
            Speech Recognition
          </Badge>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-green-400 mb-2 font-mono">PROGRAMMING_LANGUAGE</label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="bg-gray-900/80 border-green-500/30 text-white font-mono">
                <SelectValue />
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

          <div className="space-y-4">
            <div className="flex space-x-2">
              <Button
                onClick={isListening ? stopListening : startListening}
                disabled={isProcessing || !recognition}
                className={`flex-1 font-mono ${
                  isListening 
                    ? 'bg-red-600 hover:bg-red-500' 
                    : 'bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500'
                }`}
              >
                {isListening ? (
                  <>
                    <MicOff className="h-4 w-4 mr-2" />
                    STOP_LISTENING
                  </>
                ) : (
                  <>
                    <Mic className="h-4 w-4 mr-2" />
                    START_VOICE_COMMAND
                  </>
                )}
              </Button>

              <Button
                onClick={clearTranscript}
                variant="outline"
                className="border-green-500/30 text-green-400 hover:bg-green-500/10 font-mono"
              >
                CLEAR
              </Button>
            </div>

            {isListening && (
              <div className="text-center p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                <div className="animate-pulse text-red-400 font-mono">🎤 LISTENING...</div>
                <p className="text-sm text-gray-400 mt-2">Speak your coding request clearly</p>
              </div>
            )}
          </div>

          {transcript && (
            <div>
              <label className="block text-sm font-medium text-green-400 mb-2 font-mono">VOICE_TRANSCRIPT</label>
              <div className="bg-gray-900/80 border border-green-500/30 rounded-lg p-3 text-white font-mono">
                "{transcript}"
              </div>
            </div>
          )}

          <div className="text-xs text-gray-500 font-mono space-y-1">
            <p>• Speak clearly and use technical terms</p>
            <p>• Example: "Create a function to sort an array"</p>
            <p>• Works best with Chrome/Edge browsers</p>
          </div>
        </div>
      </div>

      <div className="flex-1">
        <CodeDisplay
          code={generatedCode}
          isProcessing={isProcessing}
          error={null}
          selectedLanguage={{ name: language, extension: language.toLowerCase(), icon: '🎤', color: 'text-green-400' }}
          selectedFeature="voice-assistant"
        />
      </div>
    </div>
  );
};
