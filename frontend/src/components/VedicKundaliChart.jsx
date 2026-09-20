import React from 'react';

/**
 * Traditional North Indian Janam Kundali (Diamond) Chart Visualizer
 * Accurately plots the 12 Bhavas, Rashi numbers, and planetary placements
 * with special golden illumination on the 9th House (Pitru Bhava).
 */
export default function VedicKundaliChart({ ascendant, planets }) {
  if (!ascendant || !planets) return null;

  const lagnaSignIndex = ascendant.signIndex || 1;

  // Abbreviated planet symbols and styles
  const PLANET_ABBR = {
    Sun: { label: 'Su', name: 'Surya', color: '#D9531E' },
    Moon: { label: 'Mo', name: 'Chandra', color: '#4A5568' },
    Mars: { label: 'Ma', name: 'Mangal', color: '#C53030' },
    Mercury: { label: 'Me', name: 'Budha', color: '#2B6CB0' },
    Jupiter: { label: 'Ju', name: 'Guru', color: '#B7791F' },
    Venus: { label: 'Ve', name: 'Shukra', color: '#805AD5' },
    Saturn: { label: 'Sa', name: 'Shani', color: '#2D3748' },
    Rahu: { label: 'Ra', name: 'Rahu', color: '#9B2C2C' },
    Ketu: { label: 'Ke', name: 'Ketu', color: '#744210' },
  };

  // Group planets by house (1 to 12)
  const housePlanets = {
    1: ['Asc'],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
    8: [],
    9: [],
    10: [],
    11: [],
    12: [],
  };

  Object.entries(planets).forEach(([pName, pData]) => {
    if (pData.house && housePlanets[pData.house]) {
      housePlanets[pData.house].push(pName);
    }
  });

  // Calculate Rashi number in each house
  const getRashiNumber = (houseNum) => {
    return ((lagnaSignIndex - 1 + (houseNum - 1)) % 12) + 1;
  };

  // Coordinates for centers of each of the 12 houses (in 400x400 SVG)
  // Outer square: 0,0 to 400,400
  // Inner diamond vertices: (200, 0), (400, 200), (200, 400), (0, 200)
  // Diagonals: (0,0)-(400,400) and (0,400)-(400,0)
  const HOUSE_CONFIG = {
    1: {
      rashiPos: { x: 200, y: 55 },
      planetsPos: { x: 200, y: 110 },
      isKendra: true,
      name: 'House 1 (Lagna)',
    },
    2: {
      rashiPos: { x: 100, y: 40 },
      planetsPos: { x: 100, y: 75 },
      name: 'House 2 (Dhana)',
    },
    3: {
      rashiPos: { x: 40, y: 100 },
      planetsPos: { x: 50, y: 140 },
      name: 'House 3 (Sahaja)',
    },
    4: {
      rashiPos: { x: 110, y: 160 },
      planetsPos: { x: 110, y: 220 },
      isKendra: true,
      name: 'House 4 (Sukha)',
    },
    5: {
      rashiPos: { x: 40, y: 300 },
      planetsPos: { x: 50, y: 260 },
      name: 'House 5 (Putra)',
    },
    6: {
      rashiPos: { x: 100, y: 360 },
      planetsPos: { x: 100, y: 325 },
      name: 'House 6 (Ari/Roga)',
    },
    7: {
      rashiPos: { x: 200, y: 345 },
      planetsPos: { x: 200, y: 290 },
      isKendra: true,
      name: 'House 7 (Jaya/Kalatra)',
    },
    8: {
      rashiPos: { x: 300, y: 360 },
      planetsPos: { x: 300, y: 325 },
      name: 'House 8 (Ayur/Randhra)',
    },
    9: {
      // 9th House: Pitru Bhava / Ancestral seat!
      rashiPos: { x: 360, y: 300 },
      planetsPos: { x: 350, y: 260 },
      isPitru: true,
      name: 'House 9 (Pitru / Dharma)',
    },
    10: {
      rashiPos: { x: 290, y: 160 },
      planetsPos: { x: 290, y: 220 },
      isKendra: true,
      name: 'House 10 (Karma)',
    },
    11: {
      rashiPos: { x: 360, y: 100 },
      planetsPos: { x: 350, y: 140 },
      name: 'House 11 (Labha)',
    },
    12: {
      rashiPos: { x: 300, y: 40 },
      planetsPos: { x: 300, y: 75 },
      name: 'House 12 (Vyaya)',
    },
  };

  return (
    <div className="rounded-2xl border border-[#2C1210]/10 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
        <div>
          <h3 className="font-serif text-lg font-bold text-[#2C1210] flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#B8380D]" />
            Janam Kundali (Lagna &amp; 9th House Visualizer)
          </h3>
          <p className="mt-0.5 text-xs text-[#564540]">
            Traditional North Indian whole-sign diamond chart. Highlighted 9th House indicates ancestral seat (Pitru Bhava).
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-[#E9A534]/15 px-2.5 py-1 font-semibold text-[#8A4B00] border border-[#E9A534]/30">
            <span className="h-2 w-2 rounded-full bg-[#E9A534]" />
            9th House (Pitru Bhava)
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-md bg-[#B8380D]/10 px-2.5 py-1 font-semibold text-[#B8380D]">
            Lagna: {ascendant.sign}
          </span>
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center justify-center lg:flex-row lg:items-center lg:justify-around gap-8">
        {/* SVG CHART */}
        <div className="relative w-full max-w-[380px] aspect-square select-none">
          <svg
            viewBox="0 0 400 400"
            className="w-full h-full drop-shadow-md"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            <defs>
              {/* Radial glow for 9th House */}
              <radialGradient id="pitruGlow" cx="85%" cy="75%" r="40%">
                <stop offset="0%" stopColor="#E9A534" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#E9A534" stopOpacity="0.08" />
              </radialGradient>
            </defs>

            {/* Base Background */}
            <rect width="400" height="400" fill="#FFFDF9" rx="14" />

            {/* 9th House Highlight Polygon: (300, 300) to (400, 200) to (400, 400) */}
            <polygon
              points="300,300 400,200 400,400"
              fill="url(#pitruGlow)"
              className="animate-pulse"
              style={{ animationDuration: '3s' }}
            />

            {/* 1st House subtle highlight (Lagna) */}
            <polygon
              points="200,0 300,100 200,200 100,100"
              fill="#F9F6F0"
            />

            {/* Outer Boundary Frame */}
            <rect
              x="2"
              y="2"
              width="396"
              height="396"
              fill="none"
              stroke="#8A3B28"
              strokeWidth="3.5"
              rx="12"
            />

            {/* Diagonal 1: (0,0) to (400,400) */}
            <line x1="0" y1="0" x2="400" y2="400" stroke="#8A3B28" strokeWidth="2.2" />

            {/* Diagonal 2: (0,400) to (400,0) */}
            <line x1="0" y1="400" x2="400" y2="0" stroke="#8A3B28" strokeWidth="2.2" />

            {/* Inner Diamond: (200,0) -> (400,200) -> (200,400) -> (0,200) -> close */}
            <polygon
              points="200,0 400,200 200,400 0,200"
              fill="none"
              stroke="#8A3B28"
              strokeWidth="2.2"
            />

            {/* 9th House Special Golden Border Accent */}
            <polygon
              points="300,300 400,200 400,400"
              fill="none"
              stroke="#D88A36"
              strokeWidth="2.5"
              strokeDasharray="4 2"
            />

            {/* RASHI NUMBERS & PLANETS FOR EACH HOUSE */}
            {Object.entries(HOUSE_CONFIG).map(([hNumStr, config]) => {
              const hNum = parseInt(hNumStr, 10);
              const rashi = getRashiNumber(hNum);
              const planetsInHouse = housePlanets[hNum] || [];

              return (
                <g key={hNum}>
                  {/* Rashi Number in small circle */}
                  <text
                    x={config.rashiPos.x}
                    y={config.rashiPos.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="text-[12px] font-bold"
                    fill={config.isPitru ? '#A04000' : '#8A4B38'}
                  >
                    {rashi}
                  </text>

                  {/* 9th House label banner */}
                  {config.isPitru && (
                    <text
                      x={config.rashiPos.x - 15}
                      y={config.rashiPos.y + 16}
                      textAnchor="middle"
                      className="text-[9px] font-black uppercase tracking-wider"
                      fill="#B8380D"
                    >
                      ✦ 9th Pitru
                    </text>
                  )}

                  {/* House Planets Listed */}
                  <g>
                    {planetsInHouse.map((p, pIdx) => {
                      const isAsc = p === 'Asc';
                      const pInfo = PLANET_ABBR[p] || { label: p, color: '#2C1210' };
                      const yOffset = (pIdx - (planetsInHouse.length - 1) / 2) * 16;

                      return (
                        <text
                          key={p}
                          x={config.planetsPos.x}
                          y={config.planetsPos.y + yOffset}
                          textAnchor="middle"
                          dominantBaseline="central"
                          className="text-[11.5px] font-black"
                          fill={isAsc ? '#B8380D' : pInfo.color}
                        >
                          {isAsc ? 'ASC (Lagna)' : pInfo.label}
                        </text>
                      );
                    })}
                  </g>
                </g>
              );
            })}
          </svg>
        </div>

        {/* LEGEND & EXPLANATION COLUMN */}
        <div className="w-full lg:max-w-xs space-y-4">
          <div className="rounded-xl border border-amber-200/80 bg-amber-50/60 p-4">
            <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-[#8A4B00]">
              How to Read Your Chart
            </h4>
            <p className="mt-1.5 text-xs text-[#564540] leading-relaxed">
              • Top diamond is <strong>House 1 (Lagna)</strong> with Rashi number <strong>{lagnaSignIndex} ({ascendant.sign})</strong>.
            </p>
            <p className="mt-1 text-xs text-[#564540] leading-relaxed">
              • <strong>Golden House 9</strong> (Bottom-Right) represents <strong>Pitru Bhava</strong> (Father &amp; Ancestors).
            </p>
            <p className="mt-1 text-xs text-[#564540] leading-relaxed">
              • Numbers (1–12) indicate the Zodiac Signs in each Bhava.
            </p>
          </div>

          <div className="rounded-xl border border-gray-100 bg-gray-50/80 p-3.5">
            <h5 className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">
              Planetary Legend
            </h5>
            <div className="grid grid-cols-3 gap-2 text-[11px] text-[#2C1210]">
              <span className="flex items-center gap-1 font-medium">
                <span className="text-[#D9531E] font-bold">Su:</span> Sun
              </span>
              <span className="flex items-center gap-1 font-medium">
                <span className="text-[#4A5568] font-bold">Mo:</span> Moon
              </span>
              <span className="flex items-center gap-1 font-medium">
                <span className="text-[#C53030] font-bold">Ma:</span> Mars
              </span>
              <span className="flex items-center gap-1 font-medium">
                <span className="text-[#2B6CB0] font-bold">Me:</span> Mercury
              </span>
              <span className="flex items-center gap-1 font-medium">
                <span className="text-[#B7791F] font-bold">Ju:</span> Jupiter
              </span>
              <span className="flex items-center gap-1 font-medium">
                <span className="text-[#805AD5] font-bold">Ve:</span> Venus
              </span>
              <span className="flex items-center gap-1 font-medium">
                <span className="text-[#2D3748] font-bold">Sa:</span> Saturn
              </span>
              <span className="flex items-center gap-1 font-medium">
                <span className="text-[#9B2C2C] font-bold">Ra:</span> Rahu
              </span>
              <span className="flex items-center gap-1 font-medium">
                <span className="text-[#744210] font-bold">Ke:</span> Ketu
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
