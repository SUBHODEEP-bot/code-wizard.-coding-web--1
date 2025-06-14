
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'bn', label: 'Bengali' },
  { code: 'hi', label: 'Hindi' },
];

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  return (
    <div className="flex items-center space-x-2">
      {languages.map(lang => (
        <button
          key={lang.code}
          onClick={() => i18n.changeLanguage(lang.code)}
          className={`px-2 py-1 rounded text-xs ${
            i18n.language === lang.code ? 'bg-green-600 text-white' : 'bg-gray-800 text-green-300'
          } transition-all`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
};
