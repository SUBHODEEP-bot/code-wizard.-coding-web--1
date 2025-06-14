
import { Volume2, VolumeX } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useSoundEffects } from '@/hooks/useSoundEffects';

interface SoundToggleProps {
  isSoundEnabled: boolean;
  onToggle: () => void;
}

export const SoundToggle = ({ isSoundEnabled, onToggle }: SoundToggleProps) => {
  return (
    <div className="flex items-center space-x-2 px-3 py-1 bg-gray-900 border border-green-500/30 rounded-lg">
      {isSoundEnabled ? (
        <Volume2 className="h-4 w-4 text-green-400" />
      ) : (
        <VolumeX className="h-4 w-4 text-gray-400" />
      )}
      <Switch
        checked={isSoundEnabled}
        onCheckedChange={onToggle}
        className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-gray-600"
      />
      <span className="text-xs text-green-400 font-mono">
        {isSoundEnabled ? 'AUDIO_ON' : 'AUDIO_OFF'}
      </span>
    </div>
  );
};
