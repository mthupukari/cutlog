import { generatedMealBlueprints } from "../data/mockData";
import { mealLibrary, mealPlanTemplates } from "../data/mealLibrary";

const dayOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getMealById(id) {
  return mealLibrary.find((meal) => meal.id === id) || generatedMealBlueprints.find((meal) => meal.id === id);
}

function summarizeMacros(planDays) {
  return planDays.reduce(
    (acc, day) => {
      if (!day.mealId) {
        return acc;
      }

      const meal = getMealById(day.mealId);
      if (!meal) {
        return acc;
      }

      acc.calories += meal.macros.calories;
      acc.protein += meal.macros.protein;
      acc.carbs += meal.macros.carbs;
      acc.fat += meal.macros.fat;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  );
}

function aggregateGroceryList(planDays) {
  const grouped = {};

  planDays.forEach((day) => {
    const meal = getMealById(day.mealId);
    if (!meal) {
      return;
    }

    const store = meal.groceryStore || "General";
    grouped[store] = grouped[store] || [];
    meal.ingredients.forEach((ingredient) => {
      if (!grouped[store].includes(ingredient)) {
        grouped[store].push(ingredient);
      }
    });
  });

  return grouped;
}

export function generateWeeklyPlan({ profile, existingPlanIndex = 0, includeGeneratedMeal = true }) {
  const template = mealPlanTemplates[existingPlanIndex % mealPlanTemplates.length];
  const generatedMeal = generatedMealBlueprints[0];

  const planDays = template.meals.map((day, index) => {
    if (includeGeneratedMeal && day.day === "Sun") {
      return {
        ...day,
        mealId: generatedMeal.id,
        locked: false,
        note: "AI generated to keep the week from feeling repetitive while still matching your macro target.",
        dayIndex: index,
      };
    }

    return {
      ...day,
      locked: false,
      dayIndex: index,
    };
  });

  const macroSummary = summarizeMacros(planDays);
  const groceryItems = aggregateGroceryList(planDays);

  return {
    id: `plan_${template.id}_${Date.now()}`,
    theme: template.theme,
    status: "draft",
    planDays,
    groceryItems,
    macroSummary,
    rationale: `Built around ${profile.displayName}'s ${profile.dailyCalorieTarget} calorie target, ${profile.dailyProteinTarget}g protein target, and Sunday meal-prep cadence. One generated meal was introduced for novelty without leaving the core library.`,
  };
}

export function swapMealInPlan({ plan, dayIndex }) {
  const day = plan.planDays[dayIndex];
  if (!day || !day.mealId || day.locked) {
    return plan;
  }

  const libraryIds = mealLibrary
    .filter((meal) => meal.id !== day.mealId)
    .map((meal) => meal.id)
    .sort((a, b) => dayOrder.indexOf(plan.planDays[dayIndex].day) - dayOrder.indexOf(plan.planDays[dayIndex].day) || a.localeCompare(b));

  const nextMealId = libraryIds[dayIndex % libraryIds.length];

  const nextPlanDays = plan.planDays.map((planDay, index) =>
    index === dayIndex
      ? {
          ...planDay,
          mealId: nextMealId,
          note: "Swapped from the mobile plan editor.",
        }
      : planDay,
  );

  return {
    ...plan,
    planDays: nextPlanDays,
    groceryItems: aggregateGroceryList(nextPlanDays),
    macroSummary: summarizeMacros(nextPlanDays),
  };
}

export function toggleMealLock({ plan, dayIndex }) {
  return {
    ...plan,
    planDays: plan.planDays.map((day, index) => (index === dayIndex ? { ...day, locked: !day.locked } : day)),
  };
}

export function getPlanMeal(day) {
  if (!day?.mealId) {
    return null;
  }

  return getMealById(day.mealId);
}
