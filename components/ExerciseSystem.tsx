
import React, { useState, useEffect } from 'react';
import { Topic, Level, Question } from '../types';
import { geminiService } from '../services/geminiService';
import { Loader2, CheckCircle2, XCircle, AlertCircle, RefreshCw } from 'lucide-react';

interface ExerciseSystemProps {
  topic: Topic;
  level: Level;
}

const ExerciseSystem: React.FC<ExerciseSystemProps> = ({ topic, level }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [finished, setFinished] = useState<boolean>(false);

  const fetchExercises = async () => {
    setLoading(true);
    setFinished(false);
    setScore(0);
    setCurrentIdx(0);
    try {
      const data = await geminiService.generateExercises(topic.title, level);
      setQuestions(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, [topic, level]);

  const handleSelect = (idx: number) => {
    if (showExplanation) return;
    setSelectedOption(idx);
  };

  const handleValidate = () => {
    if (selectedOption === null) return;
    if (selectedOption === questions[currentIdx].correctAnswer) {
      setScore(s => s + 1);
    }
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(c => c + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setFinished(true);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
        <p className="text-slate-500 font-medium">L'IA génère vos exercices personnalisés...</p>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center animate-in zoom-in duration-300">
        <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={40} />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Terminé !</h2>
        <p className="text-slate-500 mb-8">Vous avez obtenu un score de <span className="font-bold text-indigo-600">{score} / {questions.length}</span></p>
        <div className="flex justify-center gap-4">
          <button 
            onClick={fetchExercises}
            className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition"
          >
            <RefreshCw size={20} /> Recommencer
          </button>
        </div>
      </div>
    );
  }

  const current = questions[currentIdx];

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in duration-500">
      <div className="mb-8 flex justify-between items-center px-4">
        <span className="text-sm font-bold text-indigo-600 uppercase tracking-widest">Question {currentIdx + 1} sur {questions.length}</span>
        <div className="h-2 w-48 bg-slate-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-600 transition-all duration-300" 
            style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 md:p-10 mb-6">
        <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-8">{current.question}</h3>
        
        <div className="space-y-4">
          {current.options.map((opt, i) => {
            let stateClass = "border-slate-200 hover:border-indigo-300 hover:bg-slate-50";
            if (showExplanation) {
               if (i === current.correctAnswer) stateClass = "border-green-500 bg-green-50 text-green-700 ring-2 ring-green-100";
               else if (i === selectedOption) stateClass = "border-red-500 bg-red-50 text-red-700";
               else stateClass = "opacity-50 border-slate-100";
            } else if (selectedOption === i) {
               stateClass = "border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-100";
            }

            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                disabled={showExplanation}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between group ${stateClass}`}
              >
                <span className="font-medium">{opt}</span>
                {showExplanation && i === current.correctAnswer && (
                  <CheckCircle2 className="text-green-500 animate-pop fill-green-50" size={24} />
                )}
                {showExplanation && i === selectedOption && i !== current.correctAnswer && (
                  <XCircle className="text-red-500 animate-pop fill-red-50" size={24} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {showExplanation ? (
        <div className="animate-in slide-in-from-top-4 duration-300">
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 mb-6">
            <h4 className="flex items-center gap-2 font-bold text-indigo-900 mb-2">
              <AlertCircle size={20} /> Explication de l'expert
            </h4>
            <p className="text-indigo-800 text-sm leading-relaxed">{current.explanation}</p>
          </div>
          <button 
            onClick={handleNext}
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100"
          >
            Question suivante
          </button>
        </div>
      ) : (
        <button 
          onClick={handleValidate}
          disabled={selectedOption === null}
          className={`w-full py-4 rounded-2xl font-bold transition shadow-lg ${selectedOption === null ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100'}`}
        >
          Valider ma réponse
        </button>
      )}
    </div>
  );
};

export default ExerciseSystem;
