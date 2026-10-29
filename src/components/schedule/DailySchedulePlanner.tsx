import React, { useState } from 'react';
import {
  Clock,
  Calendar,
  Sparkles,
  AlertTriangle,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ScheduleEvent } from '../../types';

export const DailySchedulePlanner: React.FC = () => {
  const {
    userProfile,
    schedule,
    addScheduleEvent,
    deleteScheduleEvent,
    toggleScheduleEvent,
  } = useApp();

  const daysOfWeek = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];
  const [selectedDay, setSelectedDay] = useState<string>('Montag');

  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ScheduleEvent['category']>('Training');
  const [start, setStart] = useState('16:00');
  const [end, setEnd] = useState('17:00');

  // Filter events for selected day and sort chronologically
  const dayEvents = schedule
    .filter((s) => s.day === selectedDay)
    .sort((a, b) => a.start.localeCompare(b.start));

  // Check for conflicts on this day
  const dayConflicts: Array<{ a: ScheduleEvent; b: ScheduleEvent }> = [];
  for (let i = 0; i < dayEvents.length; i++) {
    for (let j = i + 1; j < dayEvents.length; j++) {
      const a = dayEvents[i];
      const b = dayEvents[j];
      if (
        (a.start < b.end && a.end > b.start) ||
        (b.start < a.end && b.end > a.start)
      ) {
        dayConflicts.push({ a, b });
      }
    }
  }

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addScheduleEvent({
      title: title.trim(),
      day: selectedDay,
      category,
      start,
      end,
      completed: false,
    });

    setTitle('');
    setShowAddModal(false);
  };

  const categoryColor = (cat: ScheduleEvent['category']) => {
    switch (cat) {
      case 'Schule/Arbeit': return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
      case 'Training': return 'bg-[#66D9FF]/10 text-[#66D9FF] border-[#66D9FF]/30';
      case 'Vereinssport': return 'bg-[#8B7CFF]/10 text-[#8B7CFF] border-[#8B7CFF]/30';
      case 'Mahlzeit': return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
      case 'Erholung': return 'bg-sky-500/10 text-sky-300 border-sky-500/30';
      case 'Lernen': return 'bg-purple-500/10 text-purple-300 border-purple-500/30';
      case 'Schlaf': return 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30';
      default: return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-widest text-[#66D9FF]">
            Tagesstruktur & Fokus
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-white mt-1">
            Intelligenter Tagesplaner
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Strukturiere deinen Tag von Aufstehen bis Schlafengehen mit realistischen Zeitfenstern.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#66D9FF] to-[#8B7CFF] text-slate-950 text-xs font-black hover:opacity-90 shadow-md transition-all flex items-center gap-1.5 self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Aktivität hinzufügen</span>
        </button>
      </div>

      {/* Day Selector Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {daysOfWeek.map((d) => (
          <button
            key={d}
            onClick={() => setSelectedDay(d)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedDay === d
                ? 'bg-gradient-to-r from-[#66D9FF] to-[#8B7CFF] text-slate-950 shadow-md'
                : 'bg-[#141B2A] text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Conflict Alert on Selected Day */}
      {dayConflicts.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-800/60 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-200">
            <span className="font-bold block">Zeitliche Überschneidung!</span>
            <span>
              "{dayConflicts[0].a.title}" ({dayConflicts[0].a.start}-{dayConflicts[0].a.end}) überschneidet sich mit "{dayConflicts[0].b.title}" ({dayConflicts[0].b.start}-{dayConflicts[0].b.end}). Passe die Start- oder Endzeit an.
            </span>
          </div>
        </div>
      )}

      {/* Chronological Daily Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Timeline list */}
        <div className="lg:col-span-8 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Ablauf für {selectedDay} ({dayEvents.length} Termine)
            </span>
            <span className="text-xs text-slate-400">
              Klicke zum Abhaken
            </span>
          </div>

          {dayEvents.length > 0 ? (
            <div className="space-y-2.5">
              {dayEvents.map((ev) => (
                <div
                  key={ev.id}
                  className={`frost-card p-4 rounded-2xl border transition-all flex items-center justify-between group ${
                    ev.completed
                      ? 'bg-emerald-950/20 border-emerald-900/40 opacity-70'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div
                    onClick={() => toggleScheduleEvent(ev.id)}
                    className="flex items-center gap-3.5 flex-1 cursor-pointer"
                  >
                    {ev.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-500 shrink-0" />
                    )}

                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm font-bold block ${
                            ev.completed ? 'line-through text-slate-400' : 'text-white'
                          }`}
                        >
                          {ev.title}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${categoryColor(ev.category)}`}>
                          {ev.category}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 font-mono mt-0.5 block">
                        {ev.start} - {ev.end} Uhr
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => deleteScheduleEvent(ev.id)}
                      className="text-slate-500 hover:text-rose-400 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Löschen"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="frost-card p-10 rounded-3xl border border-slate-800 text-center space-y-3">
              <Clock className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-xs text-slate-400">Noch keine Aktivitäten für {selectedDay} eingetragen.</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-[#66D9FF] rounded-xl transition-colors"
              >
                + Erste Aktivität anlegen
              </button>
            </div>
          )}
        </div>

        {/* Priority Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="frost-card p-5 rounded-3xl border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider block">
              Prioritäten-Hierarchie
            </span>
            <p className="text-xs text-slate-400 leading-relaxed">
              Die KI strukturiert den Tag nach bewährten Leistungs- und Erholungsgesetzen:
            </p>
            <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside font-medium">
              <li><strong className="text-white">Schule / Arbeit:</strong> Feste Verpflichtungen stehen fest.</li>
              <li><strong className="text-white">Vereinssport:</strong> Feste Trainingstage des Teams.</li>
              <li><strong className="text-white">Schlaf (7-8+ Std.):</strong> Schlafenszeit nicht opfern.</li>
              <li><strong className="text-white">Erholung & Essen:</strong> Energie zuführen & verdauen.</li>
              <li><strong className="text-white">Individuelles Workout:</strong> Gezieltes Training im freien Zeitfenster.</li>
              <li><strong className="text-white">Persönliche Projekte:</strong> Konzentrierte Fokusblöcke.</li>
            </ol>
          </div>

          <div className="p-4 rounded-3xl bg-[#0B0F19]/50 border border-slate-800 flex items-start gap-3 text-xs text-slate-400">
            <ShieldCheck className="w-5 h-5 text-[#66D9FF] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Kein Überfüllen des Tages! Plane zwischen intensiven Blöcken immer mindestens 15-30 Minuten Pufferzeit für Mahlzeiten und mentale Entlastung ein.
            </p>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#141B2A] border border-slate-700 rounded-3xl p-6 md:p-8 space-y-5 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">Aktivität für {selectedDay} hinzufügen</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddEvent} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Titel der Aktivität</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="z.B. Vorlesung, Krafttraining, Spaziergang, Abendessen"
                  className="w-full bg-[#182131] border border-slate-700 rounded-xl px-3 py-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Kategorie</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-[#182131] border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  <option value="Training">Training</option>
                  <option value="Vereinssport">Vereinssport</option>
                  <option value="Schule/Arbeit">Schule / Arbeit</option>
                  <option value="Mahlzeit">Mahlzeit</option>
                  <option value="Erholung">Erholung</option>
                  <option value="Lernen">Lernen</option>
                  <option value="Schlaf">Schlaf</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Startzeit</label>
                  <input
                    type="time"
                    value={start}
                    onChange={(e) => setStart(e.target.value)}
                    className="w-full bg-[#182131] border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Endzeit</label>
                  <input
                    type="time"
                    value={end}
                    onChange={(e) => setEnd(e.target.value)}
                    className="w-full bg-[#182131] border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-3">
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
                  Speichern
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
