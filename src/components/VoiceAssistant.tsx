
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Volume2, VolumeX, MessageSquare, Zap } from 'lucide-react';
import { CodeDisplay } from './CodeDisplay';
import { aiService } from '@/services/aiService';
import { toast } from '@/hooks/use-toast';
import { useSoundEffects } from '@/hooks/useSoundEffects';

export const VoiceAssistant = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [language, setLanguage] = useState('JavaScript');
  const [response, setResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<any>(null);

  const { playMechanicalSound } = useSoundEffects();

  const languages = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'PHP', 'Ruby'
  ];

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcriptText = event.results[current][0].transcript;
        setTranscript(transcriptText);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const startRecording = () => {
    playMechanicalSound();
    if (recognitionRef.current) {
      setIsRecording(true);
      setTranscript('');
      recognitionRef.current.start();
    } else {
      toast({
        title: "Speech Recognition Unavailable",
        description: "Your browser doesn't support speech recognition",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    playMechanicalSound();
    if (recognitionRef.current) {
      setIsRecording(false);
      recognitionRef.current.stop();
    }
  };

  const processVoiceCommand = async () => {
    if (!transcript.trim()) {
      toast({
        title: "No Voice Input",
        description: "Please record your voice command first",
        variant: "destructive"
      });
      return;
    }

    playMechanicalSound();
    setIsProcessing(true);
    
    const prompt = `Voice command: "${transcript}"

Language context: ${language}

Please interpret this voice command and provide appropriate code assistance. This could be:
1. Writing code based on the description
2. Explaining code concepts
3. Debugging help
4. Code optimization suggestions
5. General programming questions

Provide a helpful response in ${language} if code is requested, or clear explanations for concepts.`;

    try {
      const result = await aiService.processPrompt(prompt, 'voice-assistant', 'OpenAI');
      setResponse(result);
      
      // Text-to-speech for the response
      speakResponse(result);
      
      toast({
        title: "Voice Command Processed",
        description: "AI response generated and spoken",
        className: "bg-gray-900 border-green-500 text-green-400"
      });
    } catch (error) {
      console.error('Voice processing failed:', error);
      toast({
        title: "Processing Failed",
        description: "Failed to process voice command",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const speakResponse = (text: string) => {
    if ('speechSynthesis' in window) {
      playMechanicalSound();
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      
      speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    playMechanicalSound();
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <div className="flex h-full">
      <div className="w-1/2 border-r border-green-500/30 flex flex-col bg-gray-950/50">
        <div className="p-6 border-b border-green-500/20 bg-gradient-to-r from-gray-900 to-gray-800">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg">
              <Mic className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-mono">VOICE_ASSISTANT</h2>
              <p className="text-sm text-gray-300 font-mono">Voice-controlled coding assistant</p>
            </div>
          </div>
          <Badge className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-0 font-mono">
            <MessageSquare className="h-3 w-3 mr-1" />
            OpenAI + Speech API
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

          <div className="flex space-x-3">
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              className={`flex-1 ${isRecording 
                ? 'bg-red-600 hover:bg-red-500' 
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500'
              } text-white font-mono`}
            >
              {isRecording ? (
                <>
                  <MicOff className="h-4 w-4 mr-2" />
                  STOP_RECORDING
                </>
              ) : (
                <>
                  <Mic className="h-4 w-4 mr-2" />
                  START_RECORDING
                </>
              )}
            </Button>
            
            <Button
              onClick={isSpeaking ? stopSpeaking : () => speakResponse(response)}
              disabled={!response}
              className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500 text-white font-mono"
            >
              {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
          </div>

          <div>
            <label className="block text-sm font-medium text-green-400 mb-2 font-mono">VOICE_TRANSCRIPT</label>
            <Textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Your voice commands will appear here..."
              className="bg-gray-900/80 border-green-500/30 text-white font-mono min-h-[120px]"
            />
          </div>

          <Button
            onClick={processVoiceCommand}
            disabled={isProcessing || !transcript.trim()}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-mono"
          >
            {isProcessing ? (
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                PROCESS_COMMAND
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="flex-1">
        <CodeDisplay
          code={response}
          isProcessing={isProcessing}
          error={null}
          selectedLanguage={{ name: 'Voice Response', extension: 'md', icon: '🎤', color: 'text-indigo-400' }}
          selectedFeature="voice-assistant"
        />
      </div>
    </div>
  );
};
