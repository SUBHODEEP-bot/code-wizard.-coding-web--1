
import { useState, useCallback } from 'react';

export const useSoundEffects = () => {
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);

  // Base64 encoded mechanical keyboard click sound
  const mechanicalKeySound = 'data:audio/wav;base64,UklGRk4EAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YSoEAACBhYqFbF1hdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhB';

  const playMechanicalSound = useCallback(() => {
    if (!isSoundEnabled) return;
    
    try {
      const audio = new Audio(mechanicalKeySound);
      audio.volume = 0.3;
      audio.play().catch(() => {
        // Silently fail if audio can't play (user hasn't interacted with page yet)
      });
    } catch (error) {
      // Silently handle any audio creation errors
    }
  }, [isSoundEnabled, mechanicalKeySound]);

  const toggleSound = useCallback(() => {
    setIsSoundEnabled(prev => !prev);
  }, []);

  return {
    isSoundEnabled,
    toggleSound,
    playMechanicalSound
  };
};
