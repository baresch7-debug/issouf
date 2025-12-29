
import React, { useState } from 'react';
import { Level } from '../types';
import { geminiService } from '../services/geminiService';
import { Sparkles, Send, Loader2, BrainCircuit } from 'lucide-react';

interface AIExplainerProps {
  level: Level;
}

const AIExplainer: React.FC<AIExplainerProps> = ({ level }) => {
  const [query, setQuery] = useState('');
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await geminiService.explainConcept(query, level);
      setExplanation(res);
    } catch (error) {
      setExplanation("Une erreur est survenue lors de la recherche de l'explication.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full font-bold text-sm mb-4">
          <Sparkles size={16} /> Propulsé par Gemini 3.0
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-4">Besoin d'un coup de pouce ?</h2>
        <p className="text-slate-500 max-w-xl mx-auto">Posez n'importe quelle question sur la physique et notre assistant IA vous expliquera le concept avec des mots simples adaptés à votre niveau ({level}).</p>
      </div>

      <form onSubmit={handleSubmit} className="mb-12 relative group">
        <input 
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ex: Pourquoi le ciel est bleu ? Comment fonctionne la poussée d'Archimède ?"
          className="w-full bg-white border-2 border-slate-200 focus:border-indigo-600 rounded-3xl px-8 py-5 pr-20 shadow-xl shadow-slate-200 outline-none transition-all placeholder:text-slate-400 text-lg font-medium"
        />
        <button 
          type="submit"
          disabled={loading || !query.trim()}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-indigo-600 text-white p-3 rounded-2xl hover:bg-indigo-700 transition disabled:bg-slate-200"
        >
          {loading ? <Loader2 className="animate-spin" size={24} /> : <Send size={24} />}
        </button>
      </form>

      {explanation && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-in zoom-in-95 duration-500">
          <div className="bg-slate-50 border-b border-slate-100 px-8 py-4 flex items-center gap-3">
             <BrainCircuit className="text-indigo-600" size={24} />
             <h3 className="font-bold text-slate-700">Explication personnalisée</h3>
          </div>
          <div className="p-8 md:p-10 whitespace-pre-wrap text-slate-700 leading-relaxed text-lg">
             {explanation}
          </div>
          <div className="bg-indigo-600 p-4 text-center text-indigo-100 text-xs font-medium uppercase tracking-widest">
            July Physic tools • Aide à la compréhension instantanée
          </div>
        </div>
      )}

      {!explanation && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "Qu'est-ce que l'entropie ?",
            "Explique la relativité restreinte.",
            "Comment fonctionne un laser ?",
            "C'est quoi un photon ?"
          ].map((suggestion, idx) => (
            <button 
              key={idx}
              onClick={() => { setQuery(suggestion); }}
              className="text-left p-4 bg-white border border-slate-100 rounded-2xl hover:border-indigo-200 hover:bg-indigo-50 transition text-slate-600 font-medium flex items-center justify-between group shadow-sm"
            >
              {suggestion}
              <Sparkles size={16} className="text-slate-300 group-hover:text-indigo-400 transition" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AIExplainer;
