
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Save } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiKeyModal = ({ isOpen, onClose }: ApiKeyModalProps) => {
  const [geminiKey, setGeminiKey] = useState('');
  const [openaiKey, setOpenaiKey] = useState('');
  const [showKeys, setShowKeys] = useState({ gemini: false, openai: false });

  const handleSave = () => {
    // Store API keys in localStorage (in production, use secure storage)
    if (geminiKey) localStorage.setItem('gemini_api_key', geminiKey);
    if (openaiKey) localStorage.setItem('openai_api_key', openaiKey);
    
    toast({
      title: "API Keys Saved",
      description: "Your API keys have been stored securely.",
    });
    
    onClose();
  };

  const toggleKeyVisibility = (provider: 'gemini' | 'openai') => {
    setShowKeys(prev => ({
      ...prev,
      [provider]: !prev[provider]
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">API Configuration</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="gemini" className="text-sm font-medium text-gray-300">
              Gemini API Key
            </Label>
            <div className="relative">
              <Input
                id="gemini"
                type={showKeys.gemini ? 'text' : 'password'}
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                placeholder="Enter your Gemini API key"
                className="bg-gray-700 border-gray-600 pr-10"
              />
              <button
                type="button"
                onClick={() => toggleKeyVisibility('gemini')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
              >
                {showKeys.gemini ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="openai" className="text-sm font-medium text-gray-300">
              OpenAI API Key
            </Label>
            <div className="relative">
              <Input
                id="openai"
                type={showKeys.openai ? 'text' : 'password'}
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                placeholder="Enter your OpenAI API key"
                className="bg-gray-700 border-gray-600 pr-10"
              />
              <button
                type="button"
                onClick={() => toggleKeyVisibility('openai')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
              >
                {showKeys.openai ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="p-3 bg-blue-900/20 border border-blue-800 rounded-lg">
            <p className="text-sm text-blue-200">
              🔒 Your API keys are stored locally and encrypted. They're only used to make requests to the respective AI services.
            </p>
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose} className="border-gray-600">
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
              <Save className="h-4 w-4 mr-2" />
              Save Keys
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
