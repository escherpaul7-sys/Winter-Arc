import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AppLayout } from './components/layout/AppLayout';
import { OnboardingWizard } from './components/onboarding/OnboardingWizard';
import { Dashboard } from './components/dashboard/Dashboard';
import { WorkoutGenerator } from './components/workouts/WorkoutGenerator';
import { WorkoutPlayer } from './components/workouts/WorkoutPlayer';
import { WeeklyTrainingPlanner } from './components/plan/WeeklyTrainingPlanner';
import { NutritionAI } from './components/nutrition/NutritionAI';
import { HabitTracker } from './components/habits/HabitTracker';
import { DailySchedulePlanner } from './components/schedule/DailySchedulePlanner';
import { AICoachChat } from './components/coach/AICoachChat';
import { ProgressDashboard } from './components/progress/ProgressDashboard';
import { ChallengeSystem } from './components/challenges/ChallengeSystem';
import { RecoveryWellness } from './components/recovery/RecoveryWellness';
import { SettingsView } from './components/settings/SettingsView';

const MainView: React.FC = () => {
  const { userProfile, activeTab, activeWorkoutExecution, stopWorkoutExecution } = useApp();

  if (!userProfile.isOnboarded) {
    return <OnboardingWizard />;
  }

  return (
    <AppLayout>
      {activeTab === 'dashboard' && <Dashboard />}
      {activeTab === 'workouts' && <WorkoutGenerator />}
      {activeTab === 'plan' && <WeeklyTrainingPlanner />}
      {activeTab === 'nutrition' && <NutritionAI />}
      {activeTab === 'habits' && <HabitTracker />}
      {activeTab === 'schedule' && <DailySchedulePlanner />}
      {activeTab === 'coach' && <AICoachChat />}
      {activeTab === 'progress' && <ProgressDashboard />}
      {activeTab === 'challenges' && <ChallengeSystem />}
      {activeTab === 'recovery' && <RecoveryWellness />}
      {activeTab === 'settings' && <SettingsView />}

      {/* Live Interactive Workout Player Modal */}
      {activeWorkoutExecution && (
        <WorkoutPlayer
          workout={activeWorkoutExecution}
          onClose={stopWorkoutExecution}
        />
      )}
    </AppLayout>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainView />
    </AppProvider>
  );
}
