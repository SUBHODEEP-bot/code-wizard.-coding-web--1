
import { useState } from 'react';
import { Code, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface ProgrammingLanguage {
  id: string;
  name: string;
  extension: string;
  color: string;
  icon: string;
}

export const programmingLanguages: ProgrammingLanguage[] = [
  { id: 'python', name: 'Python', extension: '.py', color: 'text-yellow-400', icon: '🐍' },
  { id: 'javascript', name: 'JavaScript', extension: '.js', color: 'text-yellow-300', icon: '⚡' },
  { id: 'typescript', name: 'TypeScript', extension: '.ts', color: 'text-blue-400', icon: '📘' },
  { id: 'java', name: 'Java', extension: '.java', color: 'text-orange-500', icon: '☕' },
  { id: 'cpp', name: 'C++', extension: '.cpp', color: 'text-blue-500', icon: '⚙️' },
  { id: 'c', name: 'C', extension: '.c', color: 'text-gray-400', icon: '🔧' },
  { id: 'csharp', name: 'C#', extension: '.cs', color: 'text-purple-400', icon: '🔷' },
  { id: 'php', name: 'PHP', extension: '.php', color: 'text-indigo-400', icon: '🐘' },
  { id: 'ruby', name: 'Ruby', extension: '.rb', color: 'text-red-400', icon: '💎' },
  { id: 'go', name: 'Go', extension: '.go', color: 'text-cyan-400', icon: '🐹' },
  { id: 'rust', name: 'Rust', extension: '.rs', color: 'text-orange-400', icon: '🦀' },
  { id: 'swift', name: 'Swift', extension: '.swift', color: 'text-orange-300', icon: '🦉' },
  { id: 'kotlin', name: 'Kotlin', extension: '.kt', color: 'text-purple-500', icon: '🔸' },
  { id: 'dart', name: 'Dart', extension: '.dart', color: 'text-blue-300', icon: '🎯' },
  { id: 'r', name: 'R', extension: '.r', color: 'text-blue-600', icon: '📊' },
  { id: 'matlab', name: 'MATLAB', extension: '.m', color: 'text-orange-600', icon: '📈' },
  { id: 'sql', name: 'SQL', extension: '.sql', color: 'text-teal-400', icon: '🗄️' },
  { id: 'html', name: 'HTML', extension: '.html', color: 'text-orange-500', icon: '🌐' },
  { id: 'css', name: 'CSS', extension: '.css', color: 'text-blue-500', icon: '🎨' },
  { id: 'shell', name: 'Shell/Bash', extension: '.sh', color: 'text-green-400', icon: '💻' },
];

interface LanguageSelectorProps {
  selectedLanguage: ProgrammingLanguage;
  onLanguageChange: (language: ProgrammingLanguage) => void;
  compact?: boolean;
}

export const LanguageSelector = ({ 
  selectedLanguage, 
  onLanguageChange, 
  compact = false 
}: LanguageSelectorProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className={`${compact ? 'h-8 px-2' : 'h-10 px-4'} bg-gray-800 border-green-500/30 hover:border-green-400 text-green-400 hover:bg-gray-700 transition-all duration-200 font-mono`}
        >
          <Code className={`${compact ? 'h-3 w-3' : 'h-4 w-4'} mr-2`} />
          <span className="mr-1">{selectedLanguage.icon}</span>
          <span className={compact ? 'text-xs' : 'text-sm'}>{selectedLanguage.name}</span>
          <ChevronDown className={`${compact ? 'h-3 w-3' : 'h-4 w-4'} ml-2`} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-64 bg-gray-900 border-green-500/30 max-h-80 overflow-y-auto"
        align="start"
      >
        {programmingLanguages.map((language) => (
          <DropdownMenuItem
            key={language.id}
            onClick={() => onLanguageChange(language)}
            className={`flex items-center space-x-3 p-3 cursor-pointer hover:bg-gray-800 transition-colors font-mono ${
              selectedLanguage.id === language.id ? 'bg-gray-800 border-l-2 border-green-400' : ''
            }`}
          >
            <span className="text-lg">{language.icon}</span>
            <div className="flex-1">
              <div className={`font-medium ${language.color}`}>{language.name}</div>
              <div className="text-xs text-gray-500">{language.extension}</div>
            </div>
            {selectedLanguage.id === language.id && (
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
