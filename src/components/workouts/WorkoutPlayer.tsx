import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  X,
  ChevronRight,
  ChevronLeft,
  Timer,
  AlertCircle,
  Sparkles,
  Flame,
  Volume2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Workout, Exercise } from '../../types';

interface WorkoutPlayerProps {
  workout: Workout;
  onClose: () => void;
}

export const WorkoutPlayer: React.FC<WorkoutPlayerProps> = ({ workout, onClose }) => {
  const { completeWorkout } = useApp();

  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [restSecondsLeft, setRestSecondsLeft] = useState(60);
  const [totalSecondsElapsed, setTotalSecondsElapsed] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [rpeRating, setRpeRating] = useState<'Leicht' | 'Mittel' | 'Anstrengend'>('Mittel');
  const [workoutNotes, setWorkoutNotes] = useState('');

  const currentExercise: Exercise | undefined = workout.exercises[currentExerciseIndex];
  const totalExercises = workout.exercises.length;
  const isLastExercise = currentExerciseIndex === totalExercises - 1;
  const totalSets = currentExercise ? currentExercise.sets : 3;

  // Total timer ticker
  useEffect(() => {
    if (isPaused || showCompletionModal) return;
    const interval = setInterval(() => {
      setTotalSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaused, showCompletionModal]);

  // Rest timer ticker
  useEffect(() => {
    if (!isResting || isPaused || showCompletionModal) return;
    if (restSecondsLeft <= 0) {
      setIsResting(false);
      return;
    }
    const timer = setInterval(() => {
      setRestSecondsLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isResting, restSecondsLeft, isPaused, showCompletionModal]);

  const handleNextSetOrExercise = () => {
    if (currentSet < totalSets) {
      setCurrentSet((prev) => prev + 1);
      // Trigger rest timer
      setRestSecondsLeft(currentExercise?.rest || 60);
      setIsResting(true);
    } else {
      // Move to next exercise or finish
      if (!isLastExercise) {
        setCurrentExerciseIndex((prev) => prev + 1);
        setCurrentSet(1);
        setRestSecondsLeft(currentExercise?.rest || 60);
        setIsResting(true);
      } else {
        setShowCompletionModal(true);
      }
    }
  };

  const handlePreviousExercise = () => {
    if (currentSet > 1) {
      setCurrentSet((prev) => prev - 1);
      setIsResting(false);
    } else if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex((prev) => prev - 1);
      setCurrentSet(1);
      setIsResting(false);
    }
  };

  const handleFinishAndSave = () => {
    completeWorkout(workout.id, rpeRating, workoutNotes);
    onClose();
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0B0F19]/95 backdrop-blur-xl flex flex-col justify-between p-4 md:p-8 overflow-y-auto">
      {/* Top Header */}
      <div className="max-w-3xl w-full mx-auto flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <span className="text-[10px] text-[#66D9FF] font-bold uppercase tracking-wider block">
            Live Workout Session
          </span>
          <h2 className="text-lg md:text-xl font-black text-white">{workout.name}</h2>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#141B2A] border border-slate-800 text-slate-300 font-mono text-sm">
            <Timer className="w-4 h-4 text-[#66D9FF]" />
            <span>{formatTime(totalSecondsElapsed)}</span>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            title="Session schließen"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="max-w-2xl w-full mx-auto my-auto py-6">
        {/* Rest Timer Overlay Mode */}
        {isResting ? (
          <div className="text-center p-8 rounded-3xl bg-[#141B2A] border border-[#66D9FF]/30 shadow-2xl space-y-6">
            <span className="text-xs uppercase tracking-widest text-slate-400 font-bold block">
              Erholung zwischen Sätzen
            </span>

            <div className="w-40 h-40 mx-auto rounded-full border-4 border-[#66D9FF] flex flex-col items-center justify-center bg-[#182131] shadow-lg shadow-[#66D9FF]/20 animate-pulse">
              <span className="text-4xl font-black text-white font-mono">{restSecondsLeft}s</span>
              <span className="text-[11px] text-slate-400">Pause</span>
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => setRestSecondsLeft((prev) => prev + 15)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700"
              >
                +15 Sek
              </button>
              <button
                onClick={() => setIsResting(false)}
                className="px-6 py-2 rounded-xl bg-[#66D9FF] text-slate-950 text-xs font-bold hover:bg-[#66D9FF]/90 shadow-md"
              >
                Pause beenden & weiter
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Nächster Satz: <span className="text-white font-semibold">{currentExercise?.name}</span> (Satz {currentSet} von {totalSets})
            </p>
          </div>
        ) : (
          /* Active Exercise Mode */
          <div className="space-y-6">
            {/* Progress indicators */}
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>
                Übung <strong className="text-white">{currentExerciseIndex + 1}</strong> von {totalExercises}
              </span>
              <span className="text-[#66D9FF] font-semibold">
                Satz {currentSet} von {totalSets}
              </span>
            </div>

            {/* Exercise Card */}
            <div className="frost-card p-6 md:p-8 rounded-3xl space-y-5 border border-slate-700/80 shadow-2xl relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold text-[#8B7CFF] bg-[#8B7CFF]/10 px-2.5 py-1 rounded-lg">
                    {currentExercise?.category || 'Übung'}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-black text-white mt-2">
                    {currentExercise?.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Zielbereich: <span className="text-slate-300">{currentExercise?.targetArea}</span> • Equipment: <span className="text-slate-300">{currentExercise?.equipment}</span>
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Wiederholungen</span>
                  <span className="text-2xl font-black text-[#66D9FF]">{currentExercise?.reps}</span>
                </div>
              </div>

              {/* Instruction cues */}
              <div className="p-4 rounded-2xl bg-[#0B0F19]/60 border border-slate-800 text-xs space-y-2">
                <p className="text-slate-300 leading-relaxed font-medium">
                  {currentExercise?.instruction}
                </p>
                {currentExercise?.safetyNote && (
                  <div className="flex items-start gap-2 pt-1 text-amber-300/90">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{currentExercise.safetyNote}</span>
                  </div>
                )}
              </div>

              {/* Alternative swap if needed */}
              {currentExercise?.alternative && (
                <div className="text-xs text-slate-400 flex items-center justify-between pt-1">
                  <span>Passende Alternative:</span>
                  <span className="text-slate-300 font-semibold">{currentExercise.alternative}</span>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between gap-3 pt-4">
              <button
                onClick={handlePreviousExercise}
                disabled={currentExerciseIndex === 0 && currentSet === 1}
                className="px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors flex items-center gap-1.5 text-xs font-semibold"
              >
                <ChevronLeft className="w-4 h-4" /> Zurück
              </button>

              <button
                onClick={() => setIsPaused(!isPaused)}
                className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title={isPaused ? 'Fortsetzen' : 'Pausieren'}
              >
                {isPaused ? <Play className="w-5 h-5 text-emerald-400" /> : <Pause className="w-5 h-5" />}
              </button>

              <button
                onClick={handleNextSetOrExercise}
                className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-[#66D9FF] to-[#8B7CFF] text-slate-950 font-black text-sm hover:opacity-95 shadow-xl shadow-[#66D9FF]/25 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>
                  {currentSet < totalSets
                    ? `Satz ${currentSet} beendet (Pause starten)`
                    : isLastExercise
                    ? 'Workout abschließen'
                    : 'Nächste Übung'}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Completion Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#141B2A] border border-[#66D9FF]/30 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl text-center">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-br from-[#66D9FF] to-[#8B7CFF] flex items-center justify-center text-3xl shadow-xl shadow-[#66D9FF]/20">
              🏆
            </div>

            <div>
              <h3 className="text-2xl font-black text-white">Starke Leistung!</h3>
              <p className="text-xs text-slate-400 mt-1">
                Du hast <strong className="text-white">{workout.name}</strong> erfolgreich absolviert.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#182131] border border-slate-800">
                <span className="text-slate-400 block">Trainingsdauer</span>
                <span className="text-lg font-bold text-[#66D9FF] font-mono">{formatTime(totalSecondsElapsed)}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#182131] border border-slate-800">
                <span className="text-slate-400 block">Übungen</span>
                <span className="text-lg font-bold text-white">{workout.exercises.length} abgeschlossen</span>
              </div>
            </div>

            {/* Subjective RPE Rating */}
            <div className="text-left space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">
                Wie intensiv hat sich das Training angefühlt? (RPE)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Leicht', 'Mittel', 'Anstrengend'] as const).map((rpe) => (
                  <button
                    key={rpe}
                    type="button"
                    onClick={() => setRpeRating(rpe)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      rpeRating === rpe
                        ? 'bg-[#182131] text-[#66D9FF] border-[#66D9FF]'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {rpe}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-left space-y-1">
              <label className="text-xs font-semibold text-slate-300 block">Notizen zur Einheit (optional)</label>
              <input
                type="text"
                value={workoutNotes}
                onChange={(e) => setWorkoutNotes(e.target.value)}
                placeholder="z.B. Gute Energie, Kniebeugen sauber ausgeführt"
                className="w-full bg-[#182131] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <button
              onClick={handleFinishAndSave}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#66D9FF] to-[#8B7CFF] text-slate-950 font-black text-sm hover:opacity-90 shadow-lg shadow-[#66D9FF]/20"
            >
              Speichern & im Dashboard eintragen
            </button>
          </div>
        </div>
      )}

      {/* Bottom Bar info */}
      <div className="max-w-3xl w-full mx-auto pt-4 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
        <span>Kategorie: {workout.category}</span>
        <button
          onClick={() => setShowCompletionModal(true)}
          className="text-slate-400 hover:text-white underline"
        >
          Vorzeitig beenden
        </button>
      </div>
    </div>
  );
};
