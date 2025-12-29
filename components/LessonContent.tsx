
import React, { useState, useEffect } from 'react';
import { Topic, Level } from '../types';
import { geminiService } from '../services/geminiService';
import { Loader2, FileText, Share2, Printer } from 'lucide-react';

interface LessonContentProps {
  topic: Topic;
  level: Level;
}

const LessonContent: React.FC<LessonContentProps> = ({ topic, level }) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchLesson = async () => {
      setLoading(true);
      try {
        const lessonContent = await geminiService.generateLesson(topic.title, level);
        setContent(lessonContent);
      } catch (error) {
        setContent("Impossible de charger le cours pour le moment.");
      } finally {
        setLoading(false);
      }
    };
    fetchLesson();
  }, [topic, level]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
        <p className="text-slate-500 font-medium animate-pulse">L'IA prépare votre cours sur mesure...</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-700">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-8">
        <div className="bg-slate-50 border-b border-slate-200 px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-100 rounded-2xl text-indigo-600">
              <FileText size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">{topic.title}</h2>
              <p className="text-slate-500 text-sm">Niveau {level} • July Physic Tutor</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="p-2 text-slate-400 hover:text-indigo-600 transition" title="Partager"><Share2 size={20} /></button>
            <button className="p-2 text-slate-400 hover:text-indigo-600 transition" title="Imprimer"><Printer size={20} /></button>
          </div>
        </div>
        
        <div className="p-8 md:p-12 prose prose-indigo max-w-none">
          {/* We format the markdown-like content simply for this prototype */}
          <div className="whitespace-pre-wrap text-slate-700 leading-relaxed font-light space-y-4">
             {content.split('\n').map((line, i) => {
               if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-bold text-slate-900 mt-8 mb-4 border-b pb-2">{line.replace('# ', '')}</h1>;
               if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-bold text-slate-800 mt-8 mb-4">{line.replace('## ', '')}</h2>;
               if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-bold text-slate-700 mt-6 mb-3">{line.replace('### ', '')}</h3>;
               if (line.startsWith('**')) return <p key={i} className="font-semibold text-indigo-700">{line.replace(/\*\*/g, '')}</p>;
               if (line.trim() === '') return <div key={i} className="h-2"></div>;
               return <p key={i}>{line}</p>;
             })}
          </div>
        </div>
      </div>
      
      <div className="bg-indigo-50 rounded-2xl p-6 flex items-center justify-between border border-indigo-100">
        <div>
          <h4 className="font-bold text-indigo-900 mb-1">Prêt pour l'étape suivante ?</h4>
          <p className="text-indigo-700 text-sm">Testez vos connaissances avec les exercices sur ce module.</p>
        </div>
        <button className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">
          Commencer les exercices
        </button>
      </div>
    </div>
  );
};

export default LessonContent;
