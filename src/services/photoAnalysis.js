import * as ImagePicker from "expo-image-picker";

import { demoPhotoEstimate } from "../data/mockData";

function buildEstimateFromNote(note) {
  const lower = note.toLowerCase();

  if (lower.includes("chicken") && lower.includes("rice")) {
    return {
      mealLabel: "Chicken rice bowl",
      confidence: 0.84,
      explanation: "Detected a lean protein bowl with a rice base and moderate sauce load, which usually lands in a steady cut-friendly calorie range.",
      macros: { calories: 610, protein: 44, carbs: 52, fat: 18 },
    };
  }

  if (lower.includes("oikos") || lower.includes("yogurt")) {
    return {
      mealLabel: "Protein yogurt snack",
      confidence: 0.89,
      explanation: "This reads like a high-protein snack with a predictable macro profile, especially when it includes Greek yogurt or Oikos.",
      macros: { calories: 220, protein: 20, carbs: 24, fat: 4 },
    };
  }

  if (lower.includes("shrimp")) {
    return {
      mealLabel: "Shrimp plate",
      confidence: 0.77,
      explanation: "Shrimp-based meals usually stay protein-forward with lower fat unless there is a heavy sauce or starch portion.",
      macros: { calories: 470, protein: 39, carbs: 28, fat: 16 },
    };
  }

  if (lower.includes("wrap") || lower.includes("sandwich")) {
    return {
      mealLabel: "Wrap or sandwich meal",
      confidence: 0.71,
      explanation: "Detected a handheld meal pattern with moderate carbs from bread or tortilla and a likely medium-fat condiment profile.",
      macros: { calories: 560, protein: 33, carbs: 48, fat: 24 },
    };
  }

  if (lower.includes("salad")) {
    return {
      mealLabel: "Protein salad",
      confidence: 0.76,
      explanation: "Detected a lighter meal pattern with lean protein, greens, and moderate dressing.",
      macros: { calories: 430, protein: 35, carbs: 18, fat: 22 },
    };
  }

  if (lower.includes("burrito") || lower.includes("taco")) {
    return {
      mealLabel: "Tex-Mex plate",
      confidence: 0.72,
      explanation: "Detected a heavier carb + protein profile with a moderate fat load from tortillas or toppings.",
      macros: { calories: 690, protein: 38, carbs: 64, fat: 28 },
    };
  }

  if (lower.includes("pasta")) {
    return {
      mealLabel: "Pasta meal",
      confidence: 0.67,
      explanation: "Pasta usually means a larger carb serving, with total calories driven mostly by portion size and added fats in the sauce.",
      macros: { calories: 740, protein: 27, carbs: 82, fat: 24 },
    };
  }

  return demoPhotoEstimate;
}

export async function pickFoodPhoto() {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    throw new Error("Photo library permission was not granted.");
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.7,
  });

  if (result.canceled) {
    return null;
  }

  return result.assets[0];
}

export async function captureFoodPhoto() {
  const permission = await ImagePicker.requestCameraPermissionsAsync();
  if (!permission.granted) {
    throw new Error("Camera permission was not granted.");
  }

  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.7,
  });

  if (result.canceled) {
    return null;
  }

  return result.assets[0];
}

export async function estimatePhotoMacros({ photoAsset, note }) {
  await new Promise((resolve) => setTimeout(resolve, 700));
  const estimate = buildEstimateFromNote(note || "");

  return {
    id: `estimate_${Date.now()}`,
    photoUri: photoAsset?.uri || null,
    note,
    ...estimate,
  };
}
