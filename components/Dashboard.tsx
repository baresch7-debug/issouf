
import React, { useState, useMemo } from 'react';
import { Topic, Level, AppState } from '../types';
import { 
  Book, Zap, Waves, Beaker, Radio, X, 
  GraduationCap, PlayCircle, Activity, Atom, 
  Search, FilterX, Eye, Milestone, Radiation, 
  Orbit, FlaskConical, Thermometer 
} from 'lucide-react';

interface DashboardProps {
  topics: Topic[];
  level: Level;
  onSelectTopic: (topic: Topic, mode: AppState) => void;
}

const CategoryIcon = ({ category }: { category: string }) => {
  const iconProps = { size: 22 };
  switch (category) {
    case 'Mécanique': return <Milestone {...iconProps} className="text-orange-500" />;
    case 'Optique': return <Eye {...iconProps} className="text-blue-500" />;
    case 'Électricité': return <Zap {...iconProps} className="text-yellow-500" />;
    case 'Nucléaire': return <Radiation {...iconProps} className="text-red-500" />;
    case 'Chimie': return <FlaskConical {...iconProps} className="text-pink-500" />;
    case 'Ondes': return <Waves {...iconProps} className="text-purple-500" />;
    case 'Quantique': return <Orbit {...iconProps} className="text-indigo-500" />;
    case 'Thermodynamique': return <Thermometer {...iconProps} className="text-red-400" />;
    default: return <Book {...iconProps} className="text-indigo-500" />;
  }
};

const Dashboard: React.FC<DashboardProps> = ({ topics, level, onSelectTopic }) => {
  const [activeModalTopic, setActiveModalTopic] = useState<Topic | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTopics = useMemo(() => {
    if (!searchQuery.trim()) return topics;
    const query = searchQuery.toLowerCase();
    return topics.filter(topic => 
      topic.title.toLowerCase().includes(query) || 
      topic.category.toLowerCase().includes(query)
    );
  }, [topics, searchQuery]);

  const closeModal = () => setActiveModalTopic(null);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-8 md:p-12 text-white shadow-xl overflow-hidden relative">
        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight">Apprenez la Physique.</h2>
          <p className="text-indigo-100 text-lg max-w-2xl font-light">
            Découvrez les secrets de l'univers avec des modules interactifs conçus pour le niveau {level}.
          </p>
        </div>
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none rotate-12">
          <Atom size={200} />
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Book className="text-indigo-600" /> Vos modules d'apprentissage
          </h3>
          
          <div className="relative group w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
            <input 
              type="text"
              placeholder="Rechercher un module (ex: Chimie, Forces...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border-2 border-slate-200 focus:border-indigo-600 rounded-2xl py-3 pl-12 pr-4 outline-none transition-all shadow-sm text-sm font-medium"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {filteredTopics.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTopics.map((topic) => (
              <button
                key={topic.id}
                onClick={() => setActiveModalTopic(topic)}
                className="text-left group bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-indigo-50 transition-colors">
                    <CategoryIcon category={topic.category} />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-1 bg-slate-100 text-slate-500 rounded uppercase tracking-wider">{topic.category}</span>
                </div>
                <h4 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">{topic.title}</h4>
                <p className="text-slate-500 text-sm line-clamp-2">Maîtrisez les concepts de {topic.title.toLowerCase()} avec July Physic.</p>
              </button>
            ))}
          </div>
        ) : (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center animate-in fade-in zoom-in duration-300">
            <div className="inline-flex p-4 bg-slate-50 text-slate-400 rounded-full mb-4">
              <FilterX size={40} />
            </div>
            <h4 className="text-xl font-bold text-slate-800 mb-2">Aucun module trouvé</h4>
            <p className="text-slate-500 max-w-sm mx-auto">Essayez d'autres mots-clés ou changez de niveau pour voir plus de contenus.</p>
            <button 
              onClick={() => setSearchQuery('')}
              className="mt-6 text-indigo-600 font-bold hover:underline"
            >
              Effacer la recherche
            </button>
          </div>
        )}
      </div>

      {activeModalTopic && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 rounded-lg"><CategoryIcon category={activeModalTopic.category} /></div>
                <div>
                  <h4 className="font-bold text-slate-800">{activeModalTopic.title}</h4>
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-tight">Niveau {level}</p>
                </div>
              </div>
              <button onClick={closeModal} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition"><X size={20} /></button>
            </div>
            <div className="p-8 space-y-4">
              <button onClick={() => { onSelectTopic(activeModalTopic, 'lesson'); closeModal(); }} className="w-full group flex items-center gap-4 p-5 rounded-2xl bg-indigo-50 border-2 border-transparent hover:border-indigo-600 transition-all text-left">
                <div className="bg-white p-3 rounded-xl shadow-sm text-indigo-600 group-hover:scale-110 transition-transform"><Book size={24} /></div>
                <div><span className="block font-bold text-indigo-900">Lire le cours</span><span className="text-sm text-indigo-700/70">Théorie et formules clés</span></div>
              </button>
              <button onClick={() => { onSelectTopic(activeModalTopic, 'exercises'); closeModal(); }} className="w-full group flex items-center gap-4 p-5 rounded-2xl bg-slate-50 border-2 border-transparent hover:border-emerald-600 transition-all text-left">
                <div className="bg-white p-3 rounded-xl shadow-sm text-emerald-600 group-hover:scale-110 transition-transform"><PlayCircle size={24} /></div>
                <div><span className="block font-bold text-slate-900">Exercices</span><span className="text-sm text-slate-500">S'entraîner et s'évaluer</span></div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
