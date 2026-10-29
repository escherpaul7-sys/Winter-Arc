import React, { useState } from 'react';
import {
  CheckSquare,
  Flame,
  Plus,
  Trash2,
  Calendar,
  CheckCircle2,
  Circle,
  Heart,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Habit, HabitCategory } from '../../types';

export const HabitTracker: React.FC = () => {
  const { habits, toggleHabitToday, addHabit, deleteHabit } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitDesc, setNewHabitDesc] = useState('');
  const [newHabitCat, setNewHabitCat] = useState<HabitCategory>('Fitness');
  const [newHabitTarget, setNewHabitTarget] = useState('30 Min');
  const [newHabitFreq, setNewHabitFreq] = useState<'Täglich' | 'Wochentags' | 'Wochenende'>('Täglich');

  const todayStr = new Date().toISOString().split('T')[0];

  // Helper to calculate current streak for a habit
  const calculateStreak = (completedDates: string[]): number => {
    let streak = 0;
    const checkDate = new Date();

    // Check if done today or yesterday to continue streak
    const todayFormatted = checkDate.toISOString().split('T')[0];
    const isDoneToday = completedDates.includes(todayFormatted);

    if (!isDoneToday) {
      checkDate.setDate(checkDate.getDate() - 1);
    }

    while (true) {
      const formatted = checkDate.toISOString().split('T')[0];
      if (completedDates.includes(formatted)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  };

  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;

    addHabit({
      name: newHabitName.trim(),
      description: newHabitDesc.trim() || 'Tägliche Gewohnheit für deinen persönlichen Winter Arc.',
      category: newHabitCat,
      targetPerDay: newHabitTarget,
      frequency: newHabitFreq,
    });

    setNewHabitName('');
    setNewHabitDesc('');
    setShowAddModal(false);
  };

  // Generate last 14 days for the completion grid
  const pastDays: string[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    pastDays.push(d.toISOString().split('T')[0]);
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-widest text-[#66D9FF]">
            Kontinuität & Gewohnheiten
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-white mt-1">
            Habit Tracker & Streak System
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Baue schrittweise feste Routinen auf. Gesunde Kontinuität schlägt Perfektion.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#66D9FF] to-[#8B7CFF] text-slate-950 text-xs font-black hover:opacity-90 shadow-md transition-all flex items-center gap-1.5 self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Neue Gewohnheit erstellen</span>
        </button>
      </div>

      {/* Streak Protection Mindset Banner */}
      <div className="p-4 rounded-3xl frost-card border border-[#66D9FF]/30 flex items-center gap-3.5 shadow-xl">
        <div className="p-3 rounded-2xl bg-[#66D9FF]/10 text-[#66D9FF] shrink-0">
          <Heart className="w-5 h-5 text-rose-400" />
        </div>
        <div>
          <span className="text-xs font-bold text-white block">Winter Arc Grundsatz</span>
          <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
            “Ein neuer Tag ist eine neue Chance.” Auch wenn eine Streak mal unterbrochen wird: Du fängst nie bei Null an. Dein Körper und dein Geist erinnern sich an jeden investierten Schritt.
          </p>
        </div>
      </div>

      {/* Habit Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {habits.map((habit) => {
          const isDoneToday = habit.completedDates.includes(todayStr);
          const streak = calculateStreak(habit.completedDates);

          return (
            <div
              key={habit.id}
              className={`frost-card p-5 rounded-3xl border transition-all flex flex-col justify-between space-y-4 ${
                isDoneToday ? 'border-[#66D9FF]/40 bg-[#182131]/95' : 'border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-bold text-[#8B7CFF] bg-[#8B7CFF]/10 px-2 py-0.5 rounded">
                    {habit.category} • {habit.frequency}
                  </span>
                  <button
                    onClick={() => deleteHabit(habit.id)}
                    className="text-slate-500 hover:text-rose-400 p-1"
                    title="Gewohnheit entfernen"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h3 className="text-base font-bold text-white mt-2">{habit.name}</h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {habit.description}
                </p>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-2 text-xs mt-3 pt-3 border-t border-slate-800/80">
                  <div className="p-2 rounded-xl bg-[#0B0F19]/50 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Tagesziel</span>
                    <span className="font-semibold text-white">{habit.targetPerDay}</span>
                  </div>

                  <div className="p-2 rounded-xl bg-[#0B0F19]/50 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Aktive Streak</span>
                      <span className="font-bold text-[#66D9FF] flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-amber-400" /> {streak} Tage
                      </span>
                    </div>
                  </div>
                </div>

                {/* 14-day miniature heatmap bar */}
                <div className="mt-3 space-y-1">
                  <span className="text-[10px] text-slate-500 block">Verlauf letzte 14 Tage:</span>
                  <div className="flex gap-1">
                    {pastDays.map((d) => {
                      const completed = habit.completedDates.includes(d);
                      return (
                        <div
                          key={d}
                          title={`${d}: ${completed ? 'Erledigt' : 'Nicht erledigt'}`}
                          className={`flex-1 h-3 rounded-sm ${
                            completed ? 'bg-[#66D9FF]' : 'bg-slate-800'
                          }`}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Toggle Today Button */}
              <button
                onClick={() => toggleHabitToday(habit.id)}
                className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                  isDoneToday
                    ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/50 shadow-sm'
                    : 'bg-[#182131] hover:bg-[#1E293B] border border-slate-700 text-slate-200'
                }`}
              >
                {isDoneToday ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Heute erledigt ✓</span>
                  </>
                ) : (
                  <>
                    <Circle className="w-4 h-4 text-slate-500" />
                    <span>Für heute abhaken</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Add Habit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#141B2A] border border-slate-700 rounded-3xl p-6 md:p-8 space-y-5 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">Neue Gewohnheit erstellen</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateHabit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Name der Gewohnheit</label>
                <input
                  type="text"
                  value={newHabitName}
                  onChange={(e) => setNewHabitName(e.target.value)}
                  placeholder="z.B. 20 Minuten Lesen, Kalt abduschen, Spaziergang"
                  className="w-full bg-[#182131] border border-slate-700 rounded-xl px-3 py-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Beschreibung / Warum mache ich das?</label>
                <input
                  type="text"
                  value={newHabitDesc}
                  onChange={(e) => setNewHabitDesc(e.target.value)}
                  placeholder="z.B. Für geistige Klarheit und besseren Schlaf"
                  className="w-full bg-[#182131] border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Kategorie</label>
                  <select
                    value={newHabitCat}
                    onChange={(e) => setNewHabitCat(e.target.value as HabitCategory)}
                    className="w-full bg-[#182131] border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Fitness">Fitness</option>
                    <option value="Health">Gesundheit</option>
                    <option value="Mindset">Mindset</option>
                    <option value="Organization">Organisation</option>
                    <option value="Recovery">Erholung</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Tagesziel</label>
                  <input
                    type="text"
                    value={newHabitTarget}
                    onChange={(e) => setNewHabitTarget(e.target.value)}
                    placeholder="z.B. 2L, 20 Min, 10 Seiten"
                    className="w-full bg-[#182131] border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Häufigkeit</label>
                <select
                  value={newHabitFreq}
                  onChange={(e) => setNewHabitFreq(e.target.value as any)}
                  className="w-full bg-[#182131] border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  <option value="Täglich">Täglich</option>
                  <option value="Wochentags">Nur Wochentags (Mo-Fr)</option>
                  <option value="Wochenende">Nur Wochenende (Sa-So)</option>
                </select>
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
                  Gewohnheit anlegen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
