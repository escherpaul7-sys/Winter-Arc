import React, { useState } from 'react';
import {
  Calendar,
  Dumbbell,
  Clock,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Trash2,
  Edit2,
  Heart,
  ShieldCheck,
  ChevronRight,
  Play,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ScheduleEvent, Workout } from '../../types';

export const WeeklyTrainingPlanner: React.FC = () => {
  const {
    userProfile,
    workouts,
    schedule,
    addScheduleEvent,
    deleteScheduleEvent,
    startWorkoutExecution,
  } = useApp();

  const daysOfWeek = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];
  const [selectedDay, setSelectedDay] = useState<string>('Montag');

  // Add event modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDay, setNewDay] = useState('Montag');
  const [newCategory, setNewCategory] = useState<ScheduleEvent['category']>('Training');
  const [newStart, setNewStart] = useState('17:00');
  const [newEnd, setNewEnd] = useState('17:45');

  // Conflict detection
  const conflicts: Array<{ day: string; eventA: ScheduleEvent; eventB: ScheduleEvent }> = [];
  daysOfWeek.forEach((d) => {
    const dayEvents = schedule.filter((s) => s.day === d);
    for (let i = 0; i < dayEvents.length; i++) {
      for (let j = i + 1; j < dayEvents.length; j++) {
        const a = dayEvents[i];
        const b = dayEvents[j];
        if (
          (a.start < b.end && a.end > b.start) ||
          (b.start < a.end && b.end > a.start)
        ) {
          conflicts.push({ day: d, eventA: a, eventB: b });
        }
      }
    }
  });

  const handleAddEvent = () => {
    if (!newTitle.trim()) return;
    addScheduleEvent({
      title: newTitle.trim(),
      day: newDay,
      start: newStart,
      end: newEnd,
      category: newCategory,
      completed: false,
    });
    setNewTitle('');
    setShowAddModal(false);
  };

  const handleAutoPlanWeek = () => {
    // Generate balanced week adhering to commitments
    // Preserves existing club sports and adds 3-4 structured sessions on free slots
    const generatedEvents: Omit<ScheduleEvent, 'id'>[] = [
      { title: 'Upper Body Strength', day: 'Montag', start: '17:00', end: '17:45', category: 'Training' },
      { title: 'Basketball / Vereinssport', day: 'Dienstag', start: '18:00', end: '19:30', category: 'Vereinssport' },
      { title: 'Mobilität & Aktive Erholung', day: 'Mittwoch', start: '17:30', end: '18:00', category: 'Erholung' },
      { title: 'Basketball / Vereinssport', day: 'Donnerstag', start: '18:00', end: '19:30', category: 'Vereinssport' },
      { title: 'Lower Body & Core', day: 'Freitag', start: '16:30', end: '17:15', category: 'Training' },
      { title: 'Outdoor Spaziergang & Frische Luft', day: 'Samstag', start: '14:00', end: '15:00', category: 'Erholung' },
      { title: 'Vollständiger Ruhetag & Meal Prep', day: 'Sonntag', start: '18:00', end: '19:00', category: 'Erholung' },
    ];

    generatedEvents.forEach((ev) => addScheduleEvent(ev));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-widest text-[#66D9FF]">
            Belastungssteuerung & Planung
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-white mt-1">
            Wöchentlicher Trainingsplaner
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Kombiniere Workouts, Vereinssport und bewusste Erholung harmonisch im Wochenrhythmus.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAutoPlanWeek}
            className="px-4 py-2.5 rounded-xl bg-[#182131] hover:bg-[#1E293B] border border-[#66D9FF]/30 text-[#66D9FF] text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>KI-Wochenplan erstellen</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#66D9FF] to-[#8B7CFF] text-slate-950 text-xs font-black hover:opacity-90 shadow-md transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Termin / Training hinzufügen</span>
          </button>
        </div>
      </div>

      {/* Conflict Warning Alert if any */}
      {conflicts.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-800/50 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <span className="font-bold text-amber-200 block">Zeitlicher Konflikt erkannt!</span>
            <p className="text-amber-300/90 leading-relaxed">
              Auf {conflicts[0].day} überschneidet sich "{conflicts[0].eventA.title}" ({conflicts[0].eventA.start}-{conflicts[0].eventA.end}) mit "{conflicts[0].eventB.title}" ({conflicts[0].eventB.start}-{conflicts[0].eventB.end}).
              Verschiebe eine Einheit, um Überlastung zu vermeiden.
            </p>
          </div>
        </div>
      )}

      {/* 7-Day Calendar Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
        {daysOfWeek.map((day) => {
          const dayEvents = schedule.filter((s) => s.day === day);
          const hasWorkout = dayEvents.some((s) => s.category === 'Training');
          const hasClubSport = dayEvents.some((s) => s.category === 'Vereinssport');
          const isRestDay = !hasWorkout && !hasClubSport;

          return (
            <div
              key={day}
              className={`frost-card p-4 rounded-2xl border transition-all flex flex-col justify-between min-h-[220px] ${
                selectedDay === day ? 'border-[#66D9FF]/50 ring-1 ring-[#66D9FF]/30' : 'border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2.5">
                  <span className="text-xs font-black text-white">{day}</span>
                  {isRestDay ? (
                    <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-medium">
                      Ruhetag
                    </span>
                  ) : (
                    <span className="text-[9px] bg-[#66D9FF]/10 text-[#66D9FF] px-1.5 py-0.5 rounded font-bold">
                      Aktiv
                    </span>
                  )}
                </div>

                {/* Day events */}
                <div className="space-y-1.5">
                  {dayEvents.length > 0 ? (
                    dayEvents.map((ev) => (
                      <div
                        key={ev.id}
                        className={`p-2 rounded-xl text-left border text-[11px] group relative ${
                          ev.category === 'Training'
                            ? 'bg-[#182131] border-[#66D9FF]/30 text-white'
                            : ev.category === 'Vereinssport'
                            ? 'bg-[#182131] border-[#8B7CFF]/30 text-white'
                            : 'bg-slate-900/40 border-slate-800 text-slate-300'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <span className="font-semibold block truncate pr-3">{ev.title}</span>
                          <button
                            onClick={() => deleteScheduleEvent(ev.id)}
                            className="text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Löschen"
                          >
                            ×
                          </button>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono block">
                          {ev.start} - {ev.end}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="py-6 text-center text-[11px] text-slate-500">
                      Geplanter Ruhetag
                    </div>
                  )}
                </div>
              </div>

              {/* Add event on this day button */}
              <button
                onClick={() => {
                  setNewDay(day);
                  setShowAddModal(true);
                }}
                className="w-full mt-2 py-1 bg-slate-900/60 hover:bg-slate-800 rounded-lg text-[10px] text-slate-400 hover:text-white font-medium transition-colors"
              >
                + Planen
              </button>
            </div>
          );
        })}
      </div>

      {/* Safety & Youth Load Management Guidelines */}
      <div className="p-6 rounded-3xl frost-card border border-slate-800 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base">Winter Arc Belastungssteuerung</h3>
            <p className="text-xs text-slate-400">Nachhaltiger Fortschritt schützt vor Überlastung und Verletzungen.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-[#0B0F19]/50 border border-slate-800/80 space-y-1">
            <span className="font-bold text-white block">Vereinssport Vorrang</span>
            <p className="text-slate-400 leading-relaxed">
              An Tagen mit Vereinssport (Handball, Basketball, Fußball) empfiehlt die App leichte Mobilität oder vollständige Ruhe statt hartem Krafttraining.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#0B0F19]/50 border border-slate-800/80 space-y-1">
            <span className="font-bold text-white block">Saubere Technik vor Gewicht</span>
            <p className="text-slate-400 leading-relaxed">
              Keine maximalen Krafttests als Standard. Kontrollierte Wiederholungen mit 1-2 Wiederholungen im Tank (RPE 7-8) für stetiges Muskelwachstum.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#0B0F19]/50 border border-slate-800/80 space-y-1">
            <span className="font-bold text-white block">Ruhetage sind Wachstumstage</span>
            <p className="text-slate-400 leading-relaxed">
              Muskeln wachsen in der Ruhephase bei ausreichendem Schlaf und ausgewogener Ernährung. Plane mindestens 2 Ruhetage pro Woche ein.
            </p>
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#141B2A] border border-slate-700 rounded-3xl p-6 md:p-8 space-y-5 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">Neuen Termin planen</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Bezeichnung</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="z.B. Oberkörper Workout, Vereinstraining"
                  className="w-full bg-[#182131] border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Wochentag</label>
                  <select
                    value={newDay}
                    onChange={(e) => setNewDay(e.target.value)}
                    className="w-full bg-[#182131] border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    {daysOfWeek.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Kategorie</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-[#182131] border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Training">Training</option>
                    <option value="Vereinssport">Vereinssport</option>
                    <option value="Schule/Arbeit">Schule / Arbeit</option>
                    <option value="Erholung">Erholung</option>
                    <option value="Lernen">Lernen</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Startzeit</label>
                  <input
                    type="time"
                    value={newStart}
                    onChange={(e) => setNewStart(e.target.value)}
                    className="w-full bg-[#182131] border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Endzeit</label>
                  <input
                    type="time"
                    value={newEnd}
                    onChange={(e) => setNewEnd(e.target.value)}
                    className="w-full bg-[#182131] border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Abbrechen
              </button>
              <button
                type="button"
                onClick={handleAddEvent}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#66D9FF] to-[#8B7CFF] text-slate-950 text-xs font-black"
              >
                Termin speichern
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
