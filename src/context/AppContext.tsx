import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  UserProfile,
  Workout,
  Habit,
  ScheduleEvent,
  Challenge,
  Achievement,
  MealPlan,
  GroceryItem,
  WellnessCheckIn,
  ChatMessage,
} from '../types';
import {
  INITIAL_EMPTY_PROFILE,
  DEMO_USER_PROFILE,
  INITIAL_HABITS,
  INITIAL_WORKOUTS,
  INITIAL_SCHEDULE_EVENTS,
  INITIAL_CHALLENGES,
  INITIAL_ACHIEVEMENTS,
  INITIAL_MEAL_PLAN,
  INITIAL_WELLNESS_CHECKINS,
} from '../data/initialData';

export type NavigationTab =
  | 'dashboard'
  | 'workouts'
  | 'plan'
  | 'nutrition'
  | 'habits'
  | 'schedule'
  | 'coach'
  | 'progress'
  | 'challenges'
  | 'recovery'
  | 'settings';

interface AppContextType {
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  updateProfile: (updates: Partial<UserProfile>) => void;
  completeOnboarding: (profile: UserProfile) => void;
  workouts: Workout[];
  addWorkout: (workout: Workout) => void;
  updateWorkout: (id: string, updates: Partial<Workout>) => void;
  deleteWorkout: (id: string) => void;
  completeWorkout: (id: string, rpe: 'Leicht' | 'Mittel' | 'Anstrengend', notes?: string) => void;
  activeWorkoutExecution: Workout | null;
  startWorkoutExecution: (workout: Workout) => void;
  stopWorkoutExecution: () => void;
  habits: Habit[];
  toggleHabitToday: (habitId: string) => void;
  addHabit: (habit: Omit<Habit, 'id' | 'completedDates' | 'createdAt'>) => void;
  deleteHabit: (habitId: string) => void;
  schedule: ScheduleEvent[];
  addScheduleEvent: (event: Omit<ScheduleEvent, 'id'>) => void;
  updateScheduleEvent: (id: string, updates: Partial<ScheduleEvent>) => void;
  deleteScheduleEvent: (id: string) => void;
  toggleScheduleEvent: (id: string) => void;
  challenges: Challenge[];
  toggleChallengeTask: (challengeId: string, taskId: string) => void;
  addChallenge: (challenge: Omit<Challenge, 'id' | 'completed'>) => void;
  achievements: Achievement[];
  unlockAchievement: (id: string) => void;
  mealPlan: MealPlan;
  setMealPlan: React.Dispatch<React.SetStateAction<MealPlan>>;
  groceries: GroceryItem[];
  toggleGrocery: (id: string) => void;
  addGrocery: (name: string, category: GroceryItem['category']) => void;
  removeGrocery: (id: string) => void;
  clearCheckedGroceries: () => void;
  populateGroceriesFromMealPlan: () => void;
  wellnessCheckIns: WellnessCheckIn[];
  addWellnessCheckIn: (checkIn: WellnessCheckIn) => void;
  chatMessages: ChatMessage[];
  sendMessageToCoach: (message: string) => Promise<void>;
  isCoachLoading: boolean;
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  resetToDemo: () => void;
  clearAllData: () => void;
  exportData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PROFILE: 'winter_arc_profile_v2',
  WORKOUTS: 'winter_arc_workouts_v2',
  HABITS: 'winter_arc_habits_v2',
  SCHEDULE: 'winter_arc_schedule_v2',
  CHALLENGES: 'winter_arc_challenges_v2',
  ACHIEVEMENTS: 'winter_arc_achievements_v2',
  MEALPLAN: 'winter_arc_mealplan_v2',
  GROCERIES: 'winter_arc_groceries_v2',
  WELLNESS: 'winter_arc_wellness_v2',
  CHAT: 'winter_arc_chat_v2',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [activeWorkoutExecution, setActiveWorkoutExecution] = useState<Workout | null>(null);

  // User Profile: User MUST enter data before entering the app
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (
          parsed &&
          parsed.isOnboarded === true &&
          parsed.name &&
          parsed.name.trim().length > 0 &&
          !parsed.isDemoUser
        ) {
          return parsed;
        }
      } catch (e) {
        /* ignore */
      }
    }
    return INITIAL_EMPTY_PROFILE;
  });

  // Workouts
  const [workouts, setWorkouts] = useState<Workout[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WORKOUTS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_WORKOUTS;
  });

  // Habits
  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.HABITS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_HABITS;
  });

  // Schedule
  const [schedule, setSchedule] = useState<ScheduleEvent[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SCHEDULE);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_SCHEDULE_EVENTS;
  });

  // Challenges
  const [challenges, setChallenges] = useState<Challenge[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CHALLENGES);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_CHALLENGES;
  });

  // Achievements
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_ACHIEVEMENTS;
  });

  // Meal Plan
  const [mealPlan, setMealPlan] = useState<MealPlan>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MEALPLAN);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_MEAL_PLAN;
  });

  // Groceries
  const [groceries, setGroceries] = useState<GroceryItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.GROCERIES);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [
      { id: 'g1', name: 'Haferflocken (Vollkorn)', category: 'Getreide', checked: true },
      { id: 'g2', name: 'Süßkartoffeln', category: 'Gemüse', checked: false },
      { id: 'g3', name: 'Kichererbsen (Dose)', category: 'Proteinquellen', checked: false },
      { id: 'g4', name: 'Äpfel & Clementinen', category: 'Obst', checked: false },
      { id: 'g5', name: 'Griechischer Joghurt / Tofu', category: 'Proteinquellen', checked: true },
      { id: 'g6', name: 'Chiasamen & Walnüsse', category: 'Sonstiges', checked: false },
    ];
  });

  // Wellness
  const [wellnessCheckIns, setWellnessCheckIns] = useState<WellnessCheckIn[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WELLNESS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_WELLNESS_CHECKINS;
  });

  // Chat
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CHAT);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [
      {
        id: 'c-welcome',
        sender: 'coach',
        content: `Hi ${userProfile.name}! Ich bin dein persönlicher Winter Arc Coach. Zusammen bauen wir gesunde Gewohnheiten auf, trainieren strukturiert und sorgen für optimale Erholung. Woran möchtest du heute arbeiten?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });

  const [isCoachLoading, setIsCoachLoading] = useState(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(workouts));
  }, [workouts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SCHEDULE, JSON.stringify(schedule));
  }, [schedule]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(challenges));
  }, [challenges]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
  }, [achievements]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MEALPLAN, JSON.stringify(mealPlan));
  }, [mealPlan]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GROCERIES, JSON.stringify(groceries));
  }, [groceries]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WELLNESS, JSON.stringify(wellnessCheckIns));
  }, [wellnessCheckIns]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CHAT, JSON.stringify(chatMessages));
  }, [chatMessages]);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...updates }));
  };

  const completeOnboarding = (profile: UserProfile) => {
    const updatedProfile: UserProfile = {
      ...profile,
      isOnboarded: true,
      isDemoUser: false,
      startDate: profile.startDate || new Date().toISOString().split('T')[0],
      targetEndDate: profile.targetEndDate || new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
    };
    setUserProfile(updatedProfile);

    // Build tailored schedule from user's workoutDays and commitments
    const newSchedule: ScheduleEvent[] = [];
    profile.commitments.forEach((c) => {
      newSchedule.push({
        id: 's-' + c.id,
        title: c.title,
        day: c.day,
        start: c.start,
        end: c.end,
        category: c.category as any,
        completed: false,
      });
    });

    profile.workoutDays.forEach((wDay, i) => {
      newSchedule.push({
        id: 's-wday-' + i,
        title: `${profile.sports[0] || 'Winter Arc'} Workout`,
        day: wDay,
        start: '17:00',
        end: '17:45',
        category: 'Training',
        completed: false,
      });
    });

    if (newSchedule.length > 0) {
      setSchedule(newSchedule);
    }

    // Personalized welcome message in coach chat
    const welcomeMsg: ChatMessage = {
      id: 'c-welcome-' + Date.now(),
      sender: 'coach',
      content: `Hi ${profile.name}! Willkommen in deinem persönlichen Winter Arc. Dein Profil ist eingerichtet: Deine Ziele (${profile.goals.slice(0, 3).join(', ')}), Sportarten (${profile.sports.join(', ') || 'Training'}) und deine geplanten ${profile.dailyTime} Min. pro Session sind hinterlegt. Ich begleite dich jeden Tag auf deinem Weg. Womit möchtest du heute starten?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setChatMessages([welcomeMsg]);

    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    setActiveTab('dashboard');
  };

  const unlockAchievement = (id: string) => {
    setAchievements((prev) => {
      const existing = prev.find((a) => a.id === id);
      if (existing && !existing.unlockedAt) {
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
        return prev.map((a) => (a.id === id ? { ...a, unlockedAt: new Date().toISOString().split('T')[0] } : a));
      }
      return prev;
    });
  };

  const addWorkout = (workout: Workout) => {
    setWorkouts((prev) => [workout, ...prev]);
  };

  const updateWorkout = (id: string, updates: Partial<Workout>) => {
    setWorkouts((prev) => prev.map((w) => (w.id === id ? { ...w, ...updates } : w)));
  };

  const deleteWorkout = (id: string) => {
    setWorkouts((prev) => prev.filter((w) => w.id !== id));
  };

  const completeWorkout = (id: string, rpe: 'Leicht' | 'Mittel' | 'Anstrengend', notes?: string) => {
    setWorkouts((prev) =>
      prev.map((w) =>
        w.id === id
          ? {
              ...w,
              completed: true,
              completedAt: new Date().toISOString().split('T')[0],
              rpeRating: rpe,
              notes: notes || w.notes,
            }
          : w
      )
    );
    unlockAchievement('ach-first-workout');
    setActiveWorkoutExecution(null);
    confetti({ particleCount: 80, spread: 80, origin: { y: 0.5 } });
  };

  const startWorkoutExecution = (workout: Workout) => {
    setActiveWorkoutExecution(workout);
  };

  const stopWorkoutExecution = () => {
    setActiveWorkoutExecution(null);
  };

  const toggleHabitToday = (habitId: string) => {
    const today = new Date().toISOString().split('T')[0];
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== habitId) return h;
        const alreadyDone = h.completedDates.includes(today);
        const newDates = alreadyDone
          ? h.completedDates.filter((d) => d !== today)
          : [...h.completedDates, today];
        return { ...h, completedDates: newDates };
      })
    );
  };

  const addHabit = (habitData: Omit<Habit, 'id' | 'completedDates' | 'createdAt'>) => {
    const newHabit: Habit = {
      ...habitData,
      id: 'h-' + Date.now(),
      completedDates: [],
      createdAt: new Date().toISOString().split('T')[0],
    };
    setHabits((prev) => [...prev, newHabit]);
  };

  const deleteHabit = (habitId: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== habitId));
  };

  const addScheduleEvent = (eventData: Omit<ScheduleEvent, 'id'>) => {
    const newEvent: ScheduleEvent = {
      ...eventData,
      id: 's-' + Date.now(),
    };
    setSchedule((prev) => [...prev, newEvent]);
    unlockAchievement('ach-week-planned');
  };

  const updateScheduleEvent = (id: string, updates: Partial<ScheduleEvent>) => {
    setSchedule((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const deleteScheduleEvent = (id: string) => {
    setSchedule((prev) => prev.filter((s) => s.id !== id));
  };

  const toggleScheduleEvent = (id: string) => {
    setSchedule((prev) => prev.map((s) => (s.id === id ? { ...s, completed: !s.completed } : s)));
  };

  const toggleChallengeTask = (challengeId: string, taskId: string) => {
    setChallenges((prev) =>
      prev.map((c) => {
        if (c.id !== challengeId) return c;
        const newTasks = c.tasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t));
        const allCompleted = newTasks.every((t) => t.completed);
        if (allCompleted && !c.completed) {
          confetti({ particleCount: 90, spread: 90, origin: { y: 0.6 } });
        }
        return {
          ...c,
          tasks: newTasks,
          completed: allCompleted,
        };
      })
    );
  };

  const addChallenge = (challengeData: Omit<Challenge, 'id' | 'completed'>) => {
    const newChallenge: Challenge = {
      ...challengeData,
      id: 'ch-' + Date.now(),
      completed: false,
    };
    setChallenges((prev) => [newChallenge, ...prev]);
  };

  const toggleGrocery = (id: string) => {
    setGroceries((prev) => prev.map((g) => (g.id === id ? { ...g, checked: !g.checked } : g)));
  };

  const addGrocery = (name: string, category: GroceryItem['category']) => {
    setGroceries((prev) => [{ id: 'g-' + Date.now(), name, category, checked: false }, ...prev]);
  };

  const removeGrocery = (id: string) => {
    setGroceries((prev) => prev.filter((g) => g.id !== id));
  };

  const clearCheckedGroceries = () => {
    setGroceries((prev) => prev.filter((g) => !g.checked));
  };

  const populateGroceriesFromMealPlan = () => {
    const newItems: GroceryItem[] = [];
    const allIngredients = [
      ...mealPlan.meals.breakfast.ingredients,
      ...mealPlan.meals.lunch.ingredients,
      ...mealPlan.meals.dinner.ingredients,
      ...mealPlan.meals.snacks.flatMap((s) => s.ingredients),
    ];

    allIngredients.forEach((ing, idx) => {
      const lower = ing.toLowerCase();
      let cat: GroceryItem['category'] = 'Sonstiges';
      if (lower.includes('apfel') || lower.includes('beeren') || lower.includes('clementine') || lower.includes('obst') || lower.includes('zitrone')) cat = 'Obst';
      else if (lower.includes('zucchini') || lower.includes('spinat') || lower.includes('brokkoli') || lower.includes('paprika') || lower.includes('gemüse') || lower.includes('karotte') || lower.includes('gurke') || lower.includes('kürbis')) cat = 'Gemüse';
      else if (lower.includes('milch') || lower.includes('joghurt') || lower.includes('quark') || lower.includes('käse') || lower.includes('frischkäse') || lower.includes('feta')) cat = 'Milchprodukte';
      else if (lower.includes('haferflocken') || lower.includes('quinoa') || lower.includes('reis') || lower.includes('brot') || lower.includes('dinkel') || lower.includes('nudeln')) cat = 'Getreide';
      else if (lower.includes('lachs') || lower.includes('tofu') || lower.includes('kichererbsen') || lower.includes('linsen') || lower.includes('ei') || lower.includes('hähnchen')) cat = 'Proteinquellen';

      newItems.push({
        id: `g-gen-${Date.now()}-${idx}`,
        name: ing,
        category: cat,
        checked: false,
      });
    });

    setGroceries((prev) => {
      const existingNames = new Set(prev.map((g) => g.name.toLowerCase()));
      const filtered = newItems.filter((item) => !existingNames.has(item.name.toLowerCase()));
      return [...filtered, ...prev];
    });
  };

  const addWellnessCheckIn = (checkIn: WellnessCheckIn) => {
    setWellnessCheckIns((prev) => {
      const filtered = prev.filter((c) => c.date !== checkIn.date);
      return [checkIn, ...filtered];
    });
    unlockAchievement('ach-recovery-hero');
  };

  const sendMessageToCoach = async (content: string) => {
    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setIsCoachLoading(true);

    try {
      const res = await fetch('/api/ai/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...chatMessages, userMsg],
          userProfile,
          activeWorkout: workouts[0],
          habits,
        }),
      });

      if (!res.ok) throw new Error('API request failed');
      const data = await res.json();

      const coachMsg: ChatMessage = {
        id: 'msg-coach-' + Date.now(),
        sender: 'coach',
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages((prev) => [...prev, coachMsg]);
    } catch (err) {
      console.error('Coach request error:', err);
      const fallbackCoachMsg: ChatMessage = {
        id: 'msg-coach-err-' + Date.now(),
        sender: 'coach',
        content: `Klasse Einsatz, ${userProfile.name}! Ich bin bereit für deine nächste Session. Konzentriere dich auf saubere Ausführung und ausreichend Regeneration. Was möchtest du heute als Nächstes anpacken?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages((prev) => [...prev, fallbackCoachMsg]);
    } finally {
      setIsCoachLoading(false);
    }
  };

  const resetToDemo = () => {
    setUserProfile(DEMO_USER_PROFILE);
    setWorkouts(INITIAL_WORKOUTS);
    setHabits(INITIAL_HABITS);
    setSchedule(INITIAL_SCHEDULE_EVENTS);
    setChallenges(INITIAL_CHALLENGES);
    setAchievements(INITIAL_ACHIEVEMENTS);
    setMealPlan(INITIAL_MEAL_PLAN);
    setWellnessCheckIns(INITIAL_WELLNESS_CHECKINS);
    localStorage.clear();
    setActiveTab('dashboard');
  };

  const clearAllData = () => {
    const emptyProfile: UserProfile = {
      id: 'fresh-user-' + Date.now(),
      name: '',
      ageGroup: '18-24',
      goals: [],
      sports: [],
      experience: 'Anfänger',
      equipment: [],
      dailyTime: 30,
      workoutDays: [],
      commitments: [],
      nutritionGoals: [],
      allergies: [],
      dietaryType: 'Ausgewogen',
      dislikes: [],
      sleepTime: '22:30',
      wakeTime: '06:30',
      recoveryGoals: [],
      startDate: new Date().toISOString().split('T')[0],
      targetEndDate: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
      isOnboarded: false,
      isDemoUser: false,
    };
    setUserProfile(emptyProfile);
    setWorkouts([]);
    setHabits([]);
    setSchedule([]);
    setChallenges([]);
    setGroceries([]);
    setWellnessCheckIns([]);
    setChatMessages([]);
    localStorage.clear();
  };

  const exportData = () => {
    const data = {
      userProfile,
      workouts,
      habits,
      schedule,
      challenges,
      achievements,
      mealPlan,
      groceries,
      wellnessCheckIns,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Winter_Arc_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AppContext.Provider
      value={{
        userProfile,
        setUserProfile,
        updateProfile,
        completeOnboarding,
        workouts,
        addWorkout,
        updateWorkout,
        deleteWorkout,
        completeWorkout,
        activeWorkoutExecution,
        startWorkoutExecution,
        stopWorkoutExecution,
        habits,
        toggleHabitToday,
        addHabit,
        deleteHabit,
        schedule,
        addScheduleEvent,
        updateScheduleEvent,
        deleteScheduleEvent,
        toggleScheduleEvent,
        challenges,
        toggleChallengeTask,
        addChallenge,
        achievements,
        unlockAchievement,
        mealPlan,
        setMealPlan,
        groceries,
        toggleGrocery,
        addGrocery,
        removeGrocery,
        clearCheckedGroceries,
        populateGroceriesFromMealPlan,
        wellnessCheckIns,
        addWellnessCheckIn,
        chatMessages,
        sendMessageToCoach,
        isCoachLoading,
        activeTab,
        setActiveTab,
        resetToDemo,
        clearAllData,
        exportData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
