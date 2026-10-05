const mongoose = require('mongoose');
require('dotenv').config();
const Video = require('./src/models/Video');
const { extractYouTubeId, getYouTubeThumbnail } = require('./src/utils/youtube');

const seedVideos = [
  {
    title: "Discover Your Cosmic Path: Vedic Astrology & Destiny Insights",
    description: "Explore how Vedic astrology and planetary alignments illuminate your life's path, relationships, and soul purpose with authentic CosmiNidhi guidance.",
    youtube_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Default safe placeholder that can be updated in admin
    category: "Vedic Astrology",
    is_featured: true,
    display_order: 1,
  },
  {
    title: "Understanding Your Zodiac Sign & Ascendant (Lagna)",
    description: "Learn how your Sun sign, Moon sign, and rising sign interact to shape your cosmic personality, emotional tendencies, and natural strengths.",
    youtube_url: "https://www.youtube.com/watch?v=kYJzEwX_9L4",
    category: "Zodiac Signs",
    is_featured: false,
    display_order: 2,
  },
  {
    title: "Tarot Card Reading for Clarity, Love & Life Decisions",
    description: "A deep dive into how Tarot cards reveal hidden energies, intuitive wisdom, and actionable direction during major life transitions.",
    youtube_url: "https://www.youtube.com/watch?v=Zt_3CqZ8q8U",
    category: "Tarot Reading",
    is_featured: false,
    display_order: 3,
  },
  {
    title: "Numerology Secrets: The Power of Life Path Numbers",
    description: "How your birth date unlocks your destiny number, master vibration, and relationship compatibility in authentic Vedic numerology.",
    youtube_url: "https://www.youtube.com/watch?v=6P2h9z3xWv8",
    category: "Numerology",
    is_featured: false,
    display_order: 4,
  },
  {
    title: "Sacred Energy Flow: Vastu Principles for Peace & Abundance",
    description: "Simple yet transformative spatial energy practices and gemstone placements to invite positive cosmic vibrations into home and work.",
    youtube_url: "https://www.youtube.com/watch?v=QeY_mH4q4lQ",
    category: "Spiritual Guidance",
    is_featured: false,
    display_order: 5,
  },
  {
    title: "Planetary Transits & What They Mean for Career & Finance",
    description: "Understand the subtle influences of Jupiter, Saturn, and Rahu transits on professional elevation and financial security.",
    youtube_url: "https://www.youtube.com/watch?v=xV3x7bM1jLk",
    category: "Career & Finance",
    is_featured: false,
    display_order: 6,
  },
];

async function runSeed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for Video seeding...');

    const existingCount = await Video.countDocuments();
    if (existingCount > 0) {
      console.log(`Database already has ${existingCount} video(s). Keeping existing videos.`);
      process.exit(0);
    }

    for (const v of seedVideos) {
      const videoId = extractYouTubeId(v.youtube_url) || 'dQw4w9WgXcQ';
      await Video.create({
        title: v.title,
        description: v.description,
        youtube_url: v.youtube_url,
        youtube_video_id: videoId,
        thumbnail_url: getYouTubeThumbnail(videoId),
        category: v.category,
        is_active: true,
        is_featured: v.is_featured,
        display_order: v.display_order,
      });
    }

    console.log(`✅ Successfully seeded ${seedVideos.length} initial videos!`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding videos:', error);
    process.exit(1);
  }
}

runSeed();
