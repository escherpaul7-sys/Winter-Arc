import React, { useState } from 'react';
import {
  Utensils,
  Sparkles,
  ShoppingBag,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  RefreshCw,
  Clock,
  ShieldCheck,
  Droplet,
  ChevronRight,
  Flame,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MealPlan, GroceryItem } from '../../types';

export const NutritionAI: React.FC = () => {
  const {
    userProfile,
    mealPlan,
    setMealPlan,
    groceries,
    toggleGrocery,
    addGrocery,
    removeGrocery,
    clearCheckedGroceries,
    populateGroceriesFromMealPlan,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'meals' | 'groceries'>('meals');
  const [isGenerating, setIsGenerating] = useState(false);
  const [newGroceryName, setNewGroceryName] = useState('');
  const [newGroceryCat, setNewGroceryCat] = useState<GroceryItem['category']>('Gemüse');

  const handleGenerateMealPlan = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/generate-mealplan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preferences: 'Wärmende, energiegebende Mahlzeiten für den Winter Arc',
          allergies: userProfile.allergies,
          dietaryType: userProfile.dietaryType,
          dislikes: userProfile.dislikes,
          goals: userProfile.nutritionGoals,
        }),
      });

      if (!response.ok) throw new Error('API Fehler bei Ernährungsplanung');
      const data: MealPlan = await response.json();
      setMealPlan(data);
    } catch (err) {
      console.error('Meal plan generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddCustomGrocery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroceryName.trim()) return;
    addGrocery(newGroceryName.trim(), newGroceryCat);
    setNewGroceryName('');
  };

  // Group groceries by category
  const categories: Array<GroceryItem['category']> = [
    'Obst',
    'Gemüse',
    'Milchprodukte',
    'Getreide',
    'Proteinquellen',
    'Sonstiges',
  ];

  const totalGroceries = groceries.length;
  const checkedGroceries = groceries.filter((g) => g.checked).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-widest text-[#66D9FF]">
            Nährstoffe & Energie
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-white mt-1">
            Nutrition AI & Einkaufsliste
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Ausgewogene Wintermahlzeiten, energiegebende Rezepte und automatische Einkaufslisten.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-[#141B2A] border border-slate-800 rounded-2xl self-start">
          <button
            onClick={() => setActiveTab('meals')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'meals'
                ? 'bg-gradient-to-r from-[#66D9FF] to-[#8B7CFF] text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>Mahlzeitenplan</span>
          </button>

          <button
            onClick={() => setActiveTab('groceries')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'groceries'
                ? 'bg-[#182131] text-white border border-[#66D9FF]/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Einkaufsliste ({checkedGroceries}/{totalGroceries})</span>
          </button>
        </div>
      </div>

      {/* Hydration Banner */}
      <div className="p-4 rounded-3xl frost-card border border-sky-800/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-[#66D9FF]/10 text-[#66D9FF] shrink-0">
            <Droplet className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-white block">Winter Hydration Tipp</span>
            <p className="text-xs text-slate-300 mt-0.5">{mealPlan.hydrationTip}</p>
          </div>
        </div>

        <button
          onClick={handleGenerateMealPlan}
          disabled={isGenerating}
          className="px-4 py-2 rounded-xl bg-[#182131] hover:bg-[#1E293B] border border-[#66D9FF]/30 text-[#66D9FF] text-xs font-bold transition-all flex items-center gap-1.5 shrink-0"
        >
          {isGenerating ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Sparkles className="w-3.5 h-3.5" />
          )}
          <span>Neuen Plan berechnen</span>
        </button>
      </div>

      {/* TAB 1: MEALS */}
      {activeTab === 'meals' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">{mealPlan.dayTitle}</h2>
              <p className="text-xs text-[#66D9FF] font-medium">{mealPlan.focus}</p>
            </div>

            <button
              onClick={() => {
                populateGroceriesFromMealPlan();
                setActiveTab('groceries');
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-colors flex items-center gap-1.5"
            >
              <ShoppingBag className="w-4 h-4 text-[#66D9FF]" />
              <span>Zutaten auf Einkaufsliste übernehmen</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Breakfast */}
            <div className="frost-card p-6 rounded-3xl border border-slate-800 space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-bold text-[#66D9FF] bg-[#66D9FF]/10 px-2 py-0.5 rounded">
                    Frühstück
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    ⏱ {mealPlan.meals.breakfast.prepTime}
                  </span>
                </div>
                <h3 className="text-base font-black text-white">{mealPlan.meals.breakfast.name}</h3>
                <span className="text-xs font-semibold text-[#8B7CFF] block mt-1">
                  {mealPlan.meals.breakfast.caloriesApprox}
                </span>

                <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Zutaten
                  </span>
                  <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                    {mealPlan.meals.breakfast.ingredients.map((ing, i) => (
                      <li key={i}>{ing}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-3 pt-2 text-xs text-slate-400 leading-relaxed bg-[#0B0F19]/50 p-3 rounded-2xl border border-slate-800">
                  {mealPlan.meals.breakfast.instructions}
                </div>
              </div>

              <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                <span className="text-slate-300 font-semibold block">Alternative:</span>
                <span>{mealPlan.meals.breakfast.alternative}</span>
              </div>
            </div>

            {/* Lunch */}
            <div className="frost-card p-6 rounded-3xl border border-slate-800 space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-bold text-[#8B7CFF] bg-[#8B7CFF]/10 px-2 py-0.5 rounded">
                    Mittagessen
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    ⏱ {mealPlan.meals.lunch.prepTime}
                  </span>
                </div>
                <h3 className="text-base font-black text-white">{mealPlan.meals.lunch.name}</h3>
                <span className="text-xs font-semibold text-[#8B7CFF] block mt-1">
                  {mealPlan.meals.lunch.caloriesApprox}
                </span>

                <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Zutaten
                  </span>
                  <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                    {mealPlan.meals.lunch.ingredients.map((ing, i) => (
                      <li key={i}>{ing}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-3 pt-2 text-xs text-slate-400 leading-relaxed bg-[#0B0F19]/50 p-3 rounded-2xl border border-slate-800">
                  {mealPlan.meals.lunch.instructions}
                </div>
              </div>

              <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                <span className="text-slate-300 font-semibold block">Alternative:</span>
                <span>{mealPlan.meals.lunch.alternative}</span>
              </div>
            </div>

            {/* Dinner */}
            <div className="frost-card p-6 rounded-3xl border border-slate-800 space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded">
                    Abendessen
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    ⏱ {mealPlan.meals.dinner.prepTime}
                  </span>
                </div>
                <h3 className="text-base font-black text-white">{mealPlan.meals.dinner.name}</h3>
                <span className="text-xs font-semibold text-[#8B7CFF] block mt-1">
                  {mealPlan.meals.dinner.caloriesApprox}
                </span>

                <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Zutaten
                  </span>
                  <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                    {mealPlan.meals.dinner.ingredients.map((ing, i) => (
                      <li key={i}>{ing}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-3 pt-2 text-xs text-slate-400 leading-relaxed bg-[#0B0F19]/50 p-3 rounded-2xl border border-slate-800">
                  {mealPlan.meals.dinner.instructions}
                </div>
              </div>

              <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                <span className="text-slate-300 font-semibold block">Alternative:</span>
                <span>{mealPlan.meals.dinner.alternative}</span>
              </div>
            </div>
          </div>

          {/* Snacks Section */}
          <div className="p-6 rounded-3xl frost-card border border-slate-800 space-y-3">
            <span className="text-xs uppercase font-extrabold tracking-wider text-[#66D9FF] block">
              Smarte Winter Arc Snacks
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {mealPlan.meals.snacks.map((snack, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-[#0B0F19]/50 border border-slate-800">
                  <span className="font-bold text-white block">{snack.name}</span>
                  <p className="text-slate-400 text-[11px] mt-0.5">{snack.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GROCERIES */}
      {activeTab === 'groceries' && (
        <div className="space-y-6">
          {/* Add item form & clear checked */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch justify-between">
            <form onSubmit={handleAddCustomGrocery} className="flex-1 flex gap-2">
              <input
                type="text"
                value={newGroceryName}
                onChange={(e) => setNewGroceryName(e.target.value)}
                placeholder="Zutat oder Lebensmittel hinzufügen..."
                className="flex-1 bg-[#141B2A] border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#66D9FF]"
              />
              <select
                value={newGroceryCat}
                onChange={(e) => setNewGroceryCat(e.target.value as any)}
                className="bg-[#141B2A] border border-slate-800 rounded-2xl px-3 py-2 text-xs text-white"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <button
                type="submit"
                className="px-4 py-2.5 rounded-2xl bg-[#182131] hover:bg-[#1E293B] border border-slate-700 text-xs font-bold text-white transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4 text-[#66D9FF]" /> Hinzufügen
              </button>
            </form>

            <button
              onClick={clearCheckedGroceries}
              className="px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs font-semibold text-slate-300 transition-colors"
            >
              Erledigte entfernen
            </button>
          </div>

          {/* Categorized Groceries */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => {
              const catItems = groceries.filter((g) => g.category === cat);
              if (catItems.length === 0) return null;

              return (
                <div key={cat} className="frost-card p-5 rounded-3xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      {cat}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {catItems.filter((i) => i.checked).length}/{catItems.length}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {catItems.map((item) => (
                      <div
                        key={item.id}
                        className={`flex items-center justify-between p-2.5 rounded-xl border transition-all text-xs ${
                          item.checked
                            ? 'bg-emerald-950/20 border-emerald-900/40 opacity-60'
                            : 'bg-[#182131] border-slate-800'
                        }`}
                      >
                        <div
                          onClick={() => toggleGrocery(item.id)}
                          className="flex items-center gap-2.5 flex-1 cursor-pointer"
                        >
                          {item.checked ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-500 shrink-0" />
                          )}
                          <span
                            className={`truncate ${
                              item.checked ? 'line-through text-slate-400' : 'text-slate-200'
                            }`}
                          >
                            {item.name}
                          </span>
                        </div>

                        <button
                          onClick={() => removeGrocery(item.id)}
                          className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Safety Notice */}
      <div className="p-4 rounded-2xl bg-[#141B2A]/60 border border-slate-800 flex items-start gap-3 text-xs text-slate-400">
        <ShieldCheck className="w-5 h-5 text-[#66D9FF] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Nutrition AI unterstützt gesunde Mahlzeiten, regelmäßige Energiezufuhr und Hydration. Keine Crash-Diäten, restriktive Kaloriendefizite oder Hungern. Bei medizinischen Ernährungsfragen wende dich bitte an qualifiziertes Fachpersonal.
        </p>
      </div>
    </div>
  );
};
