export const PLANTS = [
  // Beginner Plants
  {
    id: 'pothos',
    name: 'Pothos',
    scientific: 'Epipremnum aureum',
    category: 'Beginner',
    difficulty: 'Beginner-Friendly',
    light: 'Low to Bright Indirect',
    water: 'Every 1–2 Weeks',
    humidity: 'Average to High',
    petSafe: false,
    growthRate: 'Fast',
    description: 'The ultimate survivor. Pothos thrives in almost any condition, making it the perfect starting point for new plant parents. Its trailing vines add a lush, tropical feel to any space.',
    problems: [
      { symptom: 'Yellow Leaves', cause: 'Overwatering or old age', solution: 'Allow soil to dry out between waterings. Check drainage.' },
      { symptom: 'Brown Tips', cause: 'Low humidity or fluoride in water', solution: 'Mist leaves or use distilled water.' },
      { symptom: 'Leggy Growth', cause: 'Insufficient light', solution: 'Move to a brighter spot with indirect light.' }
    ],
    habitat: 'Low-maintenance tropical'
  },
  {
    id: 'snake-plant',
    name: 'Snake Plant',
    scientific: 'Sansevieria trifasciata',
    category: 'Beginner',
    difficulty: 'Beginner-Friendly',
    light: 'Low to Bright Indirect',
    water: 'Every 2–3 Weeks',
    humidity: 'Low to Average',
    petSafe: false,
    growthRate: 'Slow',
    description: 'Architectural and air-purifying, the Snake Plant is virtually indestructible. Its upright, sword-like leaves bring a sculptural elegance to any room.',
    problems: [
      { symptom: 'Mushy Leaves', cause: 'Root rot from overwatering', solution: 'Let soil dry completely. Repot if necessary.' },
      { symptom: 'Curling Leaves', cause: 'Thrips or underwatering', solution: 'Inspect for pests and water deeply.' }
    ],
    habitat: 'Low-maintenance tropical'
  },
  {
    id: 'zz-plant',
    name: 'ZZ Plant',
    scientific: 'Zamioculcas zamiifolia',
    category: 'Beginner',
    difficulty: 'Beginner-Friendly',
    light: 'Low to Bright Indirect',
    water: 'Every 2–3 Weeks',
    humidity: 'Low to Average',
    petSafe: false,
    growthRate: 'Slow',
    description: 'Sleek and modern, the ZZ Plant is the definition of low-maintenance. It tolerates neglect and low light with grace.',
    problems: [
      { symptom: 'Yellow Stems', cause: 'Overwatering', solution: 'Reduce watering frequency significantly.' },
      { symptom: 'Drooping', cause: 'Underwatering or cold draft', solution: 'Water thoroughly and move away from drafts.' }
    ],
    habitat: 'Low-maintenance tropical'
  },
  {
    id: 'spider-plant',
    name: 'Spider Plant',
    scientific: 'Chlorophytum comosum',
    category: 'Beginner',
    difficulty: 'Beginner-Friendly',
    light: 'Bright Indirect',
    water: 'Every 1–2 Weeks',
    humidity: 'Average',
    petSafe: true,
    growthRate: 'Fast',
    description: 'A classic houseplant that produces charming baby "spiderettes." It\'s forgiving, pet-safe, and wonderfully decorative.',
    problems: [
      { symptom: 'Brown Tips', cause: 'Chemicals in water', solution: 'Use rainwater or filtered water.' },
      { symptom: 'Pale Leaves', cause: 'Too much direct sun', solution: 'Move to a spot with filtered light.' }
    ],
    habitat: 'Low-maintenance tropical'
  },
  {
    id: 'heartleaf-philodendron',
    name: 'Heartleaf Philodendron',
    scientific: 'Philodendron hederaceum',
    category: 'Beginner',
    difficulty: 'Beginner-Friendly',
    light: 'Low to Bright Indirect',
    water: 'Every 1–2 Weeks',
    humidity: 'Average to High',
    petSafe: false,
    growthRate: 'Fast',
    description: 'With its deep green, heart-shaped leaves, this Philodendron is a forgiving climber that thrives on neglect.',
    problems: [
      { symptom: 'Yellow Leaves', cause: 'Overwatering', solution: 'Allow top inch of soil to dry.' },
      { symptom: 'Leggy Vines', cause: 'Low light', solution: 'Provide more indirect light.' }
    ],
    habitat: 'Low-maintenance tropical'
  },

  // Tropical Plants
  {
    id: 'monstera',
    name: 'Monstera Deliciosa',
    scientific: 'Monstera deliciosa',
    category: 'Tropical',
    difficulty: 'Easy to Moderate',
    light: 'Bright Indirect',
    water: 'Every 1–2 Weeks',
    humidity: 'Moderate to High',
    petSafe: false,
    growthRate: 'Fast',
    description: 'The iconic "Swiss Cheese Plant." Its massive, fenestrated leaves bring instant jungle vibes to any space. A true statement piece.',
    problems: [
      { symptom: 'No Holes in Leaves', cause: 'Insufficient light or maturity', solution: 'Increase light and ensure the plant is mature.' },
      { symptom: 'Yellow Leaves', cause: 'Overwatering', solution: 'Let soil dry between waterings.' },
      { symptom: 'Brown Spots', cause: 'Bacterial leaf spot or sunburn', solution: 'Move away from direct sun and improve airflow.' }
    ],
    habitat: 'Lush rainforest'
  },
  {
    id: 'bird-of-paradise',
    name: 'Bird of Paradise',
    scientific: 'Strelitzia reginae',
    category: 'Tropical',
    difficulty: 'Moderate',
    light: 'Bright Indirect to Direct',
    water: 'Every 1–2 Weeks',
    humidity: 'Moderate to High',
    petSafe: false,
    growthRate: 'Moderate',
    description: 'Majestic and architectural, the Bird of Paradise brings resort-level luxury to your home. Its banana-like leaves make a powerful statement.',
    problems: [
      { symptom: 'Splitting Leaves', cause: 'Natural or low humidity', solution: 'Increase humidity or enjoy the natural look!' },
      { symptom: 'Brown Edges', cause: 'Low humidity or underwatering', solution: 'Mist regularly and check soil moisture.' }
    ],
    habitat: 'Lush rainforest'
  },
  {
    id: 'alocasia',
    name: 'Alocasia',
    scientific: 'Alocasia spp.',
    category: 'Tropical',
    difficulty: 'Moderate to Expert',
    light: 'Bright Indirect',
    water: 'Every 1 Week',
    humidity: 'High',
    petSafe: false,
    growthRate: 'Moderate',
    description: 'Arrow-shaped leaves with stunning veining patterns. Alocasias are dramatic divas that reward attentive plant parents with breathtaking foliage.',
    problems: [
      { symptom: 'Drooping', cause: 'Low humidity or underwatering', solution: 'Increase humidity with a humidifier or pebble tray.' },
      { symptom: 'Yellowing', cause: 'Overwatering or temperature shock', solution: 'Maintain consistent temperature and reduce watering.' }
    ],
    habitat: 'Lush rainforest'
  },
  {
    id: 'anthurium',
    name: 'Anthurium',
    scientific: 'Anthurium andraeanum',
    category: 'Tropical',
    difficulty: 'Moderate',
    light: 'Bright Indirect',
    water: 'Every 1–2 Weeks',
    humidity: 'Moderate to High',
    petSafe: false,
    growthRate: 'Moderate',
    description: 'Glossy, heart-shaped spathes in vibrant reds, pinks, and whites. Anthuriums bloom almost continuously with proper care.',
    problems: [
      { symptom: 'No Flowers', cause: 'Insufficient light or nutrients', solution: 'Provide brighter indirect light and feed monthly.' },
      { symptom: 'Brown Spots on Flowers', cause: 'Bacterial infection or overhead watering', solution: 'Water at the base and improve airflow.' }
    ],
    habitat: 'Lush rainforest'
  },

  // Desert Plants
  {
    id: 'cactus',
    name: 'Cactus',
    scientific: 'Cactaceae spp.',
    category: 'Desert',
    difficulty: 'Beginner-Friendly',
    light: 'Direct Sun',
    water: 'Every 2–4 Weeks',
    humidity: 'Low',
    petSafe: true,
    growthRate: 'Slow',
    description: 'The ultimate drought-tolerant plant. Cacti come in infinite shapes and sizes, bringing desert beauty to your windowsill.',
    problems: [
      { symptom: 'Soft/Mushy Base', cause: 'Root rot from overwatering', solution: 'Stop watering immediately. Repot in dry, gritty soil.' },
      { symptom: 'Shriveling', cause: 'Underwatering or root damage', solution: 'Check roots and water deeply.' }
    ],
    habitat: 'Rock formations and dry terrain'
  },
  {
    id: 'aloe-vera',
    name: 'Aloe Vera',
    scientific: 'Aloe barbadensis miller',
    category: 'Desert',
    difficulty: 'Beginner-Friendly',
    light: 'Bright Indirect to Direct',
    water: 'Every 2–3 Weeks',
    humidity: 'Low',
    petSafe: false,
    growthRate: 'Moderate',
    description: 'A soothing succulent with thick, gel-filled leaves. Beautiful, practical, and wonderfully easy to care for.',
    problems: [
      { symptom: 'Brown/Red Tips', cause: 'Too much sun', solution: 'Provide some afternoon shade.' },
      { symptom: 'Soft Leaves', cause: 'Overwatering', solution: 'Let soil dry completely between waterings.' }
    ],
    habitat: 'Rock formations and dry terrain'
  },
  {
    id: 'echeveria',
    name: 'Echeveria',
    scientific: 'Echeveria spp.',
    category: 'Desert',
    difficulty: 'Easy to Moderate',
    light: 'Direct Sun',
    water: 'Every 2 Weeks',
    humidity: 'Low',
    petSafe: true,
    growthRate: 'Slow',
    description: 'Rosette-forming succulents in stunning pastel shades. Their geometric beauty makes them irresistible collectors\' plants.',
    problems: [
      { symptom: 'Stretching (Etiolation)', cause: 'Insufficient light', solution: 'Move to a sunnier location gradually.' },
      { symptom: 'Mushy Bottom Leaves', cause: 'Overwatering', solution: 'Reduce watering and check soil drainage.' }
    ],
    habitat: 'Rock formations and dry terrain'
  },
  {
    id: 'jade-plant',
    name: 'Jade Plant',
    scientific: 'Crassula ovata',
    category: 'Desert',
    difficulty: 'Beginner-Friendly',
    light: 'Bright Indirect to Direct',
    water: 'Every 2–3 Weeks',
    humidity: 'Low',
    petSafe: false,
    growthRate: 'Slow',
    description: 'A symbol of good luck, the Jade Plant\'s thick, glossy leaves and tree-like form bring warmth and positivity to any space.',
    problems: [
      { symptom: 'Leaf Drop', cause: 'Overwatering or cold draft', solution: 'Adjust watering schedule and protect from cold.' },
      { symptom: 'Leggy Growth', cause: 'Insufficient light', solution: 'Move to brighter light.' }
    ],
    habitat: 'Rock formations and dry terrain'
  },

  // Rare Collector Plants
  {
    id: 'variegated-monstera',
    name: 'Variegated Monstera',
    scientific: 'Monstera deliciosa var. borsigiana',
    category: 'Rare Collector',
    difficulty: 'Expert',
    light: 'Bright Indirect',
    water: 'Every 1–2 Weeks',
    humidity: 'Moderate to High',
    petSafe: false,
    growthRate: 'Moderate',
    description: 'The crown jewel of plant collecting. Stunning white and green variegation makes every leaf a unique masterpiece. Extremely sought after.',
    problems: [
      { symptom: 'Browning Variegation', cause: 'Insufficient light or root issues', solution: 'Ensure bright indirect light and healthy roots.' },
      { symptom: 'Losing Variegation', cause: 'Insufficient light', solution: 'Provide more light to maintain variegation.' }
    ],
    habitat: 'Luxury glass display'
  },
  {
    id: 'pink-princess',
    name: 'Pink Princess Philodendron',
    scientific: 'Philodendron erubescens',
    category: 'Rare Collector',
    difficulty: 'Moderate to Expert',
    light: 'Bright Indirect',
    water: 'Every 1–2 Weeks',
    humidity: 'Moderate to High',
    petSafe: false,
    growthRate: 'Moderate',
    description: 'Dark burgundy leaves splashed with bubblegum pink. The Pink Princess is a TikTok sensation that lives up to the hype.',
    problems: [
      { symptom: 'Low Pink', cause: 'Insufficient light', solution: 'Provide brighter indirect light to bring out pink.' },
      { symptom: 'Brown Edges', cause: 'Low humidity', solution: 'Increase humidity with a humidifier.' }
    ],
    habitat: 'Luxury glass display'
  },
  {
    id: 'thai-constellation',
    name: 'Thai Constellation Monstera',
    scientific: 'Monstera deliciosa "Thai Constellation"',
    category: 'Rare Collector',
    difficulty: 'Moderate',
    light: 'Bright Indirect',
    water: 'Every 1–2 Weeks',
    humidity: 'Moderate to High',
    petSafe: false,
    growthRate: 'Moderate',
    description: 'Tissue-cultured in Thailand, this stable variegation produces creamy speckles across massive fenestrated leaves. A true collector\'s dream.',
    problems: [
      { symptom: 'Browning Cream', cause: 'Too much direct sun', solution: 'Provide bright indirect light only.' },
      { symptom: 'Slow Growth', cause: 'Underfeeding or rootbound', solution: 'Feed monthly during growing season.' }
    ],
    habitat: 'Luxury glass display'
  },

  // Pet-Friendly Plants
  {
    id: 'calathea',
    name: 'Calathea',
    scientific: 'Calathea spp.',
    category: 'Pet-Friendly',
    difficulty: 'Moderate to Expert',
    light: 'Low to Medium Indirect',
    water: 'Every 1 Week',
    humidity: 'High',
    petSafe: true,
    growthRate: 'Moderate',
    description: 'Stunning patterned leaves that move with the sun (prayer plant family). A diva that rewards high humidity with breathtaking foliage.',
    problems: [
      { symptom: 'Crispy Leaf Edges', cause: 'Low humidity or tap water chemicals', solution: 'Use distilled water and increase humidity.' },
      { symptom: 'Fading Patterns', cause: 'Too much light', solution: 'Move to a shadier spot.' }
    ],
    habitat: 'Safe family plant'
  },
  {
    id: 'prayer-plant',
    name: 'Prayer Plant',
    scientific: 'Maranta leuconeura',
    category: 'Pet-Friendly',
    difficulty: 'Easy to Moderate',
    light: 'Low to Medium Indirect',
    water: 'Every 1 Week',
    humidity: 'Moderate to High',
    petSafe: true,
    growthRate: 'Moderate',
    description: 'Fascinating leaves that fold upward at night like hands in prayer. The intricate red veining pattern is utterly captivating.',
    problems: [
      { symptom: 'Leaves Not Folding', cause: 'Normal in some conditions', solution: 'Ensure proper light cycle and humidity.' },
      { symptom: 'Brown Leaves', cause: 'Low humidity or chemicals', solution: 'Use filtered water and mist regularly.' }
    ],
    habitat: 'Safe family plant'
  },
  {
    id: 'parlor-palm',
    name: 'Parlor Palm',
    scientific: 'Chamaedorea elegans',
    category: 'Pet-Friendly',
    difficulty: 'Beginner-Friendly',
    light: 'Low to Medium Indirect',
    water: 'Every 1–2 Weeks',
    humidity: 'Average to High',
    petSafe: true,
    growthRate: 'Slow',
    description: 'A Victorian parlor favorite that thrives in low light. Its delicate, feathery fronds bring instant tropical elegance.',
    problems: [
      { symptom: 'Yellowing Fronds', cause: 'Overwatering', solution: 'Allow top inch of soil to dry.' },
      { symptom: 'Brown Tips', cause: 'Low humidity or dry air', solution: 'Mist regularly or place on a humidity tray.' }
    ],
    habitat: 'Safe family plant'
  },
  {
    id: 'peperomia',
    name: 'Peperomia',
    scientific: 'Peperomia spp.',
    category: 'Pet-Friendly',
    difficulty: 'Beginner-Friendly',
    light: 'Medium to Bright Indirect',
    water: 'Every 1–2 Weeks',
    humidity: 'Average',
    petSafe: true,
    growthRate: 'Slow',
    description: 'Compact, colorful, and endlessly varied. Peperomias are perfect for small spaces and come in fascinating shapes and textures.',
    problems: [
      { symptom: 'Soft Leaves', cause: 'Overwatering', solution: 'Let soil dry between waterings.' },
      { symptom: 'Falling Leaves', cause: 'Temperature shock', solution: 'Keep away from cold drafts and heaters.' }
    ],
    habitat: 'Safe family plant'
  }
];

export const SYMPTOMS = [
  'Yellow Leaves',
  'Brown Tips',
  'Brown Spots',
  'Drooping',
  'Root Rot',
  'Pests',
  'Slow Growth',
  'Leaf Drop',
  'Crispy Edges',
  'Fading Color'
];

export const LIGHT_LEVELS = ['Low Light', 'Medium Light', 'Bright Indirect', 'Direct Sun'];
export const PLANT_TYPES = ['Tropical', 'Succulent/Cactus', 'Fern', 'Flowering'];
export const POT_SIZES = ['Small (2-4")', 'Medium (6-8")', 'Large (10-12")', 'Extra Large (14"+)'];
export const CLIMATES = ['Dry/Arid', 'Average', 'Humid'];
