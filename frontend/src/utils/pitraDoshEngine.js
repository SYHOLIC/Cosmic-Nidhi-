/**
 * Vedic Pitra Dosha Calculation & Astrological Rule Engine
 * Based on Brihat Parashara Hora Shastra (BPHS), Phaladeepika, and classical Vedic Jyotish principles.
 */

// Popular city geographical coordinates database (Latitude, Longitude, Timezone Offset in hours)
export const CITIES_DATABASE = [
  { name: 'Noida, Uttar Pradesh, India', lat: 28.5355, lng: 77.3910, tz: 5.5 },
  { name: 'New Delhi, Delhi, India', lat: 28.6139, lng: 77.2090, tz: 5.5 },
  { name: 'Delhi, India', lat: 28.6139, lng: 77.2090, tz: 5.5 },
  { name: 'Mumbai, Maharashtra, India', lat: 19.0760, lng: 72.8777, tz: 5.5 },
  { name: 'Bengaluru, Karnataka, India', lat: 12.9716, lng: 77.5946, tz: 5.5 },
  { name: 'Bangalore, Karnataka, India', lat: 12.9716, lng: 77.5946, tz: 5.5 },
  { name: 'Kolkata, West Bengal, India', lat: 22.5726, lng: 88.3639, tz: 5.5 },
  { name: 'Chennai, Tamil Nadu, India', lat: 13.0827, lng: 80.2707, tz: 5.5 },
  { name: 'Hyderabad, Telangana, India', lat: 17.3850, lng: 78.4867, tz: 5.5 },
  { name: 'Ahmedabad, Gujarat, India', lat: 23.0225, lng: 72.5714, tz: 5.5 },
  { name: 'Pune, Maharashtra, India', lat: 18.5204, lng: 73.8567, tz: 5.5 },
  { name: 'Jaipur, Rajasthan, India', lat: 26.9124, lng: 75.7873, tz: 5.5 },
  { name: 'Lucknow, Uttar Pradesh, India', lat: 26.8467, lng: 80.9462, tz: 5.5 },
  { name: 'Varanasi, Uttar Pradesh, India', lat: 25.3176, lng: 82.9739, tz: 5.5 },
  { name: 'Patna, Bihar, India', lat: 25.5941, lng: 85.1376, tz: 5.5 },
  { name: 'Bhopal, Madhya Pradesh, India', lat: 23.2599, lng: 77.4126, tz: 5.5 },
  { name: 'Indore, Madhya Pradesh, India', lat: 22.7196, lng: 75.8577, tz: 5.5 },
  { name: 'Chandigarh, India', lat: 30.7333, lng: 76.7794, tz: 5.5 },
  { name: 'Surat, Gujarat, India', lat: 21.1702, lng: 72.8311, tz: 5.5 },
  { name: 'Nagpur, Maharashtra, India', lat: 21.1458, lng: 79.0882, tz: 5.5 },
  { name: 'Agra, Uttar Pradesh, India', lat: 27.1767, lng: 78.0081, tz: 5.5 },
  { name: 'Kanpur, Uttar Pradesh, India', lat: 26.4499, lng: 80.3319, tz: 5.5 },
  { name: 'Ghaziabad, Uttar Pradesh, India', lat: 28.6692, lng: 77.4538, tz: 5.5 },
  { name: 'Faridabad, Haryana, India', lat: 28.4089, lng: 77.3178, tz: 5.5 },
  { name: 'Gurugram, Haryana, India', lat: 28.4595, lng: 77.0266, tz: 5.5 },
  { name: 'Gurgaon, Haryana, India', lat: 28.4595, lng: 77.0266, tz: 5.5 },
  { name: 'Amritsar, Punjab, India', lat: 31.6340, lng: 74.8723, tz: 5.5 },
  { name: 'Ludhiana, Punjab, India', lat: 30.9010, lng: 75.8573, tz: 5.5 },
  { name: 'Ranchi, Jharkhand, India', lat: 23.3441, lng: 85.3096, tz: 5.5 },
  { name: 'Bhubaneswar, Odisha, India', lat: 20.2961, lng: 85.8245, tz: 5.5 },
  { name: 'Guwahati, Assam, India', lat: 26.1445, lng: 91.7362, tz: 5.5 },
  { name: 'Dehradun, Uttarakhand, India', lat: 30.3165, lng: 78.0322, tz: 5.5 },
  { name: 'Haridwar, Uttarakhand, India', lat: 29.9457, lng: 78.1642, tz: 5.5 },
  { name: 'Rishikesh, Uttarakhand, India', lat: 30.0869, lng: 78.2676, tz: 5.5 },
  { name: 'Gaya, Bihar, India', lat: 24.7955, lng: 85.0002, tz: 5.5 },
  { name: 'Ujjain, Madhya Pradesh, India', lat: 23.1765, lng: 75.7885, tz: 5.5 },
  { name: 'Prayagraj, Uttar Pradesh, India', lat: 25.4358, lng: 81.8463, tz: 5.5 },
  { name: 'Allahabad, Uttar Pradesh, India', lat: 25.4358, lng: 81.8463, tz: 5.5 },
  { name: 'Dubai, United Arab Emirates', lat: 25.2048, lng: 55.2708, tz: 4.0 },
  { name: 'London, United Kingdom', lat: 51.5074, lng: -0.1278, tz: 0.0 },
  { name: 'New York, United States', lat: 40.7128, lng: -74.0060, tz: -5.0 },
  { name: 'San Francisco, United States', lat: 37.7749, lng: -122.4194, tz: -8.0 },
  { name: 'Toronto, Canada', lat: 43.6532, lng: -79.3832, tz: -5.0 },
  { name: 'Singapore, Singapore', lat: 1.3521, lng: 103.8198, tz: 8.0 },
  { name: 'Sydney, Australia', lat: -33.8688, lng: 151.2093, tz: 10.0 }
];

export const ZODIAC_SIGNS = [
  { id: 1, name: 'Aries', sanskrit: 'Mesha', ruler: 'Mars', element: 'Fire' },
  { id: 2, name: 'Taurus', sanskrit: 'Vrishabha', ruler: 'Venus', element: 'Earth' },
  { id: 3, name: 'Gemini', sanskrit: 'Mithuna', ruler: 'Mercury', element: 'Air' },
  { id: 4, name: 'Cancer', sanskrit: 'Karka', ruler: 'Moon', element: 'Water' },
  { id: 5, name: 'Leo', sanskrit: 'Simha', ruler: 'Sun', element: 'Fire' },
  { id: 6, name: 'Virgo', sanskrit: 'Kanya', ruler: 'Mercury', element: 'Earth' },
  { id: 7, name: 'Libra', sanskrit: 'Tula', ruler: 'Venus', element: 'Air' },
  { id: 8, name: 'Scorpio', sanskrit: 'Vrishchika', ruler: 'Mars', element: 'Water' },
  { id: 9, name: 'Sagittarius', sanskrit: 'Dhanu', ruler: 'Jupiter', element: 'Fire' },
  { id: 10, name: 'Capricorn', sanskrit: 'Makara', ruler: 'Saturn', element: 'Earth' },
  { id: 11, name: 'Aquarius', sanskrit: 'Kumbha', ruler: 'Saturn', element: 'Air' },
  { id: 12, name: 'Pisces', sanskrit: 'Meena', ruler: 'Jupiter', element: 'Water' },
];

export const NAKSHATRAS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
  'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
];

/**
 * Normalizes angle to 0 - 360 degrees
 */
function normalizeAngle(angle) {
  let b = angle % 360;
  if (b < 0) b += 360;
  return b;
}

/**
 * Calculates Julian Day Number from Gregorian Date & Universal Time (UT)
 */
function getJulianDay(year, month, day, decimalHourUT) {
  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  const jd = Math.floor(365.25 * (y + 4716)) +
             Math.floor(30.6001 * (m + 1)) +
             day + B - 1524.5 + (decimalHourUT / 24.0);
  return jd;
}

/**
 * Approximate Lahiri Ayanamsha for a given Julian Day
 */
function getLahiriAyanamsha(jd) {
  // Epoch J2000.0 is JD 2451545.0 (Ayanamsha ~ 23.856 deg)
  // Annual precession ~ 50.29 arcseconds = 0.013969 degrees/year
  const daysSince2000 = jd - 2451545.0;
  const years = daysSince2000 / 365.25;
  return 23.856 + (years * 0.013969);
}

/**
 * Calculates planetary Nirayana (Sidereal) longitudes using astronomical mean orbital elements
 */
function calculateVedicPlanets(jd, lat, lng) {
  const ayanamsha = getLahiriAyanamsha(jd);
  const T = (jd - 2451545.0) / 36525.0; // Julian centuries since J2000

  // 1. Sun (Surya)
  const L0_sun = normalizeAngle(280.46646 + 36000.76983 * T);
  const M_sun = normalizeAngle(357.52911 + 35999.05029 * T);
  const C_sun = (1.914602 - 0.004817 * T) * Math.sin(M_sun * Math.PI / 180) +
                (0.019993 - 0.000101 * T) * Math.sin(2 * M_sun * Math.PI / 180);
  const tropicalSun = normalizeAngle(L0_sun + C_sun);
  const siderealSun = normalizeAngle(tropicalSun - ayanamsha);

  // 2. Moon (Chandra)
  const L_moon = normalizeAngle(218.3165 + 481267.8813 * T);
  const M_moon = normalizeAngle(134.9634 + 477198.8675 * T);
  const D_moon = normalizeAngle(297.8502 + 445267.1114 * T);
  const C_moon = 6.289 * Math.sin(M_moon * Math.PI / 180) +
                 1.274 * Math.sin((2 * D_moon - M_moon) * Math.PI / 180) +
                 0.658 * Math.sin(2 * D_moon * Math.PI / 180) -
                 0.186 * Math.sin(M_sun * Math.PI / 180);
  const tropicalMoon = normalizeAngle(L_moon + C_moon);
  const siderealMoon = normalizeAngle(tropicalMoon - ayanamsha);

  // 3. Rahu (Mean North Node) - retrograde motion
  const tropicalRahu = normalizeAngle(125.04452 - 1934.136261 * T);
  const siderealRahu = normalizeAngle(tropicalRahu - ayanamsha);

  // 4. Ketu (180 deg opposite Rahu)
  const siderealKetu = normalizeAngle(siderealRahu + 180);

  // 5. Saturn (Shani)
  const L_saturn = normalizeAngle(50.07744 + 1222.1138 * T);
  const M_saturn = normalizeAngle(317.0207 + 1206.653 * T);
  const C_saturn = 6.3 * Math.sin(M_saturn * Math.PI / 180);
  const tropicalSaturn = normalizeAngle(L_saturn + C_saturn);
  const siderealSaturn = normalizeAngle(tropicalSaturn - ayanamsha);

  // 6. Jupiter (Guru)
  const L_jupiter = normalizeAngle(34.3515 + 3034.9057 * T);
  const M_jupiter = normalizeAngle(20.0202 + 3034.69 * T);
  const C_jupiter = 5.5 * Math.sin(M_jupiter * Math.PI / 180);
  const tropicalJupiter = normalizeAngle(L_jupiter + C_jupiter);
  const siderealJupiter = normalizeAngle(tropicalJupiter - ayanamsha);

  // 7. Mars (Mangal)
  const L_mars = normalizeAngle(355.433 + 19140.299 * T);
  const tropicalMars = normalizeAngle(L_mars);
  const siderealMars = normalizeAngle(tropicalMars - ayanamsha);

  // 8. Venus (Shukra)
  const L_venus = normalizeAngle(181.979 + 58517.815 * T);
  const tropicalVenus = normalizeAngle(L_venus);
  const siderealVenus = normalizeAngle(tropicalVenus - ayanamsha);

  // 9. Mercury (Budha)
  const L_mercury = normalizeAngle(252.25 + 149472.67 * T);
  const tropicalMercury = normalizeAngle(L_mercury);
  const siderealMercury = normalizeAngle(tropicalMercury - ayanamsha);

  // Ascendant (Lagna) Calculation based on Local Sidereal Time
  const d = jd - 2451545.0;
  const GMST = normalizeAngle(280.46061837 + 360.98564736629 * d);
  const RAMC = normalizeAngle(GMST + lng); // Local Sidereal Time in degrees
  const eps = 23.4392911 - 0.0130042 * T; // Obliquity of ecliptic
  const epsRad = eps * Math.PI / 180;
  const ramcRad = RAMC * Math.PI / 180;
  const latRad = lat * Math.PI / 180;

  const yAsc = Math.cos(ramcRad);
  const xAsc = -Math.sin(ramcRad) * Math.cos(epsRad) - Math.tan(latRad) * Math.sin(epsRad);
  let ascTropical = Math.atan2(yAsc, xAsc) * (180 / Math.PI);
  ascTropical = normalizeAngle(ascTropical + 90);
  const siderealAsc = normalizeAngle(ascTropical - ayanamsha);

  return {
    Sun: siderealSun,
    Moon: siderealMoon,
    Mars: siderealMars,
    Mercury: siderealMercury,
    Jupiter: siderealJupiter,
    Venus: siderealVenus,
    Saturn: siderealSaturn,
    Rahu: siderealRahu,
    Ketu: siderealKetu,
    Ascendant: siderealAsc,
    ayanamsha,
  };
}

/**
 * Formats a celestial longitude (0-360) into Sign, Degree, Nakshatra, and House index
 */
function getSignAndHouse(longitude, ascendantLongitude) {
  const signIndex = Math.floor(longitude / 30); // 0 = Aries, 1 = Taurus...
  const degreeInSign = longitude % 30;
  const ascSignIndex = Math.floor(ascendantLongitude / 30);
  
  // Whole Sign House system (standard in Vedic Parasari astrology)
  let house = (signIndex - ascSignIndex + 1);
  if (house <= 0) house += 12;

  const nakshatraIndex = Math.floor(longitude / (360 / 27));
  const signInfo = ZODIAC_SIGNS[signIndex];

  return {
    sign: signInfo.name,
    sanskritSign: signInfo.sanskrit,
    ruler: signInfo.ruler,
    element: signInfo.element,
    degree: degreeInSign.toFixed(2),
    totalDegree: longitude,
    signIndex: signIndex + 1, // 1-indexed
    house,
    nakshatra: NAKSHATRAS[nakshatraIndex] || 'Ashwini',
  };
}

/**
 * Determines planetary dignity in Vedic astrology
 */
function getPlanetaryDignity(planetName, signName) {
  const exaltations = {
    Sun: 'Aries',
    Moon: 'Taurus',
    Mars: 'Capricorn',
    Mercury: 'Virgo',
    Jupiter: 'Cancer',
    Venus: 'Pisces',
    Saturn: 'Libra',
    Rahu: 'Taurus',
    Ketu: 'Scorpio',
  };

  const debilitations = {
    Sun: 'Libra',
    Moon: 'Scorpio',
    Mars: 'Cancer',
    Mercury: 'Pisces',
    Jupiter: 'Capricorn',
    Venus: 'Virgo',
    Saturn: 'Aries',
    Rahu: 'Scorpio',
    Ketu: 'Taurus',
  };

  const ownSigns = {
    Sun: ['Leo'],
    Moon: ['Cancer'],
    Mars: ['Aries', 'Scorpio'],
    Mercury: ['Gemini', 'Virgo'],
    Jupiter: ['Sagittarius', 'Pisces'],
    Venus: ['Taurus', 'Libra'],
    Saturn: ['Capricorn', 'Aquarius'],
  };

  if (exaltations[planetName] === signName) return 'Exalted (Uchcha)';
  if (debilitations[planetName] === signName) return 'Debilitated (Neecha)';
  if (ownSigns[planetName]?.includes(signName)) return 'Own Sign (Swakshetra)';
  return 'Normal Placement';
}

/**
 * Checks angular distance between two planetary longitudes
 */
function getAngularDistance(lon1, lon2) {
  let diff = Math.abs(lon1 - lon2) % 360;
  if (diff > 180) diff = 360 - diff;
  return diff;
}

/**
 * Main Engine: Calculates Pitra Dosha status, triggered rules, cancellations, and remedies
 */
export function calculatePitraDosha({
  fullName,
  dateOfBirth, // YYYY-MM-DD
  timeOfBirth, // HH:MM
  timePeriod,  // 'AM' | 'PM'
  birthPlace,  // String or object
  whatsappNumber,
}) {
  if (!dateOfBirth || !timeOfBirth) {
    throw new Error('Please provide valid Date and Time of birth');
  }

  // 1. Resolve coordinates & timezone
  const inputCity = (birthPlace || '').trim().toLowerCase();
  let resolvedCity = CITIES_DATABASE.find(c => {
    const cLower = c.name.toLowerCase();
    const primary = c.name.split(',')[0].toLowerCase();
    return inputCity.includes(primary) || cLower.includes(inputCity) || inputCity.includes(cLower);
  });

  if (!resolvedCity) {
    // Default fallback to New Delhi / IST if not found
    resolvedCity = {
      name: birthPlace || 'New Delhi, India',
      lat: 28.6139,
      lng: 77.2090,
      tz: 5.5,
    };
  }

  // 2. Parse Date and Time to Universal Time (UTC)
  const [yearStr, monthStr, dayStr] = dateOfBirth.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);

  const [rawHoursStr, rawMinutesStr] = timeOfBirth.split(':');
  let hours = parseInt(rawHoursStr, 10);
  const minutes = parseInt(rawMinutesStr, 10) || 0;

  if (timePeriod === 'PM' && hours < 12) hours += 12;
  if (timePeriod === 'AM' && hours === 12) hours = 0;

  // Local decimal hours
  const localDecimalHours = hours + (minutes / 60.0);
  // UTC decimal hours
  let utcDecimalHours = localDecimalHours - resolvedCity.tz;
  let adjustedDay = day;
  let adjustedMonth = month;
  let adjustedYear = year;

  if (utcDecimalHours < 0) {
    utcDecimalHours += 24;
    adjustedDay -= 1;
    if (adjustedDay < 1) {
      adjustedMonth -= 1;
      if (adjustedMonth < 1) {
        adjustedMonth = 12;
        adjustedYear -= 1;
      }
      adjustedDay = 28; // safe approximation for boundary
    }
  } else if (utcDecimalHours >= 24) {
    utcDecimalHours -= 24;
    adjustedDay += 1;
  }

  const jd = getJulianDay(adjustedYear, adjustedMonth, adjustedDay, utcDecimalHours);

  // 3. Calculate Planetary Positions
  const planetsRaw = calculateVedicPlanets(jd, resolvedCity.lat, resolvedCity.lng);
  const ascendantInfo = getSignAndHouse(planetsRaw.Ascendant, planetsRaw.Ascendant);

  // Map each planet with sign, house, degree, dignity
  const planets = {};
  for (const pName of ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu']) {
    const info = getSignAndHouse(planetsRaw[pName], planetsRaw.Ascendant);
    const dignity = getPlanetaryDignity(pName, info.sign);
    planets[pName] = {
      ...info,
      dignity,
    };
  }

  // Identify 9th House & 9th Lord
  const ninthHouseSignIndex = ((ascendantInfo.signIndex + 8 - 1) % 12);
  const ninthHouseSign = ZODIAC_SIGNS[ninthHouseSignIndex];
  const ninthLordName = ninthHouseSign.ruler;
  const ninthLordPlanet = planets[ninthLordName];

  // 4. PITRA DOSHA RULE ENGINE (Vedic Jyotish Shastras)
  const triggeredRules = [];
  let doshaPoints = 0;

  // Rule 1: Sun conjunct Rahu (Surya Grahan / Pitra Rin - Classic BPHS)
  const sunRahuDist = getAngularDistance(planetsRaw.Sun, planetsRaw.Rahu);
  if (planets.Sun.sign === planets.Rahu.sign || sunRahuDist < 12) {
    triggeredRules.push({
      code: 'SURYA_RAHU_YUTI',
      title: 'Surya - Rahu Conjunction (Surya Grahan Yoga)',
      intensity: 'High',
      points: 3,
      description: 'Sun (Surya - Karaka of Father and Pitrus) is afflicted by Rahu, creating an ancestral shadow (Surya Grahan). In classical astrology, this indicates unresolved paternal karma requiring formal tarpan and solar mantras.',
    });
    doshaPoints += 3;
  }

  // Rule 2: Sun conjunct Ketu (Ketu Grasta Surya)
  const sunKetuDist = getAngularDistance(planetsRaw.Sun, planetsRaw.Ketu);
  if (planets.Sun.sign === planets.Ketu.sign || sunKetuDist < 12) {
    triggeredRules.push({
      code: 'SURYA_KETU_YUTI',
      title: 'Surya - Ketu Conjunction',
      intensity: 'Moderate to High',
      points: 2.5,
      description: 'Sun conjunct spiritual node Ketu indicates sudden obstacles or ancestral debts related to unfulfilled pledges made by elders.',
    });
    doshaPoints += 2.5;
  }

  // Rule 3: Sun afflicted by Saturn (Surya-Shani Conflict)
  const sunSaturnDist = getAngularDistance(planetsRaw.Sun, planetsRaw.Saturn);
  if (planets.Sun.sign === planets.Saturn.sign || (sunSaturnDist >= 170 && sunSaturnDist <= 190)) {
    triggeredRules.push({
      code: 'SURYA_SHANI_AFFLICTION',
      title: 'Sun - Saturn Conjunction or Direct Opposition',
      intensity: 'Moderate',
      points: 2,
      description: 'Sun and Saturn form a tense alignment. In Vedic lore, Sun represents the King/Father and Saturn represents Karma. This can bring friction between father and children or delays in inheritance.',
    });
    doshaPoints += 2;
  }

  // Rule 4: Rahu or Ketu in the 9th House (Pitru Bhava)
  if (planets.Rahu.house === 9) {
    triggeredRules.push({
      code: 'RAHU_IN_9TH',
      title: 'Rahu Situated in the 9th House (Pitru Sthana)',
      intensity: 'High',
      points: 3,
      description: 'The 9th house is the foundational seat of Dharma, Father, and Ancestors. Rahu in the 9th directly afflicts the Pitru Bhava, causing fluctuating fortune and ancestral debts.',
    });
    doshaPoints += 3;
  } else if (planets.Ketu.house === 9) {
    triggeredRules.push({
      code: 'KETU_IN_9TH',
      title: 'Ketu Situated in the 9th House',
      intensity: 'Moderate',
      points: 2,
      description: 'Ketu in the 9th house signifies spiritual karmic obligations from ancestors, often manifesting as detachment or spiritual seeking.',
    });
    doshaPoints += 2;
  }

  // Rule 5: Saturn in the 9th House
  if (planets.Saturn.house === 9) {
    triggeredRules.push({
      code: 'SATURN_IN_9TH',
      title: 'Saturn Placed in the 9th House',
      intensity: 'Moderate',
      points: 1.5,
      description: 'Saturn residing in the 9th house introduces heavy karmic lessons and trials in fortune, requiring patient dharmic service and respect for elders.',
    });
    doshaPoints += 1.5;
  }

  // Rule 6: 9th Lord Afflicted or in Dusthana (6th, 8th, or 12th House)
  if (ninthLordPlanet && [6, 8, 12].includes(ninthLordPlanet.house)) {
    triggeredRules.push({
      code: 'NINTH_LORD_DUSTHANA',
      title: `9th Lord (${ninthLordName}) Placed in ${ninthLordPlanet.house}th Dusthana House`,
      intensity: 'Moderate',
      points: 2,
      description: `The ruler of your ancestral 9th house (${ninthLordName}) is situated in the ${ninthLordPlanet.house}th house of debts, transformations, or losses, weakening the natural ancestral protection shield.`,
    });
    doshaPoints += 2;
  }

  // Rule 7: Sun in 8th or 12th House with Malefic Affliction
  if ([8, 12].includes(planets.Sun.house) && ([planets.Rahu.house, planets.Saturn.house, planets.Ketu.house].includes(planets.Sun.house))) {
    triggeredRules.push({
      code: 'SUN_IN_TRIK_MALEFIC',
      title: `Sun in ${planets.Sun.house}th House with Malefic Node / Saturn`,
      intensity: 'Moderate to High',
      points: 2.5,
      description: 'Sun in the hidden 8th or 12th house along with Rahu or Saturn points towards unperformed rites or lineage hurdles.',
    });
    doshaPoints += 2.5;
  }

  // Rule 8: Moon Afflicted by Rahu or Saturn in 4th/9th House (Matru-Pitra Rin)
  if ([4, 9].includes(planets.Moon.house) && (planets.Moon.sign === planets.Rahu.sign || planets.Moon.sign === planets.Saturn.sign)) {
    triggeredRules.push({
      code: 'MATRU_PITRA_RIN',
      title: 'Moon Afflicted in 4th / 9th House (Matru-Pitra Rin)',
      intensity: 'Mild to Moderate',
      points: 1.5,
      description: 'Moon (Matru Karaka) afflicted in parental houses indicates emotional ancestral baggage on the maternal lineage side.',
    });
    doshaPoints += 1.5;
  }

  // 5. CANCELLATION & MITIGATION ENGINE (Bhanga / Shanti Factors)
  const mitigations = [];
  let mitigationPoints = 0;

  // A. Jupiter's Divine Aspect (Guru Drishti) on 9th House, 9th Lord, or Sun
  // Jupiter aspects 5th, 7th, 9th houses from its placement
  const jupHouse = planets.Jupiter.house;
  const jupAspectHouses = [jupHouse, (jupHouse + 4) % 12 || 12, (jupHouse + 6) % 12 || 12, (jupHouse + 8) % 12 || 12];
  
  if (jupAspectHouses.includes(9) || jupAspectHouses.includes(planets.Sun.house) || (ninthLordPlanet && jupAspectHouses.includes(ninthLordPlanet.house))) {
    mitigations.push({
      title: 'Benefic Jupiter (Guru) Aspect on Pitru Factors',
      factor: 'Divine Grace (Guru Drishti)',
      benefit: 'Significantly shields against malefic effects and opens spiritual redemption.',
      reduction: 2.5,
    });
    mitigationPoints += 2.5;
  }

  // B. Jupiter in Kendra (1, 4, 7, 10) or Trikona (1, 5, 9)
  if ([1, 4, 5, 7, 9, 10].includes(planets.Jupiter.house)) {
    mitigations.push({
      title: `Jupiter Well-Placed in ${planets.Jupiter.house}th House`,
      factor: 'Kendra / Trikona Strength',
      benefit: 'Acts as a strong moral and karmic stabilizer for the entire horoscope.',
      reduction: 1.5,
    });
    mitigationPoints += 1.5;
  }

  // C. Sun Exalted in Aries or in Own Sign Leo
  if (['Aries', 'Leo'].includes(planets.Sun.sign)) {
    mitigations.push({
      title: `Sun in ${planets.Sun.sign} (${planets.Sun.dignity})`,
      factor: 'High Solar Dignity',
      benefit: 'When Sun is powerful in Aries or Leo, ancestral vitality and leadership remain resilient.',
      reduction: 2.0,
    });
    mitigationPoints += 2.0;
  }

  // D. 9th Lord in Own Sign or Exalted
  if (ninthLordPlanet && ['Exalted (Uchcha)', 'Own Sign (Swakshetra)'].includes(ninthLordPlanet.dignity)) {
    mitigations.push({
      title: `9th Lord (${ninthLordName}) in ${ninthLordPlanet.dignity}`,
      factor: 'Fortified Pitru Lord',
      benefit: 'The ruler of the ancestral house has superior strength, neutralizing family curses.',
      reduction: 2.0,
    });
    mitigationPoints += 2.0;
  }

  // E. Benefic Venus or Mercury in 9th House without Rahu/Saturn
  if ([planets.Venus.house, planets.Mercury.house].includes(9) && ![planets.Rahu.house, planets.Saturn.house].includes(9)) {
    mitigations.push({
      title: 'Natural Benefic (Shukra/Budha) in 9th House',
      factor: 'Subha Graha Influence',
      benefit: 'Softens karmic friction and brings auspicious opportunities.',
      reduction: 1.0,
    });
    mitigationPoints += 1.0;
  }

  // Net Dosha Score Calculation
  const netScore = Math.max(0, doshaPoints - mitigationPoints);

  // Status & Intensity categorization
  let status = 'NO_DOSHA';
  let statusText = 'No Pitra Dosha Detected';
  let severity = 'Clean / Blessed';
  let badgeColor = '#2E7D32'; // Green
  let summary = 'Your birth chart shows no major afflicted ancestral karma. You are blessed with Pitru Kripa (ancestral favor and protection).';

  if (netScore > 4.5) {
    status = 'SEVERE';
    statusText = 'Severe Pitra Dosha (High Karmic Debt)';
    severity = 'Severe';
    badgeColor = '#C1272D'; // Deep Red
    summary = 'Multiple primary indicators (Sun afflicted by Rahu/Saturn or 9th house afflictions) are active in your Kundali. This ancestral karma can create persistent career blocks, progeny delays, and family disharmony unless formal Vedic shanti rituals are performed.';
  } else if (netScore >= 2.5) {
    status = 'MODERATE';
    statusText = 'Moderate Pitra Dosha Detected';
    severity = 'Moderate';
    badgeColor = '#D35400'; // Amber/Orange
    summary = 'Moderate ancestral afflictions are detected around the Sun or 9th house. Regular observance of Amavasya tarpan, cow service, and Surya Arghya can resolve these blocks efficiently.';
  } else if (netScore > 0) {
    status = 'MILD';
    statusText = 'Mild Pitra Dosha (Mitigated)';
    severity = 'Mild';
    badgeColor = '#E9A534'; // Gold
    summary = 'A mild ancestral karmic footprint was present, but strong mitigating factors (like Jupiter or Sun dignity) have largely softened its malefic impact. Simple daily mantras and respect for elders will keep your path clear.';
  }

  // Traditional Vedic Remedies Tailored to Identified Yogas
  const remedies = [
    {
      type: 'Daily Ritual',
      title: 'Surya Arghya with Gayatri Mantra',
      instruction: 'Offer fresh water in a copper vessel mixed with kumkum, red flowers, and a pinch of sugar to Lord Surya every morning during sunrise, chanting the Gayatri Mantra or Aditya Hridaya Stotram.',
    },
    {
      type: 'Amavasya Observance',
      title: 'Pitru Tarpan & Black Sesame Donation',
      instruction: 'On every Amavasya (New Moon day) and during Pitru Paksha, offer water with black sesame seeds (til) facing South for the peace of departed ancestors, followed by feeding a Brahmin or needy person.',
    },
    {
      type: 'Sacred Service (Gau Seva)',
      title: 'Feeding Cows & Birds',
      instruction: 'Feed fresh green grass or chapatis with jaggery to cows (Gau Seva) and offer cooked rice mixed with curd to crows and stray dogs, especially on Saturdays and Tuesdays.',
    },
    {
      type: 'Sacred Tree Worship',
      title: 'Watering Peepal Tree',
      instruction: 'Offer water and raw milk to the roots of a sacred Peepal or Banyan tree on Saturdays without physically touching the tree trunk, lighting a mustard oil diya in the evening.',
    },
    {
      type: 'Vedic Shanti Puja',
      title: 'Narayan Bali & Tripindi Shradh',
      instruction: 'For deep-rooted Pitru Rin, a formal Narayan Bali or Tripindi Shradh at holy pilgrimage sites like Haridwar, Gaya, Pehowa, or Trayambakeshwar effectively liberates ancestral souls.',
    },
  ];

  // Specific symptoms / life effects
  const lifeImpacts = [
    { area: 'Career & Progress', effect: status === 'NO_DOSHA' ? 'Steady growth with elder blessings.' : 'Unexplained delays in promotions, sudden career stagnation, or instability.' },
    { area: 'Family & Progeny', effect: status === 'NO_DOSHA' ? 'Peaceful domestic harmony.' : 'Difficulties in conceiving, strained relationship with father/elders, or family disputes.' },
    { area: 'Mental Peace', effect: status === 'NO_DOSHA' ? 'Clear mind and positive outlook.' : 'Restless sleep, occasional dreams of deceased relatives, or persistent feeling of heavy burden.' },
    { area: 'Financial Flow', effect: status === 'NO_DOSHA' ? 'Stable savings and ancestral support.' : 'Money slipping away unexpectedly or disputes surrounding ancestral inheritance.' },
  ];

  return {
    meta: {
      fullName,
      dateOfBirth,
      timeOfBirth,
      timePeriod,
      birthPlace: resolvedCity.name,
      whatsappNumber,
      calculatedAt: new Date().toISOString(),
    },
    scores: {
      rawDoshaPoints: doshaPoints.toFixed(1),
      mitigationPoints: mitigationPoints.toFixed(1),
      netScore: netScore.toFixed(1),
      status,
      statusText,
      severity,
      badgeColor,
    },
    summary,
    ascendant: ascendantInfo,
    ninthHouse: {
      sign: ninthHouseSign.name,
      sanskrit: ninthHouseSign.sanskrit,
      ruler: ninthLordName,
      rulerPlacement: ninthLordPlanet,
    },
    planets,
    triggeredRules,
    mitigations,
    remedies,
    lifeImpacts,
  };
}
