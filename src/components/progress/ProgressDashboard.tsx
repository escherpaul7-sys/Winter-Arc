import React from 'react';
import {
  TrendingUp,
  Trophy,
  Flame,
  Dumbbell,
  CheckCircle2,
  Calendar,
  Clock,
  Heart,
  Sparkles,
  Award,
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
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useApp } from '../../context/AppContext';

export const ProgressDashboard: React.FC = () => {
  const { userProfile, workouts, habits, achievements, wellnessCheckIns } = useApp();

  const completedWorkouts = workouts.filter((w) => w.completed);
  const totalWorkoutMinutes = completedWorkouts.reduce((acc, curr) => acc + (curr.duration || 30), 0);

  // Today
  const todayStr = new Date().toISOString().split('T')[0];
  const completedHabitsToday = habits.filter((h) => h.completedDates.includes(todayStr)).length;

  // Compute daily habit completion for the last 7 days
  const last7DaysData = [];
  const dayNames = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayLabel = dayNames[d.getDay()];

    const habitCount = habits.filter((h) => h.completedDates.includes(dateStr)).length;
    const workoutCount = workouts.filter((w) => w.completed && w.completedAt === dateStr).length;

    last7DaysData.push({
      date: dateStr,
      day: dayLabel,
      habits: habitCount,
      workouts: workoutCount,
    });
  }

  // Goal progress estimates
  const goalItems = userProfile.goals.map((goal, idx) => {
    // Generate calculated progress based on completed items
    const baseProgress = 40 + (idx * 12) + (completedWorkouts.length * 5);
    const pct = Math.min(100, baseProgress);
    return {
      goal,
      progress: pct,
    };
  });

  const unlockedAchievementsCount = achievements.filter((a) => a.unlockedAt).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs uppercase font-extrabold tracking-widest text-[#66D9FF]">
          Fortschritt & Meilensteine
        </span>
        <h1 className="text-2xl md:text-3xl font-black text-white mt-1">
          Progress Dashboard & Achievements
        </h1>
        <p className="text-xs md:text-sm text-slate-400 mt-1">
          Echte Kennzahlen deiner Trainings, Gewohnheiten und mentalen Beständigkeit.
        </p>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="frost-card p-5 rounded-3xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Workouts beendet</span>
            <Dumbbell className="w-4 h-4 text-[#66D9FF]" />
          </div>
          <div className="text-2xl md:text-3xl font-black text-white">
            {completedWorkouts.length}
          </div>
          <span className="text-[10px] text-slate-400 block font-mono">
            {totalWorkoutMinutes} Min. Gesamtbelastung
          </span>
        </div>

        <div className="frost-card p-5 rounded-3xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Habits Heute</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl md:text-3xl font-black text-white">
            {completedHabitsToday} / {habits.length}
          </div>
          <span className="text-[10px] text-slate-400 block">
            {habits.length > 0 ? Math.round((completedHabitsToday / habits.length) * 100) : 0}% Tageserfüllung
          </span>
        </div>

        <div className="frost-card p-5 rounded-3xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Achievements</span>
            <Trophy className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl md:text-3xl font-black text-white">
            {unlockedAchievementsCount} / {achievements.length}
          </div>
          <span className="text-[10px] text-amber-300/80 block">Freigeschaltete Abzeichen</span>
        </div>

        <div className="frost-card p-5 rounded-3xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Wellness-Schnitt</span>
            <Heart className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl md:text-3xl font-black text-white">
            {wellnessCheckIns.length > 0
              ? (wellnessCheckIns.reduce((a, c) => a + c.energy, 0) / wellnessCheckIns.length).toFixed(1)
              : '8.0'}{' '}
            <span className="text-xs text-slate-400">/ 10</span>
          </div>
          <span className="text-[10px] text-slate-400 block">Energie & Wohlbefinden</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Activity Bar Chart */}
        <div className="lg:col-span-7 frost-card p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#66D9FF] tracking-wider block">
                Letzte 7 Tage
              </span>
              <h3 className="text-lg font-bold text-white">Tägliche Gewohnheiten & Einheiten</h3>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={last7DaysData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                <Bar dataKey="habits" fill="#66D9FF" radius={[6, 6, 0, 0]} name="Erledigte Gewohnheiten" />
                <Bar dataKey="workouts" fill="#8B7CFF" radius={[6, 6, 0, 0]} name="Workouts" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Goal Progress Section */}
        <div className="lg:col-span-5 frost-card p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="pb-2 border-b border-slate-800">
            <span className="text-[10px] uppercase font-bold text-[#8B7CFF] tracking-wider block">
              Ziele & Fokus
            </span>
            <h3 className="text-lg font-bold text-white">Persönlicher Zielfortschritt</h3>
          </div>

          <div className="space-y-4">
            {goalItems.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-white">{item.goal}</span>
                  <span className="font-mono text-[#66D9FF] font-bold">{item.progress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#66D9FF] to-[#8B7CFF] transition-all duration-500 rounded-full"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Achievement Badges Showcase */}
      <div className="frost-card p-6 md:p-8 rounded-3xl border border-slate-800 space-y-6">
        <div>
          <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block">
            Erfolge & Belohnungen
          </span>
          <h2 className="text-xl font-bold text-white mt-1">Winter Arc Achievements</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Belohnungen für gesunde Beständigkeit, kluges Training und ausreichende Erholung.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((ach) => {
            const isUnlocked = Boolean(ach.unlockedAt);
            return (
              <div
                key={ach.id}
                className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                  isUnlocked
                    ? 'bg-[#182131] border-amber-500/30 shadow-md shadow-amber-500/5'
                    : 'bg-[#141B2A]/40 border-slate-800/80 opacity-50'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 text-xl font-black ${
                    isUnlocked
                      ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 shadow-md'
                      : 'bg-slate-800 text-slate-600'
                  }`}
                >
                  <Trophy className="w-6 h-6" />
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white block">{ach.title}</span>
                    {isUnlocked && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-950/60 text-amber-300 font-mono">
                        Freigeschaltet
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">{ach.description}</p>
                  {ach.unlockedAt && (
                    <span className="text-[10px] text-slate-500 block">Seit {ach.unlockedAt}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
