
import React, { useState } from 'react';
import { Level } from '../types';
import { 
  Gamepad2, Trophy, Zap, Beaker, Brain, ArrowRight, RefreshCw, 
  Check, X, ShieldCheck, Ruler, Milestone, Activity, Waves, 
  Eye, Sun, Thermometer, Database, Weight, Timer, TrendingUp,
  Atom, ZapOff, Orbit
} from 'lucide-react';

interface PhysicsGamesProps {
  level: Level;
}

type GameType = 'formula' | 'truefalse' | 'symbols' | 'units';

interface FormulaItem {
  name: string;
  formula: string;
  level: Level;
  icon: React.ReactNode;
  color: string;
}

const PhysicsGames: React.FC<PhysicsGamesProps> = ({ level }) => {
  const [activeGame, setActiveGame] = useState<GameType | null>(null);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<'start' | 'playing' | 'end'>('start');
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; show: boolean } | null>(null);

  // --- DATA SETS ---
  const formulaData: FormulaItem[] = [
    { name: "Poids", formula: "P = m × g", level: Level.FOUR, icon: <Weight size={20} />, color: "text-orange-500" },
    { name: "Vitesse", formula: "v = d / t", level: Level.FOUR, icon: <Timer size={20} />, color: "text-blue-500" },
    { name: "Loi d'Ohm", formula: "U = R × I", level: Level.FOUR, icon: <Zap size={20} />, color: "text-yellow-500" },
    { name: "Masse volumique", formula: "ρ = m / V", level: Level.FOUR, icon: <Database size={20} />, color: "text-emerald-500" },
    { name: "Énergie cinétique", formula: "Ec = ½mv²", level: Level.THREE, icon: <Activity size={20} />, color: "text-rose-500" },
    { name: "Puissance électrique", formula: "P = U × I", level: Level.THREE, icon: <Zap size={20} />, color: "text-amber-500" },
    { name: "Concentration molaire", formula: "C = n / V", level: Level.TWO, icon: <Beaker size={20} />, color: "text-indigo-500" },
    { name: "Quantité de matière", formula: "n = m / M", level: Level.TWO, icon: <Database size={20} />, color: "text-slate-500" },
    { name: "Loi de Snell-Descartes", formula: "n₁.sin(i₁) = n₂.sin(i₂)", level: Level.TWO, icon: <Sun size={20} />, color: "text-cyan-500" },
    { name: "2nde Loi de Newton", formula: "ΣF = m × a", level: Level.ONE, icon: <TrendingUp size={20} />, color: "text-red-500" },
    { name: "Énergie d'un photon", formula: "E = h × ν", level: Level.TLE, icon: <Orbit size={20} />, color: "text-violet-500" },
  ].filter(f => Object.values(Level).indexOf(f.level) <= Object.values(Level).indexOf(level));

  const trueFalseData = [
    { text: "La masse d'un objet change selon la planète où il se trouve.", answer: false, explanation: "C'est le poids qui change, la masse reste constante !", level: Level.FOUR },
    { text: "Le son peut se propager dans le vide.", answer: false, explanation: "Le son a besoin d'un milieu matériel pour voyager.", level: Level.FOUR },
    { text: "Un ion positif est un atome qui a perdu un ou plusieurs électrons.", answer: true, explanation: "Exact ! Moins d'électrons négatifs = charge globale positive.", level: Level.THREE },
    { text: "La lumière voyage plus vite que le son.", answer: true, explanation: "300 000 km/s vs 340 m/s !", level: Level.FOUR },
    { text: "Le pH d'une solution acide est supérieur à 7.", answer: false, explanation: "C'est l'inverse, il est inférieur à 7.", level: Level.THREE },
    { text: "L'énergie mécanique est la somme de l'énergie cinétique et potentielle.", answer: true, explanation: "Em = Ec + Ep.", level: Level.THREE },
  ].filter(f => Object.values(Level).indexOf(f.level) <= Object.values(Level).indexOf(level));

  const symbolsData = [
    { name: "Fer", symbol: "Fe" }, { name: "Cuivre", symbol: "Cu" }, { name: "Or", symbol: "Au" },
    { name: "Argent", symbol: "Ag" }, { name: "Carbone", symbol: "C" }, { name: "Oxygène", symbol: "O" },
    { name: "Azote", symbol: "N" }, { name: "Hydrogène", symbol: "H" }, { name: "Hélium", symbol: "He" },
    { name: "Chlore", symbol: "Cl" }, { name: "Sodium", symbol: "Na" }, { name: "Potassium", symbol: "K" }
  ];

  const unitsData = [
    { quantity: "Force", unit: "Newton (N)" }, { quantity: "Énergie", unit: "Joule (J)" },
    { quantity: "Puissance", unit: "Watt (W)" }, { quantity: "Pression", unit: "Pascal (Pa)" },
    { quantity: "Résistance", unit: "Ohm (Ω)" }, { quantity: "Tension", unit: "Volt (V)" },
    { quantity: "Intensité", unit: "Ampère (A)" }, { quantity: "Fréquence", unit: "Hertz (Hz)" }
  ];

  const startGame = (gameId: GameType) => {
    setActiveGame(gameId);
    setGameState('playing');
    setScore(0);
    setCurrentChallenge(0);
    setFeedback(null);
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (feedback?.show) return;
    
    setFeedback({ isCorrect, show: true });
    if (isCorrect) setScore(s => s + 10);

    setTimeout(() => {
      setFeedback(null);
      const dataLength = getDataLength();
      if (currentChallenge < dataLength - 1) {
        setCurrentChallenge(c => c + 1);
      } else {
        setGameState('end');
      }
    }, 1200);
  };

  const getDataLength = () => {
    switch (activeGame) {
      case 'formula': return formulaData.length;
      case 'truefalse': return trueFalseData.length;
      case 'symbols': return 6; 
      case 'units': return unitsData.length;
      default: return 0;
    }
  };

  if (gameState === 'start') {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-slate-800 mb-4 flex items-center justify-center gap-3">
            <Gamepad2 className="text-amber-500" size={32} /> Le Labo des Jeux
          </h2>
          <p className="text-slate-500">Défiez vos connaissances scientifiques avec nos mini-jeux rapides.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border-2 border-slate-100 rounded-3xl p-6 hover:border-amber-400 transition-all group shadow-sm flex flex-col h-full">
            <div className="p-4 bg-amber-50 rounded-2xl w-fit mb-4 text-amber-600 group-hover:scale-110 transition-transform">
              <Zap size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Formule Express</h3>
            <p className="text-slate-500 mb-6 flex-grow">Identifiez la bonne formule pour chaque grandeur physique.</p>
            <button onClick={() => startGame('formula')} className="w-full bg-amber-500 text-white py-3 rounded-xl font-bold hover:bg-amber-600 transition flex items-center justify-center gap-2">
              Jouer <ArrowRight size={20} />
            </button>
          </div>

          <div className="bg-white border-2 border-slate-100 rounded-3xl p-6 hover:border-indigo-400 transition-all group shadow-sm flex flex-col h-full">
            <div className="p-4 bg-indigo-50 rounded-2xl w-fit mb-4 text-indigo-600 group-hover:scale-110 transition-transform">
              <ShieldCheck size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Vrai ou Faux ?</h3>
            <p className="text-slate-500 mb-6 flex-grow">Testez vos intuitions sur les phénomènes physiques.</p>
            <button onClick={() => startGame('truefalse')} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition flex items-center justify-center gap-2">
              Jouer <ArrowRight size={20} />
            </button>
          </div>

          <div className="bg-white border-2 border-slate-100 rounded-3xl p-6 hover:border-emerald-400 transition-all group shadow-sm flex flex-col h-full">
            <div className="p-4 bg-emerald-50 rounded-2xl w-fit mb-4 text-emerald-600 group-hover:scale-110 transition-transform">
              <Beaker size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Symboles Master</h3>
            <p className="text-slate-500 mb-6 flex-grow">Saurez-vous retrouver les symboles des éléments chimiques ?</p>
            <button onClick={() => startGame('symbols')} className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition flex items-center justify-center gap-2">
              Jouer <ArrowRight size={20} />
            </button>
          </div>

          <div className="bg-white border-2 border-slate-100 rounded-3xl p-6 hover:border-rose-400 transition-all group shadow-sm flex flex-col h-full">
            <div className="p-4 bg-rose-50 rounded-2xl w-fit mb-4 text-rose-600 group-hover:scale-110 transition-transform">
              <Ruler size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">L'Unité Juste</h3>
            <p className="text-slate-500 mb-6 flex-grow">Chaque grandeur a son unité officielle. Ne vous trompez pas !</p>
            <button onClick={() => startGame('units')} className="w-full bg-rose-600 text-white py-3 rounded-xl font-bold hover:bg-rose-700 transition flex items-center justify-center gap-2">
              Jouer <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  const renderGameContent = () => {
    switch (activeGame) {
      case 'formula': {
        const current = formulaData[currentChallenge];
        const options = [current.formula];
        while(options.length < 3) {
            const random = formulaData[Math.floor(Math.random() * formulaData.length)].formula;
            if (!options.includes(random)) options.push(random);
        }
        const shuffledOptions = options.sort();
        return (
          <div className="p-8 text-center relative">
            <div className={`mx-auto w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-4 ${current.color}`}>
              {current.icon}
            </div>
            <p className="text-slate-400 text-xs mb-2 font-bold uppercase tracking-widest">Quelle est la formule de :</p>
            <h3 className="text-3xl font-black text-slate-800 mb-10">{current.name}</h3>
            <div className="grid grid-cols-1 gap-4">
              {shuffledOptions.map((opt, i) => (
                <button 
                  key={i}
                  disabled={!!feedback}
                  onClick={() => handleAnswer(opt === current.formula)}
                  className={`p-6 rounded-2xl border-2 transition-all font-mono text-xl font-bold ${
                    feedback?.show && opt === current.formula 
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-700' 
                    : feedback?.show && opt !== current.formula 
                      ? 'bg-slate-50 border-slate-100 opacity-50' 
                      : 'border-slate-100 hover:border-amber-500 hover:bg-amber-50 text-slate-700 shadow-sm'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        );
      }
      case 'truefalse': {
        const current = trueFalseData[currentChallenge];
        return (
          <div className="p-8 text-center">
            <h3 className="text-2xl font-bold text-slate-800 mb-10 leading-snug italic">"{current.text}"</h3>
            <div className="grid grid-cols-2 gap-4">
              <button 
                disabled={!!feedback}
                onClick={() => handleAnswer(current.answer === true)}
                className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${feedback?.show && current.answer === true ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'border-slate-100 hover:border-emerald-500 hover:bg-emerald-50 text-slate-700'}`}
              >
                <Check size={32} /> <span className="font-black uppercase tracking-wider">Vrai</span>
              </button>
              <button 
                disabled={!!feedback}
                onClick={() => handleAnswer(current.answer === false)}
                className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${feedback?.show && current.answer === false ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'border-slate-100 hover:border-rose-500 hover:bg-rose-50 text-slate-700'}`}
              >
                <X size={32} /> <span className="font-black uppercase tracking-wider">Faux</span>
              </button>
            </div>
            {feedback?.show && (
              <div className="mt-6 p-4 bg-slate-50 rounded-xl text-sm text-slate-600 italic animate-in fade-in slide-in-from-top-2">
                {current.explanation}
              </div>
            )}
          </div>
        );
      }
      case 'symbols': {
        const current = symbolsData[currentChallenge % symbolsData.length];
        const options = [current.symbol];
        while(options.length < 4) {
            const random = symbolsData[Math.floor(Math.random() * symbolsData.length)].symbol;
            if (!options.includes(random)) options.push(random);
        }
        const shuffledOptions = options.sort();
        return (
          <div className="p-8 text-center">
             <p className="text-slate-400 text-xs mb-2 font-bold uppercase tracking-widest">Symbole chimique de :</p>
             <h3 className="text-4xl font-black text-slate-800 mb-10 underline decoration-emerald-500 decoration-4 underline-offset-8 tracking-tight">{current.name}</h3>
             <div className="grid grid-cols-2 gap-4">
              {shuffledOptions.map((opt, i) => (
                <button 
                  key={i}
                  disabled={!!feedback}
                  onClick={() => handleAnswer(opt === current.symbol)}
                  className={`p-6 rounded-2xl border-2 transition-all text-2xl font-black ${feedback?.show && opt === current.symbol ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'border-slate-100 hover:border-emerald-500 hover:bg-emerald-50 text-slate-700 shadow-sm'}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        );
      }
      case 'units': {
        const current = unitsData[currentChallenge % unitsData.length];
        const options = [current.unit];
        while(options.length < 3) {
            const random = unitsData[Math.floor(Math.random() * unitsData.length)].unit;
            if (!options.includes(random)) options.push(random);
        }
        const shuffledOptions = options.sort();
        return (
          <div className="p-8 text-center">
             <p className="text-slate-400 text-xs mb-2 font-bold uppercase tracking-widest">Unité SI de la grandeur :</p>
             <h3 className="text-3xl font-black text-slate-800 mb-10">{current.quantity}</h3>
             <div className="grid grid-cols-1 gap-4">
              {shuffledOptions.map((opt, i) => (
                <button 
                  key={i}
                  disabled={!!feedback}
                  onClick={() => handleAnswer(opt === current.unit)}
                  className={`p-5 rounded-2xl border-2 transition-all font-bold text-lg ${feedback?.show && opt === current.unit ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'border-slate-100 hover:border-rose-500 hover:bg-rose-50 text-slate-700 shadow-sm'}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        );
      }
      default: return null;
    }
  };

  if (activeGame && gameState === 'playing') {
    const gameColor = activeGame === 'formula' ? 'amber' : activeGame === 'truefalse' ? 'indigo' : activeGame === 'symbols' ? 'emerald' : 'rose';
    
    return (
      <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden animate-in zoom-in-95 relative">
        <div className={`bg-${gameColor}-600 p-6 text-white flex justify-between items-center transition-colors`}>
          <div className="flex items-center gap-2">
            <Brain size={24} />
            <span className="font-bold uppercase tracking-tighter text-sm">{activeGame === 'formula' ? 'Formule Express' : activeGame === 'truefalse' ? 'Vrai ou Faux' : activeGame === 'symbols' ? 'Symboles Master' : 'L\'unité Juste'}</span>
          </div>
          <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold">Score: {score}</div>
        </div>
        
        {renderGameContent()}

        {feedback?.show && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-in zoom-in duration-300">
             <div className={`p-8 rounded-full shadow-2xl ${feedback.isCorrect ? 'bg-emerald-500' : 'bg-rose-500'} text-white`}>
                {feedback.isCorrect ? <Check size={80} /> : <X size={80} />}
             </div>
          </div>
        )}
      </div>
    );
  }

  if (gameState === 'end') {
    return (
      <div className="max-w-md mx-auto text-center p-12 bg-white rounded-3xl shadow-2xl border border-slate-100 animate-in zoom-in duration-300">
        <div className="w-24 h-24 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Trophy size={48} />
        </div>
        <h2 className="text-3xl font-black text-slate-800 mb-2">Terminé !</h2>
        <p className="text-slate-500 mb-8 text-lg">Votre score final au Labo : <span className="text-amber-600 font-black">{score}</span></p>
        <button 
          onClick={() => setGameState('start')}
          className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition flex items-center justify-center gap-2"
        >
          <RefreshCw size={20} /> Rejouer
        </button>
      </div>
    );
  }

  return null;
};

export default PhysicsGames;
