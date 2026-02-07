import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div className="relative group">
            <button className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5">
                <Globe size={18} />
                <span className="uppercase text-xs font-bold">{i18n.language.split('-')[0]}</span>
            </button>

            <div className="absolute right-0 mt-2 w-32 bg-space-card backdrop-blur-md border border-white/10 rounded-lg shadow-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <button
                    onClick={() => changeLanguage('en')}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-white/10 transition-colors ${i18n.language.startsWith('en') ? 'text-cyan-400 font-bold' : 'text-slate-300'}`}
                >
                    English
                </button>
                <button
                    onClick={() => changeLanguage('es')}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-white/10 transition-colors ${i18n.language.startsWith('es') ? 'text-cyan-400 font-bold' : 'text-slate-300'}`}
                >
                    Español
                </button>
                <button
                    onClick={() => changeLanguage('fr')}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-white/10 transition-colors ${i18n.language.startsWith('fr') ? 'text-cyan-400 font-bold' : 'text-slate-300'}`}
                >
                    Français
                </button>
                <button
                    onClick={() => changeLanguage('ru')}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-white/10 transition-colors ${i18n.language.startsWith('ru') ? 'text-cyan-400 font-bold' : 'text-slate-300'}`}
                >
                    Русский
                </button>
                <button
                    onClick={() => changeLanguage('hi')}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-white/10 transition-colors ${i18n.language.startsWith('hi') ? 'text-cyan-400 font-bold' : 'text-slate-300'}`}
                >
                    हिन्दी
                </button>
                <button
                    onClick={() => changeLanguage('or')}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-white/10 transition-colors ${i18n.language.startsWith('or') ? 'text-cyan-400 font-bold' : 'text-slate-300'}`}
                >
                    ଓଡ଼ିଆ
                </button>
            </div>
        </div>
    );
};

export default LanguageSwitcher;
