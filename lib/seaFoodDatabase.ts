export interface ClarificationQuestion {
  id: string
  question: string
  type: 'single' | 'multi'
  options: Array<{
    id: string
    label: string
    calorieModifier: number
  }>
}

export interface SeaFood {
  id: string
  dishName: string
  country: string
  category: string
  emoji: string
  defaultCaloriesMin: number
  defaultCaloriesMax: number
  defaultCalories: number
  macros: {
    protein: number
    carbs: number
    fat: number
    fiber: number
  }
  commonHiddenCalories: string[]
  clarificationQuestions: ClarificationQuestion[]
  healthierAlternative: {
    name: string
    caloriesSaved: number
  }
}

export const SEA_FOOD_DATABASE: SeaFood[] = [
  // SINGAPORE
  {
    id: 'sg-chicken-rice',
    dishName: 'Chicken Rice',
    country: 'Singapore',
    category: 'Rice & Chicken',
    emoji: '🍚',
    defaultCaloriesMin: 350,
    defaultCaloriesMax: 750,
    defaultCalories: 480,
    macros: { protein: 28, carbs: 52, fat: 12, fiber: 2 },
    commonHiddenCalories: [
      'Chicken skin adds 50–80 kcal',
      'Chilli sauce: 20–40 kcal per tablespoon',
      'Oil used in cooking rice: 60–100 kcal',
      'Ginger garnish oil: 10–15 kcal',
    ],
    clarificationQuestions: [
      {
        id: 'sg-cr-portion',
        question: 'Portion size?',
        type: 'single',
        options: [
          { id: 'small', label: 'Small', calorieModifier: -100 },
          { id: 'regular', label: 'Regular', calorieModifier: 0 },
          { id: 'large', label: 'Large', calorieModifier: 120 },
          { id: 'xl', label: 'Double Rice', calorieModifier: 240 },
        ],
      },
      {
        id: 'sg-cr-skin',
        question: 'Ate the chicken skin?',
        type: 'single',
        options: [
          { id: 'no-skin', label: 'No', calorieModifier: -50 },
          { id: 'some-skin', label: 'Some', calorieModifier: 0 },
          { id: 'all-skin', label: 'Yes', calorieModifier: 60 },
        ],
      },
      {
        id: 'sg-cr-sauce',
        question: 'How much sauce?',
        type: 'single',
        options: [
          { id: 'light', label: 'Light', calorieModifier: -20 },
          { id: 'normal', label: 'Normal', calorieModifier: 0 },
          { id: 'extra', label: 'Extra', calorieModifier: 40 },
        ],
      },
    ],
    healthierAlternative: {
      name: 'Skinless Chicken Rice with Less Oil',
      caloriesSaved: 120,
    },
  },
  {
    id: 'sg-hokkien-mee',
    dishName: 'Hokkien Mee',
    country: 'Singapore',
    category: 'Noodles',
    emoji: '🍝',
    defaultCaloriesMin: 450,
    defaultCaloriesMax: 650,
    defaultCalories: 580,
    macros: { protein: 18, carbs: 62, fat: 18, fiber: 2 },
    commonHiddenCalories: [
      'Pork lard sprinkled on top: 60–80 kcal',
      'Prawns can add 40–60 kcal',
      'Oil for stir-frying: 80–120 kcal',
      'Egg cooked in: 70–90 kcal',
    ],
    clarificationQuestions: [
      {
        id: 'sg-hm-lard',
        question: 'Was there pork lard on top?',
        type: 'single',
        options: [
          { id: 'no-lard', label: 'No', calorieModifier: 0 },
          { id: 'light-lard', label: 'Some', calorieModifier: 60 },
          { id: 'heavy-lard', label: 'Lots', calorieModifier: 100 },
        ],
      },
      {
        id: 'sg-hm-prawns',
        question: 'Any prawns?',
        type: 'single',
        options: [
          { id: 'no-prawns', label: 'No', calorieModifier: 0 },
          { id: 'some-prawns', label: 'Yes', calorieModifier: 50 },
        ],
      },
    ],
    healthierAlternative: {
      name: 'Hokkien Mee with Less Lard & Extra Vegetables',
      caloriesSaved: 100,
    },
  },
  {
    id: 'sg-laksa',
    dishName: 'Laksa',
    country: 'Singapore',
    category: 'Soups & Curries',
    emoji: '🍜',
    defaultCaloriesMin: 400,
    defaultCaloriesMax: 700,
    defaultCalories: 560,
    macros: { protein: 22, carbs: 48, fat: 20, fiber: 3 },
    commonHiddenCalories: [
      'Coconut cream in curry base: 150–200 kcal',
      'Tofu puffs: 80–120 kcal',
      'Thick noodles absorb oil: 60–100 kcal',
      'Hard-boiled egg: 70–80 kcal',
    ],
    clarificationQuestions: [
      {
        id: 'sg-laksa-base',
        question: 'How creamy was it?',
        type: 'single',
        options: [
          { id: 'light', label: 'Light', calorieModifier: -100 },
          { id: 'normal', label: 'Normal', calorieModifier: 0 },
          { id: 'creamy', label: 'Very Creamy', calorieModifier: 100 },
        ],
      },
      {
        id: 'sg-laksa-toppings',
        question: 'Which toppings?',
        type: 'multi',
        options: [
          { id: 'tofu', label: 'Tofu Puffs', calorieModifier: 100 },
          { id: 'egg', label: 'Hard-boiled Egg', calorieModifier: 75 },
          { id: 'prawn', label: 'Prawns', calorieModifier: 40 },
        ],
      },
    ],
    healthierAlternative: {
      name: 'Light Laksa with Coconut Milk Reduced',
      caloriesSaved: 80,
    },
  },
  {
    id: 'sg-char-kway-teow',
    dishName: 'Char Kway Teow',
    country: 'Singapore',
    category: 'Noodles',
    emoji: '🥘',
    defaultCaloriesMin: 500,
    defaultCaloriesMax: 800,
    defaultCalories: 680,
    macros: { protein: 20, carbs: 68, fat: 26, fiber: 2 },
    commonHiddenCalories: [
      'Lard oil for stir-frying: 120–160 kcal',
      'Dark soy sauce: 10–20 kcal',
      'Prawns and seafood: 50–80 kcal',
      'Chinese sausage (lap cheong): 60–80 kcal',
    ],
    clarificationQuestions: [
      {
        id: 'sg-ckt-wok-hei',
        question: 'How much wok hei (charred)?',
        type: 'single',
        options: [
          { id: 'light', label: 'Light', calorieModifier: -40 },
          { id: 'normal', label: 'Normal', calorieModifier: 0 },
          { id: 'heavy', label: 'Heavy', calorieModifier: 60 },
        ],
      },
      {
        id: 'sg-ckt-meat',
        question: 'Which meats?',
        type: 'multi',
        options: [
          { id: 'sausage', label: 'Chinese Sausage', calorieModifier: 70 },
          { id: 'prawn', label: 'Prawns', calorieModifier: 50 },
          { id: 'chicken', label: 'Chicken', calorieModifier: 30 },
        ],
      },
    ],
    healthierAlternative: {
      name: 'Char Kway Teow with Less Oil & More Vegetables',
      caloriesSaved: 120,
    },
  },
  {
    id: 'sg-roti-prata',
    dishName: 'Roti Prata',
    country: 'Singapore',
    category: 'Breads & Pastries',
    emoji: '🫓',
    defaultCaloriesMin: 280,
    defaultCaloriesMax: 500,
    defaultCalories: 350,
    macros: { protein: 8, carbs: 42, fat: 16, fiber: 1 },
    commonHiddenCalories: [
      'Ghee/butter used in dough: 100–140 kcal',
      'Oil for frying: 80–120 kcal',
      'Curry dip (if included): 50–80 kcal',
      'Sugar dusted on top: 20–30 kcal',
    ],
    clarificationQuestions: [
      {
        id: 'sg-rp-oily',
        question: 'How oily was it?',
        type: 'single',
        options: [
          { id: 'light', label: 'Light', calorieModifier: -50 },
          { id: 'normal', label: 'Normal', calorieModifier: 0 },
          { id: 'very-oily', label: 'Very Oily', calorieModifier: 80 },
        ],
      },
      {
        id: 'sg-rp-filling',
        question: 'Did you have a filling?',
        type: 'single',
        options: [
          { id: 'no-filling', label: 'Plain', calorieModifier: 0 },
          { id: 'egg', label: 'Egg', calorieModifier: 60 },
          { id: 'onion', label: 'Onion', calorieModifier: 20 },
          { id: 'mutton', label: 'Mutton', calorieModifier: 80 },
        ],
      },
    ],
    healthierAlternative: {
      name: 'Roti Canai with Less Ghee',
      caloriesSaved: 60,
    },
  },
  {
    id: 'sg-cai-png',
    dishName: 'Cai Png (Mixed Vegetables Rice)',
    country: 'Singapore',
    category: 'Rice & Vegetables',
    emoji: '🍱',
    defaultCaloriesMin: 300,
    defaultCaloriesMax: 600,
    defaultCalories: 420,
    macros: { protein: 16, carbs: 48, fat: 12, fiber: 4 },
    commonHiddenCalories: [
      'Fried egg: 70–90 kcal (if added)',
      'Meat sauce on veg: 40–60 kcal',
      'Oil in cooked vegetables: 60–100 kcal',
      'Processed meat sides: 80–120 kcal',
    ],
    clarificationQuestions: [
      {
        id: 'sg-cp-portions',
        question: 'How many veg portions?',
        type: 'single',
        options: [
          { id: '2-portions', label: '2 portions', calorieModifier: -50 },
          { id: '3-portions', label: '3 portions (normal)', calorieModifier: 0 },
          { id: '4-portions', label: '4 portions', calorieModifier: 80 },
        ],
      },
      {
        id: 'sg-cp-protein',
        question: 'What protein?',
        type: 'single',
        options: [
          { id: 'tofu', label: 'Tofu', calorieModifier: 30 },
          { id: 'egg', label: 'Fried Egg', calorieModifier: 80 },
          { id: 'meat', label: 'Meat/Chicken', calorieModifier: 60 },
        ],
      },
    ],
    healthierAlternative: {
      name: 'Cai Png with Tofu & Extra Vegetables',
      caloriesSaved: 80,
    },
  },
  {
    id: 'sg-bak-chor-mee',
    dishName: 'Bak Chor Mee (Minced Meat Noodles)',
    country: 'Singapore',
    category: 'Noodles',
    emoji: '🍜',
    defaultCaloriesMin: 400,
    defaultCaloriesMax: 650,
    defaultCalories: 520,
    macros: { protein: 20, carbs: 55, fat: 16, fiber: 2 },
    commonHiddenCalories: [
      'Minced meat has high fat: 80–120 kcal',
      'Chilli oil at bottom: 60–100 kcal',
      'Pork lard bits: 40–60 kcal',
      'Liver pieces (high cal): 50–80 kcal',
    ],
    clarificationQuestions: [
      {
        id: 'sg-bcm-chilli-oil',
        question: 'How much chilli oil at bottom?',
        type: 'single',
        options: [
          { id: 'little', label: 'Little', calorieModifier: -50 },
          { id: 'some', label: 'Some', calorieModifier: 0 },
          { id: 'lot', label: 'Lots', calorieModifier: 80 },
        ],
      },
      {
        id: 'sg-bcm-offal',
        question: 'Offal included (liver/intestines)?',
        type: 'single',
        options: [
          { id: 'no', label: 'No', calorieModifier: 0 },
          { id: 'yes', label: 'Yes', calorieModifier: 80 },
        ],
      },
    ],
    healthierAlternative: {
      name: 'Bak Chor Mee with Lean Meat & Less Oil',
      caloriesSaved: 100,
    },
  },

  // MALAYSIA
  {
    id: 'my-nasi-lemak',
    dishName: 'Nasi Lemak',
    country: 'Malaysia',
    category: 'Rice & Curries',
    emoji: '🍛',
    defaultCaloriesMin: 500,
    defaultCaloriesMax: 800,
    defaultCalories: 650,
    macros: { protein: 20, carbs: 68, fat: 20, fiber: 2 },
    commonHiddenCalories: [
      'Coconut milk in rice: 150–180 kcal',
      'Anchovies (sambal ikan bilis): 80–100 kcal',
      'Peanuts: 60–100 kcal',
      'Fried chicken (if added): 120–180 kcal',
    ],
    clarificationQuestions: [
      {
        id: 'my-nl-rice',
        question: 'How rich was the rice?',
        type: 'single',
        options: [
          { id: 'light', label: 'Light', calorieModifier: -80 },
          { id: 'normal', label: 'Normal', calorieModifier: 0 },
          { id: 'rich', label: 'Very Rich', calorieModifier: 100 },
        ],
      },
      {
        id: 'my-nl-protein',
        question: 'Protein served with?',
        type: 'single',
        options: [
          { id: 'egg', label: 'Boiled Egg', calorieModifier: 70 },
          { id: 'fried-egg', label: 'Fried Egg', calorieModifier: 100 },
          { id: 'chicken', label: 'Fried Chicken', calorieModifier: 150 },
          { id: 'fish', label: 'Fried Fish', calorieModifier: 120 },
        ],
      },
    ],
    healthierAlternative: {
      name: 'Nasi Lemak with Reduced Coconut & Steamed Protein',
      caloriesSaved: 120,
    },
  },
  {
    id: 'my-rendang',
    dishName: 'Rendang (Meat/Vegetable)',
    country: 'Malaysia',
    category: 'Soups & Curries',
    emoji: '🍲',
    defaultCaloriesMin: 400,
    defaultCaloriesMax: 700,
    defaultCalories: 550,
    macros: { protein: 24, carbs: 15, fat: 38, fiber: 2 },
    commonHiddenCalories: [
      'Coconut cream: 180–220 kcal',
      'Oil absorbed in meat: 80–120 kcal',
      'Spice paste: 40–60 kcal',
      'Fried shallots on top: 60–80 kcal',
    ],
    clarificationQuestions: [
      {
        id: 'my-rendang-type',
        question: 'What type of rendang?',
        type: 'single',
        options: [
          { id: 'chicken', label: 'Chicken', calorieModifier: 0 },
          { id: 'beef', label: 'Beef', calorieModifier: 80 },
          { id: 'vegetable', label: 'Vegetable', calorieModifier: -100 },
        ],
      },
      {
        id: 'my-rendang-creamy',
        question: 'How creamy?',
        type: 'single',
        options: [
          { id: 'dry', label: 'Dry', calorieModifier: -80 },
          { id: 'normal', label: 'Normal', calorieModifier: 0 },
          { id: 'wet', label: 'Wet/Saucy', calorieModifier: 100 },
        ],
      },
    ],
    healthierAlternative: {
      name: 'Rendang with Less Coconut Cream',
      caloriesSaved: 100,
    },
  },
  {
    id: 'my-mee-goreng',
    dishName: 'Mee Goreng',
    country: 'Malaysia',
    category: 'Noodles',
    emoji: '🍝',
    defaultCaloriesMin: 450,
    defaultCaloriesMax: 700,
    defaultCalories: 580,
    macros: { protein: 18, carbs: 62, fat: 18, fiber: 2 },
    commonHiddenCalories: [
      'Oil in stir-frying: 100–150 kcal',
      'Ketchup/sweet sauce: 40–60 kcal',
      'Egg mixed in: 70–90 kcal',
      'Potato cubes: 50–80 kcal',
    ],
    clarificationQuestions: [
      {
        id: 'my-mg-oily',
        question: 'Oil level?',
        type: 'single',
        options: [
          { id: 'dry', label: 'Dry', calorieModifier: -60 },
          { id: 'normal', label: 'Normal', calorieModifier: 0 },
          { id: 'oily', label: 'Very Oily', calorieModifier: 80 },
        ],
      },
      {
        id: 'my-mg-veg',
        question: 'Vegetables included?',
        type: 'multi',
        options: [
          { id: 'cabbage', label: 'Cabbage', calorieModifier: -10 },
          { id: 'carrot', label: 'Carrot', calorieModifier: -5 },
          { id: 'bean-sprouts', label: 'Bean Sprouts', calorieModifier: -15 },
        ],
      },
    ],
    healthierAlternative: {
      name: 'Mee Goreng with Less Oil & More Vegetables',
      caloriesSaved: 100,
    },
  },
  {
    id: 'my-satay',
    dishName: 'Satay (Grilled Meat Skewers)',
    country: 'Malaysia',
    category: 'Grilled & BBQ',
    emoji: '🍢',
    defaultCaloriesMin: 150,
    defaultCaloriesMax: 350,
    defaultCalories: 200,
    macros: { protein: 22, carbs: 2, fat: 12, fiber: 0 },
    commonHiddenCalories: [
      'Peanut sauce (per tbsp): 80–100 kcal',
      'Oil from grilling: 40–80 kcal',
      'Cucumber pickle: 10–20 kcal',
      'Onion & chilli: 10–20 kcal',
    ],
    clarificationQuestions: [
      {
        id: 'my-satay-sticks',
        question: 'How many sticks?',
        type: 'single',
        options: [
          { id: '5-sticks', label: '5 sticks', calorieModifier: 0 },
          { id: '10-sticks', label: '10 sticks', calorieModifier: 200 },
          { id: '15-sticks', label: '15 sticks', calorieModifier: 400 },
        ],
      },
      {
        id: 'my-satay-sauce',
        question: 'Peanut sauce amount?',
        type: 'single',
        options: [
          { id: 'little', label: 'Little', calorieModifier: 20 },
          { id: 'normal', label: 'Normal', calorieModifier: 80 },
          { id: 'lots', label: 'Lots', calorieModifier: 160 },
        ],
      },
    ],
    healthierAlternative: {
      name: 'Satay with Light Peanut Sauce or No Sauce',
      caloriesSaved: 60,
    },
  },
  {
    id: 'my-teh-tarik',
    dishName: 'Teh Tarik (Pulled Tea)',
    country: 'Malaysia',
    category: 'Beverages',
    emoji: '☕',
    defaultCaloriesMin: 150,
    defaultCaloriesMax: 300,
    defaultCalories: 200,
    macros: { protein: 3, carbs: 28, fat: 6, fiber: 0 },
    commonHiddenCalories: [
      'Condensed milk (2–3 tbsp): 80–120 kcal',
      'Evaporated milk: 20–40 kcal',
      'Sugar added: 40–60 kcal',
      'Tea itself: negligible',
    ],
    clarificationQuestions: [
      {
        id: 'my-tt-milk',
        question: 'How milky?',
        type: 'single',
        options: [
          { id: 'light', label: 'Light', calorieModifier: -50 },
          { id: 'normal', label: 'Normal', calorieModifier: 0 },
          { id: 'very-milky', label: 'Very Milky', calorieModifier: 80 },
        ],
      },
      {
        id: 'my-tt-sugar',
        question: 'Sugar level?',
        type: 'single',
        options: [
          { id: 'no-sugar', label: 'No Sugar', calorieModifier: -40 },
          { id: 'normal', label: 'Normal', calorieModifier: 0 },
          { id: 'extra-sweet', label: 'Extra Sweet', calorieModifier: 40 },
        ],
      },
    ],
    healthierAlternative: {
      name: 'Teh Tarik with Reduced Sugar & Evaporated Milk',
      caloriesSaved: 60,
    },
  },

  // THAILAND
  {
    id: 'th-pad-thai',
    dishName: 'Pad Thai',
    country: 'Thailand',
    category: 'Noodles',
    emoji: '🍜',
    defaultCaloriesMin: 400,
    defaultCaloriesMax: 700,
    defaultCalories: 560,
    macros: { protein: 18, carbs: 62, fat: 18, fiber: 3 },
    commonHiddenCalories: [
      'Oil for stir-frying: 100–140 kcal',
      'Tamarind paste: 20–40 kcal',
      'Fish sauce: negligible',
      'Peanuts on top: 60–100 kcal',
      'Egg cooked in: 70–90 kcal',
    ],
    clarificationQuestions: [
      {
        id: 'th-pt-oily',
        question: 'How oily?',
        type: 'single',
        options: [
          { id: 'light', label: 'Light', calorieModifier: -60 },
          { id: 'normal', label: 'Normal', calorieModifier: 0 },
          { id: 'oily', label: 'Very Oily', calorieModifier: 80 },
        ],
      },
      {
        id: 'th-pt-peanuts',
        question: 'Peanuts on top?',
        type: 'single',
        options: [
          { id: 'no-peanuts', label: 'No', calorieModifier: -70 },
          { id: 'some', label: 'Some', calorieModifier: 0 },
          { id: 'lots', label: 'Lots', calorieModifier: 40 },
        ],
      },
      {
        id: 'th-pt-protein',
        question: 'Protein type?',
        type: 'single',
        options: [
          { id: 'tofu', label: 'Tofu', calorieModifier: -20 },
          { id: 'chicken', label: 'Chicken', calorieModifier: 0 },
          { id: 'shrimp', label: 'Shrimp', calorieModifier: 30 },
          { id: 'mix', label: 'Mix', calorieModifier: 50 },
        ],
      },
    ],
    healthierAlternative: {
      name: 'Pad Thai with Less Oil, Light Peanuts & Extra Vegetables',
      caloriesSaved: 120,
    },
  },
  {
    id: 'th-tom-yum',
    dishName: 'Tom Yum (Hot & Sour Soup)',
    country: 'Thailand',
    category: 'Soups & Curries',
    emoji: '🍲',
    defaultCaloriesMin: 200,
    defaultCaloriesMax: 500,
    defaultCalories: 350,
    macros: { protein: 12, carbs: 20, fat: 18, fiber: 2 },
    commonHiddenCalories: [
      'Coconut milk: 80–120 kcal',
      'Shrimp paste: 20–40 kcal',
      'Oil in broth: 40–80 kcal',
      'Noodles/rice (if added): 100–200 kcal',
    ],
    clarificationQuestions: [
      {
        id: 'th-ty-creamy',
        question: 'Creamy or clear?',
        type: 'single',
        options: [
          { id: 'clear', label: 'Clear', calorieModifier: -100 },
          { id: 'normal', label: 'Normal', calorieModifier: 0 },
          { id: 'creamy', label: 'Creamy', calorieModifier: 80 },
        ],
      },
      {
        id: 'th-ty-noodles',
        question: 'Noodles included?',
        type: 'single',
        options: [
          { id: 'no-noodles', label: 'No', calorieModifier: 0 },
          { id: 'some', label: 'Some', calorieModifier: 100 },
          { id: 'lots', label: 'Lots', calorieModifier: 200 },
        ],
      },
    ],
    healthierAlternative: {
      name: 'Tom Yum Clear Broth with Extra Vegetables',
      caloriesSaved: 100,
    },
  },
  {
    id: 'th-green-curry',
    dishName: 'Green Curry (Gaeng Keow Wan)',
    country: 'Thailand',
    category: 'Soups & Curries',
    emoji: '🍛',
    defaultCaloriesMin: 400,
    defaultCaloriesMax: 700,
    defaultCalories: 550,
    macros: { protein: 20, carbs: 25, fat: 32, fiber: 2 },
    commonHiddenCalories: [
      'Coconut milk: 180–220 kcal',
      'Green curry paste (high in oil): 60–100 kcal',
      'Thai basil oil: 20–40 kcal',
      'Fish sauce: negligible',
    ],
    clarificationQuestions: [
      {
        id: 'th-gc-creamy',
        question: 'Coconut level?',
        type: 'single',
        options: [
          { id: 'light', label: 'Light', calorieModifier: -100 },
          { id: 'normal', label: 'Normal', calorieModifier: 0 },
          { id: 'rich', label: 'Rich', calorieModifier: 100 },
        ],
      },
      {
        id: 'th-gc-protein',
        question: 'Protein?',
        type: 'single',
        options: [
          { id: 'veg', label: 'Vegetables Only', calorieModifier: -80 },
          { id: 'chicken', label: 'Chicken', calorieModifier: 0 },
          { id: 'beef', label: 'Beef', calorieModifier: 60 },
        ],
      },
    ],
    healthierAlternative: {
      name: 'Green Curry with Reduced Coconut & Extra Vegetables',
      caloriesSaved: 100,
    },
  },
  {
    id: 'th-pad-krapow',
    dishName: 'Pad Krapow Moo (Holy Basil Pork)',
    country: 'Thailand',
    category: 'Stir-fries',
    emoji: '🍲',
    defaultCaloriesMin: 350,
    defaultCaloriesMax: 600,
    defaultCalories: 450,
    macros: { protein: 26, carbs: 35, fat: 16, fiber: 2 },
    commonHiddenCalories: [
      'Oil for stir-frying: 80–120 kcal',
      'Minced pork (fatty): 100–150 kcal',
      'Fish sauce: negligible',
      'Fried egg on top: 70–90 kcal',
    ],
    clarificationQuestions: [
      {
        id: 'th-pkm-oily',
        question: 'Oil amount?',
        type: 'single',
        options: [
          { id: 'light', label: 'Light', calorieModifier: -60 },
          { id: 'normal', label: 'Normal', calorieModifier: 0 },
          { id: 'oily', label: 'Very Oily', calorieModifier: 80 },
        ],
      },
      {
        id: 'th-pkm-egg',
        question: 'Fried egg included?',
        type: 'single',
        options: [
          { id: 'no-egg', label: 'No', calorieModifier: -80 },
          { id: 'one-egg', label: 'Yes', calorieModifier: 0 },
        ],
      },
    ],
    healthierAlternative: {
      name: 'Pad Krapow with Lean Ground Chicken & Less Oil',
      caloriesSaved: 100,
    },
  },
  {
    id: 'th-thai-milk-tea',
    dishName: 'Thai Iced Tea',
    country: 'Thailand',
    category: 'Beverages',
    emoji: '🧋',
    defaultCaloriesMin: 150,
    defaultCaloriesMax: 350,
    defaultCalories: 240,
    macros: { protein: 2, carbs: 38, fat: 6, fiber: 0 },
    commonHiddenCalories: [
      'Condensed milk: 80–120 kcal',
      'Evaporated milk: 20–40 kcal',
      'Sugar: 40–80 kcal',
      'Thai tea powder: negligible',
    ],
    clarificationQuestions: [
      {
        id: 'th-tmt-milk',
        question: 'Milk amount?',
        type: 'single',
        options: [
          { id: 'light', label: 'Light', calorieModifier: -60 },
          { id: 'normal', label: 'Normal', calorieModifier: 0 },
          { id: 'heavy', label: 'Heavy', calorieModifier: 80 },
        ],
      },
      {
        id: 'th-tmt-sugar',
        question: 'Sugar?',
        type: 'single',
        options: [
          { id: 'no-sugar', label: 'No Sugar', calorieModifier: -60 },
          { id: 'normal', label: 'Normal', calorieModifier: 0 },
          { id: 'extra', label: 'Extra Sweet', calorieModifier: 40 },
        ],
      },
    ],
    healthierAlternative: {
      name: 'Thai Tea with Reduced Sugar & Evaporated Milk',
      caloriesSaved: 80,
    },
  },

  // INDONESIA
  {
    id: 'id-nasi-goreng',
    dishName: 'Nasi Goreng',
    country: 'Indonesia',
    category: 'Rice & Stir-fries',
    emoji: '🍛',
    defaultCaloriesMin: 450,
    defaultCaloriesMax: 750,
    defaultCalories: 600,
    macros: { protein: 18, carbs: 68, fat: 18, fiber: 2 },
    commonHiddenCalories: [
      'Oil for frying: 100–150 kcal',
      'Sambal (chilli paste): 40–80 kcal',
      'Fried egg on top: 70–90 kcal',
      'Prawns/meat: 50–100 kcal',
    ],
    clarificationQuestions: [
      {
        id: 'id-ng-oily',
        question: 'Oil level?',
        type: 'single',
        options: [
          { id: 'dry', label: 'Dry', calorieModifier: -80 },
          { id: 'normal', label: 'Normal', calorieModifier: 0 },
          { id: 'oily', label: 'Very Oily', calorieModifier: 100 },
        ],
      },
      {
        id: 'id-ng-sambal',
        question: 'How much sambal?',
        type: 'single',
        options: [
          { id: 'light', label: 'Light', calorieModifier: -40 },
          { id: 'normal', label: 'Normal', calorieModifier: 0 },
          { id: 'spicy', label: 'Lots', calorieModifier: 60 },
        ],
      },
      {
        id: 'id-ng-protein',
        question: 'Protein?',
        type: 'single',
        options: [
          { id: 'egg-only', label: 'Egg Only', calorieModifier: 0 },
          { id: 'chicken', label: 'Chicken', calorieModifier: 60 },
          { id: 'prawns', label: 'Prawns', calorieModifier: 80 },
        ],
      },
    ],
    healthierAlternative: {
      name: 'Nasi Goreng with Less Oil & Light Sambal',
      caloriesSaved: 120,
    },
  },
  {
    id: 'id-mee-goreng',
    dishName: 'Mie Goreng',
    country: 'Indonesia',
    category: 'Noodles',
    emoji: '🍝',
    defaultCaloriesMin: 450,
    defaultCaloriesMax: 700,
    defaultCalories: 580,
    macros: { protein: 18, carbs: 62, fat: 18, fiber: 2 },
    commonHiddenCalories: [
      'Oil for frying: 100–140 kcal',
      'Sambal: 40–80 kcal',
      'Ketchup/sweet sauce: 30–60 kcal',
      'Fried egg: 70–90 kcal',
    ],
    clarificationQuestions: [
      {
        id: 'id-mg-oily',
        question: 'How oily?',
        type: 'single',
        options: [
          { id: 'dry', label: 'Dry', calorieModifier: -60 },
          { id: 'normal', label: 'Normal', calorieModifier: 0 },
          { id: 'wet', label: 'Very Oily', calorieModifier: 80 },
        ],
      },
      {
        id: 'id-mg-spicy',
        question: 'Spice level?',
        type: 'single',
        options: [
          { id: 'mild', label: 'Mild', calorieModifier: -40 },
          { id: 'normal', label: 'Normal', calorieModifier: 0 },
          { id: 'spicy', label: 'Spicy', calorieModifier: 40 },
        ],
      },
    ],
    healthierAlternative: {
      name: 'Mie Goreng with Less Oil & Light Sambal',
      caloriesSaved: 100,
    },
  },
  {
    id: 'id-gado-gado',
    dishName: 'Gado-Gado (Mixed Vegetables)',
    country: 'Indonesia',
    category: 'Vegetables',
    emoji: '🥗',
    defaultCaloriesMin: 250,
    defaultCaloriesMax: 500,
    defaultCalories: 350,
    macros: { protein: 14, carbs: 35, fat: 14, fiber: 6 },
    commonHiddenCalories: [
      'Peanut sauce (high fat): 80–150 kcal',
      'Fried tofu: 60–100 kcal',
      'Fried shallots: 40–60 kcal',
      'Oil in sauce base: 40–80 kcal',
    ],
    clarificationQuestions: [
      {
        id: 'id-gg-sauce',
        question: 'Peanut sauce amount?',
        type: 'single',
        options: [
          { id: 'light', label: 'Light', calorieModifier: -80 },
          { id: 'normal', label: 'Normal', calorieModifier: 0 },
          { id: 'drenched', label: 'Drenched', calorieModifier: 120 },
        ],
      },
      {
        id: 'id-gg-tofu',
        question: 'Fried or plain tofu?',
        type: 'single',
        options: [
          { id: 'plain', label: 'Plain/Boiled', calorieModifier: -60 },
          { id: 'fried', label: 'Fried', calorieModifier: 0 },
        ],
      },
    ],
    healthierAlternative: {
      name: 'Gado-Gado with Light Peanut Sauce',
      caloriesSaved: 100,
    },
  },
  {
    id: 'id-soto-ayam',
    dishName: 'Soto Ayam (Turmeric Chicken Soup)',
    country: 'Indonesia',
    category: 'Soups & Curries',
    emoji: '🍲',
    defaultCaloriesMin: 300,
    defaultCaloriesMax: 600,
    defaultCalories: 450,
    macros: { protein: 20, carbs: 40, fat: 16, fiber: 2 },
    commonHiddenCalories: [
      'Coconut milk: 80–120 kcal',
      'Oil in broth: 40–80 kcal',
      'Fried shallots: 40–60 kcal',
      'Hard-boiled egg: 70–80 kcal',
    ],
    clarificationQuestions: [
      {
        id: 'id-sa-creamy',
        question: 'Coconut level?',
        type: 'single',
        options: [
          { id: 'light', label: 'Light/Clear', calorieModifier: -100 },
          { id: 'normal', label: 'Normal', calorieModifier: 0 },
          { id: 'creamy', label: 'Creamy', calorieModifier: 80 },
        ],
      },
      {
        id: 'id-sa-portion',
        question: 'Portion size?',
        type: 'single',
        options: [
          { id: 'small', label: 'Small Bowl', calorieModifier: -100 },
          { id: 'medium', label: 'Medium Bowl', calorieModifier: 0 },
          { id: 'large', label: 'Large Bowl', calorieModifier: 150 },
        ],
      },
    ],
    healthierAlternative: {
      name: 'Soto Ayam with Less Coconut & Broth',
      caloriesSaved: 100,
    },
  },
  {
    id: 'id-kare-ayam',
    dishName: 'Kare Ayam (Yellow Curry)',
    country: 'Indonesia',
    category: 'Soups & Curries',
    emoji: '🍛',
    defaultCaloriesMin: 400,
    defaultCaloriesMax: 700,
    defaultCalories: 550,
    macros: { protein: 22, carbs: 30, fat: 30, fiber: 2 },
    commonHiddenCalories: [
      'Coconut milk: 150–200 kcal',
      'Curry paste (oil-based): 60–100 kcal',
      'Potatoes: 60–100 kcal',
      'Oil from frying: 40–80 kcal',
    ],
    clarificationQuestions: [
      {
        id: 'id-ka-creamy',
        question: 'Creamy or soupy?',
        type: 'single',
        options: [
          { id: 'light', label: 'Light/Soupy', calorieModifier: -100 },
          { id: 'normal', label: 'Normal', calorieModifier: 0 },
          { id: 'creamy', label: 'Creamy', calorieModifier: 100 },
        ],
      },
      {
        id: 'id-ka-potatoes',
        question: 'Potatoes included?',
        type: 'single',
        options: [
          { id: 'no-potatoes', label: 'No', calorieModifier: -80 },
          { id: 'some', label: 'Yes', calorieModifier: 0 },
        ],
      },
    ],
    healthierAlternative: {
      name: 'Kare Ayam with Reduced Coconut & Extra Vegetables',
      caloriesSaved: 100,
    },
  },

  // VIETNAM
  {
    id: 'vn-pho-bo',
    dishName: 'Phở Bò (Beef Noodle Soup)',
    country: 'Vietnam',
    category: 'Soups & Noodles',
    emoji: '🍲',
    defaultCaloriesMin: 350,
    defaultCaloriesMax: 650,
    defaultCalories: 500,
    macros: { protein: 24, carbs: 55, fat: 10, fiber: 2 },
    commonHiddenCalories: [
      'Beef brisket: 60–100 kcal',
      'Noodles: 150–200 kcal',
      'Broth (fatty): 40–80 kcal',
      'Oil on top: 30–60 kcal',
    ],
    clarificationQuestions: [
      {
        id: 'vn-pho-meat',
        question: 'Type of beef?',
        type: 'single',
        options: [
          { id: 'rare', label: 'Rare Slices', calorieModifier: 0 },
          { id: 'brisket', label: 'Brisket', calorieModifier: 50 },
          { id: 'both', label: 'Both', calorieModifier: 100 },
        ],
      },
      {
        id: 'vn-pho-broth',
        question: 'Broth richness?',
        type: 'single',
        options: [
          { id: 'light', label: 'Light', calorieModifier: -60 },
          { id: 'normal', label: 'Normal', calorieModifier: 0 },
          { id: 'rich', label: 'Rich/Fatty', calorieModifier: 80 },
        ],
      },
    ],
    healthierAlternative: {
      name: 'Phở with Lean Beef & Light Broth',
      caloriesSaved: 80,
    },
  },
  {
    id: 'vn-banh-mi',
    dishName: 'Bánh Mì (Vietnamese Sandwich)',
    country: 'Vietnam',
    category: 'Sandwiches & Breads',
    emoji: '🥖',
    defaultCaloriesMin: 300,
    defaultCaloriesMax: 600,
    defaultCalories: 450,
    macros: { protein: 16, carbs: 48, fat: 16, fiber: 2 },
    commonHiddenCalories: [
      'Pâté: 60–100 kcal',
      'Mayonnaise: 80–120 kcal',
      'Vietnamese cold cuts: 80–120 kcal',
      'Butter on bread: 40–80 kcal',
    ],
    clarificationQuestions: [
      {
        id: 'vn-bm-spread',
        question: 'Spread type?',
        type: 'single',
        options: [
          { id: 'light-mayo', label: 'Light Mayo', calorieModifier: -60 },
          { id: 'mayo-pate', label: 'Mayo + Pâté', calorieModifier: 0 },
          { id: 'heavy-mayo', label: 'Heavy Mayo', calorieModifier: 80 },
        ],
      },
      {
        id: 'vn-bm-meat',
        question: 'Meat type?',
        type: 'single',
        options: [
          { id: 'veg', label: 'Vegetables Only', calorieModifier: -80 },
          { id: 'pate', label: 'Pâté', calorieModifier: 0 },
          { id: 'cold-cuts', label: 'Cold Cuts', calorieModifier: 80 },
        ],
      },
    ],
    healthierAlternative: {
      name: 'Bánh Mì with Light Mayo & Grilled Chicken',
      caloriesSaved: 100,
    },
  },
  {
    id: 'vn-bun-cha',
    dishName: 'Bún Chả (Grilled Pork & Noodles)',
    country: 'Vietnam',
    category: 'Rice Noodles & Grilled',
    emoji: '🥘',
    defaultCaloriesMin: 400,
    defaultCaloriesMax: 700,
    defaultCalories: 550,
    macros: { protein: 26, carbs: 50, fat: 16, fiber: 2 },
    commonHiddenCalories: [
      'Pork meatballs: 80–120 kcal',
      'Grilled pork chops: 100–150 kcal',
      'Peanut dipping sauce: 60–100 kcal',
      'Noodles: 150–180 kcal',
    ],
    clarificationQuestions: [
      {
        id: 'vn-bc-pork',
        question: 'Portion of pork?',
        type: 'single',
        options: [
          { id: 'light', label: 'Light', calorieModifier: -80 },
          { id: 'normal', label: 'Normal', calorieModifier: 0 },
          { id: 'heavy', label: 'Heavy', calorieModifier: 100 },
        ],
      },
      {
        id: 'vn-bc-sauce',
        question: 'Sauce dipping amount?',
        type: 'single',
        options: [
          { id: 'light', label: 'Light', calorieModifier: -40 },
          { id: 'normal', label: 'Normal', calorieModifier: 0 },
          { id: 'heavy', label: 'Lots of Dipping', calorieModifier: 80 },
        ],
      },
    ],
    healthierAlternative: {
      name: 'Bún Chả with Lean Grilled Pork & Less Sauce',
      caloriesSaved: 100,
    },
  },
  {
    id: 'vn-com-tam',
    dishName: 'Cơm Tấm (Broken Rice)',
    country: 'Vietnam',
    category: 'Rice & Proteins',
    emoji: '🍚',
    defaultCaloriesMin: 400,
    defaultCaloriesMax: 700,
    defaultCalories: 550,
    macros: { protein: 20, carbs: 62, fat: 14, fiber: 2 },
    commonHiddenCalories: [
      'Grilled pork chops: 100–150 kcal',
      'Fried egg: 70–90 kcal',
      'Pâté: 60–100 kcal',
      'Shrimp paste: 20–40 kcal',
    ],
    clarificationQuestions: [
      {
        id: 'vn-ct-protein',
        question: 'Which protein?',
        type: 'single',
        options: [
          { id: 'pork', label: 'Pork Chop', calorieModifier: 0 },
          { id: 'pate', label: 'Pâté', calorieModifier: 40 },
          { id: 'chicken', label: 'Chicken', calorieModifier: -20 },
        ],
      },
      {
        id: 'vn-ct-egg',
        question: 'Egg preparation?',
        type: 'single',
        options: [
          { id: 'no-egg', label: 'No Egg', calorieModifier: -80 },
          { id: 'fried', label: 'Fried Egg', calorieModifier: 0 },
          { id: 'two-eggs', label: 'Two Fried Eggs', calorieModifier: 80 },
        ],
      },
    ],
    healthierAlternative: {
      name: 'Cơm Tấm with Grilled Chicken & Light Protein',
      caloriesSaved: 80,
    },
  },
  {
    id: 'vn-spring-rolls',
    dishName: 'Spring Rolls (Fried)',
    country: 'Vietnam',
    category: 'Appetizers',
    emoji: '🥐',
    defaultCaloriesMin: 200,
    defaultCaloriesMax: 400,
    defaultCalories: 300,
    macros: { protein: 8, carbs: 28, fat: 14, fiber: 1 },
    commonHiddenCalories: [
      'Oil from deep-frying: 80–120 kcal',
      'Pork filling: 40–60 kcal',
      'Sugar in sauce: 20–40 kcal',
      'Wrapper (fried): 40–60 kcal',
    ],
    clarificationQuestions: [
      {
        id: 'vn-sr-count',
        question: 'How many rolls?',
        type: 'single',
        options: [
          { id: '2-rolls', label: '2 rolls', calorieModifier: 0 },
          { id: '4-rolls', label: '4 rolls', calorieModifier: 300 },
          { id: '6-rolls', label: '6 rolls', calorieModifier: 600 },
        ],
      },
      {
        id: 'vn-sr-sauce',
        question: 'Sauce amount?',
        type: 'single',
        options: [
          { id: 'dip', label: 'Light Dip', calorieModifier: 0 },
          { id: 'drizzle', label: 'Drizzled', calorieModifier: 30 },
        ],
      },
    ],
    healthierAlternative: {
      name: 'Fresh Spring Rolls (Unfried)',
      caloriesSaved: 120,
    },
  },
  {
    id: 'vn-pho-ga',
    dishName: 'Phở Gà (Chicken Noodle Soup)',
    country: 'Vietnam',
    category: 'Soups & Noodles',
    emoji: '🍲',
    defaultCaloriesMin: 350,
    defaultCaloriesMax: 550,
    defaultCalories: 450,
    macros: { protein: 26, carbs: 50, fat: 8, fiber: 2 },
    commonHiddenCalories: [
      'Chicken: 80–120 kcal',
      'Noodles: 150–200 kcal',
      'Broth with oil: 40–80 kcal',
      'Fried shallots: 20–40 kcal',
    ],
    clarificationQuestions: [
      {
        id: 'vn-pg-portion',
        question: 'Chicken amount?',
        type: 'single',
        options: [
          { id: 'light', label: 'Light', calorieModifier: -60 },
          { id: 'normal', label: 'Normal', calorieModifier: 0 },
          { id: 'heavy', label: 'Heavy', calorieModifier: 80 },
        ],
      },
    ],
    healthierAlternative: {
      name: 'Phở Gà with Skinless Chicken',
      caloriesSaved: 60,
    },
  },

  // PHILIPPINES
  {
    id: 'ph-adobo',
    dishName: 'Adobo (Braised Meat)',
    country: 'Philippines',
    category: 'Braised & Stews',
    emoji: '🍲',
    defaultCaloriesMin: 400,
    defaultCaloriesMax: 700,
    defaultCalories: 550,
    macros: { protein: 28, carbs: 15, fat: 32, fiber: 1 },
    commonHiddenCalories: [
      'Pork/chicken fat: 100–160 kcal',
      'Coconut milk: 60–100 kcal',
      'Oil in sauce: 40–80 kcal',
      'Soy sauce: negligible',
    ],
    clarificationQuestions: [
      {
        id: 'ph-ad-meat',
        question: 'Type of meat?',
        type: 'single',
        options: [
          { id: 'chicken', label: 'Chicken', calorieModifier: -80 },
          { id: 'pork', label: 'Pork', calorieModifier: 0 },
          { id: 'mixed', label: 'Mixed', calorieModifier: 60 },
        ],
      },
      {
        id: 'ph-ad-sauce',
        question: 'Sauce richness?',
        type: 'single',
        options: [
          { id: 'light', label: 'Light', calorieModifier: -80 },
          { id: 'normal', label: 'Normal', calorieModifier: 0 },
          { id: 'rich', label: 'Rich', calorieModifier: 100 },
        ],
      },
    ],
    healthierAlternative: {
      name: 'Adobo with Lean Chicken & Less Oil',
      caloriesSaved: 120,
    },
  },
  {
    id: 'ph-lumpia',
    dishName: 'Lumpia (Spring Rolls)',
    country: 'Philippines',
    category: 'Appetizers',
    emoji: '🥐',
    defaultCaloriesMin: 180,
    defaultCaloriesMax: 380,
    defaultCalories: 280,
    macros: { protein: 8, carbs: 24, fat: 12, fiber: 1 },
    commonHiddenCalories: [
      'Oil from frying: 80–120 kcal',
      'Pork/shrimp filling: 40–70 kcal',
      'Wrapper: 30–50 kcal',
      'Sweet sauce for dipping: 20–40 kcal',
    ],
    clarificationQuestions: [
      {
        id: 'ph-lump-count',
        question: 'How many lumpia?',
        type: 'single',
        options: [
          { id: '2-pieces', label: '2 pieces', calorieModifier: 0 },
          { id: '4-pieces', label: '4 pieces', calorieModifier: 280 },
          { id: '6-pieces', label: '6 pieces', calorieModifier: 560 },
        ],
      },
    ],
    healthierAlternative: {
      name: 'Lumpia with Baked Instead of Fried',
      caloriesSaved: 80,
    },
  },
  {
    id: 'ph-sinigang',
    dishName: 'Sinigang (Sour Stew)',
    country: 'Philippines',
    category: 'Soups & Stews',
    emoji: '🍲',
    defaultCaloriesMin: 350,
    defaultCaloriesMax: 650,
    defaultCalories: 500,
    macros: { protein: 24, carbs: 40, fat: 14, fiber: 3 },
    commonHiddenCalories: [
      'Pork: 100–150 kcal',
      'Oil in broth: 40–80 kcal',
      'Potatoes: 60–100 kcal',
      'Radish: 20–40 kcal',
    ],
    clarificationQuestions: [
      {
        id: 'ph-sin-meat',
        question: 'Meat portion?',
        type: 'single',
        options: [
          { id: 'light', label: 'Light', calorieModifier: -80 },
          { id: 'normal', label: 'Normal', calorieModifier: 0 },
          { id: 'heavy', label: 'Heavy', calorieModifier: 100 },
        ],
      },
      {
        id: 'ph-sin-veg',
        question: 'Vegetables included?',
        type: 'multi',
        options: [
          { id: 'radish', label: 'Radish', calorieModifier: 30 },
          { id: 'potato', label: 'Potato', calorieModifier: 80 },
          { id: 'greens', label: 'Greens', calorieModifier: -20 },
        ],
      },
    ],
    healthierAlternative: {
      name: 'Sinigang with Lean Pork & Extra Vegetables',
      caloriesSaved: 80,
    },
  },
  {
    id: 'ph-lechon',
    dishName: 'Lechon (Roasted Pig)',
    country: 'Philippines',
    category: 'Grilled & BBQ',
    emoji: '🐷',
    defaultCaloriesMin: 400,
    defaultCaloriesMax: 800,
    defaultCalories: 600,
    macros: { protein: 32, carbs: 0, fat: 48, fiber: 0 },
    commonHiddenCalories: [
      'Pork skin (crispy): 100–150 kcal',
      'Fatty pork meat: 150–250 kcal',
      'Liver paste: 60–100 kcal',
      'Oil on skin: 60–100 kcal',
    ],
    clarificationQuestions: [
      {
        id: 'ph-lechon-amount',
        question: 'Portion size?',
        type: 'single',
        options: [
          { id: 'small-piece', label: 'Small Piece', calorieModifier: 0 },
          { id: 'medium-piece', label: 'Medium Piece', calorieModifier: 200 },
          { id: 'large-piece', label: 'Large Piece', calorieModifier: 400 },
        ],
      },
      {
        id: 'ph-lechon-skin',
        question: 'Ate the crispy skin?',
        type: 'single',
        options: [
          { id: 'no-skin', label: 'No', calorieModifier: -120 },
          { id: 'some', label: 'Some', calorieModifier: 0 },
          { id: 'lots', label: 'Lots', calorieModifier: 80 },
        ],
      },
    ],
    healthierAlternative: {
      name: 'Roasted Pork Loin (Leaner Cut)',
      caloriesSaved: 200,
    },
  },
  {
    id: 'ph-bicol-express',
    dishName: 'Bicol Express (Spicy Coconut Pork)',
    country: 'Philippines',
    category: 'Braised & Stews',
    emoji: '🌶️',
    defaultCaloriesMin: 450,
    defaultCaloriesMax: 750,
    defaultCalories: 600,
    macros: { protein: 26, carbs: 20, fat: 38, fiber: 2 },
    commonHiddenCalories: [
      'Coconut milk: 150–200 kcal',
      'Pork belly fat: 150–200 kcal',
      'Oil: 40–80 kcal',
      'Chilli peppers: negligible',
    ],
    clarificationQuestions: [
      {
        id: 'ph-be-creamy',
        question: 'Coconut level?',
        type: 'single',
        options: [
          { id: 'light', label: 'Light', calorieModifier: -100 },
          { id: 'normal', label: 'Normal', calorieModifier: 0 },
          { id: 'creamy', label: 'Creamy', calorieModifier: 120 },
        ],
      },
    ],
    healthierAlternative: {
      name: 'Bicol Express with Lean Pork & Reduced Coconut',
      caloriesSaved: 150,
    },
  },

  // ADDITIONAL SINGAPORE DISHES
  {
    id: 'sg-kway-chap',
    dishName: 'Kway Chap (Braised Rice Rolls)',
    country: 'Singapore',
    category: 'Rice & Noodles',
    emoji: '🍙',
    defaultCaloriesMin: 350,
    defaultCaloriesMax: 600,
    defaultCalories: 475,
    macros: { protein: 16, carbs: 52, fat: 14, fiber: 2 },
    commonHiddenCalories: [
      'Pork offal (intestines): 80–120 kcal',
      'Braising oil: 60–100 kcal',
      'Dark soy sauce: 10–20 kcal',
      'Egg (if included): 70–90 kcal',
    ],
    clarificationQuestions: [
      {
        id: 'sg-kc-offal',
        question: 'Offal included?',
        type: 'single',
        options: [
          { id: 'no-offal', label: 'No', calorieModifier: -100 },
          { id: 'some', label: 'Yes', calorieModifier: 0 },
        ],
      },
    ],
    healthierAlternative: {
      name: 'Kway Chap with Light Braising & Vegetables',
      caloriesSaved: 80,
    },
  },
  {
    id: 'sg-chilli-crab',
    dishName: 'Chilli Crab',
    country: 'Singapore',
    category: 'Seafood',
    emoji: '🦀',
    defaultCaloriesMin: 300,
    defaultCaloriesMax: 600,
    defaultCalories: 450,
    macros: { protein: 28, carbs: 15, fat: 24, fiber: 2 },
    commonHiddenCalories: [
      'Oil in sauce: 80–120 kcal',
      'Tomato-chilli paste: 30–60 kcal',
      'Mantou bread for soaking: 150–200 kcal (if included)',
      'Egg coating: 40–70 kcal',
    ],
    clarificationQuestions: [
      {
        id: 'sg-cc-sauce',
        question: 'Sauce cling to crab?',
        type: 'single',
        options: [
          { id: 'light', label: 'Light', calorieModifier: -100 },
          { id: 'normal', label: 'Normal', calorieModifier: 0 },
          { id: 'heavy', label: 'Drenched', calorieModifier: 120 },
        ],
      },
      {
        id: 'sg-cc-bread',
        question: 'Mantou bread included?',
        type: 'single',
        options: [
          { id: 'no-bread', label: 'No', calorieModifier: 0 },
          { id: 'yes-bread', label: 'Yes', calorieModifier: 180 },
        ],
      },
    ],
    healthierAlternative: {
      name: 'Chilli Crab with Less Oil & No Bread',
      caloriesSaved: 100,
    },
  },
  {
    id: 'sg-fish-head-curry',
    dishName: 'Fish Head Curry',
    country: 'Singapore',
    category: 'Seafood & Curries',
    emoji: '🍛',
    defaultCaloriesMin: 350,
    defaultCaloriesMax: 650,
    defaultCalories: 500,
    macros: { protein: 30, carbs: 20, fat: 22, fiber: 2 },
    commonHiddenCalories: [
      'Coconut milk: 120–160 kcal',
      'Oil in curry paste: 60–100 kcal',
      'Fish head (fatty): 80–120 kcal',
      'Okra cooked in oil: 40–80 kcal',
    ],
    clarificationQuestions: [
      {
        id: 'sg-fhc-coconut',
        question: 'Creamy or light?',
        type: 'single',
        options: [
          { id: 'light', label: 'Light', calorieModifier: -100 },
          { id: 'normal', label: 'Normal', calorieModifier: 0 },
          { id: 'creamy', label: 'Creamy', calorieModifier: 80 },
        ],
      },
    ],
    healthierAlternative: {
      name: 'Fish Head Curry with Light Coconut & Extra Vegetables',
      caloriesSaved: 100,
    },
  },

  // ADDITIONAL MALAYSIA DISHES
  {
    id: 'my-roti-canai',
    dishName: 'Roti Canai',
    country: 'Malaysia',
    category: 'Breads & Pastries',
    emoji: '🫓',
    defaultCaloriesMin: 280,
    defaultCaloriesMax: 480,
    defaultCalories: 380,
    macros: { protein: 8, carbs: 42, fat: 18, fiber: 1 },
    commonHiddenCalories: [
      'Ghee/butter: 120–160 kcal',
      'Oil for frying: 80–120 kcal',
      'Curry dipping: 40–80 kcal',
      'Condensed milk (sweet version): 60–100 kcal',
    ],
    clarificationQuestions: [
      {
        id: 'my-rc-oily',
        question: 'How much ghee/oil?',
        type: 'single',
        options: [
          { id: 'light', label: 'Light', calorieModifier: -60 },
          { id: 'normal', label: 'Normal', calorieModifier: 0 },
          { id: 'heavy', label: 'Heavy', calorieModifier: 100 },
        ],
      },
    ],
    healthierAlternative: {
      name: 'Roti Canai with Minimal Ghee',
      caloriesSaved: 80,
    },
  },
  {
    id: 'my-apam-balik',
    dishName: 'Apam Balik (Stuffed Pancake)',
    country: 'Malaysia',
    category: 'Breads & Pastries',
    emoji: '🥞',
    defaultCaloriesMin: 250,
    defaultCaloriesMax: 450,
    defaultCalories: 350,
    macros: { protein: 6, carbs: 48, fat: 12, fiber: 1 },
    commonHiddenCalories: [
      'Peanuts in filling: 80–120 kcal',
      'Sugar in filling: 60–100 kcal',
      'Corn/butter in filling: 40–80 kcal',
      'Oil in batter: 40–80 kcal',
    ],
    clarificationQuestions: [
      {
        id: 'my-ab-filling',
        question: 'Filling amount?',
        type: 'single',
        options: [
          { id: 'light', label: 'Light', calorieModifier: -80 },
          { id: 'normal', label: 'Normal', calorieModifier: 0 },
          { id: 'heavy', label: 'Heavy', calorieModifier: 80 },
        ],
      },
    ],
    healthierAlternative: {
      name: 'Apam Balik with Reduced Peanut & Sugar',
      caloriesSaved: 100,
    },
  },
  {
    id: 'my-teh-tarik-ais',
    dishName: 'Teh Tarik Ais (Iced Pulled Tea)',
    country: 'Malaysia',
    category: 'Beverages',
    emoji: '🧊',
    defaultCaloriesMin: 150,
    defaultCaloriesMax: 300,
    defaultCalories: 220,
    macros: { protein: 3, carbs: 32, fat: 6, fiber: 0 },
    commonHiddenCalories: [
      'Condensed milk: 80–120 kcal',
      'Evaporated milk: 20–40 kcal',
      'Sugar: 40–60 kcal',
      'Tea: negligible',
    ],
    clarificationQuestions: [
      {
        id: 'my-tta-milk',
        question: 'Milk richness?',
        type: 'single',
        options: [
          { id: 'light', label: 'Light', calorieModifier: -60 },
          { id: 'normal', label: 'Normal', calorieModifier: 0 },
          { id: 'creamy', label: 'Creamy', calorieModifier: 80 },
        ],
      },
    ],
    healthierAlternative: {
      name: 'Teh Tarik Ais with Less Sugar & Evaporated Milk',
      caloriesSaved: 70,
    },
  },

  // ADDITIONAL THAILAND DISHES
  {
    id: 'th-pad-see-ew',
    dishName: 'Pad See Ew (Dark Soy Noodles)',
    country: 'Thailand',
    category: 'Noodles',
    emoji: '🍝',
    defaultCaloriesMin: 450,
    defaultCaloriesMax: 700,
    defaultCalories: 580,
    macros: { protein: 18, carbs: 64, fat: 18, fiber: 2 },
    commonHiddenCalories: [
      'Oil for stir-frying: 100–140 kcal',
      'Dark soy sauce: 10–20 kcal',
      'Chicken/pork: 60–100 kcal',
      'Egg: 70–90 kcal',
    ],
    clarificationQuestions: [
      {
        id: 'th-pse-oily',
        question: 'Oil level?',
        type: 'single',
        options: [
          { id: 'dry', label: 'Dry', calorieModifier: -60 },
          { id: 'normal', label: 'Normal', calorieModifier: 0 },
          { id: 'oily', label: 'Oily', calorieModifier: 80 },
        ],
      },
    ],
    healthierAlternative: {
      name: 'Pad See Ew with Less Oil & Extra Vegetables',
      caloriesSaved: 100,
    },
  },
  {
    id: 'th-massaman-curry',
    dishName: 'Massaman Curry',
    country: 'Thailand',
    category: 'Soups & Curries',
    emoji: '🍛',
    defaultCaloriesMin: 450,
    defaultCaloriesMax: 750,
    defaultCalories: 600,
    macros: { protein: 22, carbs: 35, fat: 32, fiber: 3 },
    commonHiddenCalories: [
      'Coconut milk: 160–200 kcal',
      'Peanuts: 80–120 kcal',
      'Potatoes: 60–100 kcal',
      'Oil in paste: 60–100 kcal',
    ],
    clarificationQuestions: [
      {
        id: 'th-mc-creamy',
        question: 'Coconut richness?',
        type: 'single',
        options: [
          { id: 'light', label: 'Light', calorieModifier: -100 },
          { id: 'normal', label: 'Normal', calorieModifier: 0 },
          { id: 'creamy', label: 'Creamy', calorieModifier: 100 },
        ],
      },
    ],
    healthierAlternative: {
      name: 'Massaman with Less Coconut & Peanuts',
      caloriesSaved: 120,
    },
  },
  {
    id: 'th-larb',
    dishName: 'Larb (Minced Meat Salad)',
    country: 'Thailand',
    category: 'Salads',
    emoji: '🥗',
    defaultCaloriesMin: 300,
    defaultCaloriesMax: 550,
    defaultCalories: 420,
    macros: { protein: 28, carbs: 12, fat: 24, fiber: 3 },
    commonHiddenCalories: [
      'Minced meat: 100–150 kcal',
      'Oil from pan-frying: 60–100 kcal',
      'Fish sauce: negligible',
      'Lime juice: negligible',
    ],
    clarificationQuestions: [
      {
        id: 'th-larb-meat',
        question: 'Meat type?',
        type: 'single',
        options: [
          { id: 'chicken', label: 'Chicken', calorieModifier: 0 },
          { id: 'pork', label: 'Pork', calorieModifier: 80 },
          { id: 'beef', label: 'Beef', calorieModifier: 60 },
        ],
      },
    ],
    healthierAlternative: {
      name: 'Larb with Lean Chicken & Less Oil',
      caloriesSaved: 80,
    },
  },

  // ADDITIONAL INDONESIA DISHES
  {
    id: 'id-bakso',
    dishName: 'Bakso (Meatball Soup)',
    country: 'Indonesia',
    category: 'Soups & Noodles',
    emoji: '🍲',
    defaultCaloriesMin: 400,
    defaultCaloriesMax: 700,
    defaultCalories: 550,
    macros: { protein: 22, carbs: 48, fat: 18, fiber: 2 },
    commonHiddenCalories: [
      'Meatballs (fatty pork): 120–180 kcal',
      'Noodles: 150–200 kcal',
      'Oil in broth: 40–80 kcal',
      'Egg (if added): 70–90 kcal',
    ],
    clarificationQuestions: [
      {
        id: 'id-bakso-meatballs',
        question: 'How many meatballs?',
        type: 'single',
        options: [
          { id: 'few', label: 'Few (3-4)', calorieModifier: -80 },
          { id: 'normal', label: 'Normal (6-8)', calorieModifier: 0 },
          { id: 'many', label: 'Many (10+)', calorieModifier: 120 },
        ],
      },
    ],
    healthierAlternative: {
      name: 'Bakso with Lean Meat & Light Broth',
      caloriesSaved: 100,
    },
  },
  {
    id: 'id-perkedel',
    dishName: 'Perkedel (Fried Potato Croquettes)',
    country: 'Indonesia',
    category: 'Appetizers',
    emoji: '🥔',
    defaultCaloriesMin: 120,
    defaultCaloriesMax: 280,
    defaultCalories: 200,
    macros: { protein: 4, carbs: 22, fat: 10, fiber: 2 },
    commonHiddenCalories: [
      'Oil from deep-frying: 80–120 kcal',
      'Egg binding: 50–70 kcal',
      'Potato: 60–90 kcal',
      'Cheese filling (if included): 40–60 kcal',
    ],
    clarificationQuestions: [
      {
        id: 'id-perk-count',
        question: 'How many pieces?',
        type: 'single',
        options: [
          { id: '2-pieces', label: '2 pieces', calorieModifier: 0 },
          { id: '4-pieces', label: '4 pieces', calorieModifier: 200 },
          { id: '6-pieces', label: '6 pieces', calorieModifier: 400 },
        ],
      },
    ],
    healthierAlternative: {
      name: 'Baked Potato Croquettes',
      caloriesSaved: 100,
    },
  },
  {
    id: 'id-lumpia-goreng',
    dishName: 'Lumpia Goreng (Fried Spring Rolls)',
    country: 'Indonesia',
    category: 'Appetizers',
    emoji: '🥐',
    defaultCaloriesMin: 200,
    defaultCaloriesMax: 400,
    defaultCalories: 300,
    macros: { protein: 8, carbs: 28, fat: 14, fiber: 1 },
    commonHiddenCalories: [
      'Oil from frying: 80–120 kcal',
      'Shrimp/pork: 40–70 kcal',
      'Wrapper: 30–50 kcal',
      'Sweet chilli sauce: 20–40 kcal',
    ],
    clarificationQuestions: [
      {
        id: 'id-lg-count',
        question: 'How many lumpia?',
        type: 'single',
        options: [
          { id: '3-pieces', label: '3 pieces', calorieModifier: 0 },
          { id: '6-pieces', label: '6 pieces', calorieModifier: 300 },
        ],
      },
    ],
    healthierAlternative: {
      name: 'Baked Lumpia',
      caloriesSaved: 100,
    },
  },

  // ADDITIONAL VIETNAM DISHES
  {
    id: 'vn-bun-bo-hue',
    dishName: 'Bún Bò Huế (Spicy Beef Noodle Soup)',
    country: 'Vietnam',
    category: 'Soups & Noodles',
    emoji: '🍲',
    defaultCaloriesMin: 450,
    defaultCaloriesMax: 750,
    defaultCalories: 600,
    macros: { protein: 26, carbs: 58, fat: 16, fiber: 2 },
    commonHiddenCalories: [
      'Beef: 80–120 kcal',
      'Pork blood cake: 60–100 kcal',
      'Thick rice noodles: 180–220 kcal',
      'Shrimp paste oil: 30–60 kcal',
    ],
    clarificationQuestions: [
      {
        id: 'vn-bbh-spice',
        question: 'Spice level?',
        type: 'single',
        options: [
          { id: 'mild', label: 'Mild', calorieModifier: -40 },
          { id: 'normal', label: 'Normal', calorieModifier: 0 },
          { id: 'spicy', label: 'Spicy', calorieModifier: 40 },
        ],
      },
    ],
    healthierAlternative: {
      name: 'Bún Bò Huế with Light Broth',
      caloriesSaved: 80,
    },
  },
  {
    id: 'vn-cao-lau',
    dishName: 'Cao Lầu (Crispy Noodles with Pork)',
    country: 'Vietnam',
    category: 'Noodles',
    emoji: '🍜',
    defaultCaloriesMin: 450,
    defaultCaloriesMax: 700,
    defaultCalories: 575,
    macros: { protein: 20, carbs: 58, fat: 18, fiber: 2 },
    commonHiddenCalories: [
      'Crispy noodles (fried): 120–160 kcal',
      'Pork: 80–120 kcal',
      'Peanut/sesame sauce: 60–100 kcal',
      'Cracklings: 40–80 kcal',
    ],
    clarificationQuestions: [
      {
        id: 'vn-cl-noodle',
        question: 'Noodles crispiness?',
        type: 'single',
        options: [
          { id: 'soft', label: 'Soft', calorieModifier: -80 },
          { id: 'crispy', label: 'Crispy', calorieModifier: 0 },
        ],
      },
    ],
    healthierAlternative: {
      name: 'Cao Lầu with Softer Noodles & Light Sauce',
      caloriesSaved: 100,
    },
  },
  {
    id: 'vn-mi-quang',
    dishName: 'Mì Quảng (Turmeric Noodles)',
    country: 'Vietnam',
    category: 'Noodles',
    emoji: '🍝',
    defaultCaloriesMin: 400,
    defaultCaloriesMax: 650,
    defaultCalories: 525,
    macros: { protein: 18, carbs: 60, fat: 14, fiber: 3 },
    commonHiddenCalories: [
      'Turmeric noodles: 150–200 kcal',
      'Pork/chicken: 60–100 kcal',
      'Oil: 40–80 kcal',
      'Sesame/peanut: 50–80 kcal',
    ],
    clarificationQuestions: [
      {
        id: 'vn-mq-protein',
        question: 'Protein type?',
        type: 'single',
        options: [
          { id: 'chicken', label: 'Chicken', calorieModifier: 0 },
          { id: 'pork', label: 'Pork', calorieModifier: 40 },
          { id: 'shrimp', label: 'Shrimp', calorieModifier: 20 },
        ],
      },
    ],
    healthierAlternative: {
      name: 'Mì Quảng with Lean Protein & Less Oil',
      caloriesSaved: 80,
    },
  },

  // ADDITIONAL PHILIPPINES DISHES
  {
    id: 'ph-kare-kare',
    dishName: 'Kare-Kare (Peanut Stew)',
    country: 'Philippines',
    category: 'Braised & Stews',
    emoji: '🌰',
    defaultCaloriesMin: 500,
    defaultCaloriesMax: 800,
    defaultCalories: 650,
    macros: { protein: 26, carbs: 30, fat: 40, fiber: 4 },
    commonHiddenCalories: [
      'Peanut butter: 150–200 kcal',
      'Oil: 60–100 kcal',
      'Meat (beef/pork): 100–150 kcal',
      'Annatto (achiote): 30–50 kcal',
    ],
    clarificationQuestions: [
      {
        id: 'ph-kk-creamy',
        question: 'Peanut sauce amount?',
        type: 'single',
        options: [
          { id: 'light', label: 'Light', calorieModifier: -100 },
          { id: 'normal', label: 'Normal', calorieModifier: 0 },
          { id: 'thick', label: 'Thick', calorieModifier: 120 },
        ],
      },
    ],
    healthierAlternative: {
      name: 'Kare-Kare with Less Peanut Sauce',
      caloriesSaved: 120,
    },
  },
  {
    id: 'ph-sisig',
    dishName: 'Sisig (Minced Pork)',
    country: 'Philippines',
    category: 'Sizzling Dishes',
    emoji: '🍖',
    defaultCaloriesMin: 350,
    defaultCaloriesMax: 650,
    defaultCalories: 500,
    macros: { protein: 32, carbs: 8, fat: 32, fiber: 1 },
    commonHiddenCalories: [
      'Pork (fatty cuts): 150–200 kcal',
      'Liver: 60–100 kcal',
      'Oil from cooking: 80–120 kcal',
      'Soy sauce/vinegar: negligible',
    ],
    clarificationQuestions: [
      {
        id: 'ph-sisig-portion',
        question: 'Portion size?',
        type: 'single',
        options: [
          { id: 'small', label: 'Small', calorieModifier: -100 },
          { id: 'medium', label: 'Medium', calorieModifier: 0 },
          { id: 'large', label: 'Large', calorieModifier: 150 },
        ],
      },
    ],
    healthierAlternative: {
      name: 'Sisig with Lean Pork & Less Oil',
      caloriesSaved: 120,
    },
  },
  {
    id: 'ph-tapa',
    dishName: 'Tapa (Marinated Beef)',
    country: 'Philippines',
    category: 'Grilled & BBQ',
    emoji: '🥩',
    defaultCaloriesMin: 250,
    defaultCaloriesMax: 500,
    defaultCalories: 375,
    macros: { protein: 28, carbs: 2, fat: 24, fiber: 0 },
    commonHiddenCalories: [
      'Beef (fatty): 100–150 kcal',
      'Oil for frying: 80–120 kcal',
      'Soy sauce/vinegar marinade: negligible',
      'Sugar in marinade: 10–20 kcal',
    ],
    clarificationQuestions: [
      {
        id: 'ph-tapa-oily',
        question: 'How crispy/oily?',
        type: 'single',
        options: [
          { id: 'light', label: 'Light', calorieModifier: -60 },
          { id: 'normal', label: 'Normal', calorieModifier: 0 },
          { id: 'crispy', label: 'Crispy', calorieModifier: 80 },
        ],
      },
    ],
    healthierAlternative: {
      name: 'Tapa with Lean Beef & Baked Instead of Fried',
      caloriesSaved: 100,
    },
  },
]

export function getFoodById(id: string): SeaFood | undefined {
  return SEA_FOOD_DATABASE.find(food => food.id === id)
}

export function getFoodsByCountry(country: string): SeaFood[] {
  return SEA_FOOD_DATABASE.filter(food => food.country === country)
}

export function getFoodsByCategory(category: string): SeaFood[] {
  return SEA_FOOD_DATABASE.filter(food => food.category === category)
}

export function searchFoods(query: string): SeaFood[] {
  const lower = query.toLowerCase()
  return SEA_FOOD_DATABASE.filter(
    food =>
      food.dishName.toLowerCase().includes(lower) ||
      food.country.toLowerCase().includes(lower) ||
      food.category.toLowerCase().includes(lower)
  )
}
