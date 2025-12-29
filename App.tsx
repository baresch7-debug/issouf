
import React, { useState } from 'react';
import { AppState, Level, Topic } from './types';
import Dashboard from './components/Dashboard';
import LessonContent from './components/LessonContent';
import ExerciseSystem from './components/ExerciseSystem';
import AIExplainer from './components/AIExplainer';
import PhysicsGames from './components/PhysicsGames';
import { BookOpen, BrainCircuit, Gamepad2, ArrowLeft } from 'lucide-react';

const PHYSICS_TOPICS: Topic[] = [
  { id: '1', title: 'Mouvement et Forces', category: 'Mécanique', levels: [Level.FOUR, Level.THREE, Level.TWO, Level.ONE, Level.TLE] },
  { id: '2', title: 'Lumière et Vision', category: 'Optique', levels: [Level.FOUR, Level.THREE, Level.TWO] },
  { id: '3', title: 'Circuits et Puissance', category: 'Électricité', levels: [Level.FOUR, Level.THREE, Level.TWO, Level.ONE] },
  { id: '4', title: 'Constitution de la Matière', category: 'Chimie', levels: [Level.FOUR, Level.THREE, Level.TWO] },
  { id: '5', title: 'Solutions Aqueuses et pH', category: 'Chimie', levels: [Level.THREE, Level.TWO, Level.ONE] },
  { id: '6', title: 'Ondes Sonores et Électromagnétiques', category: 'Ondes', levels: [Level.TWO, Level.ONE, Level.TLE] },
  { id: '7', title: 'Énergie Interne et Transferts', category: 'Thermodynamique', levels: [Level.TWO, Level.ONE, Level.TLE] },
  { id: '8', title: 'Radioactivité et Fission', category: 'Nucléaire', levels: [Level.ONE, Level.TLE] },
  { id: '9', title: 'Dualité Onde-Corpuscule', category: 'Quantique', levels: [Level.TLE] },
  { id: '10', title: 'Synthèse Organique', category: 'Chimie', levels: [Level.ONE, Level.TLE] },
];

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<AppState>('dashboard');
  const [selectedLevel, setSelectedLevel] = useState<Level>(Level.TWO);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  const navigateToTopic = (topic: Topic, mode: AppState) => {
    setSelectedTopic(topic);
    setCurrentPage(mode);
  };

  const handleBack = () => {
    setCurrentPage('dashboard');
    setSelectedTopic(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="glass sticky top-0 z-50 border-b border-slate-200 px-4 md:px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentPage('dashboard')}>
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <BrainCircuit size={20} />
            </div>
            <h1 className="text-lg md:text-xl font-bold tracking-tight text-slate-800">July Physic <span className="text-indigo-600">tools</span></h1>
          </div>
          <div className="md:hidden flex items-center gap-2 bg-slate-100 rounded-lg p-1 scale-90">
             <select 
              value={selectedLevel} 
              onChange={(e) => setSelectedLevel(e.target.value as Level)}
              className="bg-transparent text-sm font-bold text-indigo-600 outline-none px-2"
             >
               {Object.values(Level).map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
             </select>
          </div>
        </div>

        <nav className="flex items-center gap-2 md:gap-4">
          <button 
            onClick={() => setCurrentPage('dashboard')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition ${currentPage === 'dashboard' ? 'bg-indigo-50 text-indigo-600 font-medium' : 'text-slate-600 hover:text-indigo-600'}`}
          >
            <BookOpen size={16} /> Cours
          </button>
          <button 
             onClick={() => setCurrentPage('games')}
             className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition ${currentPage === 'games' ? 'bg-amber-50 text-amber-600 font-medium' : 'text-slate-600 hover:text-amber-600'}`}
          >
            <Gamepad2 size={16} /> Jeux
          </button>
          <button 
             onClick={() => setCurrentPage('ai-explainer')}
             className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition ${currentPage === 'ai-explainer' ? 'bg-indigo-50 text-indigo-600 font-medium' : 'text-slate-600 hover:text-indigo-600'}`}
          >
            <BrainCircuit size={16} /> Expliquer
          </button>
        </nav>

        <div className="hidden md:flex items-center gap-1 bg-slate-100 rounded-xl p-1">
          {Object.values(Level).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition min-w-[50px] ${selectedLevel === lvl ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6 md:py-8 max-w-6xl">
        {currentPage !== 'dashboard' && (
          <button 
            onClick={handleBack}
            className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition mb-6 font-medium"
          >
            <ArrowLeft size={20} /> Retour
          </button>
        )}

        {currentPage === 'dashboard' && (
          <Dashboard 
            topics={PHYSICS_TOPICS.filter(t => t.levels.includes(selectedLevel))} 
            level={selectedLevel}
            onSelectTopic={navigateToTopic}
          />
        )}

        {currentPage === 'lesson' && selectedTopic && (
          <LessonContent topic={selectedTopic} level={selectedLevel} />
        )}

        {currentPage === 'exercises' && selectedTopic && (
          <ExerciseSystem topic={selectedTopic} level={selectedLevel} />
        )}

        {currentPage === 'ai-explainer' && (
          <AIExplainer level={selectedLevel} />
        )}

        {currentPage === 'games' && (
          <PhysicsGames level={selectedLevel} />
        )}
      </main>

      <footer className="border-t border-slate-200 py-6 px-6 text-center text-slate-400 text-xs">
        <p>© 2024 July Physic tools - Le compagnon des scientifiques de demain</p>
      </footer>
    </div>
  );
};

export default App;
