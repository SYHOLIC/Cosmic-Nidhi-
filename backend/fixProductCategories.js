require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./src/models/Category');
const Product = require('./src/models/Product');

async function fixCategories() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  // 1. Setup or update Top-Level Categories
  // A. Crystals & Gemstones (Parent)
  let crystalParent = await Category.findOne({
    $or: [
      { name: /^crystals/i },
      { slug: /^crystals/i }
    ]
  });

  if (!crystalParent) {
    crystalParent = await Category.create({
      name: 'Crystals & Gemstones',
      slug: 'crystals-gemstones',
      description: 'Natural crystals and gemstones for healing, meditation and spiritual practices',
      image: 'https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?w=800&h=600&fit=crop',
      parentCategory: null,
      isActive: true
    });
  } else {
    crystalParent.name = 'Crystals & Gemstones';
    crystalParent.parentCategory = null;
    crystalParent.isActive = true;
    if (!crystalParent.image) {
      crystalParent.image = 'https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?w=800&h=600&fit=crop';
    }
    await crystalParent.save();
  }

  // B. Subcategories of Crystals & Gemstones:
  // - Raw Crystals
  let rawCrystals = await Category.findOne({ name: /raw crystals/i });
  if (!rawCrystals) {
    rawCrystals = await Category.create({
      name: 'Raw Crystals',
      slug: 'raw-crystals',
      description: 'Untreated and unpolished raw crystal specimens in their natural form',
      parentCategory: crystalParent._id,
      isActive: true
    });
  } else {
    rawCrystals.parentCategory = crystalParent._id;
    rawCrystals.isActive = true;
    await rawCrystals.save();
  }

  // - Crystal Products (Tumbled & Polished Crystals)
  let crystalProducts = await Category.findOne({ name: /crystal products/i });
  if (!crystalProducts) {
    crystalProducts = await Category.create({
      name: 'Crystal Products',
      slug: 'crystal-products',
      description: 'Polished stones, crystal shapes, wands, and healing items',
      parentCategory: crystalParent._id,
      isActive: true
    });
  } else {
    crystalProducts.parentCategory = crystalParent._id;
    crystalProducts.isActive = true;
    await crystalProducts.save();
  }

  // - Gemstones
  let gemstones = await Category.findOne({ name: /^gemstones/i });
  if (!gemstones) {
    gemstones = await Category.create({
      name: 'Gemstones',
      slug: 'gemstones',
      description: 'Precious and semi-precious astrological gemstones',
      parentCategory: crystalParent._id,
      isActive: true
    });
  } else {
    gemstones.parentCategory = crystalParent._id;
    gemstones.isActive = true;
    await gemstones.save();
  }

  // C. Spiritual Jewelry (Parent)
  let jewelry = await Category.findOne({
    $or: [{ name: /jewelry|jewellery/i }, { slug: /jewelry|jewellery/i }]
  });
  if (!jewelry) {
    jewelry = await Category.create({
      name: 'Spiritual Jewelry',
      slug: 'spiritual-jewelry',
      description: 'Handcrafted healing crystal bracelets, rudraksha malas, and sacred pendants',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=600&fit=crop',
      parentCategory: null,
      isActive: true
    });
  } else {
    jewelry.name = 'Spiritual Jewelry';
    jewelry.parentCategory = null;
    jewelry.isActive = true;
    if (!jewelry.image) {
      jewelry.image = 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=600&fit=crop';
    }
    await jewelry.save();
  }

  // D. Puja & Ritual Items (Parent)
  let puja = await Category.findOne({
    $or: [{ name: /puja|pooja/i }, { slug: /puja|pooja/i }]
  });
  if (!puja) {
    puja = await Category.create({
      name: 'Puja & Ritual Items',
      slug: 'puja-ritual-items',
      description: 'Pure incense, brass diyas, aarti essentials, and ritual sacred items',
      image: 'https://images.unsplash.com/photo-1602523961358-f9f03dd557db?w=800&h=600&fit=crop',
      parentCategory: null,
      isActive: true
    });
  } else {
    puja.name = 'Puja & Ritual Items';
    puja.parentCategory = null;
    puja.isActive = true;
    if (!puja.image) {
      puja.image = 'https://images.unsplash.com/photo-1602523961358-f9f03dd557db?w=800&h=600&fit=crop';
    }
    await puja.save();
  }

  // E. Books & Guides (Parent)
  let books = await Category.findOne({
    $or: [{ name: /books/i }, { slug: /books/i }]
  });
  if (!books) {
    books = await Category.create({
      name: 'Books & Guides',
      slug: 'books-guides',
      description: 'Books on astrology, numerology, crystal therapy, and Vedic wisdom',
      image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&h=600&fit=crop',
      parentCategory: null,
      isActive: true
    });
  } else {
    books.name = 'Books & Guides';
    books.parentCategory = null;
    books.isActive = true;
    if (!books.image) {
      books.image = 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&h=600&fit=crop';
    }
    await books.save();
  }

  // F. Home Decor & Vastu (Parent)
  let homeDecor = await Category.findOne({
    $or: [{ name: /home decor|vastu/i }, { slug: /home-decor|vastu/i }]
  });
  if (!homeDecor) {
    homeDecor = await Category.create({
      name: 'Home Decor & Vastu',
      slug: 'home-decor-vastu',
      description: 'Vastu-aligned crystal trees, selenite plates, and sacred energetic home decor',
      image: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&h=600&fit=crop',
      parentCategory: null,
      isActive: true
    });
  } else {
    homeDecor.name = 'Home Decor & Vastu';
    homeDecor.parentCategory = null;
    homeDecor.isActive = true;
    if (!homeDecor.image) {
      homeDecor.image = 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&h=600&fit=crop';
    }
    await homeDecor.save();
  }

  // G. Yantras & Sacred Symbols (Parent)
  let yantras = await Category.findOne({
    $or: [{ name: /yantra/i }, { slug: /yantra/i }]
  });
  if (!yantras) {
    yantras = await Category.create({
      name: 'Yantras & Sacred Symbols',
      slug: 'yantras-sacred-symbols',
      description: 'Consecrated sacred yantras and celestial geometric plates',
      image: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800&h=600&fit=crop',
      parentCategory: null,
      isActive: true
    });
  } else {
    yantras.name = 'Yantras & Sacred Symbols';
    yantras.parentCategory = null;
    yantras.isActive = true;
    if (!yantras.image) {
      yantras.image = 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800&h=600&fit=crop';
    }
    await yantras.save();
  }

  // H. Astrology Services (Parent)
  let astrologyServices = await Category.findOne({
    $or: [{ name: /astrology services/i }, { slug: /astrology-services/i }]
  });
  if (!astrologyServices) {
    astrologyServices = await Category.create({
      name: 'Astrology Services',
      slug: 'astrology-services',
      description: 'Personalized Vedic astrology consultations, birth chart readings and remedies',
      parentCategory: null,
      isActive: true
    });
  } else {
    astrologyServices.parentCategory = null;
    astrologyServices.isActive = true;
    await astrologyServices.save();
  }

  console.log('All standard categories confirmed/created.');

  // 2. Normalize and accurately categorize all products
  const allProducts = await Product.find({});
  let updatedCount = 0;

  for (const prod of allProducts) {
    const nameLower = (prod.name || '').toLowerCase();
    let assignedCat = null;

    // Check Spiritual Jewelry (bracelets, malas, necklace, pendants)
    if (
      nameLower.includes('bracelet') ||
      nameLower.includes('mala') ||
      nameLower.includes('necklace') ||
      nameLower.includes('pendant')
    ) {
      assignedCat = jewelry._id;
    }
    // Check Home Decor & Vastu (tree, plate, pyramid)
    else if (
      nameLower.includes('healing tree') ||
      nameLower.includes('selenite plate') ||
      nameLower.includes('tree') ||
      nameLower.includes('plate')
    ) {
      assignedCat = homeDecor._id;
    }
    // Check Raw Crystals
    else if (nameLower.includes('raw ')) {
      assignedCat = rawCrystals._id;
    }
    // Check Gemstones
    else if (
      nameLower.includes('agate') ||
      nameLower.includes('emerald') ||
      nameLower.includes('pearl') ||
      nameLower.includes('opal') ||
      nameLower.includes('turquoise') ||
      nameLower.includes('peridot') ||
      nameLower.includes('garnet') ||
      nameLower.includes('aquamarine') ||
      nameLower.includes('stone')
    ) {
      assignedCat = gemstones._id;
    }
    // Check Books
    else if (
      nameLower.includes('book') ||
      nameLower.includes('guide') ||
      nameLower === 'cosmic product 4'
    ) {
      assignedCat = books._id;
      if (prod.name === 'Cosmic Product 4') {
        prod.name = 'Vedic Astrology & Crystal Guidebook';
        prod.description = 'Comprehensive handbook on Vedic astrology, healing crystal resonance, and everyday spiritual practices.';
        prod.shortDescription = 'Comprehensive handbook on Vedic astrology & crystal resonance.';
        prod.images = ['https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600&h=600&fit=crop'];
      }
    }
    // Check Astrology Services
    else if (
      nameLower.includes('consultation') ||
      nameLower.includes('service') ||
      nameLower === 'cosmic product 10'
    ) {
      assignedCat = astrologyServices._id;
      if (prod.name === 'Cosmic Product 10') {
        prod.name = 'Personal Astrological Consultation';
        prod.description = 'In-depth one-on-one natal chart reading with Acharya Nidhi for career, relationships, and gemstone remedies.';
        prod.shortDescription = 'One-on-one natal chart analysis and gemstone consultation.';
        prod.images = ['https://images.unsplash.com/photo-1532012164546-f432f2e3edd4?w=600&h=600&fit=crop'];
      }
    }
    // Transform old undefined dummy products into real catalog items:
    else if (prod.name === 'Cosmic Product 1') {
      assignedCat = puja._id;
      prod.name = 'Sacred Organic Dhoop & Incense Cones';
      prod.description = 'Handcrafted Vedic dhoop cones infused with sacred herbs and sandalwood for daily puja and energy purification.';
      prod.shortDescription = 'Vedic dhoop cones for daily puja & space purification.';
      prod.images = ['https://images.unsplash.com/photo-1602523961358-f9f03dd557db?w=600&h=600&fit=crop'];
    }
    else if (prod.name === 'Cosmic Product 2') {
      assignedCat = puja._id;
      prod.name = 'Traditional Brass Aarti Diya';
      prod.description = 'Pure handcrafted brass diya crafted according to Vedic proportions for puja rooms and sacred alters.';
      prod.shortDescription = 'Pure handcrafted brass diya for rituals & meditation.';
      prod.images = ['https://images.unsplash.com/photo-1606293926075-69a00dbfde81?w=600&h=600&fit=crop'];
    }
    else if (prod.name === 'Cosmic Product 5') {
      assignedCat = yantras._id;
      prod.name = 'Shree Yantra Sacred Copper Plate';
      prod.description = 'Energized sacred Shree Yantra engraved on pure copper plate for attracting prosperity and positive vibrations.';
      prod.shortDescription = 'Energized copper Shree Yantra for abundance and harmony.';
      prod.images = ['https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=600&h=600&fit=crop'];
    }
    else if (prod.name === 'Cosmic Product 6') {
      assignedCat = yantras._id;
      prod.name = 'Surya Yantra Radiant Energy Plate';
      prod.description = 'Energized Surya Yantra plate designed to invoke solar confidence, health, vitality, and planetary harmony.';
      prod.shortDescription = 'Energized Surya Yantra plate for solar energy & health.';
      prod.images = ['https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=600&h=600&fit=crop'];
    }
    else if (prod.name === 'Cosmic Product 8') {
      assignedCat = yantras._id;
      prod.name = 'Kuber Yantra Abundance Plate';
      prod.description = 'Energized Lord Kuber Yantra sacred plate for attracting financial prosperity and business success.';
      prod.shortDescription = 'Lord Kuber Yantra for prosperity and abundance.';
      prod.images = ['https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=600&h=600&fit=crop'];
    }
    else if (prod.name === 'Cosmic Product 9') {
      assignedCat = homeDecor._id;
      prod.name = 'Vastu Pyramid Energy Harmonizer';
      prod.description = 'Brass and crystal multi-layer Vastu pyramid designed to harmonize domestic energy fields and neutralize doshas.';
      prod.shortDescription = 'Multi-layer Vastu pyramid for energy harmonization.';
      prod.images = ['https://images.unsplash.com/photo-1600210492493-0946911123ea?w=600&h=600&fit=crop'];
    }
    else if (prod.name === 'Cosmic Product 3') {
      assignedCat = crystalProducts._id;
      prod.name = 'Polished Selenite Cleansing Tower';
      prod.description = 'High-vibration natural Moroccan selenite crystal tower for aura cleansing and crystal charging.';
      prod.shortDescription = 'Moroccan selenite tower for aura cleansing and charging.';
      prod.images = ['https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=600&h=600&fit=crop'];
    }
    // Zodiac crystals and all other healing stones
    else if (prod.zodiacSigns && prod.zodiacSigns.length > 0) {
      assignedCat = crystalProducts._id;
    }
    // Fallback: If still uncategorized, assign to crystal products
    else {
      assignedCat = crystalProducts._id;
    }

    prod.category = assignedCat;
    if (prod.stock === undefined || prod.stock === null) prod.stock = 50;
    prod.isActive = true;
    await prod.save();
    updatedCount++;
  }

  console.log(`Successfully categorized and updated all ${updatedCount} products!`);

  // Verification report
  const report = await Product.find({}).populate('category', 'name slug parentCategory');
  const catSummary = {};
  report.forEach(p => {
    const cName = p.category ? p.category.name : 'STILL_NULL';
    catSummary[cName] = (catSummary[cName] || 0) + 1;
  });
  console.log('FINAL PRODUCT DISTRIBUTION:', catSummary);

  process.exit(0);
}

fixCategories().catch(err => {
  console.error('Error fixing categories:', err);
  process.exit(1);
});
