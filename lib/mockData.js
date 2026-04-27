export const DISHES = {
  'chicken-rice': {
    id: 'chicken-rice',
    name: 'Chicken Rice',
    nameLocal: '鸡饭',
    origin: 'Singapore',
    flag: '🇸🇬',
    emoji: '🍚',
    color: '#F59E0B',
    bgColor: '#FEF3C7',
    description: 'Steamed or roasted chicken with fragrant rice cooked in chicken broth, served with chilli and ginger sauce.',
    baseCalories: 480,
    calorieRange: { min: 350, max: 750 },
    hiddenCalories: [
      'Chicken skin adds 50–80 kcal — easy to miss',
      'Rice cooked in chicken fat (oilier than plain rice)',
      'Chilli sauce: 20–40 kcal per tablespoon',
      'Ginger paste on the side adds ~20 kcal',
    ],
    macros: { protein: 28, carbs: 58, fat: 14, fiber: 1 },
    tags: ['Rice', 'Chicken', 'Classic'],
    questions: [
      {
        id: 'portion',
        question: 'How big was your portion?',
        subtitle: 'Portion size is the biggest calorie variable',
        type: 'single',
        options: [
          { id: 'small', label: 'Small', desc: "Half portion / child's meal", icon: '🤏', modifier: -100 },
          { id: 'regular', label: 'Regular', desc: 'Standard hawker serving', icon: '👌', modifier: 0 },
          { id: 'large', label: 'Large', desc: 'Extra rice added', icon: '👐', modifier: 130 },
          { id: 'xl', label: 'Double Rice', desc: 'Two scoops of rice', icon: '🙌', modifier: 220 },
        ],
      },
      {
        id: 'style',
        question: 'Which style of chicken?',
        subtitle: 'Different cooking methods change the calorie count',
        type: 'single',
        options: [
          { id: 'steamed', label: 'Steamed (Bai Qie)', desc: 'Lighter, poached in broth', icon: '💧', modifier: -30 },
          { id: 'roasted', label: 'Roasted (Shao Ji)', desc: 'Crispy skin, more flavour', icon: '🔥', modifier: 20 },
          { id: 'soy', label: 'Soy Sauce', desc: 'Braised in dark soy', icon: '🤎', modifier: 15 },
        ],
      },
      {
        id: 'extras',
        question: 'Any add-ons on your plate?',
        subtitle: 'Select all that apply',
        type: 'multi',
        options: [
          { id: 'egg', label: 'Soft-boiled egg', icon: '🥚', modifier: 70 },
          { id: 'char_siu', label: 'Char Siu slice', icon: '🥩', modifier: 110 },
          { id: 'extra_chicken', label: 'Extra chicken', icon: '🍗', modifier: 150 },
          { id: 'none', label: 'No add-ons', icon: '✓', modifier: 0, exclusive: true },
        ],
      },
    ],
  },

  'nasi-lemak': {
    id: 'nasi-lemak',
    name: 'Nasi Lemak',
    nameLocal: 'Nasi Lemak (MY)',
    origin: 'Malaysia',
    flag: '🇲🇾',
    emoji: '🍛',
    color: '#16A34A',
    bgColor: '#DCFCE7',
    description: 'Fragrant coconut rice served with crispy anchovies, roasted peanuts, boiled egg, cucumber and spicy sambal.',
    baseCalories: 620,
    calorieRange: { min: 440, max: 900 },
    hiddenCalories: [
      'Coconut rice is calorie-dense — more fat than plain rice',
      'Sambal chilli: 30–80 kcal depending on amount',
      'Fried chicken (if included) adds 150–200 kcal',
      'Crispy anchovies and peanuts are high in fat',
    ],
    macros: { protein: 20, carbs: 72, fat: 28, fiber: 4 },
    tags: ['Rice', 'Coconut', 'Spicy'],
    questions: [
      {
        id: 'protein',
        question: 'What protein came with it?',
        subtitle: 'Protein choice is the biggest calorie variable',
        type: 'single',
        options: [
          { id: 'egg', label: 'Boiled egg only', desc: 'Standard set', icon: '🥚', modifier: 0 },
          { id: 'fried_chicken', label: 'Fried chicken', desc: 'Classic add-on', icon: '🍗', modifier: 180 },
          { id: 'rendang', label: 'Beef rendang', desc: 'Rich dry curry', icon: '🥩', modifier: 130 },
          { id: 'none', label: 'No protein', desc: 'Veg/plain set', icon: '🌿', modifier: -80 },
        ],
      },
      {
        id: 'sambal',
        question: 'How much sambal?',
        subtitle: 'Sambal adds significant calories in large amounts',
        type: 'single',
        options: [
          { id: 'none', label: 'None', icon: '🚫', modifier: -30 },
          { id: 'light', label: 'Light', icon: '🔹', modifier: 0 },
          { id: 'normal', label: 'Normal', icon: '🌶️', modifier: 40 },
          { id: 'extra', label: 'Extra sambal', icon: '🔥', modifier: 90 },
        ],
      },
    ],
  },

  'char-kway-teow': {
    id: 'char-kway-teow',
    name: 'Char Kway Teow',
    nameLocal: '炒粿条',
    origin: 'Singapore',
    flag: '🇸🇬',
    emoji: '🥘',
    color: '#92400E',
    bgColor: '#FEF3C7',
    description: 'Stir-fried flat rice noodles in a rich dark sauce with prawns, cockles, Chinese sausage, eggs and bean sprouts.',
    baseCalories: 680,
    calorieRange: { min: 450, max: 870 },
    hiddenCalories: [
      'Lard used in wok frying adds 60–100 kcal',
      'Dark soy sauce contains sugar',
      'Chinese sausage (lap cheong) is high in fat',
      'Cockles are low-cal but often missed in tracking',
    ],
    macros: { protein: 22, carbs: 78, fat: 32, fiber: 2 },
    tags: ['Noodles', 'Wok-fried', 'Seafood'],
    questions: [
      {
        id: 'portion',
        question: 'How big was the plate?',
        subtitle: 'Portion is the main driver of calories here',
        type: 'single',
        options: [
          { id: 'small', label: 'Small', desc: 'Light plate', icon: '🤏', modifier: -150 },
          { id: 'regular', label: 'Regular', desc: 'Standard serving', icon: '👌', modifier: 0 },
          { id: 'large', label: 'Large', desc: 'Bigger serving', icon: '👐', modifier: 150 },
        ],
      },
      {
        id: 'lard',
        question: 'Was lard used in cooking?',
        subtitle: 'Lard is traditional but significantly increases calories',
        type: 'single',
        options: [
          { id: 'no', label: 'No lard', desc: 'Requested healthy', icon: '🥗', modifier: -80 },
          { id: 'yes', label: 'Standard lard', desc: 'Traditional cooking', icon: '🍳', modifier: 0 },
          { id: 'extra', label: 'Extra lard', desc: 'Very rich plate', icon: '🔥', modifier: 80 },
        ],
      },
    ],
  },

  'laksa': {
    id: 'laksa',
    name: 'Laksa',
    nameLocal: '叻沙',
    origin: 'Singapore',
    flag: '🇸🇬',
    emoji: '🍜',
    color: '#EA580C',
    bgColor: '#FFEDD5',
    description: 'Rich and spicy coconut milk noodle soup loaded with prawns, tofu puffs, cockles, and fresh laksa leaves.',
    baseCalories: 610,
    calorieRange: { min: 380, max: 760 },
    hiddenCalories: [
      'Coconut milk broth holds 100–200 kcal on its own',
      'Tofu puffs absorb oil — each puff adds ~40 kcal',
      'Laksa paste base is oil-heavy',
      'Cockles add minimal calories but are easy to forget',
    ],
    macros: { protein: 24, carbs: 68, fat: 28, fiber: 3 },
    tags: ['Noodles', 'Coconut', 'Spicy'],
    questions: [
      {
        id: 'broth',
        question: 'How much broth did you drink?',
        subtitle: 'The coconut broth holds most of the calories',
        type: 'single',
        options: [
          { id: 'none', label: 'Left it all', desc: 'Ate solids only', icon: '🚫', modifier: -160 },
          { id: 'little', label: 'A little sip', desc: 'Left most of it', icon: '💧', modifier: -80 },
          { id: 'half', label: 'About half', desc: 'Moderate amount', icon: '🌊', modifier: -40 },
          { id: 'all', label: 'Finished it', desc: 'Drank the whole bowl', icon: '🥣', modifier: 0 },
        ],
      },
      {
        id: 'portion',
        question: 'Bowl size?',
        subtitle: 'Portion affects noodles and toppings',
        type: 'single',
        options: [
          { id: 'small', label: 'Small bowl', icon: '🤏', modifier: -80 },
          { id: 'regular', label: 'Regular', icon: '👌', modifier: 0 },
          { id: 'large', label: 'Large bowl', icon: '👐', modifier: 100 },
        ],
      },
    ],
  },

  'cai-png': {
    id: 'cai-png',
    name: 'Cai Png (Economy Rice)',
    nameLocal: '菜饭',
    origin: 'Singapore',
    flag: '🇸🇬',
    emoji: '🍱',
    color: '#0891B2',
    bgColor: '#CFFAFE',
    description: 'Mix-and-match rice plate with a selection of dishes from a steam tray.',
    baseCalories: 520,
    calorieRange: { min: 300, max: 800 },
    hiddenCalories: [
      'Braised dishes sit in oil-rich sauces — absorbs into rice',
      'Each fried item adds 80–130 kcal',
      'Rice scoop size varies widely between stalls',
      'Gravy poured on rice adds 30–60 kcal',
    ],
    macros: { protein: 22, carbs: 65, fat: 18, fiber: 4 },
    tags: ['Rice', 'Mixed', 'Value'],
    questions: [
      {
        id: 'rice',
        question: 'How many scoops of rice?',
        subtitle: 'Each scoop is about 130 kcal',
        type: 'single',
        options: [
          { id: 'half', label: 'Half scoop', icon: '🤏', modifier: -130 },
          { id: 'one', label: '1 scoop', icon: '👌', modifier: 0 },
          { id: 'two', label: '2 scoops', icon: '👐', modifier: 130 },
          { id: 'three', label: '3 scoops', icon: '🙌', modifier: 260 },
        ],
      },
      {
        id: 'dishes',
        question: 'What type of dishes did you pick?',
        subtitle: 'Select all that apply',
        type: 'multi',
        options: [
          { id: 'veg', label: 'Stir-fried vegetables', icon: '🥦', modifier: -60 },
          { id: 'egg', label: 'Egg dish', icon: '🥚', modifier: 70 },
          { id: 'fried', label: 'A fried item', icon: '🍳', modifier: 120 },
          { id: 'braised', label: 'Braised meat', icon: '🥩', modifier: 100 },
        ],
      },
    ],
  },

  'pad-thai': {
    id: 'pad-thai',
    name: 'Pad Thai',
    nameLocal: 'ผัดไทย',
    origin: 'Thailand',
    flag: '🇹🇭',
    emoji: '🍜',
    color: '#CA8A04',
    bgColor: '#FEF9C3',
    description: 'Stir-fried rice noodles with eggs, tofu or shrimp, tamarind sauce, fish sauce, peanuts and bean sprouts.',
    baseCalories: 560,
    calorieRange: { min: 400, max: 750 },
    hiddenCalories: [
      'Peanuts add ~60 kcal per tablespoon — common to add extra',
      'Palm sugar in the sauce adds 30–50 kcal',
      'Wok oil is used generously in stir-frying',
      'Fried tofu absorbs more oil than fresh tofu',
    ],
    macros: { protein: 22, carbs: 68, fat: 24, fiber: 3 },
    tags: ['Noodles', 'Thai', 'Peanut'],
    questions: [
      {
        id: 'protein',
        question: 'Which protein?',
        subtitle: 'Protein choice affects calorie and fat content',
        type: 'single',
        options: [
          { id: 'tofu', label: 'Tofu only', desc: 'Lighter option', icon: '🟡', modifier: -60 },
          { id: 'shrimp', label: 'Shrimp', desc: 'Classic choice', icon: '🦐', modifier: 0 },
          { id: 'chicken', label: 'Chicken', icon: '🍗', modifier: 50 },
          { id: 'mix', label: 'Mixed', desc: 'Chicken + shrimp', icon: '🥘', modifier: 80 },
        ],
      },
      {
        id: 'portion',
        question: 'How big was the portion?',
        type: 'single',
        options: [
          { id: 'small', label: 'Small', icon: '🤏', modifier: -100 },
          { id: 'regular', label: 'Regular', icon: '👌', modifier: 0 },
          { id: 'large', label: 'Large', icon: '👐', modifier: 120 },
        ],
      },
    ],
  },

  'pho': {
    id: 'pho',
    name: 'Phở Bò',
    nameLocal: 'Phở bò',
    origin: 'Vietnam',
    flag: '🇻🇳',
    emoji: '🍲',
    color: '#065F46',
    bgColor: '#D1FAE5',
    description: 'Vietnamese slow-simmered beef bone broth with flat rice noodles, thin-sliced beef, fresh herbs and lime.',
    baseCalories: 480,
    calorieRange: { min: 320, max: 640 },
    hiddenCalories: [
      'Bone broth has beef fat from hours of simmering',
      'Hoisin and sriracha dipping sauces add 40–60 kcal',
      'Fatty brisket has significantly more fat than rare slices',
      'Finishing the broth adds 80–120 kcal',
    ],
    macros: { protein: 30, carbs: 58, fat: 12, fiber: 2 },
    tags: ['Soup', 'Beef', 'Vietnamese'],
    questions: [
      {
        id: 'broth',
        question: 'How much broth did you finish?',
        subtitle: 'Beef broth has fat from long simmering',
        type: 'single',
        options: [
          { id: 'little', label: 'Left most', desc: 'Just the solids', icon: '🚫', modifier: -100 },
          { id: 'half', label: 'About half', icon: '💧', modifier: -50 },
          { id: 'most', label: 'Almost all', icon: '🌊', modifier: -20 },
          { id: 'all', label: 'Finished it', icon: '🥣', modifier: 0 },
        ],
      },
      {
        id: 'beef',
        question: 'Which cut of beef?',
        subtitle: 'Fatty cuts add considerably more calories',
        type: 'single',
        options: [
          { id: 'lean', label: 'Thinly sliced rare beef', desc: 'Lean cut', icon: '🥩', modifier: 0 },
          { id: 'brisket', label: 'Fatty brisket (Gầu)', desc: 'Rich, well-marbled', icon: '🫕', modifier: 80 },
          { id: 'mixed', label: 'Mixed cuts', desc: 'Brisket + rare beef', icon: '🍖', modifier: 50 },
        ],
      },
    ],
  },

  'nasi-goreng': {
    id: 'nasi-goreng',
    name: 'Nasi Goreng',
    nameLocal: 'Nasi Goreng',
    origin: 'Indonesia',
    flag: '🇮🇩',
    emoji: '🍛',
    color: '#B45309',
    bgColor: '#FEF3C7',
    description: 'Indonesian fried rice seasoned with kecap manis, shrimp paste and chilli, topped with a fried egg and crackers.',
    baseCalories: 660,
    calorieRange: { min: 440, max: 870 },
    hiddenCalories: [
      'Kecap manis (sweet soy) adds sugar — 30–50 kcal',
      'Fried egg on top adds ~70 kcal',
      'Wok oil used generously in frying adds 60–100 kcal',
      'Prawn crackers on the side: ~80 kcal per small serving',
    ],
    macros: { protein: 22, carbs: 82, fat: 28, fiber: 2 },
    tags: ['Rice', 'Fried', 'Indonesian'],
    questions: [
      {
        id: 'egg',
        question: 'Fried egg on top?',
        subtitle: 'Classic nasi goreng includes a sunny-side egg',
        type: 'single',
        options: [
          { id: 'no', label: 'No egg', icon: '🚫', modifier: -70 },
          { id: 'yes', label: 'Yes, fried egg', icon: '🍳', modifier: 0 },
        ],
      },
      {
        id: 'portion',
        question: 'How much rice?',
        type: 'single',
        options: [
          { id: 'small', label: 'Small', icon: '🤏', modifier: -150 },
          { id: 'regular', label: 'Regular', icon: '👌', modifier: 0 },
          { id: 'large', label: 'Large', icon: '👐', modifier: 150 },
        ],
      },
    ],
  },

  'bubble-tea': {
    id: 'bubble-tea',
    name: 'Bubble Tea',
    nameLocal: '珍珠奶茶',
    origin: 'Singapore',
    flag: '🇸🇬',
    emoji: '🧋',
    color: '#7C3AED',
    bgColor: '#EDE9FE',
    description: 'Milk tea or fruit tea with chewy tapioca pearls.',
    baseCalories: 330,
    calorieRange: { min: 120, max: 580 },
    hiddenCalories: [
      'Tapioca pearls: ~150 kcal per regular cup serving',
      'Full sugar vs no sugar = difference of ~100 kcal',
      'Coconut jelly or pudding toppings add 50–80 kcal',
      'Cheese foam topping adds ~80–120 kcal',
    ],
    macros: { protein: 3, carbs: 60, fat: 8, fiber: 0 },
    tags: ['Drink', 'Sweet', 'Tea'],
    questions: [
      {
        id: 'size',
        question: 'What size?',
        type: 'single',
        options: [
          { id: 'small', label: 'Medium (500ml)', icon: '🥤', modifier: -80 },
          { id: 'large', label: 'Large (700ml)', icon: '🧋', modifier: 80 },
        ],
      },
      {
        id: 'sugar',
        question: 'Sugar level?',
        subtitle: 'Sugar level has the biggest impact on calories',
        type: 'single',
        options: [
          { id: 'zero', label: '0%', desc: 'No sugar', icon: '🚫', modifier: -80 },
          { id: 'quarter', label: '25%', icon: '🔹', modifier: -40 },
          { id: 'half', label: '50%', desc: 'Default in some shops', icon: '🌓', modifier: 0 },
          { id: 'full', label: '100%', desc: 'Full sugar', icon: '🍬', modifier: 100 },
        ],
      },
      {
        id: 'toppings',
        question: 'Toppings?',
        subtitle: 'Pearls and extras add meaningful calories',
        type: 'single',
        options: [
          { id: 'none', label: 'No toppings', icon: '✓', modifier: -80 },
          { id: 'pearls', label: 'Tapioca pearls', desc: 'Classic boba', icon: '⚫', modifier: 0 },
          { id: 'jelly', label: 'Grass jelly', desc: 'Lower calorie option', icon: '🟫', modifier: -20 },
          { id: 'pudding', label: 'Egg pudding', icon: '🟡', modifier: 60 },
        ],
      },
    ],
  },

  'roti-prata': {
    id: 'roti-prata',
    name: 'Roti Prata',
    nameLocal: 'Roti Prata (SG)',
    origin: 'Singapore',
    flag: '🇸🇬',
    emoji: '🫓',
    color: '#D97706',
    bgColor: '#FEF3C7',
    description: 'Crispy, flaky pan-fried flatbread cooked with ghee, served with fish or mutton curry for dipping.',
    baseCalories: 350,
    calorieRange: { min: 180, max: 580 },
    hiddenCalories: [
      'Ghee used in cooking adds 40–80 kcal per prata',
      'Curry dip adds 60–100 kcal depending on amount',
      'Egg prata has an extra 70–90 kcal per egg',
      'Sugar prata adds ~50 kcal vs plain',
    ],
    macros: { protein: 8, carbs: 44, fat: 17, fiber: 1 },
    tags: ['Bread', 'Indian', 'Fried'],
    questions: [
      {
        id: 'quantity',
        question: 'How many pratas?',
        type: 'single',
        options: [
          { id: 'one_plain', label: '1 plain prata', icon: '1️⃣', modifier: -100 },
          { id: 'two_plain', label: '2 plain pratas', desc: 'Standard order', icon: '2️⃣', modifier: 0 },
          { id: 'one_egg', label: '1 egg prata', icon: '🥚', modifier: -30 },
          { id: 'two_egg', label: '2 egg pratas', icon: '🍳', modifier: 110 },
        ],
      },
      {
        id: 'curry',
        question: 'How much curry dip?',
        subtitle: 'Curry sauce is calorie-dense',
        type: 'single',
        options: [
          { id: 'none', label: 'None', icon: '🚫', modifier: -60 },
          { id: 'light', label: 'Light dip', icon: '🔹', modifier: 0 },
          { id: 'normal', label: 'Normal dip', icon: '🍛', modifier: 60 },
          { id: 'lots', label: 'Extra curry', icon: '🔥', modifier: 130 },
        ],
      },
    ],
  },

  'hokkien-mee': {
    id: 'hokkien-mee',
    name: 'Hokkien Mee',
    nameLocal: '福建炒面',
    origin: 'Singapore',
    flag: '🇸🇬',
    emoji: '🍝',
    color: '#C2410C',
    bgColor: '#FFEDD5',
    description: 'Braised yellow noodles and thin rice noodles with prawns, squid, pork belly slices and egg.',
    baseCalories: 580,
    calorieRange: { min: 400, max: 780 },
    hiddenCalories: [
      'Lard drizzled on top at serving: 60–80 kcal',
      'Prawn stock base has natural fat',
      'Pork belly pieces are high in fat',
      'Sambal chilli on the side adds 20–40 kcal',
    ],
    macros: { protein: 26, carbs: 70, fat: 20, fiber: 2 },
    tags: ['Noodles', 'Seafood', 'Braised'],
    questions: [
      {
        id: 'portion',
        question: 'Portion size?',
        type: 'single',
        options: [
          { id: 'small', label: 'Small', icon: '🤏', modifier: -120 },
          { id: 'regular', label: 'Regular', icon: '👌', modifier: 0 },
          { id: 'large', label: 'Large', icon: '👐', modifier: 120 },
        ],
      },
      {
        id: 'lard',
        question: 'Lard drizzled on top?',
        subtitle: 'Traditional Hokkien Mee often includes lard at serving',
        type: 'single',
        options: [
          { id: 'no', label: 'No lard', desc: 'Requested without', icon: '🥗', modifier: -70 },
          { id: 'yes', label: 'With lard', desc: 'Traditional style', icon: '🍳', modifier: 0 },
        ],
      },
    ],
  },

  'satay': {
    id: 'satay',
    name: 'Satay',
    nameLocal: 'สะเต๊ะ',
    origin: 'Singapore',
    flag: '🇸🇬',
    emoji: '🍢',
    color: '#78350F',
    bgColor: '#FEF3C7',
    description: 'Grilled marinated meat skewers served with peanut sauce, ketupat and fresh cucumber slices.',
    baseCalories: 400,
    calorieRange: { min: 200, max: 680 },
    hiddenCalories: [
      'Peanut sauce: ~80 kcal per 2 tbsp serving',
      'Marinades contain palm sugar — adds 20–40 kcal',
      'Beef and mutton skewers have more fat than chicken',
      'Ketupat (rice cake) on the side adds ~80 kcal',
    ],
    macros: { protein: 32, carbs: 24, fat: 18, fiber: 2 },
    tags: ['Grilled', 'Skewer', 'Peanut'],
    questions: [
      {
        id: 'sticks',
        question: 'How many sticks?',
        subtitle: 'The base estimate is for 5 sticks',
        type: 'single',
        options: [
          { id: 'three', label: '3 sticks', icon: '3️⃣', modifier: -160 },
          { id: 'five', label: '5 sticks', desc: 'Base estimate', icon: '5️⃣', modifier: 0 },
          { id: 'eight', label: '8 sticks', icon: '8️⃣', modifier: 160 },
          { id: 'ten', label: '10 sticks', icon: '🔟', modifier: 280 },
        ],
      },
      {
        id: 'sauce',
        question: 'Peanut sauce amount?',
        subtitle: 'Peanut sauce is rich in calories and fat',
        type: 'single',
        options: [
          { id: 'none', label: 'None', icon: '🚫', modifier: -60 },
          { id: 'light', label: 'Light', icon: '🔹', modifier: -20 },
          { id: 'normal', label: 'Normal', icon: '🥜', modifier: 0 },
          { id: 'extra', label: 'Extra sauce', icon: '🔥', modifier: 80 },
        ],
      },
    ],
  },

  // MALAYSIA
  'rendang': {
    id: 'rendang',
    name: 'Rendang',
    origin: 'Malaysia',
    flag: '🇲🇾',
    emoji: '🍲',
    bgColor: '#DCFCE7',
    baseCalories: 550,
    calorieRange: { min: 400, max: 700 },
    hiddenCalories: ['Coconut cream: 180–220 kcal', 'Oil in meat: 80–120 kcal', 'Spice paste: 40–60 kcal'],
    macros: { protein: 24, carbs: 15, fat: 38, fiber: 2 },
    questions: [
      { id: 'type', question: 'Meat type?', type: 'single', options: [
        { id: 'chicken', label: 'Chicken', icon: '🍗', modifier: 0 },
        { id: 'beef', label: 'Beef', icon: '🥩', modifier: 80 },
      ]},
    ],
  },

  'mee-goreng': {
    id: 'mee-goreng',
    name: 'Mee Goreng',
    origin: 'Malaysia',
    flag: '🇲🇾',
    emoji: '🍝',
    bgColor: '#FEF3C7',
    baseCalories: 580,
    calorieRange: { min: 450, max: 700 },
    hiddenCalories: ['Oil in frying: 100–150 kcal', 'Ketchup/sweet sauce: 40–60 kcal', 'Egg mixed in: 70–90 kcal'],
    macros: { protein: 18, carbs: 62, fat: 18, fiber: 2 },
    questions: [
      { id: 'oily', question: 'Oil level?', type: 'single', options: [
        { id: 'light', label: 'Light', icon: '🥗', modifier: -60 },
        { id: 'normal', label: 'Normal', icon: '👌', modifier: 0 },
        { id: 'oily', label: 'Very Oily', icon: '🔥', modifier: 80 },
      ]},
    ],
  },

  'teh-tarik': {
    id: 'teh-tarik',
    name: 'Teh Tarik',
    origin: 'Malaysia',
    flag: '🇲🇾',
    emoji: '☕',
    bgColor: '#FEF3C7',
    baseCalories: 200,
    calorieRange: { min: 150, max: 300 },
    hiddenCalories: ['Condensed milk: 80–120 kcal', 'Sugar: 40–60 kcal'],
    macros: { protein: 3, carbs: 28, fat: 6, fiber: 0 },
    questions: [
      { id: 'milk', question: 'Milk richness?', type: 'single', options: [
        { id: 'light', label: 'Light', icon: '🥛', modifier: -50 },
        { id: 'normal', label: 'Normal', icon: '👌', modifier: 0 },
        { id: 'creamy', label: 'Creamy', icon: '☕', modifier: 80 },
      ]},
    ],
  },

  // THAILAND
  'tom-yum': {
    id: 'tom-yum',
    name: 'Tom Yum',
    origin: 'Thailand',
    flag: '🇹🇭',
    emoji: '🍲',
    bgColor: '#FFEDD5',
    baseCalories: 350,
    calorieRange: { min: 200, max: 500 },
    hiddenCalories: ['Coconut milk: 80–120 kcal', 'Oil in broth: 40–80 kcal'],
    macros: { protein: 12, carbs: 20, fat: 18, fiber: 2 },
    questions: [
      { id: 'creamy', question: 'Creamy or clear?', type: 'single', options: [
        { id: 'clear', label: 'Clear', icon: '💧', modifier: -100 },
        { id: 'normal', label: 'Normal', icon: '👌', modifier: 0 },
        { id: 'creamy', label: 'Creamy', icon: '🥥', modifier: 80 },
      ]},
    ],
  },

  'green-curry': {
    id: 'green-curry',
    name: 'Green Curry',
    origin: 'Thailand',
    flag: '🇹🇭',
    emoji: '🍛',
    bgColor: '#DCFCE7',
    baseCalories: 550,
    calorieRange: { min: 400, max: 700 },
    hiddenCalories: ['Coconut milk: 180–220 kcal', 'Green curry paste: 60–100 kcal'],
    macros: { protein: 20, carbs: 25, fat: 32, fiber: 2 },
    questions: [
      { id: 'creamy', question: 'Coconut level?', type: 'single', options: [
        { id: 'light', label: 'Light', icon: '🥗', modifier: -100 },
        { id: 'normal', label: 'Normal', icon: '👌', modifier: 0 },
        { id: 'rich', label: 'Rich', icon: '🥥', modifier: 100 },
      ]},
    ],
  },

  'pad-krapow': {
    id: 'pad-krapow',
    name: 'Pad Krapow Moo',
    origin: 'Thailand',
    flag: '🇹🇭',
    emoji: '🍲',
    bgColor: '#FEF3C7',
    baseCalories: 450,
    calorieRange: { min: 350, max: 600 },
    hiddenCalories: ['Oil for stir-frying: 80–120 kcal', 'Minced pork: 100–150 kcal', 'Fried egg: 70–90 kcal'],
    macros: { protein: 26, carbs: 35, fat: 16, fiber: 2 },
    questions: [
      { id: 'egg', question: 'Fried egg included?', type: 'single', options: [
        { id: 'no', label: 'No', icon: '🚫', modifier: -80 },
        { id: 'yes', label: 'Yes', icon: '🍳', modifier: 0 },
      ]},
    ],
  },

  'thai-milk-tea': {
    id: 'thai-milk-tea',
    name: 'Thai Iced Tea',
    origin: 'Thailand',
    flag: '🇹🇭',
    emoji: '🧋',
    bgColor: '#FEF3C7',
    baseCalories: 240,
    calorieRange: { min: 150, max: 350 },
    hiddenCalories: ['Condensed milk: 80–120 kcal', 'Sugar: 40–80 kcal'],
    macros: { protein: 2, carbs: 38, fat: 6, fiber: 0 },
    questions: [
      { id: 'milk', question: 'Milk amount?', type: 'single', options: [
        { id: 'light', label: 'Light', icon: '🥛', modifier: -60 },
        { id: 'normal', label: 'Normal', icon: '👌', modifier: 0 },
        { id: 'heavy', label: 'Heavy', icon: '☕', modifier: 80 },
      ]},
    ],
  },

  // INDONESIA
  'nasi-goreng-id': {
    id: 'nasi-goreng-id',
    name: 'Nasi Goreng (Indonesian)',
    origin: 'Indonesia',
    flag: '🇮🇩',
    emoji: '🍛',
    bgColor: '#FEF3C7',
    baseCalories: 600,
    calorieRange: { min: 450, max: 750 },
    hiddenCalories: ['Oil for frying: 100–150 kcal', 'Sambal: 40–80 kcal', 'Fried egg: 70–90 kcal'],
    macros: { protein: 18, carbs: 68, fat: 18, fiber: 2 },
    questions: [
      { id: 'sambal', question: 'Sambal amount?', type: 'single', options: [
        { id: 'light', label: 'Light', icon: '🔹', modifier: -40 },
        { id: 'normal', label: 'Normal', icon: '🌶️', modifier: 0 },
        { id: 'spicy', label: 'Lots', icon: '🔥', modifier: 60 },
      ]},
    ],
  },

  'gado-gado': {
    id: 'gado-gado',
    name: 'Gado-Gado',
    origin: 'Indonesia',
    flag: '🇮🇩',
    emoji: '🥗',
    bgColor: '#DCFCE7',
    baseCalories: 350,
    calorieRange: { min: 250, max: 500 },
    hiddenCalories: ['Peanut sauce: 80–150 kcal', 'Fried tofu: 60–100 kcal', 'Fried shallots: 40–60 kcal'],
    macros: { protein: 14, carbs: 35, fat: 14, fiber: 6 },
    questions: [
      { id: 'sauce', question: 'Peanut sauce amount?', type: 'single', options: [
        { id: 'light', label: 'Light', icon: '🔹', modifier: -80 },
        { id: 'normal', label: 'Normal', icon: '👌', modifier: 0 },
        { id: 'drenched', label: 'Drenched', icon: '🥜', modifier: 120 },
      ]},
    ],
  },

  'soto-ayam': {
    id: 'soto-ayam',
    name: 'Soto Ayam',
    origin: 'Indonesia',
    flag: '🇮🇩',
    emoji: '🍲',
    bgColor: '#FEF3C7',
    baseCalories: 450,
    calorieRange: { min: 300, max: 600 },
    hiddenCalories: ['Coconut milk: 80–120 kcal', 'Oil in broth: 40–80 kcal', 'Fried shallots: 40–60 kcal'],
    macros: { protein: 20, carbs: 40, fat: 16, fiber: 2 },
    questions: [
      { id: 'creamy', question: 'Coconut level?', type: 'single', options: [
        { id: 'light', label: 'Light', icon: '💧', modifier: -100 },
        { id: 'normal', label: 'Normal', icon: '👌', modifier: 0 },
        { id: 'creamy', label: 'Creamy', icon: '🥥', modifier: 80 },
      ]},
    ],
  },

  // VIETNAM
  'banh-mi': {
    id: 'banh-mi',
    name: 'Bánh Mì',
    origin: 'Vietnam',
    flag: '🇻🇳',
    emoji: '🥖',
    bgColor: '#D1FAE5',
    baseCalories: 450,
    calorieRange: { min: 300, max: 600 },
    hiddenCalories: ['Pâté: 60–100 kcal', 'Mayonnaise: 80–120 kcal', 'Vietnamese cold cuts: 80–120 kcal', 'Butter on bread: 40–80 kcal'],
    macros: { protein: 16, carbs: 48, fat: 16, fiber: 2 },
    questions: [
      { id: 'spread', question: 'Spread type?', type: 'single', options: [
        { id: 'light', label: 'Light Mayo', icon: '🥛', modifier: -60 },
        { id: 'normal', label: 'Mayo + Pâté', icon: '👌', modifier: 0 },
        { id: 'heavy', label: 'Heavy Mayo', icon: '🔥', modifier: 80 },
      ]},
    ],
  },

  'bun-cha': {
    id: 'bun-cha',
    name: 'Bún Chả',
    origin: 'Vietnam',
    flag: '🇻🇳',
    emoji: '🥘',
    bgColor: '#D1FAE5',
    baseCalories: 550,
    calorieRange: { min: 400, max: 700 },
    hiddenCalories: ['Pork meatballs: 80–120 kcal', 'Grilled pork: 100–150 kcal', 'Peanut sauce: 60–100 kcal'],
    macros: { protein: 26, carbs: 50, fat: 16, fiber: 2 },
    questions: [
      { id: 'pork', question: 'Pork portion?', type: 'single', options: [
        { id: 'light', label: 'Light', icon: '🤏', modifier: -80 },
        { id: 'normal', label: 'Normal', icon: '👌', modifier: 0 },
        { id: 'heavy', label: 'Heavy', icon: '👐', modifier: 100 },
      ]},
    ],
  },

  'com-tam': {
    id: 'com-tam',
    name: 'Cơm Tấm',
    origin: 'Vietnam',
    flag: '🇻🇳',
    emoji: '🍚',
    bgColor: '#D1FAE5',
    baseCalories: 550,
    calorieRange: { min: 400, max: 700 },
    hiddenCalories: ['Grilled pork: 100–150 kcal', 'Fried egg: 70–90 kcal', 'Pâté: 60–100 kcal'],
    macros: { protein: 20, carbs: 62, fat: 14, fiber: 2 },
    questions: [
      { id: 'protein', question: 'Protein?', type: 'single', options: [
        { id: 'pork', label: 'Pork Chop', icon: '🥩', modifier: 0 },
        { id: 'chicken', label: 'Chicken', icon: '🍗', modifier: -20 },
      ]},
    ],
  },

  'spring-rolls': {
    id: 'spring-rolls',
    name: 'Spring Rolls (Fried)',
    origin: 'Vietnam',
    flag: '🇻🇳',
    emoji: '🥐',
    bgColor: '#D1FAE5',
    baseCalories: 300,
    calorieRange: { min: 200, max: 400 },
    hiddenCalories: ['Oil from deep-frying: 80–120 kcal', 'Pork filling: 40–60 kcal', 'Wrapper: 40–60 kcal'],
    macros: { protein: 8, carbs: 28, fat: 14, fiber: 1 },
    questions: [
      { id: 'count', question: 'How many rolls?', type: 'single', options: [
        { id: '2-rolls', label: '2 rolls', icon: '2️⃣', modifier: 0 },
        { id: '4-rolls', label: '4 rolls', icon: '4️⃣', modifier: 300 },
      ]},
    ],
  },

  'pho-ga': {
    id: 'pho-ga',
    name: 'Phở Gà',
    origin: 'Vietnam',
    flag: '🇻🇳',
    emoji: '🍲',
    bgColor: '#D1FAE5',
    baseCalories: 450,
    calorieRange: { min: 350, max: 550 },
    hiddenCalories: ['Chicken: 80–120 kcal', 'Noodles: 150–200 kcal', 'Broth with oil: 40–80 kcal'],
    macros: { protein: 26, carbs: 50, fat: 8, fiber: 2 },
    questions: [
      { id: 'portion', question: 'Chicken amount?', type: 'single', options: [
        { id: 'light', label: 'Light', icon: '🤏', modifier: -60 },
        { id: 'normal', label: 'Normal', icon: '👌', modifier: 0 },
        { id: 'heavy', label: 'Heavy', icon: '👐', modifier: 80 },
      ]},
    ],
  },

  // PHILIPPINES
  'adobo': {
    id: 'adobo',
    name: 'Adobo',
    origin: 'Philippines',
    flag: '🇵🇭',
    emoji: '🍲',
    bgColor: '#FFE4E6',
    baseCalories: 550,
    calorieRange: { min: 400, max: 700 },
    hiddenCalories: ['Pork/chicken fat: 100–160 kcal', 'Coconut milk: 60–100 kcal', 'Oil in sauce: 40–80 kcal'],
    macros: { protein: 28, carbs: 15, fat: 32, fiber: 1 },
    questions: [
      { id: 'meat', question: 'Meat type?', type: 'single', options: [
        { id: 'chicken', label: 'Chicken', icon: '🍗', modifier: -80 },
        { id: 'pork', label: 'Pork', icon: '🥩', modifier: 0 },
      ]},
    ],
  },

  'lumpia-ph': {
    id: 'lumpia-ph',
    name: 'Lumpia',
    origin: 'Philippines',
    flag: '🇵🇭',
    emoji: '🥐',
    bgColor: '#FFE4E6',
    baseCalories: 280,
    calorieRange: { min: 180, max: 380 },
    hiddenCalories: ['Oil from frying: 80–120 kcal', 'Pork/shrimp: 40–70 kcal', 'Sweet sauce: 20–40 kcal'],
    macros: { protein: 8, carbs: 24, fat: 12, fiber: 1 },
    questions: [
      { id: 'count', question: 'How many pieces?', type: 'single', options: [
        { id: '2', label: '2 pieces', icon: '2️⃣', modifier: 0 },
        { id: '4', label: '4 pieces', icon: '4️⃣', modifier: 280 },
      ]},
    ],
  },

  'sinigang': {
    id: 'sinigang',
    name: 'Sinigang',
    origin: 'Philippines',
    flag: '🇵🇭',
    emoji: '🍲',
    bgColor: '#FFE4E6',
    baseCalories: 500,
    calorieRange: { min: 350, max: 650 },
    hiddenCalories: ['Pork: 100–150 kcal', 'Oil in broth: 40–80 kcal', 'Potatoes: 60–100 kcal'],
    macros: { protein: 24, carbs: 40, fat: 14, fiber: 3 },
    questions: [
      { id: 'meat', question: 'Meat portion?', type: 'single', options: [
        { id: 'light', label: 'Light', icon: '🤏', modifier: -80 },
        { id: 'normal', label: 'Normal', icon: '👌', modifier: 0 },
        { id: 'heavy', label: 'Heavy', icon: '👐', modifier: 100 },
      ]},
    ],
  },

  'lechon': {
    id: 'lechon',
    name: 'Lechon',
    origin: 'Philippines',
    flag: '🇵🇭',
    emoji: '🐷',
    bgColor: '#FFE4E6',
    baseCalories: 600,
    calorieRange: { min: 400, max: 800 },
    hiddenCalories: ['Pork skin: 100–150 kcal', 'Fatty pork: 150–250 kcal', 'Oil on skin: 60–100 kcal'],
    macros: { protein: 32, carbs: 0, fat: 48, fiber: 0 },
    questions: [
      { id: 'amount', question: 'Portion?', type: 'single', options: [
        { id: 'small', label: 'Small Piece', icon: '🤏', modifier: 0 },
        { id: 'medium', label: 'Medium', icon: '👌', modifier: 200 },
        { id: 'large', label: 'Large', icon: '👐', modifier: 400 },
      ]},
    ],
  },

  'kare-kare': {
    id: 'kare-kare',
    name: 'Kare-Kare',
    origin: 'Philippines',
    flag: '🇵🇭',
    emoji: '🌰',
    bgColor: '#FFE4E6',
    baseCalories: 650,
    calorieRange: { min: 500, max: 800 },
    hiddenCalories: ['Peanut butter: 150–200 kcal', 'Oil: 60–100 kcal', 'Meat: 100–150 kcal'],
    macros: { protein: 26, carbs: 30, fat: 40, fiber: 4 },
    questions: [
      { id: 'sauce', question: 'Peanut sauce amount?', type: 'single', options: [
        { id: 'light', label: 'Light', icon: '🔹', modifier: -100 },
        { id: 'normal', label: 'Normal', icon: '👌', modifier: 0 },
        { id: 'thick', label: 'Thick', icon: '🥜', modifier: 120 },
      ]},
    ],
  },

  'sisig': {
    id: 'sisig',
    name: 'Sisig',
    origin: 'Philippines',
    flag: '🇵🇭',
    emoji: '🍖',
    bgColor: '#FFE4E6',
    baseCalories: 500,
    calorieRange: { min: 350, max: 650 },
    hiddenCalories: ['Pork (fatty): 150–200 kcal', 'Liver: 60–100 kcal', 'Oil from cooking: 80–120 kcal'],
    macros: { protein: 32, carbs: 8, fat: 32, fiber: 1 },
    questions: [
      { id: 'portion', question: 'Portion?', type: 'single', options: [
        { id: 'small', label: 'Small', icon: '🤏', modifier: -100 },
        { id: 'medium', label: 'Medium', icon: '👌', modifier: 0 },
        { id: 'large', label: 'Large', icon: '👐', modifier: 150 },
      ]},
    ],
  },

  // ADDITIONAL SINGAPORE
  'you-tiao': {
    id: 'you-tiao',
    name: 'You Tiao',
    nameLocal: '油条',
    origin: 'Singapore',
    flag: '🇸🇬',
    emoji: '🍩',
    color: '#D97706',
    bgColor: '#FEF3C7',
    description: 'Deep-fried Chinese dough fritters — light and crispy outside, airy inside. Eaten alone, dipped in soy milk, or alongside BKT and congee.',
    baseCalories: 320,
    calorieRange: { min: 160, max: 520 },
    hiddenCalories: [
      'Deep-fried in oil: each stick absorbs 60–100 kcal of oil',
      'Dipped in condensed milk or kaya: adds 40–80 kcal',
      'Larger sticks from some stalls can be 200+ kcal each',
      'Soy milk pairing (sweetened): 80–120 kcal per cup',
    ],
    macros: { protein: 6, carbs: 38, fat: 16, fiber: 1 },
    tags: ['Fried', 'Breakfast', 'Snack'],
    questions: [
      {
        id: 'quantity',
        question: 'How many sticks?',
        subtitle: 'Base estimate is for 2 sticks (one standard order)',
        type: 'single',
        options: [
          { id: 'one', label: '1 stick', icon: '1️⃣', modifier: -160 },
          { id: 'two', label: '2 sticks', desc: 'Standard order', icon: '2️⃣', modifier: 0 },
          { id: 'three', label: '3 sticks', icon: '3️⃣', modifier: 160 },
          { id: 'four', label: '4 sticks', icon: '4️⃣', modifier: 320 },
        ],
      },
      {
        id: 'dip',
        question: 'What did you dip it in?',
        subtitle: 'The dip adds surprisingly significant calories',
        type: 'single',
        options: [
          { id: 'none', label: 'Plain / nothing', icon: '✓', modifier: 0 },
          { id: 'soymilk', label: 'Sweetened soy milk', icon: '🥛', modifier: 80 },
          { id: 'kaya', label: 'Kaya jam', icon: '🍯', modifier: 60 },
          { id: 'condensed', label: 'Condensed milk', icon: '🤍', modifier: 90 },
          { id: 'bkt', label: 'BKT broth', icon: '🍖', modifier: 20 },
        ],
      },
    ],
  },

  'bak-kut-teh': {
    id: 'bak-kut-teh',
    name: 'Bak Kut Teh',
    nameLocal: '肉骨茶',
    origin: 'Singapore',
    flag: '🇸🇬',
    emoji: '🍖',
    color: '#78350F',
    bgColor: '#FEF3C7',
    description: 'Tender pork ribs slow-simmered in a peppery or herbal broth, served with rice, you tiao and dark soy sauce.',
    baseCalories: 500,
    calorieRange: { min: 350, max: 800 },
    hiddenCalories: [
      'Pork ribs have significant fat marbling: 80–150 kcal',
      'You tiao (dough fritters) are deep-fried: 150–200 kcal each',
      'Dark soy dipping sauce contains sugar: 20–40 kcal',
      'Finishing the broth adds pork fat: 40–80 kcal',
    ],
    macros: { protein: 34, carbs: 28, fat: 22, fiber: 1 },
    tags: ['Soup', 'Pork', 'Herbal'],
    questions: [
      {
        id: 'style',
        question: 'Which style?',
        subtitle: 'Klang-style is richer and darker; Teochew is lighter and peppery',
        type: 'single',
        options: [
          { id: 'teochew', label: 'Teochew (SG)', desc: 'Clear, peppery broth', icon: '🫙', modifier: 0 },
          { id: 'klang', label: 'Klang (MY)', desc: 'Dark, herbal, richer broth', icon: '🤎', modifier: 60 },
        ],
      },
      {
        id: 'ribs',
        question: 'How many ribs?',
        subtitle: 'Portion size matters most here',
        type: 'single',
        options: [
          { id: 'small', label: 'Small (3–4 ribs)', icon: '🤏', modifier: -120 },
          { id: 'regular', label: 'Regular (5–6 ribs)', icon: '👌', modifier: 0 },
          { id: 'large', label: 'Large (7+ ribs)', icon: '👐', modifier: 150 },
        ],
      },
      {
        id: 'youtiao',
        question: 'You tiao (dough fritters)?',
        subtitle: 'Each piece is deep-fried and very calorie-dense',
        type: 'single',
        options: [
          { id: 'none', label: 'None', icon: '🚫', modifier: -30 },
          { id: 'one', label: '1 piece', icon: '1️⃣', modifier: 0 },
          { id: 'two', label: '2 pieces', icon: '2️⃣', modifier: 160 },
        ],
      },
      {
        id: 'rice',
        question: 'Rice on the side?',
        type: 'single',
        options: [
          { id: 'none', label: 'No rice', icon: '🚫', modifier: -130 },
          { id: 'one', label: '1 bowl', icon: '🍚', modifier: 0 },
          { id: 'two', label: '2 bowls', icon: '🍚', modifier: 130 },
        ],
      },
    ],
  },

  'carrot-cake': {
    id: 'carrot-cake',
    name: 'Carrot Cake (Chai Tow Kueh)',
    nameLocal: '菜头粿',
    origin: 'Singapore',
    flag: '🇸🇬',
    emoji: '🟫',
    color: '#6B7280',
    bgColor: '#F3F4F6',
    description: 'Fried radish cake cubes stir-fried with eggs and preserved radish — comes black (with sweet dark sauce) or white (without).',
    baseCalories: 480,
    calorieRange: { min: 350, max: 680 },
    hiddenCalories: [
      'Wok oil used generously during frying: 80–120 kcal',
      'Black version: sweet dark sauce adds 50–80 kcal',
      'Eggs mixed in add 70–100 kcal',
      'Preserved radish (chai poh) has hidden salt and sugar',
    ],
    macros: { protein: 12, carbs: 58, fat: 20, fiber: 2 },
    tags: ['Fried', 'Egg', 'Classic'],
    questions: [
      {
        id: 'colour',
        question: 'Black or white?',
        subtitle: 'Black has sweet dark soy sauce — noticeably more calories',
        type: 'single',
        options: [
          { id: 'white', label: 'White', desc: 'No dark sauce, lighter', icon: '⬜', modifier: -50 },
          { id: 'black', label: 'Black', desc: 'With sweet dark sauce', icon: '⬛', modifier: 0 },
        ],
      },
      {
        id: 'portion',
        question: 'Portion size?',
        type: 'single',
        options: [
          { id: 'small', label: 'Small', icon: '🤏', modifier: -100 },
          { id: 'regular', label: 'Regular', desc: 'Standard hawker plate', icon: '👌', modifier: 0 },
          { id: 'large', label: 'Large', icon: '👐', modifier: 130 },
        ],
      },
      {
        id: 'egg',
        question: 'Egg style?',
        subtitle: 'More egg = more calories but also more protein',
        type: 'single',
        options: [
          { id: 'mixed', label: 'Egg mixed in', desc: 'Standard style', icon: '🥚', modifier: 0 },
          { id: 'omelette', label: 'Omelette-style', desc: 'Egg wrapped around', icon: '🍳', modifier: 30 },
          { id: 'extra', label: 'Extra egg', icon: '➕', modifier: 70 },
        ],
      },
    ],
  },

  'kaya-toast': {
    id: 'kaya-toast',
    name: 'Kaya Toast Set',
    nameLocal: '咖椰吐司',
    origin: 'Singapore',
    flag: '🇸🇬',
    emoji: '🍞',
    color: '#92400E',
    bgColor: '#FEF3C7',
    description: 'Crispy toast slathered with kaya (coconut jam) and cold butter, served with soft-boiled eggs and kopi or teh.',
    baseCalories: 420,
    calorieRange: { min: 280, max: 650 },
    hiddenCalories: [
      'Kaya spread: 60–90 kcal per serving (it\'s sugar + coconut)',
      'Cold butter slab: 50–80 kcal — often a thick slice',
      'Soft-boiled eggs with dark soy: 70–90 kcal each',
      'Kopi with condensed milk: 80–120 kcal per cup',
    ],
    macros: { protein: 10, carbs: 52, fat: 18, fiber: 1 },
    tags: ['Breakfast', 'Toast', 'Classic'],
    questions: [
      {
        id: 'bread',
        question: 'Which bread style?',
        subtitle: 'Thick toast vs thin crispier bread changes calorie count',
        type: 'single',
        options: [
          { id: 'thin', label: 'Thin crispy bread', desc: 'Traditional Ya Kun style', icon: '🍞', modifier: -40 },
          { id: 'thick', label: 'Thick toast', desc: 'Toastbox / kopitiam style', icon: '🍳', modifier: 0 },
          { id: 'wholemeal', label: 'Wholemeal', desc: 'Healthier option', icon: '🌾', modifier: -20 },
        ],
      },
      {
        id: 'kaya',
        question: 'How much kaya and butter?',
        subtitle: 'Generous spreading is very common — honest answer matters',
        type: 'single',
        options: [
          { id: 'light', label: 'Light spread', icon: '🔹', modifier: -60 },
          { id: 'normal', label: 'Normal', desc: 'Standard kopitiam amount', icon: '👌', modifier: 0 },
          { id: 'extra', label: 'Extra thick', icon: '🧈', modifier: 80 },
        ],
      },
      {
        id: 'eggs',
        question: 'Soft-boiled eggs?',
        type: 'single',
        options: [
          { id: 'none', label: 'No eggs', icon: '🚫', modifier: -80 },
          { id: 'one', label: '1 egg', icon: '1️⃣', modifier: -40 },
          { id: 'two', label: '2 eggs', desc: 'Standard set', icon: '🥚', modifier: 0 },
        ],
      },
      {
        id: 'drink',
        question: 'What drink came with it?',
        subtitle: 'The kopi adds meaningful calories — especially with condensed milk',
        type: 'single',
        options: [
          { id: 'none', label: 'No drink / water', icon: '💧', modifier: -90 },
          { id: 'kopi_o', label: 'Kopi O (black)', desc: 'Sugar only, no milk', icon: '☕', modifier: -50 },
          { id: 'kopi', label: 'Kopi', desc: 'With condensed milk', icon: '🤎', modifier: 0 },
          { id: 'kopi_c', label: 'Kopi C', desc: 'With evaporated milk', icon: '☕', modifier: -20 },
          { id: 'milo', label: 'Milo', icon: '🟫', modifier: 40 },
        ],
      },
    ],
  },

  'fishball-mee': {
    id: 'fishball-mee',
    name: 'Fishball Mee',
    nameLocal: '鱼丸面',
    origin: 'Singapore',
    flag: '🇸🇬',
    emoji: '🍜',
    color: '#0891B2',
    bgColor: '#CFFAFE',
    description: 'Springy noodles in a light, clear fish broth topped with bouncy fishballs, fishcake slices and fried shallots.',
    baseCalories: 380,
    calorieRange: { min: 280, max: 550 },
    hiddenCalories: [
      'Fried shallots on top: 30–50 kcal',
      'Chilli sauce dip: 20–40 kcal per tablespoon',
      'Fishcake slices are pan-fried and absorb oil: ~40 kcal',
      'Soup base has residual fish oil: 20–40 kcal',
    ],
    macros: { protein: 22, carbs: 52, fat: 8, fiber: 1 },
    tags: ['Noodles', 'Soup', 'Light'],
    questions: [
      {
        id: 'style',
        question: 'Soup or dry (kon lo)?',
        subtitle: 'Dry style adds chilli oil which significantly increases calories',
        type: 'single',
        options: [
          { id: 'soup', label: 'Soup', desc: 'Clear broth noodles', icon: '🍲', modifier: 0 },
          { id: 'dry', label: 'Dry (Kon Lo)', desc: 'Tossed with chilli oil', icon: '🌶️', modifier: 80 },
        ],
      },
      {
        id: 'portion',
        question: 'How many fishballs?',
        subtitle: 'Each fishball is about 30–40 kcal',
        type: 'single',
        options: [
          { id: 'small', label: '4–5 balls', desc: 'Standard set', icon: '🤏', modifier: 0 },
          { id: 'large', label: '7–8 balls', desc: 'Large set', icon: '👐', modifier: 120 },
        ],
      },
      {
        id: 'extras',
        question: 'Any extras?',
        subtitle: 'Select all that apply',
        type: 'multi',
        options: [
          { id: 'fishcake', label: 'Fishcake slices', icon: '🟡', modifier: 60 },
          { id: 'dumpling', label: 'Meat dumplings', icon: '🥟', modifier: 80 },
          { id: 'none', label: 'No extras', icon: '✓', modifier: 0, exclusive: true },
        ],
      },
    ],
  },

  'mee-pok': {
    id: 'mee-pok',
    name: 'Mee Pok',
    nameLocal: '面薄',
    origin: 'Singapore',
    flag: '🇸🇬',
    emoji: '🍝',
    color: '#D97706',
    bgColor: '#FEF3C7',
    description: 'Flat yellow egg noodles tossed dry in a savoury-vinegary sauce with minced pork, fishballs, fishcake and chilli.',
    baseCalories: 480,
    calorieRange: { min: 360, max: 650 },
    hiddenCalories: [
      'Chilli oil tossed into noodles: 60–100 kcal',
      'Pork lard crisp bits: 40–70 kcal',
      'Vinegar-soy sauce base contains sugar: 20–30 kcal',
      'Minced pork topping has hidden fat: 50–80 kcal',
    ],
    macros: { protein: 24, carbs: 58, fat: 16, fiber: 2 },
    tags: ['Noodles', 'Dry', 'Classic'],
    questions: [
      {
        id: 'oil',
        question: 'How much chilli oil?',
        subtitle: 'Chilli oil is the biggest hidden calorie in mee pok',
        type: 'single',
        options: [
          { id: 'none', label: 'No chilli', desc: 'Plain toss', icon: '🚫', modifier: -80 },
          { id: 'light', label: 'Light', icon: '🔹', modifier: -40 },
          { id: 'normal', label: 'Normal', icon: '🌶️', modifier: 0 },
          { id: 'extra', label: 'Extra spicy', icon: '🔥', modifier: 80 },
        ],
      },
      {
        id: 'toppings',
        question: 'What toppings?',
        subtitle: 'Select all that apply',
        type: 'multi',
        options: [
          { id: 'fishball', label: 'Fishballs', icon: '⚪', modifier: 60 },
          { id: 'fishcake', label: 'Fishcake', icon: '🟡', modifier: 60 },
          { id: 'dumpling', label: 'Meat dumplings', icon: '🥟', modifier: 80 },
          { id: 'none', label: 'Noodles only', icon: '✓', modifier: 0, exclusive: true },
        ],
      },
      {
        id: 'lard',
        question: 'Lard crisp on top?',
        subtitle: 'Traditional mee pok often comes with pork lard bits',
        type: 'single',
        options: [
          { id: 'no', label: 'No lard', icon: '🥗', modifier: -50 },
          { id: 'yes', label: 'With lard crisp', icon: '🍳', modifier: 0 },
        ],
      },
    ],
  },

  'bak-chor-mee': {
    id: 'bak-chor-mee',
    name: 'Bak Chor Mee',
    origin: 'Singapore',
    flag: '🇸🇬',
    emoji: '🍜',
    bgColor: '#FEF3C7',
    baseCalories: 520,
    calorieRange: { min: 400, max: 650 },
    hiddenCalories: ['Minced meat (fatty): 80–120 kcal', 'Chilli oil: 60–100 kcal', 'Pork lard bits: 40–60 kcal'],
    macros: { protein: 20, carbs: 55, fat: 16, fiber: 2 },
    questions: [
      { id: 'chilli', question: 'Chilli oil at bottom?', type: 'single', options: [
        { id: 'little', label: 'Little', icon: '🔹', modifier: -50 },
        { id: 'some', label: 'Some', icon: '👌', modifier: 0 },
        { id: 'lot', label: 'Lots', icon: '🔥', modifier: 80 },
      ]},
    ],
  },

  'chilli-crab': {
    id: 'chilli-crab',
    name: 'Chilli Crab',
    origin: 'Singapore',
    flag: '🇸🇬',
    emoji: '🦀',
    bgColor: '#FEF3C7',
    baseCalories: 450,
    calorieRange: { min: 300, max: 600 },
    hiddenCalories: ['Oil in sauce: 80–120 kcal', 'Tomato-chilli paste: 30–60 kcal', 'Egg coating: 40–70 kcal'],
    macros: { protein: 28, carbs: 15, fat: 24, fiber: 2 },
    questions: [
      { id: 'sauce', question: 'Sauce cling?', type: 'single', options: [
        { id: 'light', label: 'Light', icon: '🔹', modifier: -100 },
        { id: 'normal', label: 'Normal', icon: '👌', modifier: 0 },
        { id: 'drenched', label: 'Drenched', icon: '🔥', modifier: 120 },
      ]},
    ],
  },
}

export const FEATURED_DISH_IDS = [
  // Singapore
  'chicken-rice', 'char-kway-teow', 'laksa', 'cai-png', 'hokkien-mee', 'satay', 'bak-chor-mee', 'chilli-crab', 'fishball-mee', 'mee-pok', 'kaya-toast', 'bak-kut-teh', 'carrot-cake', 'you-tiao',
  // Malaysia
  'nasi-lemak', 'rendang', 'mee-goreng', 'teh-tarik',
  // Thailand
  'pad-thai', 'tom-yum', 'green-curry', 'pad-krapow', 'thai-milk-tea',
  // Indonesia
  'nasi-goreng', 'gado-gado', 'soto-ayam',
  // Vietnam
  'pho', 'banh-mi', 'bun-cha', 'com-tam', 'spring-rolls', 'pho-ga',
  // Philippines
  'adobo', 'lumpia-ph', 'sinigang', 'lechon', 'kare-kare', 'sisig',
  // Beverages
  'bubble-tea', 'roti-prata',
]

export const MEAL_TYPES = [
  { id: 'breakfast', label: 'Breakfast', icon: '🌅', time: '6–11am' },
  { id: 'lunch', label: 'Lunch', icon: '☀️', time: '11am–3pm' },
  { id: 'dinner', label: 'Dinner', icon: '🌙', time: '3–10pm' },
  { id: 'snack', label: 'Snack', icon: '🍵', time: 'Anytime' },
]

export function getMealForTime() {
  const h = new Date().getHours()
  if (h >= 6 && h < 11) return 'breakfast'
  if (h >= 11 && h < 15) return 'lunch'
  if (h >= 15 && h < 22) return 'dinner'
  return 'snack'
}

export function mockDetect() {
  // Pick random dish from all 35+ available dishes (or from featured if not found in DISHES)
  const allDishIds = Object.keys(DISHES)
  const id = allDishIds[Math.floor(Math.random() * allDishIds.length)]
  return {
    dishId: id,
    confidence: Math.round((0.76 + Math.random() * 0.21) * 100),
  }
}
