import React, { useState } from 'react';
import {
  Moon,
  Heart,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Sliders,
  ShieldCheck,
  ChevronRight,
  Flame,
  BatteryCharging,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { WellnessCheckIn } from '../../types';

export const RecoveryWellness: React.FC = () => {
  const { wellnessCheckIns, addWellnessCheckIn, userProfile } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];
  const todayCheckIn = wellnessCheckIns.find((c) => c.date === todayStr);

  // Check-In Form State
  const [energy, setEnergy] = useState(todayCheckIn ? todayCheckIn.energy : 8);
  const [sleepQuality, setSleepQuality] = useState(todayCheckIn ? todayCheckIn.sleepQuality : 8);
  const [soreness, setSoreness] = useState(todayCheckIn ? todayCheckIn.soreness : 3);
  const [stress, setStress] = useState(todayCheckIn ? todayCheckIn.stress : 3);
  const [notes, setNotes] = useState(todayCheckIn ? todayCheckIn.notes || '' : '');
  const [checkInSaved, setCheckInSaved] = useState(Boolean(todayCheckIn));

  // Mobility Flow Player State
  const [activeRoutine, setActiveRoutine] = useState<number | null>(null);
  const [flowSecondsLeft, setFlowSecondsLeft] = useState(30);
  const [isFlowPlaying, setIsFlowPlaying] = useState(false);

  const mobilityRoutines = [
    {
      id: 1,
      title: 'Morgen-Wirbelsäulen-Aktivierung',
      duration: '5 Min',
      benefit: 'Weckt den Körper auf und löst Steifheit nach dem Aufstehen.',
      exercises: ['Cat-Cow (1 Min)', 'World’s Greatest Stretch (2 Min)', 'Arm- und Brustöffner (2 Min)'],
    },
    {
      id: 2,
      title: 'Hüft- & Beinentlastung (Post-Sport)',
      duration: '8 Min',
      benefit: 'Ideal nach Laufen, Basketball oder Beintraining zur Gelenksentlastung.',
      exercises: ['Pigeon Pose (2 Min)', 'Ausfallschritt-Hüftdehnung (3 Min)', 'Wadendehnung an der Wand (3 Min)'],
    },
    {
      id: 3,
      title: 'Desk-Worker Haltungs-Reset',
      duration: '6 Min',
      benefit: 'Befreit Nacken und Schultern von sitzenden Tätigkeiten und Schule.',
      exercises: ['Doorway Chest Stretch (2 Min)', 'Prone Y-T-W Heben (2 Min)', 'Nackendehnung sanft (2 Min)'],
    },
    {
      id: 4,
      title: 'Abendliche Deep Sleep Entspannung',
      duration: '7 Min',
      benefit: 'Aktiviert das parasympathische Nervensystem für tieferen Schlaf.',
      exercises: ['Kindeshaltung mit Zwerchfellatmung (3 Min)', 'Liegender Wirbelsäulen-Twist (2 Min)', 'Beine an der Wand hochlagern (2 Min)'],
    },
  ];

  const handleSaveCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    const newCheckIn: WellnessCheckIn = {
      date: todayStr,
      energy,
      sleepQuality,
      soreness,
      stress,
      notes: notes.trim(),
    };
    addWellnessCheckIn(newCheckIn);
    setCheckInSaved(true);
  };

  // Mobility timer ticker
  React.useEffect(() => {
    if (!isFlowPlaying || activeRoutine === null) return;
    if (flowSecondsLeft <= 0) {
      setIsFlowPlaying(false);
      return;
    }
    const t = setInterval(() => {
      setFlowSecondsLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(t);
  }, [isFlowPlaying, flowSecondsLeft, activeRoutine]);

  const startRoutine = (index: number) => {
    setActiveRoutine(index);
    setFlowSecondsLeft(60);
    setIsFlowPlaying(true);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs uppercase font-extrabold tracking-widest text-[#66D9FF]">
          Regeneration & Schlaf
        </span>
        <h1 className="text-2xl md:text-3xl font-black text-white mt-1">
          Recovery & Wellness Hub
        </h1>
        <p className="text-xs md:text-sm text-slate-400 mt-1">
          Ruhetage sind Wachstumstage. Pflege Schlafqualität, Mobilität und Entspannung im Winter.
        </p>
      </div>

      {/* Rest Day Affirmation Card */}
      <div className="p-6 rounded-3xl frost-card border border-indigo-800/40 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300 shrink-0">
              <Moon className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-indigo-300 tracking-wider block">
                Philosophie
              </span>
              <h2 className="text-xl font-bold text-white">Ein Ruhetag ist kein verlorener Tag.</h2>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                Deine Muskeln regenerieren, deine Glykogenspeicher füllen sich auf und dein Nervensystem erholt sich. Erholung ist aktive Leistungssteigerung!
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#0B0F19]/60 border border-indigo-800/40 text-xs text-indigo-200 shrink-0 font-mono">
            Schlafziel: {userProfile.sleepTime} - {userProfile.wakeTime} Uhr
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Wellness Check-In Form */}
        <div className="lg:col-span-6 frost-card p-6 md:p-8 rounded-3xl border border-slate-800 space-y-6 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <BatteryCharging className="w-5 h-5 text-[#66D9FF]" />
              <h3 className="font-bold text-white text-base">Täglicher Erholungs-Check-In</h3>
            </div>
            {checkInSaved && (
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Gespeichert
              </span>
            )}
          </div>

          <form onSubmit={handleSaveCheckIn} className="space-y-4 text-xs">
            {/* Energy */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-slate-300">Energielevel heute (1-10)</span>
                <span className="font-mono text-[#66D9FF] font-bold">{energy} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={energy}
                onChange={(e) => {
                  setEnergy(parseInt(e.target.value, 10));
                  setCheckInSaved(false);
                }}
                className="w-full accent-[#66D9FF] cursor-pointer"
              />
            </div>

            {/* Sleep Quality */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-slate-300">Schlafqualität der letzten Nacht (1-10)</span>
                <span className="font-mono text-[#8B7CFF] font-bold">{sleepQuality} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={sleepQuality}
                onChange={(e) => {
                  setSleepQuality(parseInt(e.target.value, 10));
                  setCheckInSaved(false);
                }}
                className="w-full accent-[#8B7CFF] cursor-pointer"
              />
            </div>

            {/* Muscle Soreness */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-slate-300">Muskelkater / Muskelspannung (1-10)</span>
                <span className="font-mono text-amber-400 font-bold">{soreness} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={soreness}
                onChange={(e) => {
                  setSoreness(parseInt(e.target.value, 10));
                  setCheckInSaved(false);
                }}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>

            {/* Stress Level */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-slate-300">Stresslevel Alltag / Schule / Job (1-10)</span>
                <span className="font-mono text-rose-400 font-bold">{stress} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={stress}
                onChange={(e) => {
                  setStress(parseInt(e.target.value, 10));
                  setCheckInSaved(false);
                }}
                className="w-full accent-rose-400 cursor-pointer"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="font-semibold text-slate-300 block mb-1">Persönliches Befinden</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => {
                  setNotes(e.target.value);
                  setCheckInSaved(false);
                }}
                placeholder="z.B. Beine etwas schwer, aber mental voll fokussiert"
                className="w-full bg-[#182131] border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
            </div>

            {/* Adaptive Recommendation based on scores */}
            <div className="p-3.5 rounded-2xl bg-[#0B0F19]/50 border border-slate-800 text-slate-300 leading-relaxed text-[11px] space-y-1">
              <span className="font-bold text-[#66D9FF] block">Erholungs-Empfehlung für heute:</span>
              <p>
                {soreness > 6 || energy < 5
                  ? 'Erhöhter Muskelkater oder niedrigere Energie erkannt: Wir empfehlen heute leichte Mobilität, warmes Baden oder einen entspannten Spaziergang statt schwerem Krafttraining.'
                  : 'Gute Energie und geringe Muskelspannung: Du bist bereit für deine geplante Einheit! Achte dennoch auf 5 Minuten Warm-up.'}
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#66D9FF] to-[#8B7CFF] text-slate-950 font-black text-xs hover:opacity-95 shadow-lg shadow-[#66D9FF]/20"
            >
              Check-In speichern
            </button>
          </form>
        </div>

        {/* Mobility Flow Routines */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#66D9FF] tracking-wider block">
                Geführte Beweglichkeit
              </span>
              <h3 className="text-lg font-bold text-white">Mobility & Stretching Flows</h3>
            </div>
          </div>

          <div className="space-y-3">
            {mobilityRoutines.map((routine, idx) => (
              <div
                key={routine.id}
                className="frost-card p-5 rounded-3xl border border-slate-800 hover:border-slate-700 transition-all space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-[#8B7CFF] bg-[#8B7CFF]/10 px-2 py-0.5 rounded">
                      ⏱ {routine.duration}
                    </span>
                    <h4 className="text-base font-bold text-white mt-1">{routine.title}</h4>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{routine.benefit}</p>
                  </div>

                  <button
                    onClick={() => startRoutine(idx)}
                    className="p-2.5 rounded-xl bg-[#182131] hover:bg-[#1E293B] border border-slate-700 text-[#66D9FF] shrink-0"
                    title="Routine starten"
                  >
                    <Play className="w-4 h-4 fill-[#66D9FF]" />
                  </button>
                </div>

                <div className="p-2.5 rounded-xl bg-[#0B0F19]/50 border border-slate-800 text-[11px] text-slate-300">
                  <span className="text-slate-500 font-semibold block mb-0.5">Übungen:</span>
                  <span>{routine.exercises.join(' • ')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Guided Routine Modal / Timer */}
      {activeRoutine !== null && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#141B2A] border border-[#66D9FF]/40 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl text-center">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#66D9FF] tracking-wider block">
                Geführter Mobilitäts-Flow
              </span>
              <h3 className="text-xl font-black text-white mt-1">
                {mobilityRoutines[activeRoutine].title}
              </h3>
            </div>

            {/* Timer Ring */}
            <div className="w-36 h-36 mx-auto rounded-full border-4 border-[#66D9FF] flex flex-col items-center justify-center bg-[#182131] shadow-xl shadow-[#66D9FF]/20">
              <span className="text-4xl font-black text-white font-mono">{flowSecondsLeft}s</span>
              <span className="text-[10px] text-slate-400">Übungszeit</span>
            </div>

            <div className="space-y-1 text-xs">
              <span className="text-slate-400 block">Aktive Sequenz:</span>
              <p className="font-bold text-white text-sm">
                {mobilityRoutines[activeRoutine].exercises[0]}
              </p>
              <p className="text-slate-400 text-[11px] mt-1">
                Gleichmäßig durch die Nase ein- und ausatmen. Dehnung schmerzfrei halten.
              </p>
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => setIsFlowPlaying(!isFlowPlaying)}
                className="px-6 py-2.5 rounded-xl bg-[#182131] border border-slate-700 text-xs font-bold text-white hover:bg-slate-800"
              >
                {isFlowPlaying ? 'Pausieren' : 'Fortsetzen'}
              </button>
              <button
                onClick={() => setActiveRoutine(null)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#66D9FF] to-[#8B7CFF] text-slate-950 text-xs font-bold"
              >
                Beenden
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
