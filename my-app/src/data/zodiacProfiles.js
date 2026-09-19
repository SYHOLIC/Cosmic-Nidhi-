// ============================================================================
// ZODIAC PROFILES — rich data for the shopping journey
// Fields per crystal: association, bestFor, howToUse, care, zodiacNote,
//                     image, price, shopSlug
// ============================================================================

export const ZODIAC_PROFILES = {
  /* ============================================================
     ARIES — Fire
  ============================================================ */
  Aries: {
    symbol: "♈",
    dates: "March 21 – April 19",
    element: "Fire",
    traits: ["Bold", "Energetic", "Independent", "Pioneering"],
    strengths: ["Courageous", "Determined", "Confident", "Enthusiastic"],
    challenges: ["Impulsive", "Impatient", "Short-tempered", "Restless"],
    crystals: [
      {
        name: "Carnelian",
        association:
          "Traditionally associated with confidence, motivation and creative energy.",
        bestFor: "Confidence, courage, creative momentum",
        howToUse:
          "Wear as a bracelet or keep in your workspace. Hold during moments that need courage.",
        care: "Rinse under cool water monthly. Keep out of prolonged direct sunlight.",
        zodiacNote: "A Mars-ruled stone — traditionally worn by Aries and Leo.",
        image:
          "https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?w=600&h=600&fit=crop",
        price: "₹499",
        shopSlug: "carnelian",
      },
      {
        name: "Clear Quartz",
        association: "Commonly used for intention-setting and mental clarity.",
        bestFor: "Intention-setting, clarity, amplifying focus",
        howToUse:
          "Hold while stating an intention. Place on a desk or meditation altar.",
        care: "Rinse in cool water. Avoid leaving in direct sun for long periods.",
        zodiacNote: "A universal stone — pairs with every sign, especially Fire.",
        image:
          "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=600&h=600&fit=crop",
        price: "₹349",
        shopSlug: "clear-quartz",
      },
      {
        name: "Amethyst",
        association: "Often selected for calm and emotional balance.",
        bestFor: "Calm, sleep, emotional balance",
        howToUse: "Place on a bedside table or carry in your pocket on stressful days.",
        care: "Cleanse under cool water. Keep away from direct sun to preserve colour.",
        zodiacNote:
          "A calming counterweight for Aries' Fire — traditionally used to soften impulsiveness.",
        image:
          "https://images.unsplash.com/photo-1602928321679-560bb453f190?w=600&h=600&fit=crop",
        price: "₹499",
        shopSlug: "amethyst",
      },
    ],
  },

  /* ============================================================
     TAURUS — Earth
  ============================================================ */
  Taurus: {
    symbol: "♉",
    dates: "April 20 – May 20",
    element: "Earth",
    traits: ["Grounded", "Patient", "Reliable", "Sensual"],
    strengths: ["Loyal", "Devoted", "Steady", "Practical"],
    challenges: ["Stubborn", "Possessive", "Resistant to change"],
    crystals: [
      {
        name: "Rose Quartz",
        association: "Often used for self-love, gentleness and emotional warmth.",
        bestFor: "Self-love, heart healing, gentle relationships",
        howToUse:
          "Keep beside your bed or in a handbag. Hold when you need to soften your own inner voice.",
        care: "Rinse in cool water monthly. Avoid harsh chemicals and prolonged sun.",
        zodiacNote:
          "A Venus-aligned stone — traditionally worn by Taurus and Libra.",
        image:
          "https://images.unsplash.com/photo-1602928321679-560bb453f190?w=600&h=600&fit=crop",
        price: "₹399",
        shopSlug: "rose-quartz",
      },
      {
        name: "Green Aventurine",
        association:
          "Traditionally associated with prosperity and steady growth.",
        bestFor: "Abundance, career growth, opportunity",
        howToUse:
          "Carry in a wallet or pocket. Place on a desk when working on long-term goals.",
        care: "Wipe with a soft cloth. Rinse occasionally in cool water.",
        zodiacNote:
          "An Earth-friendly stone — often paired with Taurus and Virgo.",
        image:
          "https://images.unsplash.com/photo-1611080626919-7cf5a9dbc5cb?w=600&h=600&fit=crop",
        price: "₹449",
        shopSlug: "green-aventurine",
      },
      {
        name: "Emerald",
        association:
          "Valued as a stone of harmony and heart-centred abundance.",
        bestFor: "Harmony, loyalty, deep emotional clarity",
        howToUse:
          "Wear close to the heart as a pendant, or keep in a jewellery box during reflection.",
        care: "Avoid ultrasonic cleaners. Wipe gently with a soft, dry cloth.",
        zodiacNote:
          "A Venus-ruled stone — traditionally connected to Taurus' ruler.",
        image:
          "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&h=600&fit=crop",
        price: "₹899",
        shopSlug: "emerald",
      },
    ],
  },

  /* ============================================================
     GEMINI — Air
  ============================================================ */
  Gemini: {
    symbol: "♊",
    dates: "May 21 – June 20",
    element: "Air",
    traits: ["Curious", "Adaptable", "Witty", "Expressive"],
    strengths: ["Quick-witted", "Communicative", "Versatile"],
    challenges: ["Restless", "Indecisive", "Scattered energy"],
    crystals: [
      {
        name: "Agate",
        association: "Commonly used to support focus and ground mental energy.",
        bestFor: "Focus, grounding, steadying a busy mind",
        howToUse:
          "Keep in a pocket or on a study desk. Hold briefly before focused work.",
        care: "Rinse in cool water. Avoid harsh chemicals and ultrasonic cleaners.",
        zodiacNote:
          "An Air-friendly stone — often paired with Gemini and Virgo.",
        image:
          "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&h=600&fit=crop",
        price: "₹449",
        shopSlug: "agate",
      },
      {
        name: "Citrine",
        association:
          "Traditionally linked to mental clarity and positive expression.",
        bestFor: "Clarity, optimism, confident communication",
        howToUse:
          "Keep on your desk or in a workspace. Ideal for writers, speakers and students.",
        care: "Keep out of direct sun — colour can fade. Wipe with a soft cloth.",
        zodiacNote:
          "A Mercury-aligned stone — often associated with Gemini.",
        image:
          "https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?w=600&h=600&fit=crop",
        price: "₹599",
        shopSlug: "citrine",
      },
      {
        name: "Sodalite",
        association:
          "Often chosen for clear communication and logical thinking.",
        bestFor: "Communication, logic, calm expression",
        howToUse:
          "Carry in a pocket before meetings or presentations. Hold when speaking.",
        care: "Rinse in cool water. Keep away from prolonged heat or sun.",
        zodiacNote:
          "Often paired with Gemini and Sagittarius for clarity in speech.",
        image:
          "https://images.unsplash.com/photo-1602928321679-560bb453f190?w=600&h=600&fit=crop",
        price: "₹449",
        shopSlug: "sodalite",
      },
    ],
  },

  /* ============================================================
     CANCER — Water
  ============================================================ */
  Cancer: {
    symbol: "♋",
    dates: "June 21 – July 22",
    element: "Water",
    traits: ["Nurturing", "Intuitive", "Protective", "Emotional"],
    strengths: ["Loyal", "Caring", "Deeply intuitive", "Protective"],
    challenges: ["Over-sensitive", "Moody", "Attached to the past"],
    crystals: [
      {
        name: "Moonstone",
        association:
          "Traditionally associated with emotional balance and intuition.",
        bestFor: "Intuition, hormonal balance, calm emotions",
        howToUse:
          "Wear close to the skin or keep on a bedside table. Ideal during transition periods.",
        care: "Cleanse gently under cool water. Avoid prolonged direct sun.",
        zodiacNote:
          "A Moon-ruled stone — traditionally aligned with Cancer.",
        image:
          "https://images.unsplash.com/photo-1611080626919-7cf5a9dbc5cb?w=600&h=600&fit=crop",
        price: "₹699",
        shopSlug: "moonstone",
      },
      {
        name: "Pearl",
        association: "Valued as a gentle stone of calm and feminine energy.",
        bestFor: "Calm, feminine energy, emotional steadiness",
        howToUse:
          "Wear as a necklace or ring. Traditionally worn during important transitions.",
        care: "Wipe with a soft dry cloth. Keep away from perfume and chemicals.",
        zodiacNote:
          "A Moon-ruled gem — long associated with Cancer.",
        image:
          "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&h=600&fit=crop",
        price: "₹799",
        shopSlug: "pearl",
      },
      {
        name: "Selenite",
        association: "Often used to cleanse emotional space and promote peace.",
        bestFor: "Cleansing, emotional release, peaceful space",
        howToUse:
          "Place in a room to cleanse the atmosphere. Sweep through aura space — not on the body.",
        care: "Never rinse in water — selenite dissolves. Wipe with a dry cloth.",
        zodiacNote:
          "A Moon-aligned stone — often paired with Cancer for calm.",
        image:
          "https://images.unsplash.com/photo-1602928321679-560bb453f190?w=600&h=600&fit=crop",
        price: "₹649",
        shopSlug: "selenite",
      },
    ],
  },

  /* ============================================================
     LEO — Fire
  ============================================================ */
  Leo: {
    symbol: "♌",
    dates: "July 23 – August 22",
    element: "Fire",
    traits: ["Confident", "Generous", "Charismatic", "Dramatic"],
    strengths: ["Warm-hearted", "Loyal", "Creative", "Natural leader"],
    challenges: ["Prideful", "Attention-seeking", "Stubborn"],
    crystals: [
      {
        name: "Tiger's Eye",
        association:
          "Traditionally associated with confidence, courage and willpower.",
        bestFor: "Confidence, willpower, decisive action",
        howToUse:
          "Wear as a bracelet or carry before high-stakes moments. Hold in the palm.",
        care: "Wipe with a soft cloth. Rinse occasionally under cool water.",
        zodiacNote:
          "A Sun-aligned stone — traditionally associated with Leo.",
        image:
          "https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?w=600&h=600&fit=crop",
        price: "₹549",
        shopSlug: "tigers-eye",
      },
      {
        name: "Citrine",
        association: "Often chosen for success, warmth and personal radiance.",
        bestFor: "Success, joy, personal radiance",
        howToUse:
          "Keep on a desk or wear as a pendant. Ideal for creative and leadership work.",
        care: "Keep out of prolonged direct sun. Wipe with a soft, dry cloth.",
        zodiacNote:
          "A Sun-aligned stone — often paired with Leo and Aries.",
        image:
          "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&h=600&fit=crop",
        price: "₹599",
        shopSlug: "citrine",
      },
      {
        name: "Sunstone",
        association: "Valued as a stone of vitality and joyful leadership.",
        bestFor: "Vitality, joyful leadership, warmth",
        howToUse:
          "Wear close to the skin. Hold during moments that call for courage or enthusiasm.",
        care: "Rinse gently in cool water. Avoid ultrasonic cleaners.",
        zodiacNote:
          "A Sun-ruled stone — traditionally connected to Leo.",
        image:
          "https://images.unsplash.com/photo-1611080626919-7cf5a9dbc5cb?w=600&h=600&fit=crop",
        price: "₹649",
        shopSlug: "sunstone",
      },
    ],
  },

  /* ============================================================
     VIRGO — Earth
  ============================================================ */
  Virgo: {
    symbol: "♍",
    dates: "August 23 – September 22",
    element: "Earth",
    traits: ["Analytical", "Precise", "Helpful", "Practical"],
    strengths: ["Detail-oriented", "Hardworking", "Reliable"],
    challenges: ["Overcritical", "Perfectionist", "Anxious"],
    crystals: [
      {
        name: "Amazonite",
        association: "Often used for calm, clarity and releasing worry.",
        bestFor: "Calm, clarity, releasing anxious thoughts",
        howToUse:
          "Keep in a pocket or on a desk. Hold during moments of overthinking.",
        care: "Rinse gently in cool water. Avoid prolonged direct sun.",
        zodiacNote:
          "An Earth-friendly stone — often paired with Virgo.",
        image:
          "https://images.unsplash.com/photo-1602928321679-560bb453f190?w=600&h=600&fit=crop",
        price: "₹549",
        shopSlug: "amazonite",
      },
      {
        name: "Peridot",
        association: "Traditionally associated with renewal and inner peace.",
        bestFor: "Renewal, inner peace, gentle heart-opening",
        howToUse:
          "Wear close to the skin or keep in a meditation space.",
        care: "Wipe with a soft dry cloth. Avoid harsh chemicals and heat.",
        zodiacNote:
          "An Earth-aligned stone — traditionally paired with Virgo.",
        image:
          "https://images.unsplash.com/photo-1611080626919-7cf5a9dbc5cb?w=600&h=600&fit=crop",
        price: "₹699",
        shopSlug: "peridot",
      },
      {
        name: "Clear Quartz",
        association: "Commonly used to support focus and mental clarity.",
        bestFor: "Focus, mental clarity, amplification",
        howToUse:
          "Place on a study desk or hold during focused work sessions.",
        care: "Rinse in cool water. Avoid long exposure to direct sun.",
        zodiacNote: "A universal stone — aligns with every sign, especially Virgo.",
        image:
          "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=600&h=600&fit=crop",
        price: "₹349",
        shopSlug: "clear-quartz",
      },
    ],
  },

  /* ============================================================
     LIBRA — Air
  ============================================================ */
  Libra: {
    symbol: "♎",
    dates: "September 23 – October 22",
    element: "Air",
    traits: ["Balanced", "Diplomatic", "Charming", "Fair-minded"],
    strengths: ["Harmonious", "Cooperative", "Idealistic"],
    challenges: ["Indecisive", "Conflict-avoidant", "Over-pleasing"],
    crystals: [
      {
        name: "Lapis Lazuli",
        association:
          "Traditionally associated with harmony, wisdom and truth.",
        bestFor: "Wisdom, truth, inner harmony",
        howToUse:
          "Wear as a pendant close to the throat. Hold during important conversations.",
        care: "Keep away from water — the stone is sensitive. Wipe with a dry cloth.",
        zodiacNote:
          "A Venus-aligned stone — often paired with Libra.",
        image:
          "https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?w=600&h=600&fit=crop",
        price: "₹799",
        shopSlug: "lapis-lazuli",
      },
      {
        name: "Rose Quartz",
        association: "Often chosen for gentle emotional balance and love.",
        bestFor: "Love, harmony, emotional balance",
        howToUse: "Keep near your bed or in a handbag. Hold during conflict resolution.",
        care: "Rinse in cool water monthly. Avoid prolonged direct sun.",
        zodiacNote:
          "A Venus-aligned stone — pairs beautifully with Libra.",
        image:
          "https://images.unsplash.com/photo-1602928321679-560bb453f190?w=600&h=600&fit=crop",
        price: "₹399",
        shopSlug: "rose-quartz",
      },
      {
        name: "Opal",
        association: "Valued as a stone of balance and creative inspiration.",
        bestFor: "Balance, creativity, emotional expression",
        howToUse:
          "Wear close to the skin or keep during creative work. Handle with care — delicate.",
        care: "Avoid ultrasonic cleaners and prolonged sun. Wipe with a soft cloth.",
        zodiacNote:
          "An Air-friendly stone — often paired with Libra for balance.",
        image:
          "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&h=600&fit=crop",
        price: "₹899",
        shopSlug: "opal",
      },
    ],
  },

  /* ============================================================
     SCORPIO — Water
  ============================================================ */
  Scorpio: {
    symbol: "♏",
    dates: "October 23 – November 21",
    element: "Water",
    traits: ["Intense", "Passionate", "Magnetic", "Private"],
    strengths: ["Loyal", "Brave", "Resourceful", "Focused"],
    challenges: ["Jealous", "Secretive", "Holding grudges"],
    crystals: [
      {
        name: "Black Tourmaline",
        association: "Traditionally used for protection and grounding.",
        bestFor: "Protection, grounding, releasing negativity",
        howToUse:
          "Keep at the entrance of your home or in a pocket. Hold during stressful situations.",
        care: "Rinse under running water occasionally. Sun-clean to recharge.",
        zodiacNote:
          "A protective stone — traditionally paired with Scorpio and Capricorn.",
        image:
          "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&h=600&fit=crop",
        price: "₹499",
        shopSlug: "black-tourmaline",
      },
      {
        name: "Obsidian",
        association: "Often chosen for emotional release and inner strength.",
        bestFor: "Emotional release, shadow work, inner strength",
        howToUse:
          "Hold during journaling or reflection. Place near a mirror for grounding.",
        care: "Wipe with a damp cloth. Avoid dropping — can chip edges.",
        zodiacNote:
          "A Pluto-aligned stone — traditionally paired with Scorpio.",
        image:
          "https://images.unsplash.com/photo-1611080626919-7cf5a9dbc5cb?w=600&h=600&fit=crop",
        price: "₹449",
        shopSlug: "obsidian",
      },
      {
        name: "Labradorite",
        association: "Valued as a stone of transformation and quiet power.",
        bestFor: "Transformation, magic, quiet power",
        howToUse:
          "Wear as a pendant or keep in a pocket. Ideal during times of change.",
        care: "Wipe gently with a soft cloth. Avoid ultrasonic cleaners.",
        zodiacNote:
          "A transformative stone — traditionally paired with Scorpio.",
        image:
          "https://images.unsplash.com/photo-1602928321679-560bb453f190?w=600&h=600&fit=crop",
        price: "₹749",
        shopSlug: "labradorite",
      },
    ],
  },

  /* ============================================================
     SAGITTARIUS — Fire
  ============================================================ */
  Sagittarius: {
    symbol: "♐",
    dates: "November 22 – December 21",
    element: "Fire",
    traits: ["Adventurous", "Optimistic", "Free-spirited", "Honest"],
    strengths: ["Generous", "Idealistic", "Curious", "Open-minded"],
    challenges: ["Restless", "Blunt", "Over-promising"],
    crystals: [
      {
        name: "Turquoise",
        association:
          "Traditionally associated with wisdom, protection and travel.",
        bestFor: "Wisdom, protection, safe travel",
        howToUse:
          "Wear as a pendant during travel. Keep in a pocket for daily protection.",
        care: "Avoid chemicals and prolonged sun. Wipe gently with a dry cloth.",
        zodiacNote:
          "A Jupiter-friendly stone — often paired with Sagittarius.",
        image:
          "https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?w=600&h=600&fit=crop",
        price: "₹699",
        shopSlug: "turquoise",
      },
      {
        name: "Sodalite",
        association: "Often chosen for clear thought and honest expression.",
        bestFor: "Clear thought, honest expression, clarity",
        howToUse:
          "Carry before important conversations. Hold when speaking your truth.",
        care: "Rinse in cool water. Avoid prolonged heat or direct sun.",
        zodiacNote:
          "Often paired with Sagittarius for honest communication.",
        image:
          "https://images.unsplash.com/photo-1611080626919-7cf5a9dbc5cb?w=600&h=600&fit=crop",
        price: "₹449",
        shopSlug: "sodalite",
      },
      {
        name: "Lapis Lazuli",
        association: "Valued as a stone of insight and higher vision.",
        bestFor: "Insight, higher vision, big-picture thinking",
        howToUse:
          "Wear near the throat. Hold during journaling or meditation on long-term goals.",
        care: "Keep away from water. Wipe with a dry, soft cloth.",
        zodiacNote:
          "A Jupiter-aligned stone — often paired with Sagittarius.",
        image:
          "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&h=600&fit=crop",
        price: "₹799",
        shopSlug: "lapis-lazuli",
      },
    ],
  },

  /* ============================================================
     CAPRICORN — Earth
  ============================================================ */
  Capricorn: {
    symbol: "♑",
    dates: "December 22 – January 19",
    element: "Earth",
    traits: ["Disciplined", "Ambitious", "Responsible", "Patient"],
    strengths: ["Persistent", "Strategic", "Resourceful"],
    challenges: ["Pessimistic", "Rigid", "Workaholic"],
    crystals: [
      {
        name: "Garnet",
        association:
          "Traditionally associated with vitality, commitment and drive.",
        bestFor: "Vitality, commitment, steady drive",
        howToUse:
          "Wear close to the skin or keep on a work desk. Hold during goal-setting.",
        care: "Rinse occasionally in cool water. Wipe with a soft cloth.",
        zodiacNote:
          "An Earth-friendly stone — often paired with Capricorn.",
        image:
          "https://images.unsplash.com/photo-1602928321679-560bb453f190?w=600&h=600&fit=crop",
        price: "₹699",
        shopSlug: "garnet",
      },
      {
        name: "Black Tourmaline",
        association: "Often used for grounding and steady progress.",
        bestFor: "Grounding, protection, steady progress",
        howToUse:
          "Place in a workspace or by the front door. Hold during stressful moments.",
        care: "Rinse under running water monthly. Recharge in the sun.",
        zodiacNote:
          "A protective stone — pairs with Capricorn's steady nature.",
        image:
          "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&h=600&fit=crop",
        price: "₹499",
        shopSlug: "black-tourmaline",
      },
      {
        name: "Smoky Quartz",
        association: "Valued as a stone of patience and quiet strength.",
        bestFor: "Patience, quiet strength, grounding",
        howToUse:
          "Keep in a pocket or on a desk. Hold when you need steady resolve.",
        care: "Rinse in cool water. Avoid prolonged direct sun.",
        zodiacNote:
          "An Earth-aligned stone — pairs well with Capricorn.",
        image:
          "https://images.unsplash.com/photo-1611080626919-7cf5a9dbc5cb?w=600&h=600&fit=crop",
        price: "₹549",
        shopSlug: "smoky-quartz",
      },
    ],
  },

  /* ============================================================
     AQUARIUS — Air
  ============================================================ */
  Aquarius: {
    symbol: "♒",
    dates: "January 20 – February 18",
    element: "Air",
    traits: ["Visionary", "Original", "Independent", "Humanitarian"],
    strengths: ["Inventive", "Progressive", "Open-minded"],
    challenges: ["Detached", "Unpredictable", "Stubbornly idealistic"],
    crystals: [
      {
        name: "Amethyst",
        association:
          "Traditionally associated with insight and spiritual clarity.",
        bestFor: "Insight, spiritual clarity, calm thinking",
        howToUse:
          "Place on a bedside table or meditation altar. Hold during reflection.",
        care: "Cleanse under cool water. Keep away from direct sun.",
        zodiacNote:
          "An Air-friendly stone — often paired with Aquarius.",
        image:
          "https://images.unsplash.com/photo-1602928321679-560bb453f190?w=600&h=600&fit=crop",
        price: "₹499",
        shopSlug: "amethyst",
      },
      {
        name: "Aquamarine",
        association: "Often chosen for calm expression and clear vision.",
        bestFor: "Calm expression, clear vision, courage to speak",
        howToUse:
          "Wear near the throat. Hold before meetings where honesty matters.",
        care: "Keep away from prolonged heat or sun. Wipe with a soft cloth.",
        zodiacNote:
          "A Water-aligned stone that balances Aquarius' airy nature.",
        image:
          "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&h=600&fit=crop",
        price: "₹849",
        shopSlug: "aquamarine",
      },
      {
        name: "Labradorite",
        association:
          "Valued as a stone of innovation and personal transformation.",
        bestFor: "Innovation, transformation, new ideas",
        howToUse:
          "Carry in a pocket or wear as a pendant. Ideal during creative or transitional periods.",
        care: "Wipe gently with a soft cloth. Avoid ultrasonic cleaners.",
        zodiacNote:
          "A transformative stone — often paired with Aquarius.",
        image:
          "https://images.unsplash.com/photo-1611080626919-7cf5a9dbc5cb?w=600&h=600&fit=crop",
        price: "₹749",
        shopSlug: "labradorite",
      },
    ],
  },

  /* ============================================================
     PISCES — Water
  ============================================================ */
  Pisces: {
    symbol: "♓",
    dates: "February 19 – March 20",
    element: "Water",
    traits: ["Compassionate", "Dreamy", "Artistic", "Intuitive"],
    strengths: ["Empathetic", "Imaginative", "Gentle", "Wise"],
    challenges: ["Over-sensitive", "Escapist", "Boundary-less"],
    crystals: [
      {
        name: "Aquamarine",
        association:
          "Traditionally associated with calm, flow and emotional clarity.",
        bestFor: "Calm, flow, emotional clarity",
        howToUse:
          "Wear near the throat or keep in a meditation space. Hold during reflection.",
        care: "Keep away from prolonged heat or sun. Wipe with a soft cloth.",
        zodiacNote:
          "A Water-aligned stone — traditionally paired with Pisces.",
        image:
          "https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?w=600&h=600&fit=crop",
        price: "₹849",
        shopSlug: "aquamarine",
      },
      {
        name: "Amethyst",
        association: "Often chosen for intuition and peaceful dreaming.",
        bestFor: "Intuition, peaceful sleep, calm emotions",
        howToUse:
          "Place on a bedside table. Hold before sleep to support restful dreaming.",
        care: "Cleanse under cool water. Keep away from direct sun.",
        zodiacNote:
          "A calming stone — often paired with Pisces' sensitive nature.",
        image:
          "https://images.unsplash.com/photo-1602928321679-560bb453f190?w=600&h=600&fit=crop",
        price: "₹499",
        shopSlug: "amethyst",
      },
      {
        name: "Moonstone",
        association: "Valued as a stone of emotional insight and sensitivity.",
        bestFor: "Emotional insight, sensitivity, nurturing intuition",
        howToUse:
          "Wear close to the skin or keep near your bed. Ideal during emotional transitions.",
        care: "Cleanse gently under cool water. Avoid prolonged direct sun.",
        zodiacNote:
          "A Moon-ruled stone — pairs beautifully with Pisces.",
        image:
          "https://images.unsplash.com/photo-1611080626919-7cf5a9dbc5cb?w=600&h=600&fit=crop",
        price: "₹699",
        shopSlug: "moonstone",
      },
    ],
  },
};