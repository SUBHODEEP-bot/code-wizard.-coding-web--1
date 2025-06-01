
import { useState, useEffect } from 'react';
import { Terminal, Zap } from 'lucide-react';

interface HackerTerminalProps {
  isActive?: boolean;
  text?: string;
}

export const HackerTerminal = ({ isActive = false, text = "AI_CODER_ASSISTANT" }: HackerTerminalProps) => {
  const [displayText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (isActive) {
      let i = 0;
      const timer = setInterval(() => {
        if (i < text.length) {
          setDisplayText(text.slice(0, i + 1));
          i++;
        } else {
          clearInterval(timer);
        }
      }, 100);
      return () => clearInterval(timer);
    } else {
      setDisplayText(text);
    }
  }, [text, isActive]);

  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(cursorTimer);
  }, []);

  return (
    <div className="flex items-center space-x-2 font-mono">
      <Terminal className="h-4 w-4 text-green-400" />
      <span className="text-green-400">root@ai-coder:~$</span>
      <span className="text-white">{displayText}</span>
      {showCursor && <span className="text-green-400 animate-pulse">|</span>}
    </div>
  );
};
