import React, { useState } from 'react';
import {
  Dumbbell,
  Sparkles,
  Play,
  Plus,
  Clock,
  Flame,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sliders,
  ChevronDown,
  Layers,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Workout, WorkoutCategory, WorkoutIntensity, Exercise } from '../../types';
import { EXERCISE_DATABASE, DatabaseExercise } from '../../data/exerciseDatabase';

export const WorkoutGenerator: React.FC = () => {
  const { workouts, addWorkout, startWorkoutExecution, userProfile } = useApp();

  const [activeTab, setActiveTab] = useState<'generator' | 'my-workouts' | 'database'>('generator');

  // Generator Settings
  const [goal, setGoal] = useState<string>('Kraft & allgemeine Fitness');
  const [targetCategory, setTargetCategory] = useState<WorkoutCategory>('Strength');
  const [duration, setDuration] = useState<number>(userProfile.dailyTime || 40);
  const [intensity, setIntensity] = useState<WorkoutIntensity>('Medium');
  const [muscleGroup, setMuscleGroup] = useState<string>('Ganzkörper');
  const [limitations, setLimitations] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedWorkout, setGeneratedWorkout] = useState<Workout | null>(null);

  // Exercise Database search & filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('Alle');
  const [selectedExerciseDetail, setSelectedExerciseDetail] = useState<DatabaseExercise | null>(null);

  const goalOptions = [
    'Kraft & allgemeine Fitness',
    'Oberkörper-Fokus',
    'Unterkörper & Explosivität',
    'Ausdauer & Cardio',
    'Mobilität & Regeneration',
    'Core-Stabilität',
    'Sportartspezifische Athletik',
  ];

  const muscleGroupOptions = ['Ganzkörper', 'Oberkörper (Push/Pull)', 'Unterkörper (Beine/Gesäß)', 'Core & Rumpf', 'Rücken & Schultern'];

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/generate-workout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal,
          sports: userProfile.sports,
          duration,
          experience: userProfile.experience,
          equipment: userProfile.equipment,
          intensity,
          muscleGroup,
          limitations,
        }),
      });

      if (!response.ok) throw new Error('API Fehler bei Workout-Generierung');
      const data = await response.json();

      const newWorkout: Workout = {
        ...data,
        id: 'w-' + Date.now(),
        completed: false,
      };

      setGeneratedWorkout(newWorkout);
    } catch (err) {
      console.error('Workout generation error:', err);
      // Fallback builder from database
      const fallbackExercises: Exercise[] = EXERCISE_DATABASE.slice(0, 4).map((ex) => ({
        ...ex,
        id: 'fe-' + Math.random(),
      }));

      const newWorkout: Workout = {
        id: 'w-' + Date.now(),
        name: `Winter Arc ${muscleGroup} Flow`,
        category: targetCategory,
        duration,
        intensity,
        goal,
        completed: false,
        warmup: [
          { name: 'Armkreisen & Schulterkreisen', duration: '1:30 min', instruction: 'Dynamisch und kontrolliert die Gelenke aufwärmen.' },
          { name: 'Cat-Cow Mobilität', duration: '1:30 min', instruction: 'Im Vierfüßlerstand die Wirbelsäule durchbewegen.' },
        ],
        exercises: fallbackExercises,
        cooldown: [
          { name: 'Kindeshaltung (Child’s Pose)', duration: '2:00 min', instruction: 'Hüfte auf die Fersen absenken, tief in den Bauch atmen.' },
        ],
      };
      setGeneratedWorkout(newWorkout);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveWorkout = (workoutToSave: Workout) => {
    addWorkout(workoutToSave);
    setActiveTab('my-workouts');
  };

  // Filter exercises
  const filteredExercises = EXERCISE_DATABASE.filter((ex) => {
    const matchesSearch =
      ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.targetArea.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.equipment.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat =
      selectedCategoryFilter === 'Alle' ||
      ex.category.toLowerCase().includes(selectedCategoryFilter.toLowerCase());
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-widest text-[#66D9FF]">
            Fitness & Kraft
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-white mt-1">
            Workout Generator & Übungsbibliothek
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Erstelle maßgeschneiderte, sichere und motivierende Trainingspläne für deinen Winter Arc.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-1.5 p-1 bg-[#141B2A] border border-slate-800 rounded-2xl self-start">
          <button
            onClick={() => setActiveTab('generator')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'generator'
                ? 'bg-gradient-to-r from-[#66D9FF] to-[#8B7CFF] text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Generator</span>
          </button>

          <button
            onClick={() => setActiveTab('my-workouts')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'my-workouts'
                ? 'bg-[#182131] text-white border border-[#66D9FF]/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Dumbbell className="w-3.5 h-3.5" />
            <span>Meine Workouts ({workouts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('database')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'database'
                ? 'bg-[#182131] text-white border border-[#66D9FF]/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Übungen ({EXERCISE_DATABASE.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: AI GENERATOR */}
      {activeTab === 'generator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="frost-card p-6 rounded-3xl space-y-5 border border-slate-800 shadow-xl">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800">
                <Sliders className="w-5 h-5 text-[#66D9FF]" />
                <h3 className="font-bold text-white text-base">Workout Parameter</h3>
              </div>

              {/* Goal */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Trainingsziel</label>
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full bg-[#182131] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white"
                >
                  {goalOptions.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              {/* Muscle Groups */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Muskelfokus</label>
                <select
                  value={muscleGroup}
                  onChange={(e) => setMuscleGroup(e.target.value)}
                  className="w-full bg-[#182131] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white"
                >
                  {muscleGroupOptions.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Trainingsart</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Strength', 'Bodyweight', 'Mobility'] as WorkoutCategory[]).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setTargetCategory(cat)}
                      className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all ${
                        targetCategory === cat
                          ? 'bg-[#182131] text-[#66D9FF] border-[#66D9FF]'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration Slider */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="font-semibold text-slate-300">Dauer</span>
                  <span className="font-mono text-[#66D9FF] font-bold">{duration} Minuten</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="75"
                  step="5"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value, 10))}
                  className="w-full accent-[#66D9FF] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>15 Min</span>
                  <span>45 Min</span>
                  <span>75 Min</span>
                </div>
              </div>

              {/* Intensity */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Intensität</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Light', 'Medium', 'High'] as WorkoutIntensity[]).map((inte) => (
                    <button
                      key={inte}
                      type="button"
                      onClick={() => setIntensity(inte)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        intensity === inte
                          ? 'bg-[#182131] text-[#8B7CFF] border-[#8B7CFF]'
                          : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}
                    >
                      {inte === 'Light' ? 'Leicht' : inte === 'Medium' ? 'Mittel' : 'Hoch'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Limitations */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Einschränkungen / Anmerkungen (optional)
                </label>
                <input
                  type="text"
                  value={limitations}
                  onChange={(e) => setLimitations(e.target.value)}
                  placeholder="z.B. Keine Trainingsbank, leise Nachbarn"
                  className="w-full bg-[#182131] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              {/* Equipment info chips */}
              <div className="p-3 rounded-2xl bg-[#0B0F19]/50 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <span className="font-semibold text-slate-300 block">Dein Profil-Equipment:</span>
                <p>{userProfile.equipment.join(', ') || 'Nur Körpergewicht'}</p>
              </div>

              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#66D9FF] to-[#8B7CFF] text-slate-950 font-black text-sm hover:opacity-95 shadow-xl shadow-[#66D9FF]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Workout wird generiert...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Smartes Workout generieren</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Generated Workout Preview Card */}
          <div className="lg:col-span-7">
            {generatedWorkout ? (
              <div className="frost-card p-6 md:p-8 rounded-3xl border border-[#66D9FF]/25 shadow-2xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#66D9FF] bg-[#66D9FF]/10 px-2.5 py-1 rounded-md">
                      {generatedWorkout.category} • {generatedWorkout.duration} Min • {generatedWorkout.intensity}
                    </span>
                    <h2 className="text-2xl font-black text-white mt-2">{generatedWorkout.name}</h2>
                    <p className="text-xs text-slate-400 mt-1">{generatedWorkout.goal}</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSaveWorkout(generatedWorkout)}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-colors flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" /> Speichern
                    </button>
                    <button
                      onClick={() => startWorkoutExecution(generatedWorkout)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#66D9FF] to-[#8B7CFF] text-slate-950 text-xs font-black hover:opacity-90 shadow-md shadow-[#66D9FF]/20 transition-all flex items-center gap-1.5"
                    >
                      <Play className="w-4 h-4 fill-slate-950" /> Starten
                    </button>
                  </div>
                </div>

                {/* Warmup */}
                {generatedWorkout.warmup && generatedWorkout.warmup.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <span>Aufwärmen (Warm-Up)</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {generatedWorkout.warmup.map((wm, i) => (
                        <div key={i} className="p-2.5 rounded-xl bg-[#182131]/60 border border-slate-800">
                          <span className="font-semibold text-white block">{wm.name} ({wm.duration})</span>
                          <span className="text-slate-400 text-[11px]">{wm.instruction}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Exercises list */}
                <div className="space-y-3">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                    Hauptteil ({generatedWorkout.exercises.length} Übungen)
                  </h4>
                  <div className="space-y-3">
                    {generatedWorkout.exercises.map((ex, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-[#182131] border border-slate-800 hover:border-slate-700 transition-colors space-y-2 text-xs"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-slate-400 text-[10px] font-mono block">Übung {idx + 1}</span>
                            <span className="text-base font-bold text-white">{ex.name}</span>
                            <p className="text-slate-400 text-[11px] mt-0.5">
                              {ex.targetArea} • {ex.equipment}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-bold text-[#66D9FF] block">
                              {ex.sets} Sätze × {ex.reps}
                            </span>
                            <span className="text-[10px] text-slate-400">{ex.rest}s Pause</span>
                          </div>
                        </div>

                        <p className="text-slate-300 leading-relaxed text-[11px] bg-slate-900/50 p-2.5 rounded-xl border border-slate-800/80">
                          {ex.instruction}
                        </p>

                        {ex.safetyNote && (
                          <div className="flex items-center gap-1.5 text-amber-300/80 text-[11px]">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{ex.safetyNote}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cooldown */}
                {generatedWorkout.cooldown && generatedWorkout.cooldown.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                      Cool-Down & Dehnen
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {generatedWorkout.cooldown.map((cd, i) => (
                        <div key={i} className="p-2.5 rounded-xl bg-[#182131]/60 border border-slate-800">
                          <span className="font-semibold text-white block">{cd.name} ({cd.duration})</span>
                          <span className="text-slate-400 text-[11px]">{cd.instruction}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-12 text-center frost-card rounded-3xl border border-slate-800/80 min-h-[380px]">
                <div className="w-16 h-16 rounded-3xl bg-[#182131] border border-[#66D9FF]/20 flex items-center justify-center text-2xl mb-4 text-[#66D9FF]">
                  ⚡️
                </div>
                <h3 className="text-lg font-bold text-white">Noch kein Workout generiert</h3>
                <p className="text-xs text-slate-400 max-w-sm mt-1 leading-relaxed">
                  Passe links deine Dauer, Zielsetzung und Muskelfokus an und klicke auf "Smartes Workout generieren", um eine individuelle Session zu erstellen.
                </p>
                <button
                  type="button"
                  onClick={handleGenerate}
                  className="mt-5 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-[#66D9FF] transition-all"
                >
                  Schnell-Start: Ganzkörper-Workout erstellen
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: MY WORKOUTS LIST */}
      {activeTab === 'my-workouts' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workouts.map((w) => (
              <div
                key={w.id}
                className="frost-card p-5 rounded-3xl border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-[#66D9FF] bg-[#66D9FF]/10 px-2 py-0.5 rounded">
                      {w.category}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5" /> {w.duration} Min
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white leading-snug">{w.name}</h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{w.goal}</p>

                  <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <span>{w.exercises.length} Übungen</span>
                    {w.completed ? (
                      <span className="text-emerald-400 font-semibold flex items-center gap-1 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Abgeschlossen
                      </span>
                    ) : (
                      <span className="text-slate-500 text-[11px]">Bereit</span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => startWorkoutExecution(w)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#66D9FF] to-[#8B7CFF] text-slate-950 font-black text-xs hover:opacity-90 shadow-md shadow-[#66D9FF]/10 transition-all flex items-center justify-center gap-1.5"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>Workout starten</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: EXERCISE DATABASE EXPLORER */}
      {activeTab === 'database' && (
        <div className="space-y-6">
          {/* Search & Category Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Übung, Zielmuskel oder Ausrüstung suchen..."
                className="w-full bg-[#141B2A] border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#66D9FF]"
              />
            </div>

            <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {['Alle', 'Unterkörper', 'Oberkörper', 'Core', 'Mobilität', 'Cardio'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategoryFilter(cat)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedCategoryFilter === cat
                      ? 'bg-[#182131] text-[#66D9FF] border border-[#66D9FF]/30'
                      : 'bg-slate-900/60 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Exercises Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredExercises.map((ex) => (
              <div
                key={ex.id}
                onClick={() => setSelectedExerciseDetail(ex)}
                className="frost-card p-5 rounded-3xl border border-slate-800 hover:border-[#66D9FF]/40 cursor-pointer transition-all space-y-3 group"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-[#8B7CFF] bg-[#8B7CFF]/10 px-2 py-0.5 rounded">
                      {ex.category}
                    </span>
                    <h3 className="text-base font-bold text-white mt-1.5 group-hover:text-[#66D9FF] transition-colors">
                      {ex.name}
                    </h3>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                    {ex.difficulty}
                  </span>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {ex.instruction}
                </p>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="truncate max-w-[160px]">{ex.equipment}</span>
                  <span className="text-[#66D9FF] font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Details & Ausführung →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Exercise Detail View */}
      {selectedExerciseDetail && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-[#141B2A] border border-slate-700 rounded-3xl p-6 md:p-8 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-[#66D9FF] bg-[#66D9FF]/10 px-2.5 py-1 rounded">
                  {selectedExerciseDetail.category} • {selectedExerciseDetail.difficulty}
                </span>
                <h3 className="text-xl md:text-2xl font-black text-white mt-2">
                  {selectedExerciseDetail.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedExerciseDetail(null)}
                className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-[#182131] border border-slate-800">
                <span className="text-slate-400 text-[10px] block">Zielmuskeln</span>
                <span className="font-semibold text-white">{selectedExerciseDetail.targetArea}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#182131] border border-slate-800">
                <span className="text-slate-400 text-[10px] block">Ausrüstung</span>
                <span className="font-semibold text-white">{selectedExerciseDetail.equipment}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <span className="font-bold text-white uppercase tracking-wider text-[11px] block">
                Richtige Ausführung
              </span>
              <p className="text-slate-300 leading-relaxed bg-[#0B0F19]/60 p-3.5 rounded-2xl border border-slate-800">
                {selectedExerciseDetail.instruction}
              </p>
            </div>

            {selectedExerciseDetail.safetyNote && (
              <div className="p-3 rounded-2xl bg-amber-950/30 border border-amber-800/40 text-amber-200 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                <span>{selectedExerciseDetail.safetyNote}</span>
              </div>
            )}

            {selectedExerciseDetail.alternative && (
              <div className="p-3 rounded-2xl bg-[#182131] border border-slate-800 text-xs space-y-1">
                <span className="text-[#66D9FF] font-semibold block text-[11px]">Sinnvolle Alternative</span>
                <p className="text-slate-300">{selectedExerciseDetail.alternative}</p>
              </div>
            )}

            <button
              onClick={() => setSelectedExerciseDetail(null)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-colors"
            >
              Schließen
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
