import * as ImagePicker from "expo-image-picker";

import { demoPhotoEstimate } from "../data/mockData";

function buildEstimateFromNote(note) {
  const lower = note.toLowerCase();

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
