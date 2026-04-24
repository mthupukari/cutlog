import { startTransition, useMemo, useState } from "react";
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { StatusBar as ExpoStatusBar } from "expo-status-bar";

import { createCoachResponse } from "../services/coachChat";
import { sendMagicLink } from "../services/auth";
import { estimatePhotoMacros, pickFoodPhoto } from "../services/photoAnalysis";
import { generateWeeklyPlan, getPlanMeal, swapMealInPlan, toggleMealLock } from "../services/planner";
import { colors, spacing, typography } from "../theme";
import {
  defaultAuthState,
  defaultChatThread,
  defaultFoodLogs,
  defaultProfile,
  defaultWaterEntries,
  demoPhotoEstimate,
  starterWeekPlan,
} from "../data/mockData";
import { mealLibrary } from "../data/mealLibrary";

const tabs = [
  { id: "today", label: "Today" },
  { id: "plan", label: "Plan" },
  { id: "log", label: "Log" },
  { id: "chat", label: "Chat" },
  { id: "profile", label: "Profile" },
];

function sumTotals(foodLogs) {
  return foodLogs.reduce(
    (acc, log) => {
      acc.calories += Number(log.correctedMacros.calories || 0);
      acc.protein += Number(log.correctedMacros.protein || 0);
      acc.carbs += Number(log.correctedMacros.carbs || 0);
      acc.fat += Number(log.correctedMacros.fat || 0);
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  );
}

function getWaterProgress(entries, goalOz) {
  const consumedOz = entries.reduce((total, entry) => total + entry.amountOz, 0);
  return {
    consumedOz,
    goalOz,
    percent: Math.min(100, Math.round((consumedOz / goalOz) * 100)),
  };
}

function formatMealType(type) {
  if (type === "double") return "Lunch + dinner";
  if (type === "leftover") return "Leftover";
  if (type === "night_out") return "Night out";
  return "Prep";
}

function MacroCard({ label, value, helper, tone = "default" }) {
  const toneMap = {
    default: styles.macroValue,
    accent: styles.macroValueAccent,
    success: styles.macroValueSuccess,
    water: styles.macroValueWater,
  };

  return (
    <View style={styles.macroCard}>
      <Text style={[styles.macroValue, toneMap[tone]]}>{value}</Text>
      <Text style={styles.macroLabel}>{label}</Text>
      {helper ? <Text style={styles.macroHelper}>{helper}</Text> : null}
    </View>
  );
}

function SectionCard({ title, subtitle, children, right }) {
  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionHeaderCopy}>
          <Text style={styles.sectionTitle}>{title}</Text>
          {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
        </View>
        {right}
      </View>
      {children}
    </View>
  );
}

function TabButton({ label, active, onPress }) {
  return (
    <Pressable onPress={onPress} style={[styles.tabButton, active && styles.tabButtonActive]}>
      <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{label}</Text>
    </Pressable>
  );
}

function AuthGate({ email, onEmailChange, onSendMagicLink, statusMessage, onDemo }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ExpoStatusBar style="dark" />
      <StatusBar barStyle="dark-content" />
      <View style={styles.authShell}>
        <Text style={styles.eyebrow}>CutLog</Text>
        <Text style={styles.authTitle}>Your nutrition tracker, built around your actual routine.</Text>
        <Text style={styles.authBody}>
          Mobile-first photo logging, weekly meal planning, grounded AI coaching, and simple hydration tracking.
        </Text>
        <TextInput
          value={email}
          onChangeText={onEmailChange}
          placeholder="Email for magic link"
          placeholderTextColor={colors.muted}
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
        />
        <Pressable onPress={onSendMagicLink} style={styles.primaryButton}>
          <Text style={styles.primaryButtonLabel}>Send magic link</Text>
        </Pressable>
        <Pressable onPress={onDemo} style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonLabel}>Open demo workspace</Text>
        </Pressable>
        {statusMessage ? <Text style={styles.statusMessage}>{statusMessage}</Text> : null}
      </View>
    </SafeAreaView>
  );
}

function TodayScreen({ profile, totals, waterProgress, currentPlan, recentLogs, onAddWater }) {
  const todayMeals = currentPlan.planDays.slice(0, 3).map((day) => ({
    ...day,
    meal: getPlanMeal(day),
  }));

  return (
    <ScrollView contentContainerStyle={styles.screenContent}>
      <Text style={styles.heroEyebrow}>Today</Text>
      <Text style={styles.heroTitle}>Stay on the rails without overthinking every meal.</Text>
      <View style={styles.heroBanner}>
        <View style={styles.heroTextWrap}>
          <Text style={styles.heroBannerTitle}>Cut phase target</Text>
          <Text style={styles.heroBannerBody}>
            {profile.currentWeightLb} to {profile.goalWeightLb} lb by late season. Keep today around {profile.dailyCalorieTarget} cal
            and {profile.dailyProteinTarget}g protein.
          </Text>
        </View>
      </View>

      <View style={styles.macroGrid}>
        <MacroCard label="Calories" value={totals.calories} helper={`of ${profile.dailyCalorieTarget}`} tone="accent" />
        <MacroCard label="Protein" value={`${totals.protein}g`} helper={`of ${profile.dailyProteinTarget}g`} tone="success" />
        <MacroCard label="Water" value={`${waterProgress.consumedOz}oz`} helper={`${waterProgress.percent}% of goal`} tone="water" />
      </View>

      <SectionCard
        title="Hydration"
        subtitle="Quick add for the water goal you actually care about"
        right={<Text style={styles.sectionBadge}>{waterProgress.goalOz}oz goal</Text>}
      >
        <View style={styles.pillRow}>
          {[12, 16, 24].map((amount) => (
            <Pressable key={amount} onPress={() => onAddWater(amount)} style={styles.pillButton}>
              <Text style={styles.pillButtonLabel}>+{amount}oz</Text>
            </Pressable>
          ))}
        </View>
      </SectionCard>

      <SectionCard title="Planned meals" subtitle="The next meals already budgeted into the day">
        {todayMeals.map((item) => (
          <View key={`${item.day}-${item.mealId || item.label}`} style={styles.listRow}>
            <View style={styles.dayBadge}>
              <Text style={styles.dayBadgeLabel}>{item.day}</Text>
            </View>
            <View style={styles.listRowCopy}>
              <Text style={styles.listRowTitle}>{item.meal?.title || item.label}</Text>
              <Text style={styles.listRowMeta}>{formatMealType(item.type)}</Text>
            </View>
            <Text style={styles.listRowValue}>{item.meal ? `${item.meal.macros.protein}g` : ""}</Text>
          </View>
        ))}
      </SectionCard>

      <SectionCard title="Recent logs" subtitle="Confirmed entries only count toward totals">
        {recentLogs.map((log) => (
          <View key={log.id} style={styles.listRow}>
            <View style={styles.dot} />
            <View style={styles.listRowCopy}>
              <Text style={styles.listRowTitle}>{log.mealLabel}</Text>
              <Text style={styles.listRowMeta}>{log.note}</Text>
            </View>
            <Text style={styles.listRowValue}>{log.correctedMacros.calories} cal</Text>
          </View>
        ))}
      </SectionCard>
    </ScrollView>
  );
}

function PlanScreen({ currentPlan, onRegeneratePlan, onSwapMeal, onToggleLock }) {
  return (
    <ScrollView contentContainerStyle={styles.screenContent}>
      <View style={styles.screenHeaderRow}>
        <View>
          <Text style={styles.heroEyebrow}>Weekly plan</Text>
          <Text style={styles.heroTitle}>{currentPlan.theme}</Text>
        </View>
        <Pressable onPress={onRegeneratePlan} style={styles.secondaryActionChip}>
          <Text style={styles.secondaryActionChipLabel}>Regenerate</Text>
        </Pressable>
      </View>

      <SectionCard title="Planner rationale" subtitle="Generated from your targets, prep cadence, and library favorites">
        <Text style={styles.bodyCopy}>{currentPlan.rationale}</Text>
      </SectionCard>

      <SectionCard title="Week view" subtitle="Swap, regenerate, or lock meals without losing the whole plan">
        {currentPlan.planDays.map((day) => {
          const meal = getPlanMeal(day);
          return (
            <View key={`${day.day}-${day.dayIndex}`} style={styles.planCard}>
              <View style={styles.planRowTop}>
                <View>
                  <Text style={styles.planDay}>{day.day}</Text>
                  <Text style={styles.planMeal}>{meal?.title || day.label}</Text>
                  <Text style={styles.planMeta}>{meal ? `${meal.cuisine} · ${meal.macros.calories} cal` : "Flexible slot"}</Text>
                </View>
                <Pressable onPress={() => onToggleLock(day.dayIndex)} style={[styles.lockChip, day.locked && styles.lockChipActive]}>
                  <Text style={[styles.lockChipLabel, day.locked && styles.lockChipLabelActive]}>{day.locked ? "Locked" : "Lock"}</Text>
                </Pressable>
              </View>
              {day.note ? <Text style={styles.planNote}>{day.note}</Text> : null}
              {meal ? (
                <View style={styles.planActionRow}>
                  <Pressable onPress={() => onSwapMeal(day.dayIndex)} style={styles.inlineButton}>
                    <Text style={styles.inlineButtonLabel}>Swap meal</Text>
                  </Pressable>
                  <Text style={styles.planMeta}>{formatMealType(day.type)}</Text>
                </View>
              ) : null}
            </View>
          );
        })}
      </SectionCard>

      <SectionCard title="Grocery list" subtitle="Pulled directly from the accepted weekly plan">
        {Object.entries(currentPlan.groceryItems).map(([store, items]) => (
          <View key={store} style={styles.groceryGroup}>
            <Text style={styles.groceryStore}>{store}</Text>
            {items.map((item) => (
              <View key={`${store}-${item}`} style={styles.listRowCompact}>
                <View style={styles.dot} />
                <Text style={styles.listRowMetaStrong}>{item}</Text>
              </View>
            ))}
          </View>
        ))}
      </SectionCard>
    </ScrollView>
  );
}

function LogScreen({
  foodLogs,
  pendingEstimate,
  note,
  onNoteChange,
  onPickPhoto,
  onUseDemoEstimate,
  onSaveEstimate,
  onAdjustEstimate,
  onManualQuickLog,
}) {
  return (
    <ScrollView contentContainerStyle={styles.screenContent}>
      <Text style={styles.heroEyebrow}>Food log</Text>
      <Text style={styles.heroTitle}>Take a photo, review the estimate, then decide what counts.</Text>

      <SectionCard title="Photo logging" subtitle="AI estimates stay editable until you confirm them">
        <TextInput
          value={note}
          onChangeText={onNoteChange}
          placeholder="Add a note like 'chicken bowl with rice and peppers'"
          placeholderTextColor={colors.muted}
          multiline
          style={[styles.input, styles.textArea]}
        />
        <View style={styles.pillRow}>
          <Pressable onPress={onPickPhoto} style={styles.primaryButtonSmall}>
            <Text style={styles.primaryButtonLabel}>Choose photo</Text>
          </Pressable>
          <Pressable onPress={onUseDemoEstimate} style={styles.secondaryButtonSmall}>
            <Text style={styles.secondaryButtonLabel}>Use demo estimate</Text>
          </Pressable>
        </View>
      </SectionCard>

      {pendingEstimate ? (
        <SectionCard title="Review estimate" subtitle={`${Math.round(pendingEstimate.confidence * 100)}% confidence`}>
          {pendingEstimate.photoUri ? <Image source={{ uri: pendingEstimate.photoUri }} style={styles.previewImage} /> : null}
          <Text style={styles.reviewTitle}>{pendingEstimate.mealLabel}</Text>
          <Text style={styles.bodyCopy}>{pendingEstimate.explanation}</Text>
          <View style={styles.macroGrid}>
            {[
              ["Calories", "calories"],
              ["Protein", "protein"],
              ["Carbs", "carbs"],
              ["Fat", "fat"],
            ].map(([label, key]) => (
              <View key={key} style={styles.macroCard}>
                <TextInput
                  value={String(pendingEstimate.macros[key])}
                  keyboardType="numeric"
                  onChangeText={(value) => onAdjustEstimate(key, value)}
                  style={styles.macroInput}
                />
                <Text style={styles.macroLabel}>{label}</Text>
              </View>
            ))}
          </View>
          <Pressable onPress={onSaveEstimate} style={styles.primaryButton}>
            <Text style={styles.primaryButtonLabel}>Confirm and save</Text>
          </Pressable>
        </SectionCard>
      ) : null}

      <SectionCard title="Manual fallback" subtitle="When AI is off, you should still be able to log fast">
        <Pressable onPress={onManualQuickLog} style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonLabel}>Log office lunch at 600 cal / 35g protein</Text>
        </Pressable>
      </SectionCard>

      <SectionCard title="Saved meals" subtitle="Newest confirmed entries first">
        {foodLogs
          .slice()
          .reverse()
          .map((log) => (
            <View key={log.id} style={styles.listRow}>
              <View style={styles.dot} />
              <View style={styles.listRowCopy}>
                <Text style={styles.listRowTitle}>{log.mealLabel}</Text>
                <Text style={styles.listRowMeta}>{log.note}</Text>
              </View>
              <Text style={styles.listRowValue}>{log.correctedMacros.calories}</Text>
            </View>
          ))}
      </SectionCard>
    </ScrollView>
  );
}

function ChatScreen({ messages, draft, onDraftChange, onSend, pendingAction, onApplyAction }) {
  return (
    <ScrollView contentContainerStyle={styles.screenContent}>
      <Text style={styles.heroEyebrow}>Coach chat</Text>
      <Text style={styles.heroTitle}>Ask about protein, water, cravings, or change the future plan.</Text>

      <SectionCard title="Thread" subtitle="Grounded in your current plan, logs, and hydration">
        {messages.map((message) => (
          <View
            key={message.id}
            style={[styles.chatBubble, message.role === "user" ? styles.chatBubbleUser : styles.chatBubbleAssistant]}
          >
            <Text style={[styles.chatRole, message.role === "user" && styles.chatRoleUser]}>
              {message.role === "user" ? "You" : "Coach"}
            </Text>
            <Text style={[styles.chatBody, message.role === "user" && styles.chatBodyUser]}>{message.content}</Text>
          </View>
        ))}
        {pendingAction ? (
          <View style={styles.actionNotice}>
            <Text style={styles.sectionTitle}>Pending plan edit</Text>
            <Text style={styles.bodyCopy}>Coach suggested swapping {pendingAction.targetDay}. Apply it when you’re ready.</Text>
            <Pressable onPress={onApplyAction} style={styles.primaryButtonSmall}>
              <Text style={styles.primaryButtonLabel}>Apply plan edit</Text>
            </Pressable>
          </View>
        ) : null}
      </SectionCard>

      <SectionCard title="Ask the coach" subtitle="Examples: 'How do I hit protein tonight?' or 'Swap Friday'">
        <TextInput
          value={draft}
          onChangeText={onDraftChange}
          placeholder="Type a question..."
          placeholderTextColor={colors.muted}
          multiline
          style={[styles.input, styles.textArea]}
        />
        <Pressable onPress={onSend} style={styles.primaryButton}>
          <Text style={styles.primaryButtonLabel}>Send</Text>
        </Pressable>
      </SectionCard>
    </ScrollView>
  );
}

function ProfileScreen({ profile, onProfileChange, authState, onResetDemo }) {
  const fields = [
    ["displayName", "Name"],
    ["currentWeightLb", "Current weight (lb)"],
    ["goalWeightLb", "Goal weight (lb)"],
    ["dailyCalorieTarget", "Daily calorie target"],
    ["dailyProteinTarget", "Daily protein target"],
    ["dailyWaterGoalOz", "Water goal (oz)"],
  ];

  return (
    <ScrollView contentContainerStyle={styles.screenContent}>
      <Text style={styles.heroEyebrow}>Profile</Text>
      <Text style={styles.heroTitle}>Targets and preferences that drive everything else.</Text>

      <SectionCard title="Single-user setup" subtitle={`${authState.mode === "demo" ? "Demo session" : "Magic link session"} · ${profile.email}`}>
        <Text style={styles.bodyCopy}>
          This build is already shaped around a one-user app. Once Supabase is configured, the same profile values can back real auth, logs, plans, and storage.
        </Text>
      </SectionCard>

      <SectionCard title="Goals" subtitle="These fields feed the planner, dashboard, and coach context">
        {fields.map(([key, label]) => (
          <View key={key} style={styles.formField}>
            <Text style={styles.fieldLabel}>{label}</Text>
            <TextInput
              value={String(profile[key])}
              onChangeText={(value) => onProfileChange(key, value)}
              keyboardType={key === "displayName" ? "default" : "numeric"}
              style={styles.input}
            />
          </View>
        ))}
      </SectionCard>

      <SectionCard title="Preferences" subtitle="Seeded from the original meal plan assumptions">
        <Text style={styles.bodyCopy}>Dietary restrictions: {profile.dietaryRestrictions.join(" · ")}</Text>
        <Text style={styles.bodyCopy}>Meal preferences: {profile.mealPreferences.join(" · ")}</Text>
        <Text style={styles.bodyCopy}>Prep constraints: {profile.prepConstraints.join(" · ")}</Text>
      </SectionCard>

      <Pressable onPress={onResetDemo} style={styles.secondaryButton}>
        <Text style={styles.secondaryButtonLabel}>Reset demo data</Text>
      </Pressable>
    </ScrollView>
  );
}

export default function CutLogApp() {
  const [activeTab, setActiveTab] = useState("today");
  const [authState, setAuthState] = useState(defaultAuthState);
  const [emailDraft, setEmailDraft] = useState(defaultAuthState.email);
  const [authMessage, setAuthMessage] = useState("");
  const [profile, setProfile] = useState(defaultProfile);
  const [foodLogs, setFoodLogs] = useState(defaultFoodLogs);
  const [waterEntries, setWaterEntries] = useState(defaultWaterEntries);
  const [currentPlan, setCurrentPlan] = useState(starterWeekPlan);
  const [chatMessages, setChatMessages] = useState(defaultChatThread.messages);
  const [chatDraft, setChatDraft] = useState("");
  const [pendingAction, setPendingAction] = useState(null);
  const [logNote, setLogNote] = useState("");
  const [pendingEstimate, setPendingEstimate] = useState(null);

  const totals = useMemo(() => sumTotals(foodLogs), [foodLogs]);
  const waterProgress = useMemo(
    () => getWaterProgress(waterEntries, Number(profile.dailyWaterGoalOz)),
    [profile.dailyWaterGoalOz, waterEntries],
  );

  async function handleSendMagicLink() {
    const result = await sendMagicLink(emailDraft);
    setAuthMessage(result.message);
  }

  function handleOpenDemo() {
    setAuthState({
      ...authState,
      status: "signed_in",
      mode: "demo",
    });
  }

  function addWater(amountOz) {
    setWaterEntries((current) => [
      ...current,
      {
        id: `water_${Date.now()}`,
        amountOz,
        loggedAt: new Date().toISOString(),
      },
    ]);
  }

  function regeneratePlan() {
    startTransition(() => {
      setCurrentPlan(generateWeeklyPlan({ profile, existingPlanIndex: Math.floor(Math.random() * 4) }));
    });
  }

  function swapMeal(dayIndex) {
    setCurrentPlan((current) => swapMealInPlan({ plan: current, dayIndex }));
  }

  function toggleLock(dayIndex) {
    setCurrentPlan((current) => toggleMealLock({ plan: current, dayIndex }));
  }

  async function handlePickPhoto() {
    try {
      const asset = await pickFoodPhoto();
      if (!asset) {
        return;
      }

      const estimate = await estimatePhotoMacros({ photoAsset: asset, note: logNote });
      setPendingEstimate(estimate);
    } catch (error) {
      setAuthMessage(error.message);
    }
  }

  async function handleUseDemoEstimate() {
    const estimate = await estimatePhotoMacros({ photoAsset: null, note: logNote || "chicken bowl" });
    setPendingEstimate(estimate || demoPhotoEstimate);
  }

  function adjustEstimate(key, value) {
    setPendingEstimate((current) => ({
      ...current,
      macros: {
        ...current.macros,
        [key]: Number(value) || 0,
      },
    }));
  }

  function saveEstimate() {
    if (!pendingEstimate) {
      return;
    }

    setFoodLogs((current) => [
      ...current,
      {
        id: `log_${Date.now()}`,
        source: "photo",
        mealLabel: pendingEstimate.mealLabel,
        note: pendingEstimate.note || "Photo estimate",
        eatenAt: new Date().toISOString(),
        correctedMacros: pendingEstimate.macros,
        photoUri: pendingEstimate.photoUri,
      },
    ]);
    setPendingEstimate(null);
    setLogNote("");
    setActiveTab("today");
  }

  function addManualQuickLog() {
    setFoodLogs((current) => [
      ...current,
      {
        id: `manual_${Date.now()}`,
        source: "manual",
        mealLabel: "Office lunch",
        note: "Quick add fallback",
        eatenAt: new Date().toISOString(),
        correctedMacros: { calories: 600, protein: 35, carbs: 55, fat: 22 },
      },
    ]);
  }

  function sendChatMessage() {
    if (!chatDraft.trim()) {
      return;
    }

    const userMessage = {
      id: `user_${Date.now()}`,
      role: "user",
      content: chatDraft.trim(),
    };

    const response = createCoachResponse({
      message: chatDraft,
      profile,
      totals,
      waterProgress,
      currentPlan,
      mealLibrary,
    });

    const assistantMessage = {
      id: `assistant_${Date.now()}`,
      role: "assistant",
      content: response.content,
    };

    setChatMessages((current) => [...current, userMessage, assistantMessage]);
    setPendingAction(response.action || null);
    setChatDraft("");
  }

  function applyChatAction() {
    if (!pendingAction) {
      return;
    }

    if (pendingAction.type === "swap_day") {
      const targetIndex = currentPlan.planDays.findIndex((day) => day.day === pendingAction.targetDay);
      if (targetIndex !== -1) {
        setCurrentPlan((current) => swapMealInPlan({ plan: current, dayIndex: targetIndex }));
      }
    }

    setPendingAction(null);
  }

  function handleProfileChange(key, value) {
    setProfile((current) => ({
      ...current,
      [key]: key === "displayName" ? value : Number(value) || 0,
    }));
  }

  function resetDemoData() {
    setProfile(defaultProfile);
    setFoodLogs(defaultFoodLogs);
    setWaterEntries(defaultWaterEntries);
    setCurrentPlan(starterWeekPlan);
    setChatMessages(defaultChatThread.messages);
    setPendingAction(null);
    setPendingEstimate(null);
    setLogNote("");
    setActiveTab("today");
  }

  if (authState.status !== "signed_in") {
    return (
      <AuthGate
        email={emailDraft}
        onEmailChange={setEmailDraft}
        onSendMagicLink={handleSendMagicLink}
        statusMessage={authMessage}
        onDemo={handleOpenDemo}
      />
    );
  }

  let screen = null;
  if (activeTab === "today") {
    screen = (
      <TodayScreen
        profile={profile}
        totals={totals}
        waterProgress={waterProgress}
        currentPlan={currentPlan}
        recentLogs={foodLogs}
        onAddWater={addWater}
      />
    );
  } else if (activeTab === "plan") {
    screen = <PlanScreen currentPlan={currentPlan} onRegeneratePlan={regeneratePlan} onSwapMeal={swapMeal} onToggleLock={toggleLock} />;
  } else if (activeTab === "log") {
    screen = (
      <LogScreen
        foodLogs={foodLogs}
        pendingEstimate={pendingEstimate}
        note={logNote}
        onNoteChange={setLogNote}
        onPickPhoto={handlePickPhoto}
        onUseDemoEstimate={handleUseDemoEstimate}
        onSaveEstimate={saveEstimate}
        onAdjustEstimate={adjustEstimate}
        onManualQuickLog={addManualQuickLog}
      />
    );
  } else if (activeTab === "chat") {
    screen = (
      <ChatScreen
        messages={chatMessages}
        draft={chatDraft}
        onDraftChange={setChatDraft}
        onSend={sendChatMessage}
        pendingAction={pendingAction}
        onApplyAction={applyChatAction}
      />
    );
  } else {
    screen = (
      <ProfileScreen profile={profile} onProfileChange={handleProfileChange} authState={authState} onResetDemo={resetDemoData} />
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ExpoStatusBar style="dark" />
      <StatusBar barStyle="dark-content" />
      <View style={styles.appShell}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>CutLog</Text>
            <Text style={styles.headerTitle}>Mobile nutrition system for your actual cut.</Text>
          </View>
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>{authState.mode === "demo" ? "Demo" : "Magic link"}</Text>
          </View>
        </View>

        <View style={styles.screenWrap}>{screen}</View>

        <View style={styles.tabBar}>
          {tabs.map((tab) => (
            <TabButton key={tab.id} label={tab.label} active={tab.id === activeTab} onPress={() => setActiveTab(tab.id)} />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  appShell: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  eyebrow: {
    fontSize: typography.caption,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: colors.accent,
    fontWeight: "700",
  },
  headerTitle: {
    marginTop: 6,
    fontSize: typography.subheading,
    color: colors.text,
    fontWeight: "700",
    maxWidth: 280,
  },
  headerBadge: {
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.sm,
    paddingVertical: 8,
    borderRadius: 999,
  },
  headerBadgeText: {
    color: colors.ink,
    fontWeight: "700",
    fontSize: typography.caption,
  },
  screenWrap: {
    flex: 1,
  },
  screenContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl * 2,
    gap: spacing.md,
  },
  heroEyebrow: {
    fontSize: typography.caption,
    color: colors.muted,
    textTransform: "uppercase",
    letterSpacing: 2,
    marginTop: spacing.xs,
  },
  heroTitle: {
    fontSize: typography.title,
    lineHeight: 36,
    color: colors.text,
    fontWeight: "700",
  },
  heroBanner: {
    borderRadius: 22,
    backgroundColor: colors.ink,
    padding: spacing.lg,
  },
  heroTextWrap: {
    maxWidth: 300,
  },
  heroBannerTitle: {
    color: "#e7d8c2",
    textTransform: "uppercase",
    letterSpacing: 2,
    fontSize: typography.caption,
    fontWeight: "700",
  },
  heroBannerBody: {
    marginTop: spacing.sm,
    color: "#fff4e5",
    fontSize: typography.body,
    lineHeight: 22,
  },
  macroGrid: {
    flexDirection: "row",
    gap: spacing.sm,
    flexWrap: "wrap",
  },
  macroCard: {
    flexGrow: 1,
    minWidth: "30%",
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  macroValue: {
    color: colors.text,
    fontWeight: "700",
    fontSize: 24,
  },
  macroValueAccent: {
    color: colors.accent,
  },
  macroValueSuccess: {
    color: colors.success,
  },
  macroValueWater: {
    color: colors.water,
  },
  macroLabel: {
    marginTop: 4,
    fontSize: typography.caption,
    textTransform: "uppercase",
    color: colors.muted,
    letterSpacing: 1,
    fontWeight: "700",
  },
  macroHelper: {
    marginTop: 8,
    fontSize: typography.caption,
    color: colors.muted,
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.cardShadow,
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 18,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.sm,
    alignItems: "flex-start",
    marginBottom: spacing.md,
  },
  sectionHeaderCopy: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: typography.subheading,
    color: colors.text,
    fontWeight: "700",
  },
  sectionSubtitle: {
    marginTop: 4,
    color: colors.muted,
    lineHeight: 20,
  },
  sectionBadge: {
    color: colors.water,
    backgroundColor: colors.waterSoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: 999,
    overflow: "hidden",
    fontWeight: "700",
    fontSize: typography.caption,
  },
  pillRow: {
    flexDirection: "row",
    gap: spacing.sm,
    flexWrap: "wrap",
  },
  pillButton: {
    backgroundColor: colors.waterSoft,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    borderRadius: 999,
  },
  pillButtonLabel: {
    color: colors.water,
    fontWeight: "700",
  },
  listRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceAlt,
  },
  listRowCompact: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: 6,
  },
  dayBadge: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: colors.surfaceAlt,
    justifyContent: "center",
    alignItems: "center",
  },
  dayBadgeLabel: {
    color: colors.ink,
    fontWeight: "700",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
  },
  listRowCopy: {
    flex: 1,
  },
  listRowTitle: {
    fontWeight: "700",
    color: colors.text,
    fontSize: typography.body,
  },
  listRowMeta: {
    color: colors.muted,
    marginTop: 2,
  },
  listRowMetaStrong: {
    color: colors.text,
  },
  listRowValue: {
    color: colors.accent,
    fontWeight: "700",
  },
  screenHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  secondaryActionChip: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
  },
  secondaryActionChipLabel: {
    color: colors.ink,
    fontWeight: "700",
  },
  bodyCopy: {
    color: colors.text,
    lineHeight: 22,
  },
  planCard: {
    borderTopWidth: 1,
    borderTopColor: colors.surfaceAlt,
    paddingTop: spacing.md,
    marginTop: spacing.sm,
  },
  planRowTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  planDay: {
    color: colors.muted,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    fontSize: typography.caption,
  },
  planMeal: {
    marginTop: 4,
    fontSize: typography.subheading,
    color: colors.text,
    fontWeight: "700",
  },
  planMeta: {
    marginTop: 4,
    color: colors.muted,
  },
  planNote: {
    marginTop: spacing.sm,
    color: colors.text,
    lineHeight: 20,
  },
  planActionRow: {
    marginTop: spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lockChip: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 999,
    paddingHorizontal: spacing.sm,
    paddingVertical: 8,
  },
  lockChipActive: {
    backgroundColor: colors.ink,
  },
  lockChipLabel: {
    color: colors.ink,
    fontWeight: "700",
  },
  lockChipLabelActive: {
    color: "#fff",
  },
  inlineButton: {
    backgroundColor: colors.accentSoft,
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
  },
  inlineButtonLabel: {
    color: colors.danger,
    fontWeight: "700",
  },
  groceryGroup: {
    borderTopWidth: 1,
    borderTopColor: colors.surfaceAlt,
    paddingTop: spacing.md,
    marginTop: spacing.sm,
  },
  groceryStore: {
    color: colors.text,
    fontWeight: "700",
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    fontSize: typography.body,
    color: colors.text,
  },
  textArea: {
    minHeight: 96,
    textAlignVertical: "top",
  },
  primaryButton: {
    backgroundColor: colors.ink,
    borderRadius: 18,
    paddingHorizontal: spacing.md,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: spacing.md,
  },
  primaryButtonSmall: {
    backgroundColor: colors.ink,
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
  },
  primaryButtonLabel: {
    color: "#fff8ee",
    fontWeight: "700",
  },
  secondaryButton: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 18,
    paddingHorizontal: spacing.md,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: spacing.md,
  },
  secondaryButtonSmall: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
  },
  secondaryButtonLabel: {
    color: colors.ink,
    fontWeight: "700",
  },
  previewImage: {
    width: "100%",
    height: 220,
    borderRadius: 18,
    marginBottom: spacing.md,
  },
  reviewTitle: {
    fontSize: typography.heading,
    color: colors.text,
    fontWeight: "700",
    marginBottom: spacing.sm,
  },
  macroInput: {
    fontSize: 24,
    color: colors.text,
    fontWeight: "700",
    paddingVertical: 0,
  },
  chatBubble: {
    borderRadius: 20,
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  chatBubbleAssistant: {
    backgroundColor: colors.surfaceAlt,
  },
  chatBubbleUser: {
    backgroundColor: colors.ink,
  },
  chatRole: {
    fontSize: typography.caption,
    fontWeight: "700",
    color: colors.accent,
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  chatRoleUser: {
    color: "#d8c5ad",
  },
  chatBody: {
    color: colors.text,
    lineHeight: 22,
  },
  chatBodyUser: {
    color: "#fff9ef",
  },
  actionNotice: {
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.successSoft,
    borderRadius: 18,
  },
  formField: {
    marginBottom: spacing.md,
  },
  fieldLabel: {
    marginBottom: 8,
    color: colors.muted,
    fontWeight: "700",
  },
  tabBar: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: "#fbf6ef",
  },
  tabButton: {
    flex: 1,
    borderRadius: 18,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: colors.surfaceAlt,
  },
  tabButtonActive: {
    backgroundColor: colors.ink,
  },
  tabLabel: {
    color: colors.muted,
    fontWeight: "700",
    fontSize: typography.caption,
  },
  tabLabelActive: {
    color: "#fff8ee",
  },
  authShell: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.background,
  },
  authTitle: {
    marginTop: spacing.md,
    fontSize: 34,
    lineHeight: 42,
    color: colors.text,
    fontWeight: "700",
  },
  authBody: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
    color: colors.muted,
    lineHeight: 24,
    fontSize: typography.body,
  },
  statusMessage: {
    marginTop: spacing.md,
    color: colors.muted,
    lineHeight: 20,
  },
});
