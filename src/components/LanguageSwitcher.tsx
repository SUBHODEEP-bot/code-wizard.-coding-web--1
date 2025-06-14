
import { useTranslation } from 'react-i18next';
import { Languages as LanguagesIcon, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'bn', label: 'বাংলা (Bengali)' }, // Using native script name + English for clarity
  { code: 'hi', label: 'हिन्दी (Hindi)' },  // Using native script name + English for clarity
];

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="h-8 px-2 bg-gray-800 border-green-500/30 hover:border-green-400 text-green-300 hover:bg-gray-700 transition-all duration-200 font-mono text-xs"
        >
          <LanguagesIcon className="h-3 w-3 mr-1.5" />
          <span className="hidden sm:inline">{currentLanguage.label.split(' (')[0]}</span> {/* Show short label or icon on small screens */}
          <span className="inline sm:hidden">{currentLanguage.code.toUpperCase()}</span>
          <ChevronDown className="h-3 w-3 ml-1.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-48 bg-gray-900 border-green-500/30 text-green-300"
        align="end"
      >
        {languages.map(lang => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => i18n.changeLanguage(lang.code)}
            className={`cursor-pointer hover:bg-gray-800 transition-colors font-mono text-xs ${
              i18n.language === lang.code ? 'bg-gray-800 border-l-2 border-green-400 text-white' : ''
            }`}
          >
            {lang.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
