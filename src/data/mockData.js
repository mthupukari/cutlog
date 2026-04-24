import { mealLibrary, mealPlanTemplates } from "./mealLibrary";

const today = new Date();
const isoToday = today.toISOString();

export const defaultProfile = {
  id: "profile_mahit",
  displayName: "Mahit",
  email: "mahit.thupukari10@gmail.com",
  currentWeightLb: 195,
  goalWeightLb: 170,
  dailyCalorieTarget: 1800,
  dailyProteinTarget: 175,
  dailyWaterGoalOz: 120,
  dietaryRestrictions: ["No beef", "No pork", "No fish"],
  mealPreferences: ["Chicken", "Shrimp", "Meal prep", "Air fryer", "Instant Pot"],
  prepConstraints: ["Sunday prep", "Friday WFH", "1 night out / week"],
};

export const defaultFoodLogs = [
  {
    id: "log_breakfast",
    source: "manual",
    mealLabel: "Breakfast",
    note: "Oikos Pro + banana + black coffee",
    eatenAt: isoToday,
    correctedMacros: { calories: 230, protein: 20, carbs: 27, fat: 2 },
  },
  {
    id: "log_snack",
    source: "manual",
    mealLabel: "Afternoon snack",
    note: "Oikos Pro plain",
    eatenAt: isoToday,
    correctedMacros: { calories: 130, protein: 20, carbs: 8, fat: 0 },
  },
];

export const defaultWaterEntries = [
  { id: "water_1", amountOz: 24, loggedAt: isoToday },
  { id: "water_2", amountOz: 16, loggedAt: isoToday },
  { id: "water_3", amountOz: 12, loggedAt: isoToday },
];

export const defaultChatThread = {
  id: "thread_nutrition_coach",
  title: "Nutrition Coach",
  messages: [
    {
      id: "msg_welcome",
      role: "assistant",
      content: "I’ve got your current targets, today’s food log, water progress, and weekly meal plan in view. Ask me anything about calories, protein, swaps, cravings, or meal prep.",
    },
  ],
};

export const defaultAuthState = {
  email: defaultProfile.email,
  mode: "demo",
  status: "signed_in",
};

export const starterWeekPlan = {
  ...mealPlanTemplates[0],
  generatedAt: isoToday,
  status: "draft",
  rationale:
    "High-protein week anchored on your proven meal-prep favorites. Monday and Wednesday are batch-cook dinners, Friday is a double-duty WFH lunch + dinner, and Saturday stays flexible for a night out.",
};

export const demoPhotoEstimate = {
  id: "estimate_demo",
  mealLabel: "Chicken rice bowl",
  note: "Looks like a meal-prep bowl with grilled chicken, rice, and roasted vegetables.",
  confidence: 0.81,
  explanation: "Estimate is based on a palm-sized lean protein, about one cup of starch, and a moderate amount of vegetables and sauce.",
  macros: { calories: 610, protein: 42, carbs: 51, fat: 18 },
};

export const generatedMealBlueprints = [
  {
    id: "ai_honey_chipotle_chicken_bowl",
    title: "AI Honey Chipotle Chicken Bowl",
    cuisine: "Tex-Mex",
    source: "ai_generated",
    tags: ["generated", "weekly-plan"],
    macros: { calories: 505, protein: 47, carbs: 31, fat: 14 },
    groceryStore: "Whole Foods + Costco",
    ingredients: ["Chicken thighs", "Chipotle", "Honey", "Brown rice", "Corn salsa", "Greek yogurt crema"],
    cookMethods: ["airfryer"],
    steps: [
      "Marinate chicken with chipotle, lime, and honey.",
      "Air fry until charred and juicy.",
      "Serve over rice with salsa and yogurt crema.",
    ],
  },
];

export const seededRecipesById = Object.fromEntries(mealLibrary.map((meal) => [meal.id, meal]));
