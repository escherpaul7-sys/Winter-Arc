import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Google Gen AI client if key is present
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  try {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('Failed to initialize Google Gen AI client:', err);
  }
}

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(apiKey && ai),
    mode: process.env.NODE_ENV || 'development',
  });
});

// AI Coach Chat Endpoint
app.post('/api/ai/coach', async (req: Request, res: Response) => {
  const { messages, userProfile, activeWorkout, habits } = req.body;

  const userMessage = messages && messages.length > 0 ? messages[messages.length - 1].content : '';

  if (!userMessage) {
    return res.status(400).json({ error: 'Message content is required' });
  }

  // Construct system prompt with rich user context and safety guidelines
  const systemInstruction = `
You are the personal AI Coach for Winter Arc AI.
Your tone is friendly, professional, motivating, realistic, and empathetic.
You encourage sustainable habit building, structured workouts, healthy nutrition, and consistent recovery.
SAFETY RULES (CRITICAL):
- Never promote extreme self-optimization, crash diets, rapid weight loss, or dehydration.
- Emphasize proper recovery, adequate sleep, and mindful listening to one's body.
- For teens or beginners: prioritize clean execution, sensible loading, and guidance from qualified adults.
- Do not diagnose medical conditions. If pain, injury, sickness, or illness is mentioned, advise rest and consulting a physician.

User Context:
- Name: ${userProfile?.name || 'Athlete'}
- Age group: ${userProfile?.ageGroup || 'General'}
- Goals: ${userProfile?.goals?.join(', ') || 'General fitness and habit building'}
- Sports: ${userProfile?.sports?.join(', ') || 'Mixed'}
- Experience level: ${userProfile?.experience || 'Intermediate'}
- Available equipment: ${userProfile?.equipment?.join(', ') || 'Bodyweight'}
- Daily training time: ${userProfile?.dailyTime || '45'} minutes
- Daily commitments: ${userProfile?.commitments?.map((c: any) => `${c.title} (${c.start}-${c.end})`).join(', ') || 'Standard day'}
- Nutrition focus: ${userProfile?.nutritionGoals?.join(', ') || 'Balanced nutrition'}
- Sleep target: ${userProfile?.sleepTime || '22:30'} to ${userProfile?.wakeTime || '06:30'}
${activeWorkout ? `- Current/Today's Workout: ${activeWorkout.name} (${activeWorkout.duration} min)` : ''}
${habits && habits.length ? `- Tracked Habits: ${habits.map((h: any) => h.name).join(', ')}` : ''}

Respond in the language the user speaks (German or English). Default to German if the prompt is in German.
Keep answers concise, actionable, and encouraging (2-4 paragraphs max). Offer practical next steps.
`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: userMessage,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const reply = response.text || 'Ich bin hier, um dich bei deinem Winter Arc zu unterstützen. Wie kann ich heute helfen?';
      return res.json({ reply });
    } catch (error: any) {
      console.error('Gemini coach error:', error);
      // Fallback seamlessly
    }
  }

  // High quality context-aware algorithmic response fallback
  const fallbackReply = generateFallbackCoachReply(userMessage, userProfile);
  return res.json({ reply: fallbackReply });
});

// AI Workout Generation Endpoint
app.post('/api/ai/generate-workout', async (req: Request, res: Response) => {
  const { goal, sports, duration, experience, equipment, intensity, muscleGroup, limitations } = req.body;

  const prompt = `
Generate a structured, safe, and motivating workout session for a user with the following profile:
- Primary Goal: ${goal || 'General Fitness'}
- Target Sports: ${Array.isArray(sports) ? sports.join(', ') : sports || 'Fitness'}
- Available Duration: ${duration || 30} minutes
- Experience: ${experience || 'Beginner'}
- Equipment: ${Array.isArray(equipment) ? equipment.join(', ') : equipment || 'None / Bodyweight'}
- Intensity: ${intensity || 'Medium'}
- Target Muscle Groups / Focus: ${muscleGroup || 'Full Body'}
- Limitations / Notes: ${limitations || 'None'}

Return ONLY valid JSON matching this schema:
{
  "name": "string",
  "category": "Strength" | "Cardio" | "Mobility" | "Sport-Specific" | "Recovery" | "Bodyweight",
  "duration": number,
  "intensity": "Light" | "Medium" | "High",
  "goal": "string",
  "warmup": [
    { "name": "string", "duration": "string", "instruction": "string" }
  ],
  "exercises": [
    {
      "name": "string",
      "category": "string",
      "targetArea": "string",
      "equipment": "string",
      "sets": number,
      "reps": "string",
      "rest": number,
      "instruction": "string",
      "safetyNote": "string",
      "alternative": "string"
    }
  ],
  "cooldown": [
    { "name": "string", "duration": "string", "instruction": "string" }
  ]
}
`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.5,
        },
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        return res.json(parsed);
      }
    } catch (err) {
      console.error('Gemini workout generation error:', err);
    }
  }

  // Structured fallback
  const fallbackWorkout = generateFallbackWorkout({
    goal,
    duration: Number(duration) || 35,
    experience,
    equipment: Array.isArray(equipment) ? equipment : [equipment || 'Bodyweight'],
    muscleGroup,
  });

  return res.json(fallbackWorkout);
});

// AI Nutrition Planner Endpoint
app.post('/api/ai/generate-mealplan', async (req: Request, res: Response) => {
  const { preferences, allergies, dietaryType, dislikes, goals } = req.body;

  const prompt = `
Create a healthy, balanced, non-restrictive 1-day or multi-meal nutrition plan for a Winter Arc athlete:
- Dietary type: ${dietaryType || 'Balanced'}
- Goals: ${Array.isArray(goals) ? goals.join(', ') : goals || 'Balanced nutrition and energy'}
- Allergies: ${Array.isArray(allergies) ? allergies.join(', ') : allergies || 'None'}
- Dislikes: ${Array.isArray(dislikes) ? dislikes.join(', ') : dislikes || 'None'}
- Preferences: ${preferences || 'Simple, nourishing winter meals'}

IMPORTANT: No crash dieting, no severe caloric restrictions. Emphasize whole foods, hydration, and sustained energy.

Return ONLY valid JSON with this schema:
{
  "dayTitle": "string",
  "focus": "string",
  "meals": {
    "breakfast": { "name": "string", "prepTime": "string", "caloriesApprox": "string", "ingredients": ["string"], "instructions": "string", "alternative": "string" },
    "lunch": { "name": "string", "prepTime": "string", "caloriesApprox": "string", "ingredients": ["string"], "instructions": "string", "alternative": "string" },
    "dinner": { "name": "string", "prepTime": "string", "caloriesApprox": "string", "ingredients": ["string"], "instructions": "string", "alternative": "string" },
    "snacks": [{ "name": "string", "ingredients": ["string"], "note": "string" }]
  },
  "hydrationTip": "string"
}
`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.6,
        },
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        return res.json(parsed);
      }
    } catch (err) {
      console.error('Gemini mealplan error:', err);
    }
  }

  const fallbackMealPlan = generateFallbackMealPlan(dietaryType, allergies);
  return res.json(fallbackMealPlan);
});

// Fallback logic generators
function generateFallbackCoachReply(msg: string, profile: any): string {
  const name = profile?.name ? ` ${profile.name}` : '';
  const lower = msg.toLowerCase();

  if (lower.includes('workout') || lower.includes('training') || lower.includes('sport')) {
    return `Klasse Einsatz${name}! Für deinen heutigen Winter Arc empfehle ich dir, den Fokus auf kontrollierte Bewegungsqualität zu legen. Starte mit 5 Minuten Warm-up (Armkreisen, Hip Openers), gefolgt von 3-4 Grundübungen mit sauberer Form. Denk daran: Kontinuität schlägt maximale Intensität. Geh direkt in den Workout-Bereich, um die Einheit mit dem integrierten Timer zu starten!`;
  }
  if (lower.includes('essen') || lower.includes('ernährung') || lower.includes('meal') || lower.includes('hunger')) {
    return `Eine nachhaltige Ernährung im Winter Arc bedeutet: Gib deinem Körper die Energie, die er für Kälte und Training braucht! Wärme dich mit warmen Haferflocken mit Beeren zum Frühstück, einer bunten Bowl mit komplexen Kohlenhydraten und Proteinen zum Mittag und trinke ausreichend lauwarmes Wasser oder ungesüßten Kräutertee über den Tag.`;
  }
  if (lower.includes('müde') || lower.includes('schlaf') || lower.includes('schmerz') || lower.includes('pause') || lower.includes('erholung')) {
    return `Höre auf deinen Körper! Ein Ruhetag oder aktive Mobilität ist kein verlorener Tag, sondern der Moment, in dem deine Muskeln regenerieren und deine mentale Energie zurückkehrt. Nimm dir heute Abend 10 Minuten für sanftes Stretching und dimme das Licht 45 Minuten vor dem Schlafen.`;
  }
  if (lower.includes('plan') || lower.includes('woche') || lower.includes('tagesplan')) {
    return `Struktur gibt Freiheit! Im Winter Arc teilen wir die Woche so auf, dass Schule, Arbeit und Vereinssport absolute Priorität haben und deine individuellen Einheiten stressfrei dazwischen passen. Sieh dir deinen Wochenplan an und passe Termine an, falls sich etwas verschoben hat.`;
  }

  return `Super, dass du an deinem Winter Arc arbeitest${name}! Dein Ziel ist es, Schritt für Schritt gesunde Gewohnheiten aufzubauen. Was möchtest du heute als Erstes anpacken: Dein Workout planen, die Ernährung abstimmen oder deine Gewohnheiten für den Tag abhaken?`;
}

function generateFallbackWorkout(params: any) {
  const isBeginner = params.experience === 'Anfänger' || params.experience === 'Beginner';
  const hasDumbbells = params.equipment?.some((e: string) => e.toLowerCase().includes('kurzhantel') || e.toLowerCase().includes('dumbbell'));

  return {
    name: 'Winter Arc Foundation Flow',
    category: 'Strength',
    duration: params.duration || 30,
    intensity: 'Medium',
    goal: params.goal || 'Allgemeine Fitness & Kraft',
    warmup: [
      { name: 'Armkreisen & Schulterkreisen', duration: '1:00 min', instruction: 'Große kontrollierte Kreise vorwärts und rückwärts zur Durchblutung der Gelenke.' },
      { name: 'Cat-Cow Mobilität', duration: '1:30 min', instruction: 'Im Vierfüßlerstand die Wirbelsäule sanft beugen und strecken mit ruhiger Atmung.' },
      { name: 'World’s Greatest Stretch', duration: '2:00 min', instruction: 'Ausfallschritt mit Rumpfrotation zur Mobilisierung von Hüfte und Brustwirbelsäule.' },
    ],
    exercises: [
      {
        name: hasDumbbells ? 'Goblet Squats mit Kurzhantel' : 'Bodyweight Air Squats',
        category: 'Beine / Unterkörper',
        targetArea: 'Quadrizeps, Gesäß, Core',
        equipment: hasDumbbells ? 'Kurzhantel' : 'Eigenes Körpergewicht',
        sets: isBeginner ? 3 : 4,
        reps: '10 - 12 Wdh.',
        rest: 60,
        instruction: 'Füße schulterbreit, Knie in Richtung der Zehenspitzen führen, Brust aufrecht halten und kontrolliert absenken.',
        safetyNote: 'Fersen bleiben fest am Boden. Nicht mit rundem Rücken federn.',
        alternative: 'Box Squats auf einen Stuhl',
      },
      {
        name: 'Liegestütze (Push-Ups)',
        category: 'Oberkörper Drücken',
        targetArea: 'Brust, vordere Schultern, Trizeps, Rumpf',
        equipment: 'Eigenes Körpergewicht',
        sets: 3,
        reps: isBeginner ? '6 - 8 Wdh.' : '10 - 15 Wdh.',
        rest: 60,
        instruction: 'Hände etwas weiter als schulterbreit, Körper bildet eine feste Linie von Kopf bis Ferse.',
        safetyNote: 'Kein Hohlkreuz bilden. Rumpf und Gesäß aktiv anspannen.',
        alternative: 'Liegestütze mit Händen erhöht auf einer Bank oder Tischkante',
      },
      {
        name: hasDumbbells ? 'Kurzhantel-Rudern vorgebeugt' : 'Inverted Row oder Handtuch-Zug',
        category: 'Oberkörper Ziehen',
        targetArea: 'Breiter Rückenmuskel, oberer Rücken, Bizeps',
        equipment: hasDumbbells ? 'Kurzhanteln' : 'Widerstandsband / Türanker',
        sets: 3,
        reps: '10 - 12 Wdh.',
        rest: 60,
        instruction: 'Oberkörper stabil vorgebeugt, Schulterblätter hinten unten zusammenführen, Gewichte zur Hüfte ziehen.',
        safetyNote: 'Lendenwirbelsäule neutral und gerade halten.',
        alternative: 'Band Rows im Sitzen mit Widerstandsband',
      },
      {
        name: 'Dead Bug Core Stabilizer',
        category: 'Core / Rumpf',
        targetArea: 'Tiefe Bauchmuskeln, Beckenboden',
        equipment: 'Matte / Boden',
        sets: 3,
        reps: '8 Wdh. pro Seite',
        rest: 45,
        instruction: 'Rückenlage, unterer Rücken flach auf der Matte. Diagonale Extremitäten langsam absenken.',
        safetyNote: 'Unterer Rücken darf nicht vom Boden abheben.',
        alternative: 'Plank auf den Unterarmen (30 Sekunden)',
      },
    ],
    cooldown: [
      { name: 'Child’s Pose (Kindeshaltung)', duration: '1:30 min', instruction: 'Hüfte auf die Fersen absenken, Arme nach vorne strecken, tief in den Bauch einatmen.' },
      { name: 'Oberschenkel-Stretching', duration: '1:30 min', instruction: 'Stehend oder liegend die Ferse zum Gesäß führen, Becken aufgerichtet halten.' },
    ],
  };
}

function generateFallbackMealPlan(_dietType: string, _allergies: any) {
  return {
    dayTitle: 'Winter Arc Balance Day',
    focus: 'Nachhaltige Energie, wärmende Mahlzeiten & ausreichende Proteinzufuhr',
    meals: {
      breakfast: {
        name: 'Warmer Winter-Porridge mit Waldbeeren & Zimt',
        prepTime: '10 min',
        caloriesApprox: '~420 kcal (ausgewogen)',
        ingredients: ['80g Haferflocken', '250ml Hafermilch oder fettarme Milch', '1 Handvoll Beeren', '1 EL Chiasamen', '1 Prise Zimt', '1 EL Nüsse oder Mandelmus'],
        instructions: 'Haferflocken mit Milch kurz aufkochen und 3 Minuten sanft köcheln lassen. Mit Zimt verfeinern und mit Beeren sowie Nüssen garnieren.',
        alternative: 'Vollkornbrot mit körnigem Frischkäse und Gurkenscheiben',
      },
      lunch: {
        name: 'Bunte Winter-Quinoa-Bowl mit geröstetem Ofengemüse',
        prepTime: '25 min',
        caloriesApprox: '~620 kcal (nahrhaft)',
        ingredients: ['100g Quinoa oder Vollkornreis', '1 Zucchini & 1 Paprika gewürfelt', '150g Kichererbsen oder Tofu/Hähnchenbrust', '1 EL Olivenöl', '1 EL Tahini/Zitronen-Dressing'],
        instructions: 'Quinoa gar kochen. Gemüse auf einem Backblech mit etwas Olivenöl bei 200°C 20 Min backen. Alles in einer Schale anrichten und mit Dressing beträufeln.',
        alternative: 'Linseneintopf mit Wurzelgemüse und Vollkornbrot',
      },
      dinner: {
        name: 'Wärmende Süßkartoffel-Kürbissuppe mit Kürbiskernen',
        prepTime: '20 min',
        caloriesApprox: '~510 kcal',
        ingredients: ['1 kleine Süßkartoffel', '200g Butternut-Kürbis', '1 Schuss fettreduzierte Kokosmilch', 'Gemüsebrühe', 'Kürbiskerne geröstet', '1 Scheibe Dinkelbrot'],
        instructions: 'Gemüse würfeln, in Brühe weich kochen, fein pürieren, mit etwas Kokosmilch und Ingwer abschmecken. Mit Kürbiskernen bestreuen.',
        alternative: 'Gebackene Ofenkartoffel mit Kräuterquark und Beilagensalat',
      },
      snacks: [
        { name: 'Apfelschnitze mit 1 TL Erdnussmus', ingredients: ['1 Apfel', '1 TL Erdnussmus'], note: 'Schneller Snack vor dem Training' },
        { name: 'Kräutertee & 1 Handvoll Walnüsse', ingredients: ['Frischer Minztee', '20g Walnüsse'], note: 'Perfekt für den Nachmittag' },
      ],
    },
    hydrationTip: 'Trinke mindestens 2 bis 2,5 Liter Flüssigkeit über den Tag (Wasser, ungesüßter Tee).',
  };
}

// In development, hook Vite middleware; in production serve dist
async function setupVite() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Winter Arc AI running on port ${PORT}`);
  });
}

setupVite().catch((err) => {
  console.error('Server startup failed:', err);
  process.exit(1);
});
