require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./src/models/Category');
const Product = require('./src/models/Product');

const ZODIAC_STONES_DATA = [
  {
    name: "Carnelian",
    price: 499,
    originalPrice: 799,
    association: "Traditionally associated with confidence, motivation and creative energy.",
    bestFor: "Confidence, courage, creative momentum",
    howToUse: "Wear as a bracelet or keep in your workspace. Hold during moments that need courage.",
    care: "Rinse under cool water monthly. Keep out of prolonged direct sunlight.",
    zodiacNote: "A Mars-ruled stone — traditionally worn by Aries and Leo.",
    image: "https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?w=600&h=600&fit=crop",
    zodiacSigns: ["Aries"]
  },
  {
    name: "Clear Quartz",
    price: 349,
    originalPrice: 599,
    association: "Commonly used for intention-setting and mental clarity.",
    bestFor: "Intention-setting, clarity, amplifying focus",
    howToUse: "Hold while stating an intention. Place on a desk or meditation altar.",
    care: "Rinse in cool water. Avoid leaving in direct sun for long periods.",
    zodiacNote: "A universal stone — pairs with every sign, especially Fire.",
    image: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=600&h=600&fit=crop",
    zodiacSigns: ["Aries", "Virgo"]
  },
  {
    name: "Amethyst",
    price: 499,
    originalPrice: 799,
    association: "Often selected for calm and emotional balance.",
    bestFor: "Calm, sleep, emotional balance",
    howToUse: "Place on a bedside table or carry in your pocket on stressful days.",
    care: "Cleanse under cool water. Keep away from direct sun to preserve colour.",
    zodiacNote: "A calming counterweight for Aries' Fire — traditionally used to soften impulsiveness.",
    image: "https://images.unsplash.com/photo-1602928321679-560bb453f190?w=600&h=600&fit=crop",
    zodiacSigns: ["Aries", "Aquarius", "Pisces"]
  },
  {
    name: "Rose Quartz",
    price: 399,
    originalPrice: 699,
    association: "Often used for self-love, gentleness and emotional warmth.",
    bestFor: "Self-love, heart healing, gentle relationships",
    howToUse: "Keep beside your bed or in a handbag. Hold when you need to soften your own inner voice.",
    care: "Rinse in cool water monthly. Avoid harsh chemicals and prolonged sun.",
    zodiacNote: "A Venus-aligned stone — traditionally worn by Taurus and Libra.",
    image: "https://images.unsplash.com/photo-1602928321679-560bb453f190?w=600&h=600&fit=crop",
    zodiacSigns: ["Taurus", "Libra"]
  },
  {
    name: "Green Aventurine",
    price: 449,
    originalPrice: 699,
    association: "Traditionally associated with prosperity and steady growth.",
    bestFor: "Abundance, career growth, opportunity",
    howToUse: "Carry in a wallet or pocket. Place on a desk when working on long-term goals.",
    care: "Wipe with a soft cloth. Rinse occasionally in cool water.",
    zodiacNote: "An Earth-friendly stone — often paired with Taurus and Virgo.",
    image: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbc5cb?w=600&h=600&fit=crop",
    zodiacSigns: ["Taurus"]
  },
  {
    name: "Emerald",
    price: 899,
    originalPrice: 1499,
    association: "Valued as a stone of harmony and heart-centred abundance.",
    bestFor: "Harmony, loyalty, deep emotional clarity",
    howToUse: "Wear close to the heart as a pendant, or keep in a jewellery box during reflection.",
    care: "Avoid ultrasonic cleaners. Wipe gently with a soft, dry cloth.",
    zodiacNote: "A Venus-ruled stone — traditionally connected to Taurus' ruler.",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&h=600&fit=crop",
    zodiacSigns: ["Taurus"]
  },
  {
    name: "Agate",
    price: 449,
    originalPrice: 699,
    association: "Commonly used to support focus and ground mental energy.",
    bestFor: "Focus, grounding, steadying a busy mind",
    howToUse: "Keep in a pocket or on a study desk. Hold briefly before focused work.",
    care: "Rinse in cool water. Avoid harsh chemicals and ultrasonic cleaners.",
    zodiacNote: "An Air-friendly stone — often paired with Gemini and Virgo.",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&h=600&fit=crop",
    zodiacSigns: ["Gemini"]
  },
  {
    name: "Citrine",
    price: 599,
    originalPrice: 999,
    association: "Traditionally linked to mental clarity and positive expression.",
    bestFor: "Clarity, optimism, confident communication",
    howToUse: "Keep on your desk or in a workspace. Ideal for writers, speakers and students.",
    care: "Keep out of direct sun — colour can fade. Wipe with a soft cloth.",
    zodiacNote: "A Mercury-aligned stone — often associated with Gemini.",
    image: "https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?w=600&h=600&fit=crop",
    zodiacSigns: ["Gemini", "Leo"]
  },
  {
    name: "Sodalite",
    price: 449,
    originalPrice: 699,
    association: "Often chosen for clear communication and logical thinking.",
    bestFor: "Communication, logic, calm expression",
    howToUse: "Carry in a pocket before meetings or presentations. Hold when speaking.",
    care: "Rinse in cool water. Keep away from prolonged heat or sun.",
    zodiacNote: "Often paired with Gemini and Sagittarius for clarity in speech.",
    image: "https://images.unsplash.com/photo-1602928321679-560bb453f190?w=600&h=600&fit=crop",
    zodiacSigns: ["Gemini", "Sagittarius"]
  },
  {
    name: "Moonstone",
    price: 699,
    originalPrice: 1099,
    association: "Traditionally associated with emotional balance and intuition.",
    bestFor: "Intuition, hormonal balance, calm emotions",
    howToUse: "Wear close to the skin or keep on a bedside table. Ideal during transition periods.",
    care: "Cleanse gently under cool water. Avoid prolonged direct sun.",
    zodiacNote: "A Moon-ruled stone — traditionally aligned with Cancer.",
    image: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbc5cb?w=600&h=600&fit=crop",
    zodiacSigns: ["Cancer", "Pisces"]
  },
  {
    name: "Pearl",
    price: 799,
    originalPrice: 1299,
    association: "Valued as a gentle stone of calm and feminine energy.",
    bestFor: "Calm, feminine energy, emotional steadiness",
    howToUse: "Wear as a necklace or ring. Traditionally worn during important transitions.",
    care: "Wipe with a soft dry cloth. Keep away from perfume and chemicals.",
    zodiacNote: "A Moon-ruled gem — long associated with Cancer.",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&h=600&fit=crop",
    zodiacSigns: ["Cancer"]
  },
  {
    name: "Selenite",
    price: 649,
    originalPrice: 999,
    association: "Often used to cleanse emotional space and promote peace.",
    bestFor: "Cleansing, emotional release, peaceful space",
    howToUse: "Place in a room to cleanse the atmosphere. Sweep through aura space — not on the body.",
    care: "Never rinse in water — selenite dissolves. Wipe with a dry cloth.",
    zodiacNote: "A Moon-aligned stone — often paired with Cancer for calm.",
    image: "https://images.unsplash.com/photo-1602928321679-560bb453f190?w=600&h=600&fit=crop",
    zodiacSigns: ["Cancer"]
  },
  {
    name: "Tiger's Eye",
    price: 549,
    originalPrice: 849,
    association: "Traditionally associated with confidence, courage and willpower.",
    bestFor: "Confidence, willpower, decisive action",
    howToUse: "Wear as a bracelet or ring. Keep on your desk when managing projects.",
    care: "Rinse under cool water monthly. Avoid harsh household cleaning agents.",
    zodiacNote: "A solar-aligned stone — traditionally paired with Leo's fire.",
    image: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbc5cb?w=600&h=600&fit=crop",
    zodiacSigns: ["Leo"]
  },
  {
    name: "Sunstone",
    price: 649,
    originalPrice: 999,
    association: "Linked to warmth, enthusiasm and self-expression.",
    bestFor: "Optimism, leadership, creative warmth",
    howToUse: "Carry during public-facing events. Hold when you need to reconnect with warmth.",
    care: "Wipe with a soft cloth. Keep out of extreme heat.",
    zodiacNote: "Directly aligned with the Sun — Leo's ruling luminary.",
    image: "https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?w=600&h=600&fit=crop",
    zodiacSigns: ["Leo"]
  },
  {
    name: "Amazonite",
    price: 549,
    originalPrice: 849,
    association: "Commonly used for calming an analytical mind and easing worry.",
    bestFor: "Calming overthinking, nervous system, clear expression",
    howToUse: "Hold while journaling or during meditation. Place on a nightstand to calm busy thoughts.",
    care: "Rinse in cool water. Keep out of direct sun to prevent colour changes.",
    zodiacNote: "A gentle counterweight for Virgo's high mental activity.",
    image: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=600&h=600&fit=crop",
    zodiacSigns: ["Virgo"]
  },
  {
    name: "Peridot",
    price: 699,
    originalPrice: 1099,
    association: "Traditionally linked to releasing criticism and opening to joy.",
    bestFor: "Lightness, releasing self-criticism, heart ease",
    howToUse: "Wear as a ring or pendant. Keep near plants or in a sunlit corner.",
    care: "Avoid steam and ultrasonic cleaners. Cleanse gently with warm soapy water.",
    zodiacNote: "The traditional August birthstone — intimately connected to Virgo.",
    image: "https://images.unsplash.com/photo-1602928321679-560bb453f190?w=600&h=600&fit=crop",
    zodiacSigns: ["Virgo"]
  },
  {
    name: "Lapis Lazuli",
    price: 799,
    originalPrice: 1299,
    association: "Traditionally linked to inner wisdom, truth and balanced judgment.",
    bestFor: "Clear decision-making, inner truth, balanced perspective",
    howToUse: "Hold while making important decisions. Place in a study or library space.",
    care: "Do not submerge in water — lapis is porous. Wipe with a dry cloth.",
    zodiacNote: "Supports Libra's quest for fairness, justice and balanced choices.",
    image: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbc5cb?w=600&h=600&fit=crop",
    zodiacSigns: ["Libra", "Sagittarius"]
  },
  {
    name: "Opal",
    price: 899,
    originalPrice: 1499,
    association: "Valued for emotional balance, creativity and harmonious relationships.",
    bestFor: "Emotional harmony, creative expression, relationship ease",
    howToUse: "Wear with awareness. Keep in a fabric-lined pouch when not being worn.",
    care: "Avoid extreme temperature changes and dry environments. Store away from strong chemicals.",
    zodiacNote: "The October birthstone — deeply tied to Libra's aesthetic nature.",
    image: "https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?w=600&h=600&fit=crop",
    zodiacSigns: ["Libra"]
  },
  {
    name: "Black Tourmaline",
    price: 499,
    originalPrice: 799,
    association: "Widely selected for energetic protection and emotional boundaries.",
    bestFor: "Protection, boundary-setting, absorbing negativity",
    howToUse: "Place near entryways or on a desk. Carry in a bag when in crowded environments.",
    care: "Cleanse regularly with smoke or running water. Keep separate from softer stones.",
    zodiacNote: "An essential grounding anchor for Scorpio's deep emotional intensity.",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&h=600&fit=crop",
    zodiacSigns: ["Scorpio", "Capricorn"]
  },
  {
    name: "Obsidian",
    price: 449,
    originalPrice: 699,
    association: "Often chosen for deep shadow work, honesty and releasing tension.",
    bestFor: "Shadow work, emotional honesty, breaking patterns",
    howToUse: "Hold during quiet reflection. Place on an altar during transformative life phases.",
    care: "Rinse under running water. Avoid dropping — glass-like structure can chip.",
    zodiacNote: "Resonates with Pluto's transformative energy — Scorpio's modern ruler.",
    image: "https://images.unsplash.com/photo-1602928321679-560bb453f190?w=600&h=600&fit=crop",
    zodiacSigns: ["Scorpio"]
  },
  {
    name: "Labradorite",
    price: 749,
    originalPrice: 1199,
    association: "Known for its iridescent flash, associated with intuition and perspective.",
    bestFor: "Intuition, perception, navigating deep transformation",
    howToUse: "Carry when navigating changes. Keep on a workspace to stimulate creative depth.",
    care: "Cleanse with cool water. Avoid ultrasonic cleaners and sudden temperature shifts.",
    zodiacNote: "Pairs beautifully with Scorpio's intuitive, mysterious nature.",
    image: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=600&h=600&fit=crop",
    zodiacSigns: ["Scorpio", "Aquarius"]
  },
  {
    name: "Turquoise",
    price: 699,
    originalPrice: 1099,
    association: "Traditionally carried by travellers for protection and honest expression.",
    bestFor: "Travel protection, honest communication, expansive vision",
    howToUse: "Wear as a pendant or bracelet, especially while travelling or exploring new projects.",
    care: "Wipe with a soft cloth. Keep away from lotions, perfumes and harsh chemicals.",
    zodiacNote: "The December birthstone — a classic match for Sagittarius.",
    image: "https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?w=600&h=600&fit=crop",
    zodiacSigns: ["Sagittarius"]
  },
  {
    name: "Garnet",
    price: 699,
    originalPrice: 1099,
    association: "Linked to sustained energy, perseverance and grounded ambition.",
    bestFor: "Perseverance, physical stamina, commitment to goals",
    howToUse: "Wear as jewellery or keep on your work desk when working through a demanding phase.",
    care: "Cleanse under cool water. Avoid leaving in intense heat.",
    zodiacNote: "The January birthstone — mirrors Capricorn's steady, unyielding determination.",
    image: "https://images.unsplash.com/photo-1602928321679-560bb453f190?w=600&h=600&fit=crop",
    zodiacSigns: ["Capricorn"]
  },
  {
    name: "Smoky Quartz",
    price: 549,
    originalPrice: 849,
    association: "Often selected for grounded calm and releasing heavy responsibility.",
    bestFor: "Stress relief, practical grounding, letting go of burdens",
    howToUse: "Keep on an office desk or hold when feeling weighed down by obligations.",
    care: "Rinse under cool water. Avoid prolonged direct sun to preserve depth of colour.",
    zodiacNote: "Softens Saturn's heavy energy — an ideal companion for Capricorn.",
    image: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbc5cb?w=600&h=600&fit=crop",
    zodiacSigns: ["Capricorn"]
  },
  {
    name: "Aquamarine",
    price: 849,
    originalPrice: 1399,
    association: "A stone of clear, calm thought and flowing communication.",
    bestFor: "Clear communication, calm reflection, original thinking",
    howToUse: "Wear close to the throat. Hold before public speaking or group discussions.",
    care: "Rinse in cool soapy water. Store separately from harder stones.",
    zodiacNote: "The traditional March birthstone — aligned with Aquarius and Pisces.",
    image: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=600&h=600&fit=crop",
    zodiacSigns: ["Aquarius", "Pisces"]
  }
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  let cat = await Category.findOne({ name: /crystal|gemstone/i });
  if (!cat) {
    cat = await Category.create({
      name: "Crystals & Gemstones",
      slug: "crystals-gemstones",
      description: "Natural healing crystals and stones"
    });
  }

  let createdCount = 0;
  let updatedCount = 0;

  for (const s of ZODIAC_STONES_DATA) {
    const existing = await Product.findOne({
      $or: [
        { name: new RegExp(`^${s.name}$`, 'i') },
        { slug: new RegExp(`^${s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`, 'i') }
      ]
    });

    const features = [s.bestFor, s.howToUse, s.care, s.zodiacNote].filter(Boolean);

    if (existing) {
      existing.zodiacSigns = s.zodiacSigns;
      existing.association = s.association;
      existing.bestFor = s.bestFor;
      existing.howToUse = s.howToUse;
      existing.care = s.care;
      existing.zodiacNote = s.zodiacNote;
      if (!existing.images || existing.images.length === 0) existing.images = [s.image];
      if (!existing.features || existing.features.length === 0) existing.features = features;
      if (!existing.shortDescription) existing.shortDescription = s.association;
      if (!existing.originalPrice) existing.originalPrice = s.originalPrice;
      if (existing.stock === undefined || existing.stock === 0) existing.stock = 50;
      await existing.save();
      updatedCount++;
    } else {
      const cleanSlug = s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      await Product.create({
        name: s.name,
        slug: `${cleanSlug}-${Date.now().toString(36)}`,
        price: s.price,
        originalPrice: s.originalPrice,
        category: cat._id,
        description: `${s.association} Best for: ${s.bestFor}. Care: ${s.care}. ${s.zodiacNote}`,
        shortDescription: s.association,
        images: [s.image],
        stock: 50,
        isActive: true,
        isFeatured: true,
        badge: 'Popular',
        features,
        zodiacSigns: s.zodiacSigns,
        association: s.association,
        bestFor: s.bestFor,
        howToUse: s.howToUse,
        care: s.care,
        zodiacNote: s.zodiacNote
      });
      createdCount++;
    }
  }

  console.log(`Seeding complete! Created: ${createdCount}, Updated: ${updatedCount}`);
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
