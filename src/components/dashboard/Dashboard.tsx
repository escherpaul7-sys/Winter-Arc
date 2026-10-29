import React from 'react';
import {
  Sparkles,
  Flame,
  Dumbbell,
  Calendar,
  CheckCircle2,
  Circle,
  Play,
  ArrowRight,
  TrendingUp,
  Clock,
  Heart,
  Plus,
  Utensils,
  Moon,
  ChevronRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
} from 'recharts';
import { useApp } from '../../context/AppContext';

export const Dashboard: React.FC = () => {
  const {
    userProfile,
    workouts,
    habits,
    schedule,
    startWorkoutExecution,
    toggleHabitToday,
    toggleScheduleEvent,
    setActiveTab,
  } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];
  const currentDayName = new Date().toLocaleDateString('de-DE', { weekday: 'long' });

  // Habits calculations
  const totalHabits = habits.length;
  const completedHabitsToday = habits.filter((h) => h.completedDates.includes(todayStr)).length;
  const habitCompletionRate = totalHabits > 0 ? Math.round((completedHabitsToday / totalHabits) * 100) : 0;

  // Workouts calculations
  const completedWorkoutsCount = workouts.filter((w) => w.completed).length;
  const todayWorkout = workouts.find((w) => !w.completed) || workouts[0];

  // Winter Arc date progress calculation
  const startDate = new Date(userProfile.startDate || '2026-10-01');
  const endDate = new Date(userProfile.targetEndDate || '2027-01-01');
  const now = new Date();
  const totalDays = Math.max(1, Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
  const daysPassed = Math.max(0, Math.min(totalDays, Math.round((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))));
  const currentWeek = Math.min(12, Math.floor(daysPassed / 7) + 1);

  // Overall holistic progress score (combining habits, completed workouts, and days)
  const arcProgressPercent = Math.min(100, Math.round(((daysPassed / totalDays) * 0.4 + (habitCompletionRate / 100) * 0.3 + (Math.min(completedWorkoutsCount, 20) / 20) * 0.3) * 100));

  // Today's focus items (filtered from schedule for today or top priorities)
  const todayScheduleItems = schedule.filter(
    (s) => s.day === currentDayName || s.day === 'Montag'
  );

  // Weekly data for chart
  const weeklyData = [
    { day: 'Mo', habits: 4, workouts: 1, activeMins: 55 },
    { day: 'Di', habits: 5, workouts: 0, activeMins: 45 },
    { day: 'Mi', habits: 3, workouts: 1, activeMins: 40 },
    { day: 'Do', habits: 5, workouts: 0, activeMins: 60 },
    { day: 'Fr', habits: 4, workouts: 1, activeMins: 45 },
    { day: 'Sa', habits: 5, workouts: 0, activeMins: 30 },
    { day: 'So', habits: completedHabitsToday, workouts: todayWorkout?.completed ? 1 : 0, activeMins: 40 },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Winter Arc Big Banner Card */}
      <div className="relative frost-card rounded-3xl p-6 md:p-8 border border-[#66D9FF]/20 shadow-2xl overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute -top-16 -right-16 w-80 h-80 bg-gradient-to-br from-[#66D9FF]/15 to-[#8B7CFF]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left Text & Stats */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#66D9FF]/10 text-[#66D9FF] text-xs font-bold border border-[#66D9FF]/30 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5" /> Woche {currentWeek} des Winter Arc
              </span>
              <span className="text-xs text-slate-400">
                {userProfile.startDate} bis {userProfile.targetEndDate}
              </span>
            </div>

            <div>
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                Your Winter Arc Dashboard
              </h1>
              <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
                Konsequente Gewohnheiten, ausgewogene Ernährung und smarte Erholung formen deinen Fortschritt.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-[#0B0F19]/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 font-semibold block">Habits Heute</span>
                <span className="text-xl font-black text-white">
                  {completedHabitsToday} <span className="text-xs text-slate-400">/ {totalHabits}</span>
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#0B0F19]/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 font-semibold block">Workouts absolviert</span>
                <span className="text-xl font-black text-[#66D9FF]">{completedWorkoutsCount}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#0B0F19]/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 font-semibold block">Tag im Arc</span>
                <span className="text-xl font-black text-[#8B7CFF]">
                  Tag {daysPassed} <span className="text-xs text-slate-400">/ {totalDays}</span>
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#0B0F19]/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 font-semibold block">Schlafziel</span>
                <span className="text-xl font-black text-white font-mono text-sm sm:text-base mt-1 block">
                  {userProfile.sleepTime || '22:30'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Progress Circle */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center p-4">
            <div className="relative w-44 h-44 flex items-center justify-center">
              {/* Circular SVG Progress */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#1E293B"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="url(#arcGradient)"
                  strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - arcProgressPercent / 100)}`}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#66D9FF" />
                    <stop offset="100%" stopColor="#8B7CFF" />
                  </linearGradient>
                </defs>
              </svg>

              <div className="absolute flex flex-col items-center text-center">
                <span className="text-3xl font-black text-white tracking-tight">{arcProgressPercent}%</span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  Arc Fortschritt
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Today's Workout + Focus Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Today's Workout Card */}
        <div className="lg:col-span-6 frost-card p-6 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-[#66D9FF]/10 text-[#66D9FF]">
                <Dumbbell className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-[#66D9FF] font-bold uppercase tracking-wider block">
                  Geplante Einheit
                </span>
                <h3 className="text-lg font-bold text-white">Today's Workout</h3>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('workouts')}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <span>Alle Workouts</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {todayWorkout ? (
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#8B7CFF]/20 text-[#8B7CFF]">
                    {todayWorkout.category}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    ⏱ {todayWorkout.duration} Minuten
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    ⚡️ {todayWorkout.intensity}
                  </span>
                </div>
                <h4 className="text-xl font-black text-white">{todayWorkout.name}</h4>
                <p className="text-xs text-slate-400 mt-1">{todayWorkout.goal}</p>
              </div>

              {/* Exercises summary preview */}
              <div className="space-y-1.5 bg-[#0B0F19]/50 p-3.5 rounded-2xl border border-slate-800 text-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                  Übungsübersicht ({todayWorkout.exercises.length} Übungen)
                </span>
                {todayWorkout.exercises.slice(0, 3).map((ex, i) => (
                  <div key={i} className="flex justify-between items-center text-slate-300">
                    <span className="truncate">{i + 1}. {ex.name}</span>
                    <span className="text-slate-400 text-[11px] font-mono shrink-0">{ex.sets} × {ex.reps}</span>
                  </div>
                ))}
                {todayWorkout.exercises.length > 3 && (
                  <span className="text-[11px] text-[#66D9FF] block pt-1">
                    + {todayWorkout.exercises.length - 3} weitere Übungen
                  </span>
                )}
              </div>

              <div className="pt-2">
                <button
                  onClick={() => startWorkoutExecution(todayWorkout)}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#66D9FF] to-[#8B7CFF] text-slate-950 font-black text-xs md:text-sm hover:opacity-95 shadow-lg shadow-[#66D9FF]/20 transition-all flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>Workout mit Timer starten</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 space-y-3">
              <p className="text-sm text-slate-300">Heute ist kein Workout geplant. Ruhetag oder Regeneration?</p>
              <button
                onClick={() => setActiveTab('workouts')}
                className="px-5 py-2.5 rounded-xl bg-slate-800 text-xs font-bold text-[#66D9FF] hover:bg-slate-700"
              >
                Workout erstellen
              </button>
            </div>
          )}
        </div>

        {/* Today's Focus Checklist */}
        <div className="lg:col-span-6 frost-card p-6 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-[#8B7CFF]/10 text-[#8B7CFF]">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-[#8B7CFF] font-bold uppercase tracking-wider block">
                  Tagesstruktur
                </span>
                <h3 className="text-lg font-bold text-white">Today’s Focus</h3>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('schedule')}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <span>Tagesplan öffnen</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2.5 flex-1 overflow-y-auto max-h-72 pr-1">
            {todayScheduleItems.length > 0 ? (
              todayScheduleItems.map((event) => (
                <div
                  key={event.id}
                  onClick={() => toggleScheduleEvent(event.id)}
                  className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                    event.completed
                      ? 'bg-emerald-950/20 border-emerald-800/40 opacity-70'
                      : 'bg-[#182131] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {event.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-500 shrink-0" />
                    )}
                    <div>
                      <span
                        className={`text-xs font-bold block ${
                          event.completed ? 'line-through text-slate-400' : 'text-white'
                        }`}
                      >
                        {event.title}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {event.start} - {event.end} Uhr • {event.category}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[9px] px-2 py-0.5 rounded-full font-semibold ${
                      event.completed
                        ? 'bg-emerald-900/50 text-emerald-300'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {event.completed ? 'Erledigt' : 'Geplant'}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 text-center py-6">
                Keine Termine für heute hinterlegt.
              </p>
            )}
          </div>

          <div className="pt-2 text-xs text-slate-400 flex items-center justify-between border-t border-slate-800/80">
            <span>Klicke auf Termine, um sie als erledigt zu markieren.</span>
            <button
              onClick={() => setActiveTab('schedule')}
              className="text-[#66D9FF] hover:underline font-medium"
            >
              + Neuer Termin
            </button>
          </div>
        </div>
      </div>

      {/* 3. Habit Overview & Weekly Progress Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Habit Quick Overview */}
        <div className="lg:col-span-5 frost-card p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#66D9FF] tracking-wider block">
                Gewohnheiten
              </span>
              <h3 className="text-lg font-bold text-white">Habit Check-In</h3>
            </div>
            <button
              onClick={() => setActiveTab('habits')}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
            >
              <span>Alle Habits</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2">
            {habits.map((habit) => {
              const done = habit.completedDates.includes(todayStr);
              return (
                <div
                  key={habit.id}
                  onClick={() => toggleHabitToday(habit.id)}
                  className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                    done
                      ? 'bg-[#182131] border-[#66D9FF]/40 text-white shadow-sm'
                      : 'bg-[#141B2A] border-slate-800/80 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {done ? (
                      <CheckCircle2 className="w-4 h-4 text-[#66D9FF] shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-600 shrink-0" />
                    )}
                    <div>
                      <span className="text-xs font-semibold block">{habit.name}</span>
                      <span className="text-[10px] text-slate-400">Ziel: {habit.targetPerDay}</span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      done ? 'bg-[#66D9FF]/20 text-[#66D9FF]' : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {done ? 'Erledigt' : 'Offen'}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/40 border border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-400 shrink-0" />
            <span>Kontinuität vor Perfektion. Jeder Tag zählt für deinen Winter Arc!</span>
          </div>
        </div>

        {/* Weekly Progress Diagram */}
        <div className="lg:col-span-7 frost-card p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#8B7CFF] tracking-wider block">
                Aktivität
              </span>
              <h3 className="text-lg font-bold text-white">Weekly Performance</h3>
            </div>
            <button
              onClick={() => setActiveTab('progress')}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
            >
              <span>Vollständige Statistiken</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Recharts chart */}
          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="day" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#182131',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#FFF',
                    fontSize: '11px',
                  }}
                />
                <Bar dataKey="habits" fill="#66D9FF" radius={[6, 6, 0, 0]} name="Erledigte Habits" />
                <Bar dataKey="workouts" fill="#8B7CFF" radius={[6, 6, 0, 0]} name="Workouts" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-around text-xs text-slate-400 pt-2 border-t border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#66D9FF]" />
              <span>Erledigte Habits</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#8B7CFF]" />
              <span>Trainingssessions</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. AI Coach Banner & Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* AI Coach Card */}
        <div className="md:col-span-7 frost-card p-6 rounded-3xl border border-[#66D9FF]/20 flex flex-col justify-between space-y-4 shadow-xl">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#66D9FF] to-[#8B7CFF] flex items-center justify-center text-slate-950 font-black shadow-lg shadow-[#66D9FF]/20 shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#66D9FF] uppercase tracking-wider block">
                Persönlicher Coach
              </span>
              <h3 className="text-xl font-black text-white">Your personal coach is ready.</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Brauchst du Anpassungen an deinem Trainingsvolumen, Ernährungsratschläge für kalte Tage oder Motivation für den Abend?
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <button
              onClick={() => setActiveTab('coach')}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#66D9FF] to-[#8B7CFF] text-slate-950 text-xs font-black hover:opacity-90 shadow-md shadow-[#66D9FF]/15 transition-all flex items-center justify-center gap-2"
            >
              <span>Mit AI Coach sprechen</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('recovery')}
              className="px-4 py-3 rounded-xl bg-[#182131] hover:bg-[#1E293B] border border-slate-700 text-slate-300 text-xs font-semibold transition-all flex items-center justify-center gap-2"
            >
              <Moon className="w-4 h-4 text-[#8B7CFF]" />
              <span>Erholungs-Check-In</span>
            </button>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="md:col-span-5 frost-card p-6 rounded-3xl border border-slate-800 space-y-3 shadow-xl">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
            Schnellaktionen
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => setActiveTab('workouts')}
              className="p-3 rounded-2xl bg-[#182131] hover:bg-[#1E293B] border border-slate-800 text-left transition-all group"
            >
              <Dumbbell className="w-4 h-4 text-[#66D9FF] mb-1 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-white block">Workout erstellen</span>
              <span className="text-[10px] text-slate-400">Generator öffnen</span>
            </button>

            <button
              onClick={() => setActiveTab('nutrition')}
              className="p-3 rounded-2xl bg-[#182131] hover:bg-[#1E293B] border border-slate-800 text-left transition-all group"
            >
              <Utensils className="w-4 h-4 text-[#8B7CFF] mb-1 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-white block">Ernährung planen</span>
              <span className="text-[10px] text-slate-400">Rezepte & Einkäufe</span>
            </button>

            <button
              onClick={() => setActiveTab('habits')}
              className="p-3 rounded-2xl bg-[#182131] hover:bg-[#1E293B] border border-slate-800 text-left transition-all group"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mb-1 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-white block">Habit anlegen</span>
              <span className="text-[10px] text-slate-400">Gewohnheit tracken</span>
            </button>

            <button
              onClick={() => setActiveTab('challenges')}
              className="p-3 rounded-2xl bg-[#182131] hover:bg-[#1E293B] border border-slate-800 text-left transition-all group"
            >
              <Flame className="w-4 h-4 text-amber-400 mb-1 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-white block">Winter Challenge</span>
              <span className="text-[10px] text-slate-400">14-Tage Routine</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
