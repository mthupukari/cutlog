# AGENTS.md — CutLog App Context

## Project Overview

This is a personal health & fitness app for Mahit (6ft, 195lbs, cutting to 170lbs by September 30 for a Cabo trip). The project started as a meal plan built in Codex.ai and is now being expanded into a full React Native app with photo-based food logging, calorie tracking, and AI-powered macro estimation.

---

## What Has Already Been Built

### Meal Plan React Component (`meal-plan-month.jsx`)
A fully functional React component (not yet React Native) built in Codex.ai. It contains:

- **4-week dinner rotation** with 13 unique meals (no fish, no beef, no pork — chicken and shrimp only)
- **Full recipes** for each meal with ingredients, step-by-step instructions, and alternative cooking methods
- **3 cooking method tabs per recipe**: Stovetop/Oven, ✈️ Air Fryer, ⚡ Instant Pot
- **Weekly grocery lists** split by store (Costco bulk stock-up + Whole Foods delivery for fresh/specialty)
- **Daily calorie plan**: ~1,800 cal/day, 175g+ protein target
- **Sweets section**: 80/20 approach with 8 clean daily swaps + 2 planned weekly treats
- **Schedule tab**: Mon–Thu office lunch provided, Fri WFH, 1 night out/week, Sunday meal prep

### Tabs in the existing component:
1. **Schedule** — 7-day dinner plan per week, tappable to open recipe
2. **Recipes** — all unique meals for the week, with cooking method switcher
3. **Grocery** — Costco (Month 1 stock-up) + Whole Foods delivery (weekly fresh/specialty)
4. **🍫 Sweets** — clean swap options with cal/protein/store info

---

## User Profile

- **Name**: Mahit
- **Goal**: 195 → 170 lbs by September 30 (Cabo trip)
- **Timeline**: ~23 weeks, ~1.1 lb/week deficit
- **Daily targets**: ~1,800 cal, 175g+ protein
- **Activity**: Moderately active (3–4 workouts/week)

### Daily meal structure:
| Meal | Detail | Cal | Protein |
|---|---|---|---|
| Breakfast | Oikos Pro + banana + black coffee | ~230 | 20g |
| Lunch (M–Th) | Office provided | ~600 | ~35g |
| Lunch (Fri) | Prepped meal (WFH) | ~510 | 44g |
| Afternoon snack | Oikos Pro (plain) | ~130 | 20g |
| Dinner | Prepped meal | ~520 | 44g |
| **Total** | | **~1,800** | **~163g** |

---

## Dietary Restrictions
- ✅ Chicken (breast + thighs + ground)
- ✅ Shrimp
- ❌ No beef
- ❌ No pork
- ❌ No fish

---

## Grocery Stores
- **Costco** — bulk proteins (Kirkland chicken breasts ~$31/8.4lb, Kirkland chicken thighs ~$31/8.25lb, frozen shrimp), frozen veg (cauli rice, broccoli, edamame, spinach), pantry staples (Greek yogurt, hummus, quinoa, olive oil, soy sauce, salsa, diced tomatoes, broth, honey), Oikos Pro multipack
- **Whole Foods delivery** — weekly fresh produce + specialty sauces (gochujang, fish sauce, biryani spice, low-carb tortillas, fresh herbs/veg). Small weekly order ~$20–30.

---

## Kitchen Equipment
- Air Fryer ✅
- Instant Pot ✅
- Standard oven + stovetop

---

## 4-Week Meal Rotation

### Week 1 — The Classics
- Mon/Tue: Chicken Tikka Masala Bowl (IP recommended)
- Wed/Thu: Teriyaki Chicken + Broccoli (Air Fryer recommended)
- Fri: Mediterranean Chicken Bowl (lunch + dinner)
- Sun: Ground Chicken Taco Bowl

### Week 2 — Asian Tour
- Mon/Tue: Korean Gochujang Chicken Bowl (Air Fryer or IP)
- Wed/Thu: Garlic Shrimp Stir Fry + Cauli Rice (Air Fryer recommended)
- Fri: Thai Basil Chicken Bowl (lunch + dinner)
- Sun: Korean Gochujang Chicken Bowl

### Week 3 — Mediterranean Week
- Mon/Tue: Chicken Shawarma Bowl (Air Fryer recommended)
- Wed/Thu: Greek Chicken Souvlaki + Tzatziki (Air Fryer recommended)
- Fri: Moroccan Spiced Chicken + Chickpeas (IP recommended)
- Sun: Lemon Herb Shrimp + Roasted Veg (Air Fryer)

### Week 4 — Americas + Indian
- Mon/Tue: Chicken Biryani Bowl (IP recommended)
- Wed/Thu: Buffalo Chicken Bowl (Air Fryer recommended)
- Fri: Ground Chicken Fajita Bowl (lunch + dinner)
- Sun: Ground Chicken Taco Bowl

---

## Sweets Strategy (80/20)
**Daily clean swaps (80%):**
- Oikos Pro + cocoa + banana (~260 cal, 22g protein)
- Frozen banana nice cream (~120 cal)
- Lily's dark chocolate chips — Whole Foods (~80 cal)
- Kind Dark Chocolate bar — Costco (~200 cal)
- Kodiak Cakes protein muffin — Costco (~180 cal, 12g protein)
- Rice cake + almond butter + Lily's chips (~180 cal)
- Halo Top chocolate ice cream — Whole Foods (~280 cal/pint)
- Greek yogurt bark (freeze Sunday during meal prep)

**Weekly real treat (20%):** 1 cookie/brownie or 1 scoop real ice cream, ~300–400 cal, planned not restricted.

---

## Next Phase — Full App Build

### Vision
Expand from a static meal plan into a full personal health app with:
- 📸 Photo food logging with AI calorie estimation
- 📊 Daily dashboard (running cal/protein totals)
- 🍽️ Meal plan integration (tap prepped meal to auto-log)
- ⚖️ Weekly weigh-in tracker (195→170 progress to Cabo)
- 🛒 Grocery list generator by week

### Recommended Stack
| Layer | Choice |
|---|---|
| Frontend | React Native (Expo) |
| Backend | Supabase (auth + DB + storage) |
| Food AI | Anthropic Vision API (photo → macros) |
| Nutrition DB | Nutritionix API (barcode + text search) |
| Hosting | Expo (mobile) + Vercel (web) |

### Build Roadmap
- **Weekend 1**: Photo logging + AI calorie estimation (Codex Vision API)
- **Weekend 2**: Daily dashboard + meal plan auto-logging
- **Weekend 3**: Progress tracker + weigh-in chart
- **Weekend 4**: Grocery list generator + polish

### Key API notes
- Anthropic Vision API: send photo → returns `{calories, protein, carbs, fat}` — fastest path to working food logging
- Nutritionix API: free tier, 200k+ foods, handles barcode scanning and text search as fallback
- Supabase: free tier handles auth, postgres DB, and image storage for food photos

---

## File Reference
- `meal-plan-month.jsx` — the existing React component with full meal plan, recipes, grocery lists, and sweets section
- This file (`AGENTS.md`) — full context for continuing the build in Codex

---

## Notes for Codex
- The existing `meal-plan-month.jsx` uses plain React (not React Native) — it will need to be ported or rebuilt as Expo components
- All recipe data, grocery data, and sweets data is hardcoded in the JSX file — consider migrating to Supabase or a local JSON/SQLite DB
- The user is a software engineer comfortable with code — no need to over-explain basics
- Design aesthetic from the existing component: dark header (#1a1a1a), clean cards, Georgia serif font, minimal color palette with cuisine-coded accent colors
