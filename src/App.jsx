import { useState } from "react";

const recipes = {
  "Chicken Tikka Masala Bowl": {
    cal: 520, protein: 48, carbs: 35, fat: 14, serves: 2,
    ingredients: [
      { item: "Chicken breast", qty: "1.5 lbs", store: "Costco" },
      { item: "Plain Greek yogurt (5%)", qty: "⅔ cup", store: "Whole Foods" },
      { item: "Garlic paste", qty: "1 tbsp", store: "Whole Foods" },
      { item: "Ginger paste", qty: "1 tbsp", store: "Whole Foods" },
      { item: "Tikka masala seasoning", qty: "2 tbsp", store: "Whole Foods" },
      { item: "Garam masala", qty: "1 tsp", store: "Whole Foods" },
      { item: "Diced tomatoes (canned)", qty: "14 oz", store: "Whole Foods" },
      { item: "Heavy cream", qty: "3 tbsp", store: "Whole Foods" },
      { item: "Lemon", qty: "1", store: "Whole Foods" },
      { item: "Cauliflower rice", qty: "2 bags", store: "Costco" },
      { item: "Spinach", qty: "2 cups", store: "Costco" },
    ],
    methods: {
      standard: [
        "Cube chicken, marinate in yogurt + garlic + ginger + tikka seasoning + lemon juice for 30 min",
        "Sear chicken in pan with oil spray on high heat, 2–3 min per side until golden. Set aside.",
        "In same pan: add garlic paste, ginger paste, tikka seasoning, garam masala — toast 1 min",
        "Add diced tomatoes + ½ cup water, simmer 10 min, stir in cream and Greek yogurt",
        "Add chicken back to sauce, simmer 5 more min",
        "Microwave cauliflower rice, mix in spinach while hot",
        "Portion into 2 containers",
      ],
      instantpot: [
        "Cube chicken, marinate in yogurt + garlic + ginger + tikka seasoning + lemon juice for 30 min",
        "Use Sauté function: toast garlic paste, ginger, spices 1 min",
        "Add chicken, diced tomatoes, ½ cup water. Stir to combine.",
        "Seal lid. Pressure Cook HIGH for 10 min. Quick release.",
        "Stir in heavy cream + Greek yogurt on Sauté mode for 2 min",
        "Microwave cauliflower rice, mix in spinach while hot",
        "Portion into 2 containers",
      ],
    },
    tip: "IP version = more tender chicken and deeper sauce flavor. Freezes well for future weeks.",
  },
  "Teriyaki Chicken + Broccoli": {
    cal: 500, protein: 46, carbs: 30, fat: 10, serves: 2,
    ingredients: [
      { item: "Chicken breast", qty: "1.5 lbs", store: "Costco" },
      { item: "Low-sodium soy sauce", qty: "¼ cup", store: "Whole Foods" },
      { item: "Honey", qty: "2 tbsp", store: "Whole Foods" },
      { item: "Rice vinegar", qty: "1 tbsp", store: "Whole Foods" },
      { item: "Sesame oil", qty: "1 tsp", store: "Whole Foods" },
      { item: "Garlic, minced", qty: "2 cloves", store: "Whole Foods" },
      { item: "Ginger, grated", qty: "1 tsp", store: "Whole Foods" },
      { item: "Cornstarch", qty: "1 tsp", store: "Whole Foods" },
      { item: "Broccoli florets", qty: "3 cups", store: "Costco" },
      { item: "Brown rice or cauli rice", qty: "2 bags", store: "Costco" },
      { item: "Sesame seeds + scallions", qty: "garnish", store: "Whole Foods" },
    ],
    methods: {
      standard: [
        "Whisk soy sauce, honey, rice vinegar, sesame oil, garlic, ginger, cornstarch in a bowl",
        "Slice chicken into strips. Cook in pan over medium-high heat, 4–5 min per side",
        "Pour teriyaki sauce over chicken, simmer 2 min until thickened",
        "Roast broccoli at 425°F for 18–20 min with light oil spray",
        "Cook rice per package. Portion into containers. Garnish with sesame + scallions.",
      ],
      airfryer: [
        "Whisk soy sauce, honey, rice vinegar, sesame oil, garlic, ginger, cornstarch",
        "Slice chicken into strips, toss in half the sauce. Marinate 15 min.",
        "Air fry chicken at 400°F for 10–12 min, flipping halfway. Brush remaining sauce on last 2 min.",
        "Air fry broccoli at 380°F for 8–10 min until crispy edges — no oil needed.",
        "Cook rice per package. Portion into containers. Garnish with sesame + scallions.",
      ],
    },
    tip: "Air fryer gives the chicken a crispy teriyaki glaze that pan cooking can't replicate.",
  },
  "Mediterranean Chicken Bowl": {
    cal: 510, protein: 44, carbs: 38, fat: 13, serves: 2,
    ingredients: [
      { item: "Chicken thighs, boneless", qty: "1.5 lbs", store: "Costco" },
      { item: "Olive oil", qty: "1 tbsp", store: "Whole Foods" },
      { item: "Lemon juice", qty: "2 tbsp", store: "Whole Foods" },
      { item: "Garlic, minced", qty: "3 cloves", store: "Whole Foods" },
      { item: "Dried oregano", qty: "1 tsp", store: "Whole Foods" },
      { item: "Cumin", qty: "½ tsp", store: "Whole Foods" },
      { item: "Quinoa", qty: "¾ cup dry", store: "Whole Foods" },
      { item: "Cherry tomatoes", qty: "1 cup", store: "Whole Foods" },
      { item: "Cucumber", qty: "1", store: "Whole Foods" },
      { item: "Hummus", qty: "4 tbsp", store: "Whole Foods" },
      { item: "Fresh parsley", qty: "handful", store: "Whole Foods" },
    ],
    methods: {
      standard: [
        "Marinate chicken thighs in olive oil, lemon, garlic, oregano, cumin — 30 min",
        "Bake at 425°F for 22–25 min until internal temp hits 165°F",
        "Cook quinoa: ¾ cup dry + 1.5 cups water, simmer 15 min covered",
        "Dice cucumber, halve tomatoes, chop parsley",
        "Slice chicken. Portion: quinoa + chicken + veggies + 2 tbsp hummus",
      ],
      airfryer: [
        "Marinate chicken thighs in olive oil, lemon, garlic, oregano, cumin — 30 min",
        "Air fry at 400°F for 18–20 min, flipping halfway. Internal temp should hit 165°F.",
        "Cook quinoa: ¾ cup dry + 1.5 cups water, simmer 15 min covered",
        "Dice cucumber, halve tomatoes, chop parsley",
        "Slice chicken. Portion: quinoa + chicken + veggies + 2 tbsp hummus",
      ],
    },
    tip: "Great eaten cold — perfect for Fri WFH lunch straight from fridge.",
  },
  "Ground Chicken Taco Bowl": {
    cal: 490, protein: 44, carbs: 32, fat: 12, serves: 2,
    ingredients: [
      { item: "Ground chicken", qty: "1.5 lbs", store: "Costco" },
      { item: "Taco seasoning", qty: "2 tbsp", store: "Whole Foods" },
      { item: "Garlic, minced", qty: "2 cloves", store: "Whole Foods" },
      { item: "Bell peppers, diced", qty: "2", store: "Whole Foods" },
      { item: "Black beans, canned", qty: "½ can", store: "Whole Foods" },
      { item: "Cauliflower rice", qty: "2 bags", store: "Costco" },
      { item: "Salsa", qty: "4 tbsp", store: "Whole Foods" },
      { item: "Plain Greek yogurt", qty: "2 tbsp", store: "Whole Foods" },
      { item: "Lime", qty: "1", store: "Whole Foods" },
      { item: "Low-carb tortillas (optional)", qty: "2", store: "Whole Foods" },
    ],
    methods: {
      standard: [
        "Cook ground chicken in pan over medium heat, breaking apart. Pull off as soon as no longer pink.",
        "Add garlic + taco seasoning + splash of water, stir 2 more min",
        "Sauté diced bell peppers in same pan, 3–4 min",
        "Warm black beans in small pot",
        "Microwave cauliflower rice. Portion with salsa + lime + Greek yogurt.",
      ],
      airfryer: [
        "Form ground chicken into a loose flat patty, season with taco seasoning + garlic",
        "Air fry at 375°F for 8–10 min, breaking apart halfway through with fork",
        "Air fry diced bell peppers at 390°F for 6–7 min until slightly charred",
        "Warm black beans in microwave",
        "Microwave cauliflower rice. Portion with salsa + lime + Greek yogurt.",
      ],
    },
    tip: "Ground chicken dries out fast — don't overcook. Add a splash of chicken broth if needed.",
  },
  "Korean Gochujang Chicken Bowl": {
    cal: 510, protein: 45, carbs: 34, fat: 14, serves: 2,
    ingredients: [
      { item: "Chicken thighs, boneless", qty: "1.5 lbs", store: "Costco" },
      { item: "Gochujang paste", qty: "2 tbsp", store: "Whole Foods" },
      { item: "Low-sodium soy sauce", qty: "2 tbsp", store: "Whole Foods" },
      { item: "Honey", qty: "1 tbsp", store: "Whole Foods" },
      { item: "Sesame oil", qty: "1 tsp", store: "Whole Foods" },
      { item: "Garlic, minced", qty: "3 cloves", store: "Whole Foods" },
      { item: "Ginger, grated", qty: "1 tsp", store: "Whole Foods" },
      { item: "Cauliflower rice", qty: "2 bags", store: "Costco" },
      { item: "Shredded carrots", qty: "½ cup", store: "Whole Foods" },
      { item: "Cucumber, sliced", qty: "½", store: "Whole Foods" },
      { item: "Scallions + sesame seeds", qty: "garnish", store: "Whole Foods" },
    ],
    methods: {
      standard: [
        "Whisk gochujang, soy sauce, honey, sesame oil, garlic, ginger",
        "Marinate chicken thighs at least 15 min (overnight = better)",
        "Cook in pan over medium-high 5–6 min per side until caramelized. Rest 5 min, slice.",
        "Microwave cauliflower rice",
        "Portion: cauli rice + chicken + carrots + cucumber. Garnish with scallions + sesame.",
      ],
      airfryer: [
        "Whisk gochujang, soy sauce, honey, sesame oil, garlic, ginger",
        "Marinate chicken thighs at least 15 min (overnight = better)",
        "Air fry at 400°F for 16–18 min flipping halfway. Brush extra sauce on last 2 min.",
        "Microwave cauliflower rice",
        "Portion: cauli rice + sliced chicken + carrots + cucumber. Garnish with scallions + sesame.",
      ],
      instantpot: [
        "Whisk gochujang, soy sauce, honey, sesame oil, garlic, ginger",
        "Add chicken + sauce to IP. Seal lid.",
        "Pressure Cook HIGH for 8 min. Quick release.",
        "Use Sauté mode to reduce sauce 2–3 min. Shred or slice chicken.",
        "Microwave cauliflower rice. Portion with carrots + cucumber + garnish.",
      ],
    },
    tip: "Gochujang is at Whole Foods international aisle. Marinate overnight Saturday for deeper flavor.",
  },
  "Garlic Shrimp Stir Fry + Cauli Rice": {
    cal: 420, protein: 40, carbs: 18, fat: 12, serves: 2,
    ingredients: [
      { item: "Shrimp, peeled + deveined", qty: "1.5 lbs", store: "Costco" },
      { item: "Garlic, minced", qty: "4 cloves", store: "Whole Foods" },
      { item: "Ginger, grated", qty: "1 tsp", store: "Whole Foods" },
      { item: "Low-sodium soy sauce", qty: "2 tbsp", store: "Whole Foods" },
      { item: "Sesame oil", qty: "1 tsp", store: "Whole Foods" },
      { item: "Snap peas or bok choy", qty: "2 cups", store: "Whole Foods" },
      { item: "Red bell pepper, sliced", qty: "1", store: "Whole Foods" },
      { item: "Cauliflower rice", qty: "2 bags", store: "Costco" },
      { item: "Scallions + sesame seeds", qty: "garnish", store: "Whole Foods" },
    ],
    methods: {
      standard: [
        "Pat shrimp dry. Season with salt + pepper.",
        "Heat pan on HIGH with oil spray. Cook shrimp 1–2 min per side. Remove and set aside.",
        "Same pan: garlic + ginger 30 sec, then add veggies, stir fry 3–4 min on high",
        "Add shrimp back + soy sauce + sesame oil. Toss 1 min.",
        "Microwave cauliflower rice. Portion and garnish.",
      ],
      airfryer: [
        "Toss shrimp in garlic, ginger, soy sauce, sesame oil",
        "Air fry shrimp at 400°F for 6–8 min, shaking halfway. Don't overcrowd.",
        "Air fry snap peas + bell pepper at 390°F for 5–6 min",
        "Microwave cauliflower rice. Combine shrimp + veg + garnish.",
      ],
    },
    tip: "Air fryer shrimp comes out perfectly — slightly crispy outside, juicy inside. Best method for shrimp.",
  },
  "Thai Basil Chicken Bowl": {
    cal: 490, protein: 44, carbs: 28, fat: 13, serves: 2,
    ingredients: [
      { item: "Ground chicken", qty: "1.5 lbs", store: "Costco" },
      { item: "Garlic, minced", qty: "4 cloves", store: "Whole Foods" },
      { item: "Thai chili or red chili flakes", qty: "1–2 tsp", store: "Whole Foods" },
      { item: "Low-sodium soy sauce", qty: "2 tbsp", store: "Whole Foods" },
      { item: "Fish sauce", qty: "1 tbsp", store: "Whole Foods" },
      { item: "Oyster sauce", qty: "1 tbsp", store: "Whole Foods" },
      { item: "Fresh basil leaves", qty: "1 cup", store: "Whole Foods" },
      { item: "Bell pepper, sliced", qty: "1", store: "Whole Foods" },
      { item: "Cauliflower rice", qty: "2 bags", store: "Costco" },
      { item: "Lime", qty: "1", store: "Whole Foods" },
    ],
    methods: {
      standard: [
        "Heat pan on HIGH with oil spray. Add garlic + chili, stir 30 sec.",
        "Add ground chicken, break apart and cook until just done",
        "Add soy sauce, fish sauce, oyster sauce — toss 1 min",
        "Add bell pepper, stir fry 2 min. Remove from heat.",
        "Fold in fresh basil. Microwave cauli rice. Portion with lime wedge.",
      ],
    },
    tip: "Fish sauce and oyster sauce are at Whole Foods international aisle. Both last months in the fridge.",
  },
  "Chicken Shawarma Bowl": {
    cal: 520, protein: 46, carbs: 30, fat: 16, serves: 2,
    ingredients: [
      { item: "Chicken thighs, boneless", qty: "1.5 lbs", store: "Costco" },
      { item: "Plain Greek yogurt", qty: "¼ cup", store: "Whole Foods" },
      { item: "Olive oil", qty: "1 tbsp", store: "Whole Foods" },
      { item: "Lemon juice", qty: "2 tbsp", store: "Whole Foods" },
      { item: "Cumin", qty: "¾ tbsp", store: "Whole Foods" },
      { item: "Turmeric", qty: "¾ tbsp", store: "Whole Foods" },
      { item: "Paprika", qty: "¾ tbsp", store: "Whole Foods" },
      { item: "Garlic powder", qty: "¾ tbsp", store: "Whole Foods" },
      { item: "Cinnamon", qty: "¼ tsp", store: "Whole Foods" },
      { item: "Cauliflower rice", qty: "2 bags", store: "Costco" },
      { item: "Cherry tomatoes", qty: "1 cup", store: "Whole Foods" },
      { item: "Cucumber, diced", qty: "1", store: "Whole Foods" },
      { item: "Hummus", qty: "4 tbsp", store: "Whole Foods" },
    ],
    methods: {
      standard: [
        "Mix yogurt, olive oil, lemon, and all spices into marinade. Coat chicken thighs.",
        "Marinate 1 hour minimum (overnight is best)",
        "Bake at 425°F on wire rack for 30–35 min until 165°F internal temp",
        "Rest 5 min, slice into strips",
        "Microwave cauli rice. Portion with tomatoes + cucumber + hummus.",
      ],
      airfryer: [
        "Mix yogurt, olive oil, lemon, and all spices into marinade. Coat chicken thighs.",
        "Marinate 1 hour minimum (overnight Saturday = best)",
        "Air fry at 400°F for 18–20 min flipping halfway until 165°F internal",
        "Rest 5 min, slice into strips",
        "Microwave cauli rice. Portion with tomatoes + cucumber + hummus.",
      ],
    },
    tip: "Air fryer gives shawarma that crispy caramelized exterior. Marinate overnight Saturday.",
  },
  "Greek Chicken Souvlaki + Tzatziki": {
    cal: 500, protein: 45, carbs: 28, fat: 14, serves: 2,
    ingredients: [
      { item: "Chicken breast", qty: "1.5 lbs", store: "Costco" },
      { item: "Olive oil", qty: "2 tbsp", store: "Whole Foods" },
      { item: "Lemon juice", qty: "3 tbsp", store: "Whole Foods" },
      { item: "Garlic, minced", qty: "3 cloves", store: "Whole Foods" },
      { item: "Dried oregano", qty: "2 tsp", store: "Whole Foods" },
      { item: "Plain Greek yogurt (tzatziki)", qty: "½ cup", store: "Whole Foods" },
      { item: "Cucumber, grated", qty: "¼", store: "Whole Foods" },
      { item: "Dill, fresh or dried", qty: "1 tsp", store: "Whole Foods" },
      { item: "Quinoa", qty: "¾ cup dry", store: "Whole Foods" },
      { item: "Cherry tomatoes", qty: "1 cup", store: "Whole Foods" },
      { item: "Red onion, sliced", qty: "¼", store: "Whole Foods" },
    ],
    methods: {
      standard: [
        "Cube chicken. Marinate in olive oil, lemon, garlic, oregano — 30 min+",
        "Make tzatziki: Greek yogurt + grated cucumber (squeeze out water) + dill + garlic + lemon. Refrigerate.",
        "Thread chicken on skewers (or cook flat in pan), 4–5 min per side",
        "Cook quinoa: ¾ cup + 1.5 cups water, simmer 15 min covered",
        "Portion: quinoa + chicken + tomatoes + onion + dollop of tzatziki",
      ],
      airfryer: [
        "Cube chicken. Marinate in olive oil, lemon, garlic, oregano — 30 min+",
        "Make tzatziki: Greek yogurt + grated cucumber + dill + garlic + lemon. Refrigerate.",
        "Thread on skewers. Air fry at 390°F for 12–14 min, turning halfway.",
        "Cook quinoa: ¾ cup + 1.5 cups water, simmer 15 min covered",
        "Portion: quinoa + chicken + tomatoes + onion + dollop of tzatziki",
      ],
    },
    tip: "Tzatziki keeps 4–5 days in fridge. Make a big batch and use as a sauce all week.",
  },
  "Moroccan Spiced Chicken + Chickpeas": {
    cal: 530, protein: 44, carbs: 40, fat: 14, serves: 2,
    ingredients: [
      { item: "Chicken thighs, boneless", qty: "1.5 lbs", store: "Costco" },
      { item: "Olive oil", qty: "1 tbsp", store: "Whole Foods" },
      { item: "Cumin", qty: "1 tsp", store: "Whole Foods" },
      { item: "Paprika", qty: "1 tsp", store: "Whole Foods" },
      { item: "Turmeric", qty: "½ tsp", store: "Whole Foods" },
      { item: "Cinnamon", qty: "¼ tsp", store: "Whole Foods" },
      { item: "Cayenne", qty: "¼ tsp", store: "Whole Foods" },
      { item: "Chickpeas, canned", qty: "1 can (15 oz)", store: "Whole Foods" },
      { item: "Diced tomatoes, canned", qty: "14 oz", store: "Whole Foods" },
      { item: "Lemon", qty: "1", store: "Whole Foods" },
      { item: "Fresh cilantro or parsley", qty: "handful", store: "Whole Foods" },
      { item: "Cauliflower rice", qty: "2 bags", store: "Costco" },
    ],
    methods: {
      standard: [
        "Season chicken with all spices + salt",
        "Sear in oven-safe pan 3 min per side until golden",
        "Add chickpeas + diced tomatoes around chicken",
        "Transfer to oven at 400°F for 20 min",
        "Squeeze lemon, top with cilantro. Microwave cauli rice. Portion.",
      ],
      instantpot: [
        "Season chicken with all spices + salt",
        "Use Sauté function to sear chicken 2 min per side",
        "Add chickpeas + diced tomatoes + ¼ cup water. Seal lid.",
        "Pressure Cook HIGH for 12 min. Quick release.",
        "Squeeze lemon, top with cilantro. Microwave cauli rice. Portion.",
      ],
    },
    tip: "IP version is the easiest — one pot, 12 min, done. Great for the Fri meal since you can prep it fast.",
  },
  "Lemon Herb Shrimp + Roasted Veg": {
    cal: 390, protein: 40, carbs: 20, fat: 12, serves: 2,
    ingredients: [
      { item: "Shrimp, peeled + deveined", qty: "1.5 lbs", store: "Costco" },
      { item: "Olive oil", qty: "1 tbsp", store: "Whole Foods" },
      { item: "Lemon juice + zest", qty: "1 lemon", store: "Whole Foods" },
      { item: "Garlic, minced", qty: "3 cloves", store: "Whole Foods" },
      { item: "Fresh herbs (parsley, thyme or oregano)", qty: "2 tbsp", store: "Whole Foods" },
      { item: "Zucchini, sliced", qty: "2", store: "Whole Foods" },
      { item: "Bell pepper, sliced", qty: "1", store: "Whole Foods" },
      { item: "Cherry tomatoes", qty: "1 cup", store: "Whole Foods" },
      { item: "Cauliflower rice", qty: "2 bags", store: "Costco" },
    ],
    methods: {
      standard: [
        "Toss zucchini, bell pepper, tomatoes in olive oil + salt. Roast at 425°F for 20 min.",
        "Toss shrimp in lemon juice, garlic, herbs, salt",
        "Add shrimp to roasting pan for last 6–8 min",
        "Microwave cauli rice. Portion with lemon zest finish.",
      ],
      airfryer: [
        "Toss zucchini + bell pepper in light oil spray. Air fry at 400°F for 10 min.",
        "Toss shrimp in lemon juice, garlic, herbs, salt",
        "Air fry shrimp at 400°F for 6–8 min shaking halfway",
        "Microwave cauli rice. Combine veg + shrimp. Finish with lemon zest.",
      ],
    },
    tip: "Entire meal in ~25 min with air fryer. Great Sunday night when you're tired of cooking.",
  },
  "Chicken Biryani Bowl": {
    cal: 510, protein: 46, carbs: 35, fat: 13, serves: 2,
    ingredients: [
      { item: "Chicken breast", qty: "1.5 lbs", store: "Costco" },
      { item: "Plain Greek yogurt", qty: "¼ cup", store: "Whole Foods" },
      { item: "Biryani spice blend", qty: "2 tbsp", store: "Whole Foods" },
      { item: "Garlic paste", qty: "1 tbsp", store: "Whole Foods" },
      { item: "Ginger paste", qty: "1 tbsp", store: "Whole Foods" },
      { item: "Onion, diced", qty: "1 medium", store: "Whole Foods" },
      { item: "Diced tomatoes, canned", qty: "½ can", store: "Whole Foods" },
      { item: "Cauliflower rice", qty: "2 bags", store: "Costco" },
      { item: "Fresh cilantro", qty: "handful", store: "Whole Foods" },
      { item: "Lemon", qty: "1", store: "Whole Foods" },
    ],
    methods: {
      standard: [
        "Cube chicken. Marinate in yogurt + biryani spice + garlic + ginger — 30 min",
        "Sauté diced onion in pan until golden, ~5 min",
        "Add chicken, cook 5–6 min until browned",
        "Add diced tomatoes, simmer 10 min",
        "Microwave cauli rice. Portion with cilantro + lemon squeeze.",
      ],
      instantpot: [
        "Cube chicken. Marinate in yogurt + biryani spice + garlic + ginger — 30 min",
        "Use Sauté to cook onions until golden, ~5 min",
        "Add chicken + diced tomatoes + ¼ cup water. Seal lid.",
        "Pressure Cook HIGH for 8 min. Quick release.",
        "Microwave cauli rice. Portion with cilantro + lemon squeeze.",
      ],
    },
    tip: "Biryani spice blend at Whole Foods spice aisle. Shan or Swad brands are great.",
  },
  "Buffalo Chicken Bowl": {
    cal: 480, protein: 47, carbs: 22, fat: 14, serves: 2,
    ingredients: [
      { item: "Chicken breast", qty: "1.5 lbs", store: "Costco" },
      { item: "Frank's RedHot sauce", qty: "¼ cup", store: "Whole Foods" },
      { item: "Plain Greek yogurt", qty: "¼ cup", store: "Whole Foods" },
      { item: "Garlic powder", qty: "½ tsp", store: "Whole Foods" },
      { item: "Ranch seasoning (dry)", qty: "1 tsp", store: "Whole Foods" },
      { item: "Cauliflower rice", qty: "2 bags", store: "Costco" },
      { item: "Celery, chopped", qty: "2 stalks", store: "Whole Foods" },
      { item: "Cherry tomatoes", qty: "½ cup", store: "Whole Foods" },
      { item: "Shredded cheddar (optional)", qty: "2 tbsp", store: "Whole Foods" },
    ],
    methods: {
      standard: [
        "Cube chicken. Season with garlic powder + ranch seasoning.",
        "Cook in pan over medium-high 5–7 min until cooked through",
        "Mix Frank's + Greek yogurt into creamy buffalo sauce. Toss chicken in sauce.",
        "Microwave cauli rice. Portion with celery + tomatoes. Optional cheddar sprinkle.",
      ],
      airfryer: [
        "Cube chicken. Season with garlic powder + ranch seasoning.",
        "Air fry at 400°F for 10–12 min, shaking halfway. Gets crispy edges.",
        "Mix Frank's + Greek yogurt into creamy buffalo sauce. Toss hot chicken in sauce.",
        "Microwave cauli rice. Portion with celery + tomatoes. Optional cheddar sprinkle.",
      ],
    },
    tip: "Air fryer buffalo chicken is the best version — crispy outside, saucy coating. Best method here.",
  },
  "Ground Chicken Fajita Bowl": {
    cal: 500, protein: 46, carbs: 30, fat: 13, serves: 2,
    ingredients: [
      { item: "Ground chicken", qty: "1.5 lbs", store: "Costco" },
      { item: "Fajita seasoning", qty: "2 tbsp", store: "Whole Foods" },
      { item: "Bell peppers (mixed), sliced", qty: "3", store: "Whole Foods" },
      { item: "Onion, sliced", qty: "1", store: "Whole Foods" },
      { item: "Garlic, minced", qty: "2 cloves", store: "Whole Foods" },
      { item: "Lime juice", qty: "1 lime", store: "Whole Foods" },
      { item: "Cauliflower rice", qty: "2 bags", store: "Costco" },
      { item: "Salsa", qty: "4 tbsp", store: "Whole Foods" },
      { item: "Plain Greek yogurt", qty: "2 tbsp", store: "Whole Foods" },
      { item: "Low-carb tortillas (optional)", qty: "2", store: "Whole Foods" },
    ],
    methods: {
      standard: [
        "Cook ground chicken in pan over medium, breaking apart. Remove when just done.",
        "Same pan: sauté peppers + onion on HIGH 4–5 min until slightly charred",
        "Add garlic + fajita seasoning + splash of water. Toss everything.",
        "Add chicken back, squeeze lime over everything",
        "Microwave cauli rice. Portion with salsa + Greek yogurt drizzle.",
      ],
      airfryer: [
        "Toss sliced peppers + onion in oil spray + fajita seasoning. Air fry at 400°F for 10 min.",
        "Season ground chicken with fajita seasoning + garlic",
        "Air fry ground chicken at 375°F for 8–10 min, breaking apart halfway",
        "Squeeze lime over chicken + peppers. Combine.",
        "Microwave cauli rice. Portion with salsa + Greek yogurt drizzle.",
      ],
    },
    tip: "Air fryer peppers get that charred fajita flavor better than stovetop. Run both baskets simultaneously.",
  },
};

const weeks = [
  { week: 1, theme: "The Classics", days: [
    { day: "Mon", meal: "Chicken Tikka Masala Bowl", cuisine: "🇮🇳 Indian", cal: 520, protein: 48, prep: true },
    { day: "Tue", meal: "Chicken Tikka Masala Bowl", cuisine: "🇮🇳 Indian", cal: 520, protein: 48, repeat: true },
    { day: "Wed", meal: "Teriyaki Chicken + Broccoli", cuisine: "🇯🇵 Asian", cal: 500, protein: 46, prep: true },
    { day: "Thu", meal: "Teriyaki Chicken + Broccoli", cuisine: "🇯🇵 Asian", cal: 500, protein: 46, repeat: true },
    { day: "Fri", meal: "Mediterranean Chicken Bowl", cuisine: "🫒 Med", cal: 510, protein: 44, prep: true, fridayLunch: true },
    { day: "Sat", meal: "🍹 Night out", cuisine: "", cal: 200, protein: 0, nightOut: true },
    { day: "Sun", meal: "Ground Chicken Taco Bowl", cuisine: "🌮 Tex-Mex", cal: 490, protein: 44 },
  ], grocery: {
    "🏬 Costco (Month 1 stock-up run)": [
      "Kirkland chicken breasts ~8.4 lb pkg — $31.25 · freeze in 1.5 lb portions",
      "Kirkland chicken thighs ~8.25 lb pkg — $30.67 · freeze in 1.5 lb portions",
      "Ground chicken — bulk pack · freeze in 1.5 lb portions",
      "Kirkland frozen shrimp — large bag · freeze",
      "Kirkland frozen cauliflower rice — large bag",
      "Kirkland frozen broccoli florets — large bag",
      "Kirkland frozen edamame — bag",
      "Taylor Farms spinach — large bag",
      "Kirkland organic Greek yogurt (48oz ~$7) — replaces all recipe yogurt",
      "Kirkland hummus with pine nuts multipack (~$10) — replaces all recipe hummus",
      "Kirkland organic olive oil — pantry",
      "Kirkland low-sodium soy sauce — pantry",
      "Kirkland organic salsa — replaces all recipe salsa",
      "Kirkland quinoa — replaces all recipe quinoa",
      "Kirkland organic diced tomatoes — 6-pack · replaces all canned tomatoes",
      "Kirkland organic chicken broth — 6-pack",
      "Oikos Pro yogurt — multipack (morning + snack)",
      "Bananas — weekly",
      "Honey — large jar",
    ],
    "🛒 Whole Foods (fresh + specialty only)": [
      "Garlic paste + ginger paste",
      "Tikka masala seasoning",
      "Garam masala",
      "Heavy cream — small carton",
      "Rice vinegar",
      "Sesame oil",
      "Sesame seeds + scallions",
      "Cherry tomatoes — 1 pint",
      "Cucumber × 2",
      "Lemons × 3",
      "Fresh parsley",
      "Black beans canned — 1 can",
      "Bell peppers × 3",
      "Limes × 2",
      "Low-carb tortillas — 1 pack",
      "Taco seasoning — 1 packet",
    ],
  }},
  { week: 2, theme: "Asian Tour", days: [
    { day: "Mon", meal: "Korean Gochujang Chicken Bowl", cuisine: "🇰🇷 Asian", cal: 510, protein: 45, prep: true },
    { day: "Tue", meal: "Korean Gochujang Chicken Bowl", cuisine: "🇰🇷 Asian", cal: 510, protein: 45, repeat: true },
    { day: "Wed", meal: "Garlic Shrimp Stir Fry + Cauli Rice", cuisine: "🦐 Shrimp", cal: 420, protein: 40, prep: true },
    { day: "Thu", meal: "Garlic Shrimp Stir Fry + Cauli Rice", cuisine: "🦐 Shrimp", cal: 420, protein: 40, repeat: true },
    { day: "Fri", meal: "Thai Basil Chicken Bowl", cuisine: "🇹🇭 Asian", cal: 490, protein: 44, prep: true, fridayLunch: true },
    { day: "Sat", meal: "🍹 Night out", cuisine: "", cal: 200, protein: 0, nightOut: true },
    { day: "Sun", meal: "Korean Gochujang Chicken Bowl", cuisine: "🇰🇷 Asian", cal: 510, protein: 45 },
  ], grocery: {
    "🏬 Costco (pull from freezer)": [
      "Chicken breast — thaw 3 lbs",
      "Shrimp — thaw 1.5 lbs",
      "Cauliflower rice — pull from stock",
      "Broccoli + edamame — pull from stock",
      "Greek yogurt + soy sauce + olive oil — pull from stock",
    ],
    "🛒 Whole Foods (fresh + specialty only)": [
      "Gochujang paste — 1 tub",
      "Fish sauce — 1 bottle",
      "Oyster sauce — 1 bottle",
      "Snap peas or bok choy",
      "Shredded carrots — 1 bag",
      "Cucumber × 2",
      "Scallions × 2 bunches",
      "Fresh basil — 1 bunch",
      "Ginger root",
      "Garlic",
      "Bell peppers × 3",
      "Thai chili or red chili flakes",
      "Limes × 2",
    ],
  }},
  { week: 3, theme: "Mediterranean Week", days: [
    { day: "Mon", meal: "Chicken Shawarma Bowl", cuisine: "🫒 Med", cal: 520, protein: 46, prep: true },
    { day: "Tue", meal: "Chicken Shawarma Bowl", cuisine: "🫒 Med", cal: 520, protein: 46, repeat: true },
    { day: "Wed", meal: "Greek Chicken Souvlaki + Tzatziki", cuisine: "🫒 Med", cal: 500, protein: 45, prep: true },
    { day: "Thu", meal: "Greek Chicken Souvlaki + Tzatziki", cuisine: "🫒 Med", cal: 500, protein: 45, repeat: true },
    { day: "Fri", meal: "Moroccan Spiced Chicken + Chickpeas", cuisine: "🫒 Med", cal: 530, protein: 44, prep: true, fridayLunch: true },
    { day: "Sat", meal: "🍹 Night out", cuisine: "", cal: 200, protein: 0, nightOut: true },
    { day: "Sun", meal: "Lemon Herb Shrimp + Roasted Veg", cuisine: "🦐 Shrimp", cal: 390, protein: 40 },
  ], grocery: {
    "🏬 Costco (pull from freezer)": [
      "Chicken thighs — thaw 4.5 lbs",
      "Shrimp — thaw 1.5 lbs",
      "Spinach + cauliflower rice — pull from stock",
      "Greek yogurt + hummus + olive oil + diced tomatoes — pull from stock",
      "Quinoa + chicken broth — pull from stock",
    ],
    "🛒 Whole Foods (fresh + specialty only)": [
      "Cumin, paprika, turmeric, cinnamon, cayenne, garlic powder",
      "Chickpeas canned — 1 can",
      "Dill fresh or dried",
      "Cherry tomatoes — 1 pint",
      "Cucumber × 2",
      "Red onion × 1",
      "Zucchini × 2",
      "Bell pepper × 1",
      "Lemons × 4",
      "Fresh parsley or cilantro",
      "Fresh herbs (parsley/thyme/oregano)",
    ],
  }},
  { week: 4, theme: "Americas + Indian", days: [
    { day: "Mon", meal: "Chicken Biryani Bowl", cuisine: "🇮🇳 Indian", cal: 510, protein: 46, prep: true },
    { day: "Tue", meal: "Chicken Biryani Bowl", cuisine: "🇮🇳 Indian", cal: 510, protein: 46, repeat: true },
    { day: "Wed", meal: "Buffalo Chicken Bowl", cuisine: "🇺🇸 American", cal: 480, protein: 47, prep: true },
    { day: "Thu", meal: "Buffalo Chicken Bowl", cuisine: "🇺🇸 American", cal: 480, protein: 47, repeat: true },
    { day: "Fri", meal: "Ground Chicken Fajita Bowl", cuisine: "🌮 Tex-Mex", cal: 500, protein: 46, prep: true, fridayLunch: true },
    { day: "Sat", meal: "🍹 Night out", cuisine: "", cal: 200, protein: 0, nightOut: true },
    { day: "Sun", meal: "Ground Chicken Taco Bowl", cuisine: "🌮 Tex-Mex", cal: 490, protein: 44 },
  ], grocery: {
    "🏬 Costco (pull from freezer)": [
      "Chicken breast — thaw 3 lbs",
      "Ground chicken — thaw 3 lbs",
      "Shrimp — thaw 1 lb",
      "Cauliflower rice — pull from stock",
      "Greek yogurt + salsa + olive oil + diced tomatoes — pull from stock",
    ],
    "🛒 Whole Foods (fresh + specialty only)": [
      "Biryani spice blend — 1 pack",
      "Garlic paste + ginger paste",
      "Onion × 2",
      "Frank's RedHot sauce",
      "Ranch seasoning dry",
      "Fajita seasoning",
      "Bell peppers × 5",
      "Celery — 1 bunch",
      "Cherry tomatoes — 1 pint",
      "Avocado × 2",
      "Limes × 3",
      "Low-carb tortillas — 1 pack",
      "Fresh cilantro",
      "Shredded cheddar — small bag",
    ],
  }},
];

const sweets = {
  everyday: [
    {
      name: "Oikos Pro + Cocoa + Banana",
      type: "🍫 Chocolate",
      cal: 260, protein: 22, sugar: 18,
      desc: "Mix 1 Oikos Pro + 1 tsp cocoa powder + half a mashed banana. Tastes like chocolate mousse.",
      store: "Costco", storeColor: "#004990",
      tip: "Best after dinner. Takes 2 min. Fills you up and kills the craving.",
    },
    {
      name: "Frozen Banana Nice Cream",
      type: "🍦 Ice Cream Dupe",
      cal: 120, protein: 2, sugar: 14,
      desc: "Blend 1 frozen banana + 1 tbsp cocoa powder. Texture = soft serve. No added sugar.",
      store: "Costco", storeColor: "#004990",
      tip: "Freeze bananas in chunks ahead of time. Blends in 30 sec.",
    },
    {
      name: "Lily's Dark Chocolate Chips",
      type: "🍫 Chocolate",
      cal: 80, protein: 1, sugar: 0,
      desc: "40% less sugar, sweetened with stevia. Melt a small handful or eat straight. Real chocolate taste.",
      store: "Whole Foods", storeColor: "#2D8A4E",
      tip: "Keep a bag on your desk. A small handful = craving gone.",
    },
    {
      name: "Kind Dark Chocolate Nut Bar",
      type: "🍫 Chocolate",
      cal: 200, protein: 6, sugar: 5,
      desc: "Real dark chocolate, nuts, low sugar. Satisfying enough to replace a cookie craving.",
      store: "Costco", storeColor: "#004990",
      tip: "Costco sells multipacks. Keep at office desk for afternoon cravings.",
    },
    {
      name: "Kodiak Cakes Protein Muffin",
      type: "🧁 Baked Good",
      cal: 180, protein: 12, sugar: 8,
      desc: "Double chocolate or blueberry lemon. Tastes like a real muffin, high protein, made with whole grains.",
      store: "Costco", storeColor: "#004990",
      tip: "Costco sells the mix or ready-made cups. Make a batch Sunday = grab-and-go all week.",
    },
    {
      name: "Rice Cake + Almond Butter + Dark Chips",
      type: "🍫 Chocolate",
      cal: 180, protein: 5, sugar: 6,
      desc: "1 rice cake + 1 tbsp almond butter + small sprinkle of Lily's chips. Crunchy, sweet, satisfying.",
      store: "Whole Foods", storeColor: "#2D8A4E",
      tip: "Great afternoon desk snack. Ready in 60 seconds.",
    },
    {
      name: "Halo Top Chocolate Ice Cream",
      type: "🍦 Ice Cream",
      cal: 280, protein: 20, sugar: 16,
      desc: "Whole pint is ~280 cal vs 1,000+ for regular. Chocolate, chocolate chip, and birthday cake are best flavors.",
      store: "Whole Foods", storeColor: "#2D8A4E",
      tip: "Keep one in the freezer at all times. Way better to have this available than to reach for something worse.",
    },
    {
      name: "Greek Yogurt Bark",
      type: "🧁 Baked Good",
      cal: 150, protein: 14, sugar: 10,
      desc: "Spread Oikos Pro on parchment, top with Lily's chips + banana slices. Freeze 2 hours. Break into pieces.",
      store: "Costco", storeColor: "#004990",
      tip: "Prep Sunday during meal prep. Lasts all week in the freezer.",
    },
  ],
  weekly: [
    {
      name: "1 Real Cookie or Brownie",
      type: "🍪 Real Treat",
      cal: 300, protein: 3, sugar: 28,
      desc: "Once a week — whatever you actually want. Don't restrict it, just plan for it. Budget 300–400 cal.",
      store: "Anywhere", storeColor: "#888",
      tip: "Night out is a good time for this. Or Friday night at home. Planned treats don't derail cuts.",
    },
    {
      name: "Real Ice Cream (1 scoop)",
      type: "🍦 Real Treat",
      cal: 250, protein: 4, sugar: 22,
      desc: "One scoop of whatever you want, once a week. Way better than bingeing after restricting all week.",
      store: "Anywhere", storeColor: "#888",
      tip: "Pair with a walk after dinner — makes it feel intentional, not guilty.",
    },
  ],
};

const cuisineColors = {
  "🇮🇳 Indian": "#E8630A", "🇯🇵 Asian": "#0A7EA4", "🇰🇷 Asian": "#0A7EA4",
  "🇹🇭 Asian": "#0A7EA4", "🫒 Med": "#2D8A4E", "🌮 Tex-Mex": "#9B2335",
  "🇺🇸 American": "#1a4f8a", "🦐 Shrimp": "#5B8FA8", "": "#888",
};
const storeColors = { "Costco": "#004990", "Whole Foods": "#2D8A4E" };
const groceryStoreColors = {
  "🏬 Costco (Month 1 stock-up run)": "#004990",
  "🏬 Costco (pull from freezer)": "#004990",
  "🛒 Whole Foods (fresh + specialty only)": "#2D8A4E",
};
const methodLabels = { standard: "Stovetop/Oven", airfryer: "✈️ Air Fryer", instantpot: "⚡ Instant Pot" };

export default function App() {
  const [activeWeek, setActiveWeek] = useState(0);
  const [view, setView] = useState("schedule");
  const [activeRecipe, setActiveRecipe] = useState(null);
  const [activeMethod, setActiveMethod] = useState("standard");
  const week = weeks[activeWeek];
  const uniqueMeals = [...new Set(week.days.filter(d => !d.nightOut).map(d => d.meal))];

  if (activeRecipe) {
    const r = recipes[activeRecipe];
    const color = cuisineColors[week.days.find(d => d.meal === activeRecipe)?.cuisine] || "#888";
    const availableMethods = Object.keys(r.methods);
    const currentMethod = availableMethods.includes(activeMethod) ? activeMethod : "standard";
    const steps = r.methods[currentMethod];
    return (
      <div style={{ fontFamily: "Georgia, serif", background: "#F7F7F4", minHeight: "100vh", paddingBottom: 60, color: "#1a1a1a" }}>
        <div style={{ background: color, color: "#fff", padding: "20px 16px 16px" }}>
          <button onClick={() => setActiveRecipe(null)} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", borderRadius: 6, padding: "6px 12px", fontSize: 12, cursor: "pointer", marginBottom: 12, fontFamily: "Georgia, serif" }}>← Back</button>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>{activeRecipe}</h2>
          <p style={{ margin: "6px 0 0", opacity: 0.8, fontSize: 13 }}>Makes {r.serves} servings</p>
        </div>
        <div style={{ padding: "14px 16px" }}>
          <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
            {[["Cal", r.cal, color], ["Protein", `${r.protein}g`, "#2D8A4E"], ["Carbs", `${r.carbs}g`, "#888"], ["Fat", `${r.fat}g`, "#aaa"]].map(([l, v, c]) => (
              <div key={l} style={{ flex: 1, background: "#fff", borderRadius: 8, padding: "10px 4px", textAlign: "center", border: "1px solid #eee" }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: c }}>{v}</div>
                <div style={{ fontSize: 10, color: "#aaa", marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>

          {availableMethods.length > 1 && (
            <div style={{ display: "flex", background: "#e8e8e8", borderRadius: 8, padding: 3, marginBottom: 14, gap: 3 }}>
              {availableMethods.map(m => (
                <button key={m} onClick={() => setActiveMethod(m)} style={{
                  flex: 1, padding: "7px 4px", border: "none", borderRadius: 6,
                  background: currentMethod === m ? "#fff" : "transparent",
                  color: currentMethod === m ? "#1a1a1a" : "#888",
                  fontSize: 11, fontFamily: "Georgia, serif", cursor: "pointer",
                  fontWeight: currentMethod === m ? 700 : 400,
                  boxShadow: currentMethod === m ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                }}>{methodLabels[m]}</button>
              ))}
            </div>
          )}

          <div style={{ background: "#fff", borderRadius: 10, overflow: "hidden", border: "1px solid #eee", marginBottom: 14 }}>
            <div style={{ background: "#1a1a1a", color: "#fff", padding: "11px 16px", fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>Ingredients</div>
            {r.ingredients.map((ing, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 16px", borderBottom: i < r.ingredients.length - 1 ? "1px solid #f5f5f5" : "none", fontSize: 13 }}>
                <span>{ing.item}</span>
                <span style={{ color: "#888", fontSize: 12 }}>{ing.qty} · <span style={{ color: storeColors[ing.store] || "#888", fontWeight: 600 }}>{ing.store}</span></span>
              </div>
            ))}
          </div>

          <div style={{ background: "#fff", borderRadius: 10, overflow: "hidden", border: "1px solid #eee", marginBottom: 14 }}>
            <div style={{ background: color, color: "#fff", padding: "11px 16px", fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>{methodLabels[currentMethod]} Steps</div>
            {steps.map((step, i) => (
              <div key={i} style={{ display: "flex", gap: 12, padding: "12px 16px", borderBottom: i < steps.length - 1 ? "1px solid #f5f5f5" : "none", alignItems: "flex-start" }}>
                <div style={{ minWidth: 22, height: 22, borderRadius: "50%", background: color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
                <span style={{ fontSize: 13, lineHeight: 1.6, color: "#333" }}>{step}</span>
              </div>
            ))}
          </div>

          {r.tip && (
            <div style={{ background: "#1a1a1a", color: "#fff", borderRadius: 10, padding: "13px 16px", fontSize: 13, lineHeight: 1.6 }}>
              <strong>💡 </strong><span style={{ color: "#aaa" }}>{r.tip}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "Georgia, serif", background: "#F7F7F4", minHeight: "100vh", paddingBottom: 70, color: "#1a1a1a" }}>
      <div style={{ background: "#1a1a1a", color: "#F7F7F4", padding: "28px 20px 22px" }}>
        <div style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "#666", marginBottom: 6 }}>CutLog · Month 1</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 400 }}>4-Week Dinner Plan</h1>
        <p style={{ margin: "6px 0 0", color: "#888", fontSize: 13 }}>Chicken & shrimp · Air Fryer + Instant Pot methods included</p>
      </div>

      <div style={{ background: "#fff", padding: "14px 16px", borderBottom: "1px solid #eee" }}>
        <div style={{ display: "flex", gap: 8 }}>
          {weeks.map((w, i) => (
            <button key={i} onClick={() => { setActiveWeek(i); setView("schedule"); }} style={{
              flex: 1, padding: "10px 4px", border: "none", borderRadius: 8,
              background: activeWeek === i ? "#1a1a1a" : "#f0f0f0",
              color: activeWeek === i ? "#fff" : "#888",
              fontSize: 12, fontFamily: "Georgia, serif", cursor: "pointer",
              fontWeight: activeWeek === i ? 700 : 400,
            }}>Wk {i + 1}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: "14px 16px 0" }}>
        <div style={{ background: "#fff", borderRadius: 10, padding: "13px 16px", border: "1px solid #eee", marginBottom: 12 }}>
          <div style={{ fontSize: 10, color: "#aaa", textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 }}>Week {activeWeek + 1}</div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>{week.theme}</div>
        </div>
      </div>

      <div style={{ display: "flex", margin: "0 16px 14px", background: "#e8e8e8", borderRadius: 8, padding: 3 }}>
        {[["schedule", "Schedule"], ["recipes", "Recipes"], ["grocery", "Grocery"], ["sweets", "🍫 Sweets"]].map(([id, label]) => (
          <button key={id} onClick={() => setView(id)} style={{
            flex: 1, padding: "8px 4px", border: "none", borderRadius: 6,
            background: view === id ? "#fff" : "transparent",
            color: view === id ? "#1a1a1a" : "#888",
            fontSize: 12, fontFamily: "Georgia, serif", cursor: "pointer",
            fontWeight: view === id ? 700 : 400,
            boxShadow: view === id ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
          }}>{label}</button>
        ))}
      </div>

      <div style={{ padding: "0 16px" }}>
        {view === "schedule" && (
          <div>
            {week.days.map((d, i) => {
              const color = d.nightOut ? "#888" : (cuisineColors[d.cuisine] || "#888");
              return (
                <div key={i} onClick={() => !d.nightOut && !d.repeat && recipes[d.meal] && setActiveRecipe(d.meal)} style={{
                  background: "#fff", borderRadius: 10, marginBottom: 8, padding: "13px 14px",
                  border: "1px solid #eee", display: "flex", alignItems: "center", gap: 12,
                  opacity: d.nightOut ? 0.5 : 1,
                  cursor: !d.nightOut && !d.repeat && recipes[d.meal] ? "pointer" : "default",
                }}>
                  <div style={{ minWidth: 36, height: 36, borderRadius: 8, background: d.nightOut ? "#f0f0f0" : color + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color }}>{d.day}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: d.nightOut ? 400 : 600, color: d.nightOut ? "#aaa" : "#1a1a1a" }}>
                      {d.meal}{d.repeat && <span style={{ marginLeft: 6, fontSize: 10, color: "#ccc", fontWeight: 400 }}>(leftover)</span>}
                    </div>
                    {d.fridayLunch && <div style={{ fontSize: 10, color: "#2D8A4E", marginTop: 2 }}>Fri lunch + dinner ✓</div>}
                    {!d.nightOut && <div style={{ fontSize: 11, color: "#bbb", marginTop: 2 }}>{d.cuisine}</div>}
                  </div>
                  {!d.nightOut && (
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color }}>{d.cal}</div>
                      <div style={{ fontSize: 10, color: "#ccc" }}>cal</div>
                      <div style={{ fontSize: 11, color: "#bbb", marginTop: 1 }}>{d.protein}g</div>
                      {!d.repeat && recipes[d.meal] && <div style={{ fontSize: 10, color, marginTop: 3 }}>recipe →</div>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {view === "grocery" && (
          <div>
            {activeWeek === 0 && (
              <div style={{ background: "#004990", color: "#fff", borderRadius: 10, padding: "13px 16px", marginBottom: 12, fontSize: 13, lineHeight: 1.6 }}>
                <strong>🏬 Week 1 = Big Costco run</strong> — buy all Kirkland staples in bulk. One run covers the entire month. Freeze proteins in 1.5 lb portions right when you get home.
              </div>
            )}
            {activeWeek > 0 && (
              <div style={{ background: "#e8f0ff", borderRadius: 10, padding: "13px 16px", marginBottom: 12, fontSize: 13, lineHeight: 1.6, color: "#444", border: "1px solid #c8d8ff" }}>
                <strong style={{ color: "#004990" }}>🏬 Costco:</strong> Pull from your freezer stock — no store run needed. Thaw proteins in fridge Saturday night.
              </div>
            )}
            {Object.entries(week.grocery).map(([store, items]) => {
              const color = groceryStoreColors[store] || "#888";
              return (
                <div key={store} style={{ background: "#fff", borderRadius: 10, marginBottom: 12, overflow: "hidden", border: "1px solid #eee" }}>
                  <div style={{ background: color, color: "#fff", padding: "12px 16px", fontSize: 13, fontWeight: 700 }}>{store}</div>
                  <div style={{ padding: "6px 16px 14px" }}>
                    {items.map((item, i) => (
                      <div key={i} style={{ padding: "9px 0", borderBottom: i < items.length - 1 ? "1px solid #f5f5f5" : "none", fontSize: 13, display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 5, height: 5, borderRadius: "50%", background: color, flexShrink: 0, opacity: 0.5 }} />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            <div style={{ background: "#1a1a1a", color: "#fff", borderRadius: 10, padding: "13px 16px", fontSize: 13, lineHeight: 1.7 }}>
              <strong>💡 Tip:</strong> <span style={{ color: "#aaa" }}>Order Whole Foods Saturday night for Sunday morning delivery. Thaw Costco proteins in fridge overnight. Everything ready when you cook.</span>
            </div>
          </div>
        )}

        {view === "recipes" && (
          <div>
            <div style={{ fontSize: 11, color: "#aaa", textAlign: "center", marginBottom: 14, letterSpacing: 1, textTransform: "uppercase" }}>Tap for recipe · Air Fryer + IP methods inside</div>
            {uniqueMeals.map((meal, i) => {
              const d = week.days.find(d => d.meal === meal);
              const color = cuisineColors[d?.cuisine] || "#888";
              const r = recipes[meal];
              const hasMethods = r && Object.keys(r.methods).length > 1;
              return (
                <div key={i} onClick={() => setActiveRecipe(meal)} style={{
                  background: "#fff", borderRadius: 10, marginBottom: 10, padding: "14px 16px",
                  border: "1px solid #eee", cursor: "pointer", display: "flex", alignItems: "center", gap: 12,
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, color, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 }}>{d?.cuisine}</div>
                    <div style={{ fontSize: 16, fontWeight: 700 }}>{meal}</div>
                    <div style={{ fontSize: 12, color: "#aaa", marginTop: 4 }}>
                      {r?.protein}g protein · {r?.cal} cal
                      {hasMethods && <span style={{ marginLeft: 8, color: "#0A7EA4" }}>✈️ AF + ⚡ IP</span>}
                    </div>
                  </div>
                  <div style={{ fontSize: 18, color: "#ddd" }}>→</div>
                </div>
              );
            })}
          </div>
        )}

        {view === "sweets" && (
          <div>
            <div style={{ background: "#1a1a1a", color: "#fff", borderRadius: 10, padding: "13px 16px", marginBottom: 14, fontSize: 13, lineHeight: 1.6 }}>
              <strong>80/20 rule:</strong> <span style={{ color: "#aaa" }}>Clean swaps every day, one real treat per week. Planned indulgence beats random bingeing every time.</span>
            </div>

            <div style={{ fontSize: 11, color: "#aaa", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10, fontWeight: 700 }}>Everyday swaps (the 80%)</div>
            {sweets.everyday.map((s, i) => (
              <div key={i} style={{ background: "#fff", borderRadius: 10, marginBottom: 10, border: "1px solid #eee", overflow: "hidden" }}>
                <div style={{ padding: "14px 16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 11, color: "#888", marginBottom: 3 }}>{s.type}</div>
                      <div style={{ fontSize: 15, fontWeight: 700 }}>{s.name}</div>
                      <div style={{ fontSize: 12, color: "#aaa", marginTop: 3 }}>{s.cal} cal · {s.protein}g protein · {s.sugar}g sugar</div>
                    </div>
                    <div style={{ background: s.storeColor, color: "#fff", borderRadius: 6, padding: "4px 8px", fontSize: 11, fontWeight: 700, marginLeft: 10, whiteSpace: "nowrap" }}>
                      {s.store}
                    </div>
                  </div>
                  <div style={{ fontSize: 13, color: "#555", marginTop: 10, lineHeight: 1.6 }}>{s.desc}</div>
                  <div style={{ marginTop: 8, background: "#F7F7F4", borderRadius: 6, padding: "8px 10px", fontSize: 12, color: "#888", lineHeight: 1.5 }}>
                    💡 {s.tip}
                  </div>
                </div>
              </div>
            ))}

            <div style={{ fontSize: 11, color: "#aaa", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10, marginTop: 6, fontWeight: 700 }}>Weekly real treat (the 20%)</div>
            {sweets.weekly.map((s, i) => (
              <div key={i} style={{ background: "#fff", borderRadius: 10, marginBottom: 10, border: "1px solid #eee", overflow: "hidden" }}>
                <div style={{ padding: "14px 16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 11, color: "#888", marginBottom: 3 }}>{s.type}</div>
                      <div style={{ fontSize: 15, fontWeight: 700 }}>{s.name}</div>
                      <div style={{ fontSize: 12, color: "#aaa", marginTop: 3 }}>{s.cal} cal · {s.protein}g protein</div>
                    </div>
                    <div style={{ background: s.storeColor, color: "#fff", borderRadius: 6, padding: "4px 8px", fontSize: 11, fontWeight: 700, marginLeft: 10 }}>
                      {s.store}
                    </div>
                  </div>
                  <div style={{ fontSize: 13, color: "#555", marginTop: 10, lineHeight: 1.6 }}>{s.desc}</div>
                  <div style={{ marginTop: 8, background: "#F7F7F4", borderRadius: 6, padding: "8px 10px", fontSize: 12, color: "#888", lineHeight: 1.5 }}>
                    💡 {s.tip}
                  </div>
                </div>
              </div>
            ))}

            <div style={{ background: "#9B2335", color: "#fff", borderRadius: 10, padding: "13px 16px", fontSize: 13, lineHeight: 1.7, marginBottom: 10 }}>
              <strong>🍫 Stock list:</strong> <span style={{ color: "rgba(255,255,255,0.8)" }}>Lily's chips + Kind bars at your desk. Halo Top in freezer. Kodiak muffins on counter. Frozen bananas in freezer. Always have something available.</span>
            </div>
          </div>
        )}
      </div>

      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", borderTop: "1px solid #eee", padding: "12px 16px", display: "flex", justifyContent: "center", gap: 8 }}>
        {weeks.map((w, i) => (
          <button key={i} onClick={() => { setActiveWeek(i); setView("schedule"); }} style={{
            width: i === activeWeek ? 24 : 8, height: 8, borderRadius: 4,
            background: i === activeWeek ? "#1a1a1a" : "#ddd",
            border: "none", cursor: "pointer", padding: 0, transition: "all 0.2s",
          }} />
        ))}
      </div>
    </div>
  );
}
