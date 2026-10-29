export type AgeGroup = 'Unter 18' | '18-24' | '25-34' | '35+';
export type ExperienceLevel = 'Anfänger' | 'Fortgeschritten' | 'Erfahren';
export type WorkoutIntensity = 'Light' | 'Medium' | 'High';
export type WorkoutCategory = 'Strength' | 'Cardio' | 'Mobility' | 'Sport-Specific' | 'Recovery' | 'Bodyweight';
export type HabitCategory = 'Fitness' | 'Health' | 'Mindset' | 'Organization' | 'Recovery';
export type ChallengeCategory = 'Fitness' | 'Lifestyle' | 'Learning' | 'Recovery';

export interface Commitment {
  id: string;
  title: string;
  category: 'Schule/Arbeit' | 'Vereinssport' | 'Lernen' | 'Freizeit' | 'Sonstiges';
  day: string;
  start: string;
  end: string;
}

export interface UserProfile {
  id: string;
  name: string;
  ageGroup: AgeGroup;
  goals: string[];
  sports: string[];
  experience: ExperienceLevel;
  equipment: string[];
  dailyTime: number; // minutes
  workoutDays: string[];
  commitments: Commitment[];
  nutritionGoals: string[];
  allergies: string[];
  dietaryType: string;
  dislikes: string[];
  sleepTime: string;
  wakeTime: string;
  recoveryGoals: string[];
  startDate: string;
  targetEndDate: string;
  isOnboarded: boolean;
  isDemoUser?: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  category: string;
  targetArea: string;
  equipment: string;
  sets: number;
  reps: string;
  rest: number; // in seconds
  instruction: string;
  safetyNote: string;
  alternative: string;
}

export interface Workout {
  id: string;
  name: string;
  category: WorkoutCategory;
  duration: number;
  intensity: WorkoutIntensity;
  goal: string;
  date?: string;
  completed?: boolean;
  completedAt?: string;
  rpeRating?: 'Leicht' | 'Mittel' | 'Anstrengend';
  notes?: string;
  warmup: Array<{ name: string; duration: string; instruction: string }>;
  exercises: Exercise[];
  cooldown: Array<{ name: string; duration: string; instruction: string }>;
}

export interface Habit {
  id: string;
  name: string;
  description: string;
  category: HabitCategory;
  targetPerDay: string;
  frequency: 'Täglich' | 'Wochentags' | 'Wochenende';
  completedDates: string[]; // array of "YYYY-MM-DD"
  createdAt: string;
}

export interface MealItem {
  name: string;
  prepTime: string;
  caloriesApprox: string;
  ingredients: string[];
  instructions: string;
  alternative: string;
}

export interface MealPlan {
  dayTitle: string;
  focus: string;
  meals: {
    breakfast: MealItem;
    lunch: MealItem;
    dinner: MealItem;
    snacks: Array<{ name: string; ingredients: string[]; note: string }>;
  };
  hydrationTip: string;
}

export interface GroceryItem {
  id: string;
  name: string;
  category: 'Obst' | 'Gemüse' | 'Milchprodukte' | 'Getreide' | 'Proteinquellen' | 'Sonstiges';
  checked: boolean;
}

export interface ScheduleEvent {
  id: string;
  title: string;
  day: string; // 'Montag', 'Dienstag', etc.
  start: string; // 'HH:MM'
  end: string; // 'HH:MM'
  category: 'Schule/Arbeit' | 'Training' | 'Vereinssport' | 'Mahlzeit' | 'Erholung' | 'Lernen' | 'Schlaf';
  completed?: boolean;
  notes?: string;
}

export interface ChallengeTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  category: ChallengeCategory;
  durationDays: number;
  startDate: string;
  tasks: ChallengeTask[];
  completed: boolean;
  icon?: string;
}

export interface WellnessCheckIn {
  date: string; // YYYY-MM-DD
  energy: number; // 1-10
  sleepQuality: number; // 1-10
  soreness: number; // 1-10
  stress: number; // 1-10
  notes?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'coach';
  content: string;
  timestamp: string;
}
