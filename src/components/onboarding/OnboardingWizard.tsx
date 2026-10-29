import React, { useState } from 'react';
import {
  Sparkles,
  Target,
  Dumbbell,
  Clock,
  Calendar,
  Utensils,
  Moon,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Flame,
  Plus,
  Trash2,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserProfile, AgeGroup, ExperienceLevel, Commitment } from '../../types';

export const OnboardingWizard: React.FC = () => {
  const { completeOnboarding } = useApp();

  const [step, setStep] = useState(1);
  const totalSteps = 10;
  const [validationError, setValidationError] = useState<string | null>(null);

  // Form State - Empty by default so user is required to enter their real data
  const [name, setName] = useState('');
  const [ageGroup, setAgeGroup] = useState<AgeGroup>('18-24');
  const [goals, setGoals] = useState<string[]>([]);
  const [sports, setSports] = useState<string[]>([]);
  const [customSport, setCustomSport] = useState('');
  const [experience, setExperience] = useState<ExperienceLevel>('Fortgeschritten');
  const [equipment, setEquipment] = useState<string[]>([
    'Kurzhanteln',
    'Widerstandsbänder',
  ]);
  const [dailyTime, setDailyTime] = useState(45);
  const [workoutDays, setWorkoutDays] = useState<string[]>(['Montag', 'Mittwoch', 'Freitag']);

  const [commitments, setCommitments] = useState<Commitment[]>([]);
  const [newCommitmentTitle, setNewCommitmentTitle] = useState('');
  const [newCommitmentCategory, setNewCommitmentCategory] = useState<Commitment['category']>('Schule/Arbeit');
  const [newCommitmentDay, setNewCommitmentDay] = useState('Montag');
  const [newCommitmentStart, setNewCommitmentStart] = useState('08:00');
  const [newCommitmentEnd, setNewCommitmentEnd] = useState('15:00');

  const [nutritionGoals, setNutritionGoals] = useState<string[]>([
    'Ausgewogene Mahlzeiten',
    'Ausreichend trinken',
  ]);
  const [dietaryType, setDietaryType] = useState('Ausgewogen');
  const [allergiesText, setAllergiesText] = useState('');
  const [dislikesText, setDislikesText] = useState('');

  const [sleepTime, setSleepTime] = useState('22:30');
  const [wakeTime, setWakeTime] = useState('06:30');
  const [recoveryGoals, setRecoveryGoals] = useState<string[]>([
    'Regelmäßige Schlafzeiten einhalten (7-8+ Std.)',
    '10 Minuten Mobilität / Dehnen am Abend',
  ]);

  // Goal options
  const goalOptions = [
    'Fitness verbessern',
    'Kraft aufbauen',
    'Ausdauer verbessern',
    'Eine Sportart verbessern',
    'Regelmäßiger trainieren',
    'Besser schlafen',
    'Gesünder essen',
    'Mehr lernen',
    'Tagesroutine verbessern',
    'Mehr Zeit für persönliche Projekte',
    'Mehr Bewegung im Alltag',
    'Allgemeine persönliche Entwicklung',
  ];

  // Sport options
  const sportOptions = [
    'Fitnessstudio',
    'Krafttraining zu Hause',
    'Handball',
    'Fußball',
    'Basketball',
    'Laufen',
    'Radfahren',
    'Mountainbike',
    'Schwimmen',
    'Calisthenics',
    'Volleyball',
    'Tennis',
    'Kampfsport',
  ];

  // Equipment options
  const equipmentOptions = [
    'Keine zusätzliche Ausrüstung (Bodyweight)',
    'Kurzhanteln',
    'Langhantel',
    'Widerstandsbänder',
    'Klimmzugstange',
    'Trainingsbank',
    'Fitnessstudio',
    'Calisthenics-Park',
    'Laufband',
    'Ergometer',
  ];

  const daysOfWeek = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];

  const toggleSelection = (item: string, list: string[], setList: (val: string[]) => void) => {
    setValidationError(null);
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const addCustomSport = () => {
    if (customSport.trim() && !sports.includes(customSport.trim())) {
      setSports([...sports, customSport.trim()]);
      setCustomSport('');
      setValidationError(null);
    }
  };

  const addCommitment = () => {
    if (!newCommitmentTitle.trim()) return;
    const item: Commitment = {
      id: 'c-' + Date.now(),
      title: newCommitmentTitle.trim(),
      category: newCommitmentCategory,
      day: newCommitmentDay,
      start: newCommitmentStart,
      end: newCommitmentEnd,
    };
    setCommitments([...commitments, item]);
    setNewCommitmentTitle('');
  };

  const removeCommitment = (id: string) => {
    setCommitments(commitments.filter((c) => c.id !== id));
  };

  // Step progression with strict validation
  const handleNextStep = () => {
    setValidationError(null);

    if (step === 1) {
      if (!name.trim()) {
        setValidationError('Bitte trage deinen Namen ein, um deinen Winter Arc zu starten.');
        return;
      }
    } else if (step === 2) {
      if (goals.length === 0) {
        setValidationError('Bitte wähle mindestens ein persönliches Ziel aus.');
        return;
      }
    } else if (step === 3) {
      if (sports.length === 0) {
        setValidationError('Bitte wähle mindestens eine Sportart aus (oder trage eine eigene ein).');
        return;
      }
    } else if (step === 6) {
      if (workoutDays.length === 0) {
        setValidationError('Bitte wähle mindestens einen Trainingstag in der Woche aus.');
        return;
      }
    }

    setStep(step + 1);
  };

  const handleFinish = () => {
    if (!name.trim()) {
      setValidationError('Bitte gib deinen Namen an.');
      setStep(1);
      return;
    }

    const finalProfile: UserProfile = {
      id: 'user-' + Date.now(),
      name: name.trim(),
      ageGroup,
      goals: goals.length > 0 ? goals : ['Allgemeine Fitness'],
      sports: sports.length > 0 ? sports : ['Fitness'],
      experience,
      equipment: equipment.length > 0 ? equipment : ['Keine zusätzliche Ausrüstung (Bodyweight)'],
      dailyTime,
      workoutDays: workoutDays.length > 0 ? workoutDays : ['Montag', 'Mittwoch', 'Freitag'],
      commitments,
      nutritionGoals,
      allergies: allergiesText ? allergiesText.split(',').map((s) => s.trim()) : [],
      dietaryType,
      dislikes: dislikesText ? dislikesText.split(',').map((s) => s.trim()) : [],
      sleepTime,
      wakeTime,
      recoveryGoals,
      startDate: new Date().toISOString().split('T')[0],
      targetEndDate: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
      isOnboarded: true,
      isDemoUser: false,
    };
    completeOnboarding(finalProfile);
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-[#F8FAFC] flex flex-col justify-center items-center p-4 md:p-8">
      {/* Background Glow */}
      <div className="fixed top-10 left-1/3 w-96 h-96 bg-[#66D9FF]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-10 right-1/4 w-96 h-96 bg-[#8B7CFF]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-2xl bg-[#141B2A]/90 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl p-6 md:p-10 relative overflow-hidden">
        {/* Top Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-medium">
            <span>Schritt {step} von {totalSteps}</span>
            <span className="text-[#66D9FF] font-semibold">Persönliche Dateneingabe</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#66D9FF] to-[#8B7CFF] h-full transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Validation Error Message Box */}
        {validationError && (
          <div className="mb-5 p-3 rounded-2xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2.5 animate-bounce">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span className="font-semibold">{validationError}</span>
          </div>
        )}

        {/* STEP 1: Welcome & Name Input */}
        {step === 1 && (
          <div className="text-center space-y-6 py-2">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-[#66D9FF] to-[#8B7CFF] flex items-center justify-center text-4xl shadow-xl shadow-[#66D9FF]/20">
              ❄️
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                Start your <span className="ice-gradient-text">Winter Arc</span>.
              </h1>
              <p className="text-slate-300 text-sm md:text-base mt-2 max-w-md mx-auto leading-relaxed">
                Bevor du startest, gib bitte deine Daten ein, damit dein persönlicher Trainings-, Ernährungs- und Habit-Plan maßgeschneidert erstellt werden kann.
              </p>
            </div>

            <div className="max-w-sm mx-auto text-left space-y-3 pt-2">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Wie heißt du? <span className="text-[#66D9FF]">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  placeholder="z.B. Lukas, Alex, Sarah..."
                  autoFocus
                  className="w-full bg-[#182131] border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#66D9FF]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Altersgruppe</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['Unter 18', '18-24', '25-34', '35+'] as AgeGroup[]).map((ag) => (
                    <button
                      key={ag}
                      type="button"
                      onClick={() => setAgeGroup(ag)}
                      className={`py-2 px-2 text-center rounded-xl text-xs font-medium border transition-all ${
                        ageGroup === ag
                          ? 'bg-[#182131] text-[#66D9FF] border-[#66D9FF]'
                          : 'bg-slate-900/50 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {ag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="button"
                onClick={handleNextStep}
                className="w-full max-w-sm mx-auto py-3.5 rounded-2xl bg-gradient-to-r from-[#66D9FF] to-[#8B7CFF] text-slate-950 font-black text-sm hover:opacity-90 shadow-lg shadow-[#66D9FF]/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Jetzt Daten eingeben & starten</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Goals */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#66D9FF]/10 text-[#66D9FF]">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Was sind deine persönlichen Ziele?</h2>
                <p className="text-xs text-slate-400">Wähle alle Bereiche aus, die du im Winter Arc verbessern möchtest.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-80 overflow-y-auto pr-1">
              {goalOptions.map((g) => {
                const selected = goals.includes(g);
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => toggleSelection(g, goals, setGoals)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-left text-xs font-medium transition-all ${
                      selected
                        ? 'bg-[#182131] border-[#66D9FF] text-white shadow-sm shadow-[#66D9FF]/10'
                        : 'bg-[#141B2A] border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span>{g}</span>
                    <CheckCircle2
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        selected ? 'text-[#66D9FF]' : 'text-slate-700'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: Sports */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#66D9FF]/10 text-[#66D9FF]">
                <Dumbbell className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Welche Sportarten machst du?</h2>
                <p className="text-xs text-slate-400">Wähle deine Sportarten oder füge eigene hinzu.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-64 overflow-y-auto pr-1">
              {sportOptions.map((s) => {
                const selected = sports.includes(s);
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleSelection(s, sports, setSports)}
                    className={`p-3 rounded-xl border text-center text-xs font-medium transition-all ${
                      selected
                        ? 'bg-[#182131] border-[#66D9FF] text-[#66D9FF]'
                        : 'bg-[#141B2A] border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>

            {/* Custom sport addition */}
            <div className="pt-2">
              <label className="text-xs font-semibold text-slate-300 block mb-1">Eigene Sportart hinzufügen</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customSport}
                  onChange={(e) => setCustomSport(e.target.value)}
                  placeholder="z.B. Bouldern, Schwimmen, Kampfsport"
                  className="flex-1 bg-[#182131] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#66D9FF]"
                />
                <button
                  type="button"
                  onClick={addCustomSport}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Hinzufügen
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Experience */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#66D9FF]/10 text-[#66D9FF]">
                <Flame className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Wie viel Trainingserfahrung hast du?</h2>
                <p className="text-xs text-slate-400">Damit Intensität, Volumen und Übungsauswahl perfekt zu dir passen.</p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                {
                  level: 'Anfänger' as ExperienceLevel,
                  title: 'Anfänger',
                  desc: 'Neu im strukturierten Training. Fokus auf saubere Grundübungen, Gewohnheitsaufbau und Verletzungsprävention.',
                },
                {
                  level: 'Fortgeschritten' as ExperienceLevel,
                  title: 'Fortgeschritten',
                  desc: 'Bereits regelmäßige Trainingserfahrung. Fokus auf progressiven Kraftaufbau, Technik und Athletik.',
                },
                {
                  level: 'Erfahren' as ExperienceLevel,
                  title: 'Erfahren',
                  desc: 'Mehrere Jahre kontinuierliches Training. Hohes Verständnis für Belastungssteuerung und Regeneration.',
                },
              ].map((item) => (
                <div
                  key={item.level}
                  onClick={() => setExperience(item.level)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    experience === item.level
                      ? 'bg-[#182131] border-[#66D9FF] shadow-md shadow-[#66D9FF]/10'
                      : 'bg-[#141B2A] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-white text-sm">{item.title}</span>
                    {experience === item.level && <CheckCircle2 className="w-5 h-5 text-[#66D9FF]" />}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 5: Equipment */}
        {step === 5 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#66D9FF]/10 text-[#66D9FF]">
                <Dumbbell className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Welche Ausrüstung hast du zur Verfügung?</h2>
                <p className="text-xs text-slate-400">Workouts werden passgenau auf dein Equipment abgestimmt.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1">
              {equipmentOptions.map((eq) => {
                const selected = equipment.includes(eq);
                return (
                  <button
                    key={eq}
                    type="button"
                    onClick={() => toggleSelection(eq, equipment, setEquipment)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-left text-xs font-medium transition-all ${
                      selected
                        ? 'bg-[#182131] border-[#66D9FF] text-white'
                        : 'bg-[#141B2A] border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span>{eq}</span>
                    <CheckCircle2
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        selected ? 'text-[#66D9FF]' : 'text-slate-700'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 6: Time Planning & Workout Days */}
        {step === 6 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#66D9FF]/10 text-[#66D9FF]">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Wie viel Zeit hast du normalerweise?</h2>
                <p className="text-xs text-slate-400">Ein realistischer Plan ist ein Plan, den du durchhältst.</p>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">
                Bevorzugte Workout-Dauer: {dailyTime} Minuten
              </label>
              <div className="grid grid-cols-5 gap-2">
                {[15, 20, 30, 45, 60].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setDailyTime(mins)}
                    className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                      dailyTime === mins
                        ? 'bg-[#182131] text-[#66D9FF] border-[#66D9FF]'
                        : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {mins} Min
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <label className="text-xs font-semibold text-slate-300 block mb-2">
                An welchen Tagen möchtest du trainieren? <span className="text-[#66D9FF]">*</span>
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                {daysOfWeek.map((day) => {
                  const selected = workoutDays.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleSelection(day, workoutDays, setWorkoutDays)}
                      className={`py-2 px-1 text-center rounded-xl text-xs font-medium border transition-all ${
                        selected
                          ? 'bg-[#182131] border-[#66D9FF] text-[#66D9FF]'
                          : 'bg-[#141B2A] border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {day.substring(0, 2)}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 7: Daily Commitments */}
        {step === 7 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#66D9FF]/10 text-[#66D9FF]">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Deine festen Verpflichtungen</h2>
                <p className="text-xs text-slate-400">Schule, Arbeit, Vereinssport – wir planen keine unrealistischen Zeiten ein.</p>
              </div>
            </div>

            {commitments.length > 0 ? (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {commitments.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#182131] border border-slate-800 text-xs"
                  >
                    <div>
                      <span className="font-semibold text-white block">{c.title}</span>
                      <span className="text-slate-400">
                        {c.day} • {c.start} - {c.end} Uhr ({c.category})
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeCommitment(c.id)}
                      className="text-rose-400 hover:text-rose-300 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-2">Noch keine festen Verpflichtungen hinzugefügt.</p>
            )}

            <div className="p-3.5 rounded-2xl bg-[#182131]/60 border border-slate-800 space-y-2.5">
              <span className="text-xs font-semibold text-slate-300 block">Feste Verpflichtung hinzufügen</span>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                <input
                  type="text"
                  value={newCommitmentTitle}
                  onChange={(e) => setNewCommitmentTitle(e.target.value)}
                  placeholder="z.B. Schule, Vorlesung, Handballverein"
                  className="sm:col-span-2 bg-[#141B2A] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                />
                <select
                  value={newCommitmentCategory}
                  onChange={(e) => setNewCommitmentCategory(e.target.value as any)}
                  className="bg-[#141B2A] border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white"
                >
                  <option value="Schule/Arbeit">Schule/Arbeit</option>
                  <option value="Vereinssport">Vereinssport</option>
                  <option value="Lernen">Lernen</option>
                  <option value="Freizeit">Freizeit</option>
                </select>
                <select
                  value={newCommitmentDay}
                  onChange={(e) => setNewCommitmentDay(e.target.value)}
                  className="bg-[#141B2A] border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white"
                >
                  {daysOfWeek.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Zeitfenster:</span>
                <input
                  type="time"
                  value={newCommitmentStart}
                  onChange={(e) => setNewCommitmentStart(e.target.value)}
                  className="bg-[#141B2A] border border-slate-700 rounded-lg px-2 py-1 text-xs text-white"
                />
                <span className="text-xs text-slate-500">bis</span>
                <input
                  type="time"
                  value={newCommitmentEnd}
                  onChange={(e) => setNewCommitmentEnd(e.target.value)}
                  className="bg-[#141B2A] border border-slate-700 rounded-lg px-2 py-1 text-xs text-white"
                />
                <button
                  type="button"
                  onClick={addCommitment}
                  className="ml-auto px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-semibold text-slate-200"
                >
                  + Hinzufügen
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 8: Nutrition */}
        {step === 8 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#66D9FF]/10 text-[#66D9FF]">
                <Utensils className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Ernährung im Winter Arc</h2>
                <p className="text-xs text-slate-400">Ausgewogen, nährstoffreich und nachhaltig – keine Crash-Diäten.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                'Regelmäßiger essen',
                'Ausgewogene Mahlzeiten',
                'Mehr Obst und Gemüse',
                'Mehr Abwechslung',
                'Ausreichend trinken',
                'Mahlzeiten besser planen',
                'Sportgerechte Ernährung',
              ].map((ng) => {
                const selected = nutritionGoals.includes(ng);
                return (
                  <button
                    key={ng}
                    type="button"
                    onClick={() => toggleSelection(ng, nutritionGoals, setNutritionGoals)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-medium transition-all ${
                      selected
                        ? 'bg-[#182131] border-[#66D9FF] text-white'
                        : 'bg-[#141B2A] border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span>{ng}</span>
                    <CheckCircle2 className={`w-3.5 h-3.5 ${selected ? 'text-[#66D9FF]' : 'text-slate-700'}`} />
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">Ernährungsform</label>
                <select
                  value={dietaryType}
                  onChange={(e) => setDietaryType(e.target.value)}
                  className="w-full bg-[#182131] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="Ausgewogen">Ausgewogen (Omnivor)</option>
                  <option value="Vegetarisch">Vegetarisch</option>
                  <option value="Vegan">Vegan</option>
                  <option value="Glutenfrei">Glutenfrei</option>
                  <option value="Laktosefrei">Laktosefrei</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">Allergien / Unverträglichkeiten</label>
                <input
                  type="text"
                  value={allergiesText}
                  onChange={(e) => setAllergiesText(e.target.value)}
                  placeholder="z.B. Nüsse, Laktose"
                  className="w-full bg-[#182131] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">Mag ich gar nicht</label>
                <input
                  type="text"
                  value={dislikesText}
                  onChange={(e) => setDislikesText(e.target.value)}
                  placeholder="z.B. Pilze, Rosenkohl"
                  className="w-full bg-[#182131] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-sky-950/40 border border-sky-800/40 flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
              <p className="text-[11px] text-sky-200 leading-relaxed">
                Winter Arc unterstützt gesundes Wachstum und Energie für den Alltag. Keine extremen Diäten, keine restriktiven Kaloriendefizite.
              </p>
            </div>
          </div>
        )}

        {/* STEP 9: Sleep & Recovery */}
        {step === 9 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#66D9FF]/10 text-[#66D9FF]">
                <Moon className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Schlaf & Erholungsroutine</h2>
                <p className="text-xs text-slate-400">Regeneration und mentale Frische finden im Schlaf statt.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#182131] border border-slate-800">
                <label className="text-xs font-semibold text-slate-300 block mb-1">Geplante Schlafenszeit</label>
                <input
                  type="time"
                  value={sleepTime}
                  onChange={(e) => setSleepTime(e.target.value)}
                  className="w-full bg-[#141B2A] border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                />
              </div>

              <div className="p-4 rounded-2xl bg-[#182131] border border-slate-800">
                <label className="text-xs font-semibold text-slate-300 block mb-1">Geplante Aufstehzeit</label>
                <input
                  type="time"
                  value={wakeTime}
                  onChange={(e) => setWakeTime(e.target.value)}
                  className="w-full bg-[#141B2A] border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">Erholungsziele</label>
              <div className="space-y-2">
                {[
                  'Regelmäßige Schlafzeiten einhalten (7-8+ Std.)',
                  'Kein Smartphone 30 Min vor dem Schlafen',
                  '10 Minuten Mobilität / Dehnen am Abend',
                  'Aktiver Spaziergang an Ruhetagen',
                ].map((rg) => {
                  const selected = recoveryGoals.includes(rg);
                  return (
                    <button
                      key={rg}
                      type="button"
                      onClick={() => toggleSelection(rg, recoveryGoals, setRecoveryGoals)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-medium text-left transition-all ${
                        selected
                          ? 'bg-[#182131] border-[#66D9FF] text-white'
                          : 'bg-[#141B2A] border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span>{rg}</span>
                      <CheckCircle2 className={`w-4 h-4 ${selected ? 'text-[#66D9FF]' : 'text-slate-700'}`} />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 10: Summary & Finish */}
        {step === 10 && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#66D9FF] to-[#8B7CFF] flex items-center justify-center text-3xl shadow-lg shadow-[#66D9FF]/20 mb-3">
                ⚡️
              </div>
              <h2 className="text-2xl font-black text-white">Dein Winter Arc ist bereit, {name}!</h2>
              <p className="text-xs text-slate-400 mt-1">Hier ist die Zusammenfassung deiner Daten:</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#182131] border border-slate-800">
                <span className="text-[#66D9FF] font-semibold block mb-1">Athlet & Ziele</span>
                <p className="text-white font-bold">{name} ({ageGroup})</p>
                <p className="text-slate-300 mt-1">{goals.slice(0, 3).join(', ')}</p>
                <p className="text-slate-400 mt-0.5">Sportarten: {sports.join(', ')}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#182131] border border-slate-800">
                <span className="text-[#66D9FF] font-semibold block mb-1">Trainingsstruktur</span>
                <p className="text-white font-bold">{dailyTime} Min. pro Einheit</p>
                <p className="text-slate-300 mt-1">Tage: {workoutDays.join(', ')}</p>
                <p className="text-slate-400 mt-0.5">Erfahrung: {experience}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#182131] border border-slate-800">
                <span className="text-[#66D9FF] font-semibold block mb-1">Ernährung</span>
                <p className="text-white font-bold">{dietaryType}</p>
                <p className="text-slate-300 mt-1">{nutritionGoals.join(', ')}</p>
                {allergiesText && <p className="text-slate-400 mt-0.5">Allergien: {allergiesText}</p>}
              </div>

              <div className="p-3.5 rounded-2xl bg-[#182131] border border-slate-800">
                <span className="text-[#66D9FF] font-semibold block mb-1">Schlaf & Alltag</span>
                <p className="text-white font-bold">{sleepTime} - {wakeTime} Uhr</p>
                <p className="text-slate-300 mt-1">{commitments.length} feste Verpflichtungen hinterlegt</p>
                <p className="text-slate-400 mt-0.5">{recoveryGoals.length} Erholungs-Routinen aktiv</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleFinish}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#66D9FF] to-[#8B7CFF] text-slate-950 font-extrabold text-base hover:opacity-95 shadow-xl shadow-[#66D9FF]/25 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5 text-slate-950" />
              <span>Mein persönliches Dashboard erstellen & starten</span>
            </button>
          </div>
        )}

        {/* Navigation Buttons (Steps 2-9) */}
        {step > 1 && step < 10 && (
          <div className="flex items-center justify-between pt-6 border-t border-slate-800/80 mt-6">
            <button
              type="button"
              onClick={() => {
                setValidationError(null);
                setStep(step - 1);
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-800 transition-colors flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" /> Zurück
            </button>
            <button
              type="button"
              onClick={handleNextStep}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#66D9FF] to-[#8B7CFF] text-slate-950 text-xs font-bold hover:opacity-90 shadow-md shadow-[#66D9FF]/15 transition-all flex items-center gap-1.5"
            >
              <span>Weiter</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
