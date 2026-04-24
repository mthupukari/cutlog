import { defaultProfile } from "../data/mockData";
import { isSupabaseConfigured, supabase } from "./supabase";

function buildDefaultMealPreferences(profile = defaultProfile) {
  return {
    mealPreferences: profile.mealPreferences,
    prepConstraints: profile.prepConstraints,
  };
}

export async function ensureProfileForUser(user, fallbackProfile = defaultProfile) {
  if (!isSupabaseConfigured || !supabase || !user) {
    return fallbackProfile;
  }

  const { data: existingProfile, error: selectError } = await supabase
    .from("profiles")
    .select("*")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (selectError) {
    throw selectError;
  }

  if (existingProfile) {
    return {
      id: existingProfile.id,
      displayName: existingProfile.display_name || fallbackProfile.displayName,
      email: existingProfile.email || user.email || fallbackProfile.email,
      currentWeightLb: Number(existingProfile.current_weight_lb || fallbackProfile.currentWeightLb),
      goalWeightLb: Number(existingProfile.goal_weight_lb || fallbackProfile.goalWeightLb),
      dailyCalorieTarget: Number(existingProfile.daily_calorie_target || fallbackProfile.dailyCalorieTarget),
      dailyProteinTarget: Number(existingProfile.daily_protein_target || fallbackProfile.dailyProteinTarget),
      dailyWaterGoalOz: Number(existingProfile.daily_water_goal_oz || fallbackProfile.dailyWaterGoalOz),
      dietaryRestrictions: existingProfile.dietary_restrictions || fallbackProfile.dietaryRestrictions,
      mealPreferences:
        existingProfile.meal_preferences?.mealPreferences || existingProfile.meal_preferences || fallbackProfile.mealPreferences,
      prepConstraints: existingProfile.meal_preferences?.prepConstraints || fallbackProfile.prepConstraints,
    };
  }

  const payload = {
    auth_user_id: user.id,
    email: user.email || fallbackProfile.email,
    display_name: fallbackProfile.displayName,
    current_weight_lb: fallbackProfile.currentWeightLb,
    goal_weight_lb: fallbackProfile.goalWeightLb,
    daily_calorie_target: fallbackProfile.dailyCalorieTarget,
    daily_protein_target: fallbackProfile.dailyProteinTarget,
    daily_water_goal_oz: fallbackProfile.dailyWaterGoalOz,
    dietary_restrictions: fallbackProfile.dietaryRestrictions,
    meal_preferences: buildDefaultMealPreferences(fallbackProfile),
  };

  const { data: createdProfile, error: insertError } = await supabase.from("profiles").insert(payload).select("*").single();

  if (insertError) {
    throw insertError;
  }

  return {
    id: createdProfile.id,
    displayName: createdProfile.display_name,
    email: createdProfile.email,
    currentWeightLb: Number(createdProfile.current_weight_lb),
    goalWeightLb: Number(createdProfile.goal_weight_lb),
    dailyCalorieTarget: Number(createdProfile.daily_calorie_target),
    dailyProteinTarget: Number(createdProfile.daily_protein_target),
    dailyWaterGoalOz: Number(createdProfile.daily_water_goal_oz),
    dietaryRestrictions: createdProfile.dietary_restrictions || [],
    mealPreferences: createdProfile.meal_preferences?.mealPreferences || fallbackProfile.mealPreferences,
    prepConstraints: createdProfile.meal_preferences?.prepConstraints || fallbackProfile.prepConstraints,
  };
}

export async function updateProfile(profile) {
  if (!isSupabaseConfigured || !supabase || !profile?.id) {
    return profile;
  }

  const payload = {
    display_name: profile.displayName,
    email: profile.email,
    current_weight_lb: profile.currentWeightLb,
    goal_weight_lb: profile.goalWeightLb,
    daily_calorie_target: profile.dailyCalorieTarget,
    daily_protein_target: profile.dailyProteinTarget,
    daily_water_goal_oz: profile.dailyWaterGoalOz,
    dietary_restrictions: profile.dietaryRestrictions,
    meal_preferences: {
      mealPreferences: profile.mealPreferences,
      prepConstraints: profile.prepConstraints,
    },
  };

  const { error } = await supabase.from("profiles").update(payload).eq("id", profile.id);
  if (error) {
    throw error;
  }

  return profile;
}
