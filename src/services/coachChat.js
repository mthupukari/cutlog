export function createCoachResponse({ message, profile, totals, waterProgress, currentPlan }) {
  const lower = message.toLowerCase();

  if (lower.includes("protein")) {
    return {
      content: `You’re at ${totals.protein}g of protein today against a ${profile.dailyProteinTarget}g target. The easiest close-out move is a lean dinner or one more Oikos Pro-style snack if you’re short by bedtime.`,
    };
  }

  if (lower.includes("water")) {
    return {
      content: `Water is at ${waterProgress.consumedOz}oz of ${waterProgress.goalOz}oz. One 24oz bottle now and one with dinner would put you right back on target.`,
    };
  }

  if (lower.includes("swap") || lower.includes("change friday")) {
    const friday = currentPlan.planDays.find((day) => day.day === "Fri");
    return {
      content: `I’d swap Friday’s ${friday?.mealId ? "planned meal" : "meal"} for something with similar protein but a fresher flavor profile. I queued a suggested plan edit you can apply in one tap.`,
      action: {
        type: "swap_day",
        targetDay: "Fri",
      },
    };
  }

  if (lower.includes("calories") || lower.includes("deficit")) {
    return {
      content: `Logged calories are ${totals.calories} so far today against a ${profile.dailyCalorieTarget} target. That leaves room for a solid dinner without forcing a tiny meal.`,
    };
  }

  return {
    content: "Your plan is still aligned: protein-forward meals, one flexible night out, and enough structure to keep weekday decisions light. If you want, ask me to tighten calories, boost variety, or change a specific day.",
  };
}
