import React from 'react';
import { BookOpen, Globe, Info, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Resources = () => {
    const { t } = useTranslation();

    const glossary = [
        { term: 'ne', def: 'ne_def' },
        { term: 'pha', def: 'pha_def' },
        { term: 'au', def: 'au_def' },
        { term: 'albedo', def: 'albedo_def' },
        { term: 'magnitude', def: 'magnitude_def' }
    ];

    return (
        <div className="container mx-auto px-4 py-8 pt-24 min-h-screen">
            <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                <span className="bg-purple-500/10 text-purple-300 p-2 rounded-lg border border-purple-500/20 backdrop-blur-sm shadow-[0_0_10px_rgba(168,85,247,0.1)]">
                    <BookOpen size={24} />
                </span>
                {t('resources.title')}
            </h1>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Intro Section */}
                <div className="glass-panel p-6 rounded-2xl md:col-span-2">
                    <h2 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
                        <Info size={20} /> {t('resources.intro_title')}
                    </h2>
                    <p className="text-slate-300 leading-relaxed">
                        {t('resources.intro_text')}
                    </p>
                </div>

                {/* Glossary */}
                <div className="glass-panel p-6 rounded-2xl">
                    <h2 className="text-xl font-bold text-green-400 mb-6 flex items-center gap-2">
                        <BookOpen size={20} /> {t('resources.glossary_title')}
                    </h2>
                    <div className="space-y-4">
                        {glossary.map((item, index) => (
                            <div key={index} className="border-b border-white/5 last:border-0 pb-4 last:pb-0">
                                <h3 className="text-white font-bold text-lg mb-1">{t(`resources.terms.${item.term}`)}</h3>
                                <p className="text-slate-400 text-sm">{t(`resources.terms.${item.def}`)}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* External Links */}
                <div className="glass-panel p-6 rounded-2xl">
                    <h2 className="text-xl font-bold text-blue-400 mb-6 flex items-center gap-2">
                        <Globe size={20} /> {t('resources.links_title')}
                    </h2>
                    <ul className="space-y-4">
                        <li>
                            <a href="https://cneos.jpl.nasa.gov/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-slate-300 hover:text-cyan-400 transition-colors group">
                                <div className="p-2 bg-white/5 rounded-lg group-hover:bg-cyan-500/20 transition-colors">
                                    <ExternalLink size={18} />
                                </div>
                                <div>
                                    <div className="font-bold">NASA CNEOS</div>
                                    <div className="text-xs text-slate-500">Center for Near-Earth Object Studies</div>
                                </div>
                            </a>
                        </li>
                        <li>
                            <a href="https://www.esa.int/Safety_Security/Planetary_Defence" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-slate-300 hover:text-cyan-400 transition-colors group">
                                <div className="p-2 bg-white/5 rounded-lg group-hover:bg-cyan-500/20 transition-colors">
                                    <ExternalLink size={18} />
                                </div>
                                <div>
                                    <div className="font-bold">ESA Planetary Defence</div>
                                    <div className="text-xs text-slate-500">European Space Agency</div>
                                </div>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Resources;
