
import { useState } from 'react';
import { ArrowRight, Copy, Download, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { LanguageSelector, programmingLanguages, ProgrammingLanguage } from '@/components/LanguageSelector';
import { aiService } from '@/services/aiService';
import { toast } from '@/hooks/use-toast';

export const LanguageTranslator = () => {
  const [sourceCode, setSourceCode] = useState('');
  const [translatedCode, setTranslatedCode] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState<ProgrammingLanguage>(programmingLanguages[0]);
  const [targetLanguage, setTargetLanguage] = useState<ProgrammingLanguage>(programmingLanguages[1]);
  const [isTranslating, setIsTranslating] = useState(false);

  const handleTranslate = async () => {
    if (!sourceCode.trim()) {
      toast({
        title: "No source code",
        description: "Please enter code to translate",
        variant: "destructive",
      });
      return;
    }

    if (sourceLanguage.id === targetLanguage.id) {
      toast({
        title: "Same language selected",
        description: "Please select different source and target languages",
        variant: "destructive",
      });
      return;
    }

    setIsTranslating(true);
    setTranslatedCode('');

    try {
      const prompt = `Translate this ${sourceLanguage.name} code to ${targetLanguage.name}. Only provide the translated code without explanations:\n\n${sourceCode}`;
      
      const result = await aiService.processPrompt(prompt, 'translator', 'Both');
      setTranslatedCode(result);
      
      toast({
        title: "Translation Complete",
        description: `Successfully translated from ${sourceLanguage.name} to ${targetLanguage.name}`,
        className: "bg-gray-900 border-green-500 text-green-400",
      });
    } catch (error) {
      console.error('Translation error:', error);
      toast({
        title: "Translation Failed",
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: "destructive",
      });
    } finally {
      setIsTranslating(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Code copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const downloadCode = (code: string, language: ProgrammingLanguage) => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `translated-code-${Date.now()}${language.extension}`;
    a.click();
    URL.revokeObjectURL(url);
    toast({
      title: "Downloaded!",
      description: "Code file downloaded successfully",
    });
  };

  const swapLanguages = () => {
    const tempLang = sourceLanguage;
    setSourceLanguage(targetLanguage);
    setTargetLanguage(tempLang);
    
    // Also swap the code if both exist
    if (sourceCode && translatedCode) {
      const tempCode = sourceCode;
      setSourceCode(translatedCode);
      setTranslatedCode(tempCode);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/5 to-blue-900/5"></div>
      
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-purple-500/30 bg-gray-900/80 backdrop-blur-sm relative z-10 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg">
            <ArrowRight className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-medium text-white font-mono">LANGUAGE_TRANSLATOR</h3>
        </div>
      </div>

      {/* Language selectors */}
      <div className="p-4 border-b border-purple-500/30 bg-gray-900/50 backdrop-blur-sm flex-shrink-0 relative z-10">
        <div className="flex items-center justify-center space-x-4">
          <div className="flex-1 max-w-xs">
            <label className="block text-sm font-medium text-purple-400 mb-2 font-mono">SOURCE_LANGUAGE</label>
            <LanguageSelector 
              selectedLanguage={sourceLanguage}
              onLanguageChange={setSourceLanguage}
            />
          </div>
          
          <Button
            onClick={swapLanguages}
            className="mt-6 p-2 bg-gray-800 hover:bg-gray-700 border border-purple-500/30 text-purple-400"
            disabled={isTranslating}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          
          <div className="flex-1 max-w-xs">
            <label className="block text-sm font-medium text-blue-400 mb-2 font-mono">TARGET_LANGUAGE</label>
            <LanguageSelector 
              selectedLanguage={targetLanguage}
              onLanguageChange={setTargetLanguage}
            />
          </div>
        </div>
      </div>

      {/* Code areas */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Source code */}
        <div className="w-1/2 border-r border-purple-500/30 flex flex-col">
          <div className="p-3 bg-gray-900/80 border-b border-purple-500/30 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center space-x-2">
              <span className="text-sm">{sourceLanguage.icon}</span>
              <span className="text-sm font-mono text-purple-400">SOURCE_CODE</span>
            </div>
            <div className="flex space-x-2">
              {sourceCode && (
                <>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(sourceCode)}
                    className="text-purple-400 hover:text-purple-300 hover:bg-purple-900/20 border border-purple-500/30 font-mono"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => downloadCode(sourceCode, sourceLanguage)}
                    className="text-purple-400 hover:text-purple-300 hover:bg-purple-900/20 border border-purple-500/30 font-mono"
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                </>
              )}
            </div>
          </div>
          <div className="flex-1 p-4 overflow-auto custom-scrollbar bg-black/30">
            <Textarea
              value={sourceCode}
              onChange={(e) => setSourceCode(e.target.value)}
              placeholder={`Paste your ${sourceLanguage.name} code here...`}
              className="w-full h-full min-h-full bg-transparent border-none text-purple-300 placeholder-gray-500 resize-none font-mono focus:ring-0 focus:outline-none"
              disabled={isTranslating}
            />
          </div>
        </div>

        {/* Translation button and output */}
        <div className="w-1/2 flex flex-col">
          <div className="p-3 bg-gray-900/80 border-b border-blue-500/30 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center space-x-2">
              <span className="text-sm">{targetLanguage.icon}</span>
              <span className="text-sm font-mono text-blue-400">TRANSLATED_CODE</span>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={handleTranslate}
                disabled={isTranslating || !sourceCode.trim()}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-mono text-xs"
              >
                {isTranslating ? (
                  <div className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full mr-2" />
                ) : (
                  <ArrowRight className="h-3 w-3 mr-2" />
                )}
                TRANSLATE
              </Button>
              {translatedCode && (
                <>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(translatedCode)}
                    className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 border border-blue-500/30 font-mono"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => downloadCode(translatedCode, targetLanguage)}
                    className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 border border-blue-500/30 font-mono"
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                </>
              )}
            </div>
          </div>
          <div className="flex-1 p-4 overflow-auto custom-scrollbar bg-black/30">
            {isTranslating ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                  <p className="text-blue-400 font-mono text-sm">TRANSLATING_CODE...</p>
                </div>
              </div>
            ) : translatedCode ? (
              <pre className="text-sm text-blue-300 font-mono whitespace-pre-wrap leading-relaxed">
                <code>{translatedCode}</code>
              </pre>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500 font-mono text-sm">
                {sourceCode ? 'Click TRANSLATE to convert your code' : 'Enter source code to begin translation'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
