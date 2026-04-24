import { defaultFoodLogs, defaultWaterEntries } from "../data/mockData";
import { isSupabaseConfigured, supabase } from "./supabase";

const localJournalStore = new Map();

function pad(value) {
  return String(value).padStart(2, "0");
}

export function getDateKey(input = new Date()) {
  const date = typeof input === "string" ? new Date(input) : input;
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function formatDateLabel(dateKey) {
  const date = new Date(`${dateKey}T12:00:00`);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function shiftDateKey(dateKey, amount) {
  const date = new Date(`${dateKey}T12:00:00`);
  date.setDate(date.getDate() + amount);
  return getDateKey(date);
}

function getDayBounds(dateKey) {
  const start = new Date(`${dateKey}T00:00:00`);
  const end = new Date(`${dateKey}T23:59:59`);
  return {
    startIso: start.toISOString(),
    endIso: end.toISOString(),
  };
}

function cloneDay(day) {
  return {
    foodLogs: [...day.foodLogs],
    waterEntries: [...day.waterEntries],
    source: day.source,
  };
}

function seedLocalDay(dateKey) {
  if (localJournalStore.has(dateKey)) {
    return localJournalStore.get(dateKey);
  }

  const seeded = {
    foodLogs:
      dateKey === getDateKey()
        ? defaultFoodLogs.map((entry) => ({ ...entry }))
        : [],
    waterEntries:
      dateKey === getDateKey()
        ? defaultWaterEntries.map((entry) => ({ ...entry }))
        : [],
    source: "demo",
  };

  localJournalStore.set(dateKey, seeded);
  return seeded;
}

function readLocalDay(dateKey) {
  return cloneDay(seedLocalDay(dateKey));
}

function writeLocalDay(dateKey, updater) {
  const current = seedLocalDay(dateKey);
  const next = updater(cloneDay(current));
  localJournalStore.set(dateKey, next);
  return cloneDay(next);
}

async function resolveProfileId() {
  if (!isSupabaseConfigured || !supabase) {
    return null;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("auth_user_id", user.id)
    .single();

  if (error || !data?.id) {
    return null;
  }

  return data.id;
}

export async function loadJournalDay(dateKey) {
  const profileId = await resolveProfileId();

  if (!profileId || !supabase) {
    return readLocalDay(dateKey);
  }

  const { startIso, endIso } = getDayBounds(dateKey);

  const [{ data: foodLogs, error: foodError }, { data: waterEntries, error: waterError }] = await Promise.all([
    supabase
      .from("food_log_entries")
      .select("id, source, meal_label, note, eaten_at, photo_url, corrected_macros, ai_estimate")
      .eq("profile_id", profileId)
      .gte("eaten_at", startIso)
      .lte("eaten_at", endIso)
      .order("eaten_at", { ascending: true }),
    supabase
      .from("water_log_entries")
      .select("id, amount_oz, logged_at")
      .eq("profile_id", profileId)
      .gte("logged_at", startIso)
      .lte("logged_at", endIso)
      .order("logged_at", { ascending: true }),
  ]);

  if (foodError || waterError) {
    return readLocalDay(dateKey);
  }

  return {
    foodLogs: (foodLogs || []).map((entry) => ({
      id: entry.id,
      source: entry.source,
      mealLabel: entry.meal_label,
      note: entry.note,
      eatenAt: entry.eaten_at,
      photoUri: entry.photo_url,
      plannedLogKey: entry.ai_estimate?.plannedLogKey || null,
      correctedMacros: entry.corrected_macros,
    })),
    waterEntries: (waterEntries || []).map((entry) => ({
      id: entry.id,
      amountOz: entry.amount_oz,
      loggedAt: entry.logged_at,
    })),
    source: "supabase",
  };
}

export async function saveFoodLogForDay(dateKey, logEntry) {
  const profileId = await resolveProfileId();

  if (!profileId || !supabase) {
    return writeLocalDay(dateKey, (day) => ({
      ...day,
      foodLogs: [...day.foodLogs, logEntry],
      source: "demo",
    }));
  }

  const payload = {
    profile_id: profileId,
    source: logEntry.source,
    meal_label: logEntry.mealLabel,
    note: logEntry.note,
    eaten_at: logEntry.eatenAt,
    photo_url: logEntry.photoUri || null,
    ai_estimate: logEntry.plannedLogKey ? { plannedLogKey: logEntry.plannedLogKey } : null,
    corrected_macros: logEntry.correctedMacros,
  };

  const { error } = await supabase.from("food_log_entries").insert(payload);

  if (error) {
    return writeLocalDay(dateKey, (day) => ({
      ...day,
      foodLogs: [...day.foodLogs, logEntry],
      source: "demo",
    }));
  }

  return loadJournalDay(dateKey);
}

export async function saveWaterForDay(dateKey, waterEntry) {
  const profileId = await resolveProfileId();

  if (!profileId || !supabase) {
    return writeLocalDay(dateKey, (day) => ({
      ...day,
      waterEntries: [...day.waterEntries, waterEntry],
      source: "demo",
    }));
  }

  const { error } = await supabase.from("water_log_entries").insert({
    profile_id: profileId,
    amount_oz: waterEntry.amountOz,
    logged_at: waterEntry.loggedAt,
  });

  if (error) {
    return writeLocalDay(dateKey, (day) => ({
      ...day,
      waterEntries: [...day.waterEntries, waterEntry],
      source: "demo",
    }));
  }

  return loadJournalDay(dateKey);
}
