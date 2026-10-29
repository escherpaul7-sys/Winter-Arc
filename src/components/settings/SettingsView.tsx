import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  User,
  Dumbbell,
  Utensils,
  Bell,
  Download,
  RotateCcw,
  Trash2,
  CheckCircle2,
  ShieldCheck,
  Moon,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AgeGroup, ExperienceLevel } from '../../types';

export const SettingsView: React.FC = () => {
  const {
    userProfile,
    updateProfile,
    resetToDemo,
    clearAllData,
    exportData,
  } = useApp();

  const [name, setName] = useState(userProfile.name);
  const [ageGroup, setAgeGroup] = useState<AgeGroup>(userProfile.ageGroup);
  const [experience, setExperience] = useState<ExperienceLevel>(userProfile.experience);
  const [dailyTime, setDailyTime] = useState(userProfile.dailyTime);
  const [sleepTime, setSleepTime] = useState(userProfile.sleepTime);
  const [wakeTime, setWakeTime] = useState(userProfile.wakeTime);
  const [dietaryType, setDietaryType] = useState(userProfile.dietaryType);
  const [allergiesText, setAllergiesText] = useState(userProfile.allergies.join(', '));
  const [dislikesText, setDislikesText] = useState(userProfile.dislikes.join(', '));

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: name.trim() || 'Winter Arc Athlete',
      ageGroup,
      experience,
      dailyTime,
      sleepTime,
      wakeTime,
      dietaryType,
      allergies: allergiesText ? allergiesText.split(',').map((s) => s.trim()) : [],
      dislikes: dislikesText ? dislikesText.split(',').map((s) => s.trim()) : [],
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <span className="text-xs uppercase font-extrabold tracking-widest text-[#66D9FF]">
          Präferenzen & Konfiguration
        </span>
        <h1 className="text-2xl md:text-3xl font-black text-white mt-1">
          Einstellungen & Profil
        </h1>
        <p className="text-xs md:text-sm text-slate-400 mt-1">
          Passe dein Profil, Trainingsparameter, Ernährungsfilter und Datenverwaltung an.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          <span>Profil-Einstellungen erfolgreich gespeichert!</span>
        </div>
      )}

      {/* Profile Form */}
      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Profile Basics */}
        <div className="frost-card p-6 md:p-8 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
            <User className="w-5 h-5 text-[#66D9FF]" />
            <h3 className="font-bold text-white text-base">Persönliche Angaben</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-slate-300 block mb-1">Name / Anzeigename</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#182131] border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-300 block mb-1">Altersgruppe</label>
              <select
                value={ageGroup}
                onChange={(e) => setAgeGroup(e.target.value as AgeGroup)}
                className="w-full bg-[#182131] border border-slate-700 rounded-xl px-3 py-2 text-white"
              >
                <option value="Unter 18">Unter 18 (Jugendschutz-optimiert)</option>
                <option value="18-24">18 - 24 Jahre</option>
                <option value="25-34">25 - 34 Jahre</option>
                <option value="35+">35+ Jahre</option>
              </select>
            </div>
          </div>
        </div>

        {/* Training Parameters */}
        <div className="frost-card p-6 md:p-8 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
            <Dumbbell className="w-5 h-5 text-[#8B7CFF]" />
            <h3 className="font-bold text-white text-base">Trainingseinstellungen</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-slate-300 block mb-1">Erfahrungslevel</label>
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value as ExperienceLevel)}
                className="w-full bg-[#182131] border border-slate-700 rounded-xl px-3 py-2 text-white"
              >
                <option value="Anfänger">Anfänger (Fokus auf Form & Gewohnheit)</option>
                <option value="Fortgeschritten">Fortgeschritten</option>
                <option value="Erfahren">Erfahren</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-300 block mb-1">Bevorzugte Trainingsdauer: {dailyTime} Min</label>
              <input
                type="range"
                min="15"
                max="75"
                step="5"
                value={dailyTime}
                onChange={(e) => setDailyTime(parseInt(e.target.value, 10))}
                className="w-full accent-[#66D9FF] cursor-pointer mt-2"
              />
            </div>
          </div>
        </div>

        {/* Nutrition & Sleep */}
        <div className="frost-card p-6 md:p-8 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
            <Utensils className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-white text-base">Ernährung & Schlafenszeiten</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-semibold text-slate-300 block mb-1">Ernährungsweise</label>
              <select
                value={dietaryType}
                onChange={(e) => setDietaryType(e.target.value)}
                className="w-full bg-[#182131] border border-slate-700 rounded-xl px-3 py-2 text-white"
              >
                <option value="Ausgewogen">Ausgewogen</option>
                <option value="Vegetarisch">Vegetarisch</option>
                <option value="Vegan">Vegan</option>
                <option value="Glutenfrei">Glutenfrei</option>
                <option value="Laktosefrei">Laktosefrei</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-300 block mb-1">Schlafenszeit</label>
              <input
                type="time"
                value={sleepTime}
                onChange={(e) => setSleepTime(e.target.value)}
                className="w-full bg-[#182131] border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-300 block mb-1">Aufstehzeit</label>
              <input
                type="time"
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
                className="w-full bg-[#182131] border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div className="sm:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Allergien / Unverträglichkeiten</label>
                <input
                  type="text"
                  value={allergiesText}
                  onChange={(e) => setAllergiesText(e.target.value)}
                  placeholder="z.B. Nüsse, Laktose"
                  className="w-full bg-[#182131] border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Lebensmittel-Abneigungen</label>
                <input
                  type="text"
                  value={dislikesText}
                  onChange={(e) => setDislikesText(e.target.value)}
                  placeholder="z.B. Pilze, Rosenkohl"
                  className="w-full bg-[#182131] border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#66D9FF] to-[#8B7CFF] text-slate-950 font-black text-xs md:text-sm hover:opacity-95 shadow-lg shadow-[#66D9FF]/20"
        >
          Änderungen speichern
        </button>
      </form>

      {/* Data Management Section */}
      <div className="frost-card p-6 md:p-8 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
        <h3 className="font-bold text-white text-base">Datenverwaltung & Backup</h3>
        <p className="text-xs text-slate-400">
          Alle Daten werden lokal in deinem Browser gespeichert. Du kannst deine Daten jederzeit sichern, auf den Demo-Zustand zurücksetzen oder vollständig neu starten.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              updateProfile({ isOnboarded: false });
            }}
            className="p-3.5 rounded-2xl bg-indigo-950/20 hover:bg-indigo-950/40 border border-indigo-800/40 text-xs font-bold text-indigo-300 transition-colors flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#66D9FF]" />
            <span>Daten neu eingeben (Onboarding)</span>
          </button>

          <button
            type="button"
            onClick={exportData}
            className="p-3.5 rounded-2xl bg-[#182131] hover:bg-[#1E293B] border border-slate-700 text-xs font-bold text-white transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4 text-[#66D9FF]" />
            <span>Daten exportieren (JSON)</span>
          </button>

          <button
            type="button"
            onClick={resetToDemo}
            className="p-3.5 rounded-2xl bg-[#182131] hover:bg-[#1E293B] border border-slate-700 text-xs font-bold text-slate-200 transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4 text-[#8B7CFF]" />
            <span>Demo-Daten wiederherstellen</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (window.confirm('Möchtest du wirklich alle Daten löschen und das Onboarding neu starten?')) {
                clearAllData();
              }
            }}
            className="p-3.5 rounded-2xl bg-rose-950/20 hover:bg-rose-950/40 border border-rose-800/40 text-xs font-bold text-rose-300 transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Alle Daten löschen & Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};
