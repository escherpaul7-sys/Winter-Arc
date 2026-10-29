import React, { useState } from 'react';
import {
  Trophy,
  Flame,
  CheckCircle2,
  Circle,
  Plus,
  ShieldAlert,
  Calendar,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Challenge, ChallengeCategory } from '../../types';

export const ChallengeSystem: React.FC = () => {
  const { challenges, toggleChallengeTask, addChallenge } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [newChallengeName, setNewChallengeName] = useState('');
  const [newChallengeDesc, setNewChallengeDesc] = useState('');
  const [newChallengeCat, setNewChallengeCat] = useState<ChallengeCategory>('Fitness');
  const [newChallengeDuration, setNewChallengeDuration] = useState<number>(14);
  const [newTasksText, setNewTasksText] = useState('Wasser am Morgen, 10 Liegestütze, 20 Min Spaziergang');

  const handleCreateChallenge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChallengeName.trim()) return;

    const taskItems = newTasksText
      .split(',')
      .map((t, idx) => ({ id: `ct-${Date.now()}-${idx}`, title: t.trim(), completed: false }))
      .filter((t) => t.title.length > 0);

    addChallenge({
      name: newChallengeName.trim(),
      description: newChallengeDesc.trim() || 'Winter Arc Challenge für gezielten Fokus.',
      category: newChallengeCat,
      durationDays: newChallengeDuration,
      startDate: new Date().toISOString().split('T')[0],
      tasks: taskItems.length > 0 ? taskItems : [{ id: 'ct-1', title: 'Täglich durchziehen', completed: false }],
    });

    setNewChallengeName('');
    setNewChallengeDesc('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-widest text-[#66D9FF]">
            Motivation & Disziplin
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-white mt-1">
            Winter Arc Challenge System
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Strukturiere deinen Winter in kompakte 7-, 14- oder 30-Tage Challenges für nachhaltige Gewohnheiten.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#66D9FF] to-[#8B7CFF] text-slate-950 text-xs font-black hover:opacity-90 shadow-md transition-all flex items-center gap-1.5 self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Eigene Challenge erstellen</span>
        </button>
      </div>

      {/* Safety Notice */}
      <div className="p-4 rounded-3xl frost-card border border-slate-800 flex items-start gap-3 text-xs text-slate-400">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Sicherheit & Nachhaltigkeit:</strong> Winter Arc Challenges sind motivierend und aufbauend. Sie enthalten niemals Schlafentzug, extreme Hungerphasen oder Aufforderungen, Schmerzen zu ignorieren.
        </p>
      </div>

      {/* Challenges List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {challenges.map((challenge) => {
          const totalTasks = challenge.tasks.length;
          const completedTasks = challenge.tasks.filter((t) => t.completed).length;
          const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

          return (
            <div
              key={challenge.id}
              className={`frost-card p-6 rounded-3xl border transition-all flex flex-col justify-between space-y-5 ${
                challenge.completed ? 'border-emerald-600/40 bg-[#142328]' : 'border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-[#66D9FF] bg-[#66D9FF]/10 px-2 py-0.5 rounded">
                    {challenge.category} • {challenge.durationDays} Tage
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Start: {challenge.startDate}
                  </span>
                </div>

                <h3 className="text-lg font-black text-white">{challenge.name}</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {challenge.description}
                </p>

                {/* Progress bar */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-medium">Fortschritt</span>
                    <span className="font-mono text-[#66D9FF] font-bold">
                      {completedTasks} / {totalTasks} ({progressPercent}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#66D9FF] to-[#8B7CFF] rounded-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Task Checklist */}
                <div className="mt-4 space-y-2 pt-3 border-t border-slate-800/80">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                    Meilenstein-Aufgaben
                  </span>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {challenge.tasks.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => toggleChallengeTask(challenge.id, task.id)}
                        className={`p-2.5 rounded-xl border text-xs cursor-pointer flex items-center gap-2.5 transition-all ${
                          task.completed
                            ? 'bg-emerald-950/20 border-emerald-800/40 opacity-75'
                            : 'bg-[#182131] border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {task.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-500 shrink-0" />
                        )}
                        <span
                          className={`truncate ${
                            task.completed ? 'line-through text-slate-400' : 'text-slate-200'
                          }`}
                        >
                          {task.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {challenge.completed && (
                <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs font-bold text-center flex items-center justify-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>Challenge gemeistert! 🏆</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Challenge Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#141B2A] border border-slate-700 rounded-3xl p-6 md:p-8 space-y-5 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">Eigene Challenge anlegen</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateChallenge} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Name der Challenge</label>
                <input
                  type="text"
                  value={newChallengeName}
                  onChange={(e) => setNewChallengeName(e.target.value)}
                  placeholder="z.B. 14 Tage Mobility & Water Focus"
                  className="w-full bg-[#182131] border border-slate-700 rounded-xl px-3 py-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Beschreibung</label>
                <input
                  type="text"
                  value={newChallengeDesc}
                  onChange={(e) => setNewChallengeDesc(e.target.value)}
                  placeholder="z.B. Tägliche Dehnübung und 2.5L Wasser trinken"
                  className="w-full bg-[#182131] border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Kategorie</label>
                  <select
                    value={newChallengeCat}
                    onChange={(e) => setNewChallengeCat(e.target.value as ChallengeCategory)}
                    className="w-full bg-[#182131] border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Fitness">Fitness</option>
                    <option value="Lifestyle">Lifestyle</option>
                    <option value="Learning">Lernen & Fokus</option>
                    <option value="Recovery">Erholung & Schlaf</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Dauer (Tage)</label>
                  <select
                    value={newChallengeDuration}
                    onChange={(e) => setNewChallengeDuration(parseInt(e.target.value, 10))}
                    className="w-full bg-[#182131] border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value={7}>7 Tage</option>
                    <option value={14}>14 Tage</option>
                    <option value={30}>30 Tage</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  Aufgaben (durch Komma getrennt)
                </label>
                <textarea
                  value={newTasksText}
                  onChange={(e) => setNewTasksText(e.target.value)}
                  placeholder="Aufgabe 1, Aufgabe 2, Aufgabe 3"
                  rows={3}
                  className="w-full bg-[#182131] border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#66D9FF] to-[#8B7CFF] text-slate-950 font-black"
                >
                  Challenge starten
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
