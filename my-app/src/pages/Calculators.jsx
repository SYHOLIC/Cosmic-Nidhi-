import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calculator, 
  Calendar, 
  Clock, 
  Users, 
  Heart,
  Star,
  ArrowRight,
  Sun,
  Moon,
  Sparkles,
  Gem,
  Home,
  Compass,
  User,
  Mail,
  Phone,
  MapPin,
  ChevronDown,
  ChevronUp,
  CheckCircle
} from 'lucide-react';
import Reveal from '../components/Reveal';

// Calculator Data
const CALCULATORS = [
  {
    id: 'zodiac',
    title: 'Zodiac Sign Calculator',
    icon: Star,
    description: 'Find your sun sign, moon sign, and rising sign based on your birth details',
    color: '#C1272D',
    fields: ['Full Name', 'Date of Birth', 'Time of Birth', 'Place of Birth'],
  },
  {
    id: 'numerology',
    title: 'Numerology Calculator',
    icon: Calculator,
    description: 'Calculate your life path number, destiny number, and soul urge number',
    color: '#E9A534',
    fields: ['Full Name', 'Date of Birth'],
  },
  {
    id: 'compatibility',
    title: 'Love Compatibility',
    icon: Heart,
    description: 'Check compatibility between two people based on their birth charts',
    color: '#C1272D',
    fields: ['Partner 1 Name', 'Partner 1 DOB', 'Partner 2 Name', 'Partner 2 DOB'],
  },
  {
    id: 'mangal',
    title: 'Mangal Dosha Checker',
    icon: Compass,
    description: 'Check if Mars is malefic in your birth chart and its intensity',
    color: '#5A0E14',
    fields: ['Full Name', 'Date of Birth', 'Time of Birth', 'Place of Birth'],
  },
  {
    id: 'muhurat',
    title: 'Auspicious Muhurat',
    icon: Calendar,
    description: 'Find the most auspicious dates and times for your important events',
    color: '#E9A534',
    fields: ['Event Type', 'Preferred Date Range', 'City'],
  },
  {
    id: 'namkaran',
    title: 'Name Numerology',
    icon: User,
    description: 'Analyze the numerological significance of your name',
    color: '#C1272D',
    fields: ['Full Name', 'Date of Birth'],
  },
];

// Sample results data (for demonstration)
const sampleResults = {
  zodiac: {
    sunSign: 'Aries ♈',
    moonSign: 'Taurus ♉',
    risingSign: 'Gemini ♊',
    element: 'Fire',
    rulingPlanet: 'Mars',
    description: 'You are a natural leader with passion and determination. Your moon sign suggests emotional stability, while your rising sign makes you curious and communicative.'
  },
  numerology: {
    lifePath: '7',
    destiny: '5',
    soulUrge: '3',
    description: 'Life Path 7: You are a seeker of truth and wisdom. Destiny 5: You are adventurous and freedom-loving. Soul Urge 3: You are creative and expressive.'
  },
  compatibility: {
    score: '85%',
    level: 'High Compatibility',
    description: 'You and your partner share a strong emotional and intellectual connection. Your communication styles complement each other well.',
    strengths: ['Emotional bonding', 'Intellectual connection', 'Shared values'],
    challenges: ['Different approaches to finances', 'Need for personal space']
  },
  mangal: {
    dosha: 'Present',
    intensity: 'Mild',
    description: 'Mild Mangal Dosha detected. This may cause some challenges in relationships but can be balanced with simple remedies.',
    remedies: ['Wear red coral', 'Chant Mars mantras on Tuesdays', 'Donate to temples']
  },
  muhurat: {
    dates: ['March 15, 2026', 'March 22, 2026', 'April 5, 2026'],
    times: ['10:30 AM - 12:00 PM', '3:00 PM - 5:00 PM'],
    description: 'These dates and times are considered highly auspicious for your chosen event.'
  },
  namkaran: {
    number: '9',
    meaning: 'Compassionate and Humanitarian',
    description: 'Your name resonates with the energy of universal love and compassion. You are likely to be drawn towards helping others and making a positive impact.'
  }
};

function CalculatorCard({ calculator, index, onOpen }) {
  const Icon = calculator.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      viewport={{ once: true }}
      onClick={() => onOpen(calculator)}
      className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-[#5A0E14]/8 cursor-pointer"
    >
      <div className="p-6 md:p-8">
        <div className="flex items-start justify-between">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: calculator.color + '20' }}>
            <Icon className="w-7 h-7" style={{ color: calculator.color }} />
          </div>
          <span className="text-xs font-medium text-[#5A0E14]/30 font-sans">0{index + 1}</span>
        </div>
        
        <h3 className="font-display text-xl text-[#3C080D] mt-4 group-hover:text-[#C1272D] transition-colors duration-300">
          {calculator.title}
        </h3>
        <p className="text-[#2C1210]/60 font-sans text-sm mt-2 leading-relaxed">
          {calculator.description}
        </p>
        
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-[#5A0E14]/40 font-sans">
            {calculator.fields.length} fields
          </span>
          <span className="inline-flex items-center gap-1 text-sm text-[#E9A534] font-medium group-hover:translate-x-1 transition-transform duration-300">
            Calculate <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function CalculatorModal({ calculator, isOpen, onClose }) {
  const [formData, setFormData] = useState({});
  const [result, setResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleCalculate = () => {
    setLoading(true);
    // Simulate calculation
    setTimeout(() => {
      setResult(sampleResults[calculator.id]);
      setShowResult(true);
      setLoading(false);
    }, 1500);
  };

  const handleReset = () => {
    setFormData({});
    setResult(null);
    setShowResult(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B0818]/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#FFF7E9] rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-[#FFF7E9] z-10 p-6 border-b border-[#5A0E14]/8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: calculator.color + '20' }}>
              <calculator.icon className="w-5 h-5" style={{ color: calculator.color }} />
            </div>
            <h2 className="font-display text-2xl text-[#3C080D]">{calculator.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#5A0E14]/40 hover:text-[#C1272D] transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-6 md:p-8">
          {!showResult ? (
            <>
              {/* Input Fields */}
              <div className="space-y-4">
                {calculator.fields.map((field, index) => (
                  <div key={index}>
                    <label className="text-sm font-medium text-[#5A0E14]/80 font-sans block mb-1.5">
                      {field}
                    </label>
                    <input
                      type={field.includes('DOB') || field.includes('Date') ? 'date' : 'text'}
                      placeholder={`Enter ${field}`}
                      value={formData[field] || ''}
                      onChange={(e) => handleInputChange(field, e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[#5A0E14]/15 bg-white focus:border-[#C1272D] focus:ring-2 focus:ring-[#C1272D]/20 outline-none transition-all duration-300 font-sans text-[#2C1210]"
                    />
                  </div>
                ))}
              </div>

              {/* Calculate Button */}
              <button
                onClick={handleCalculate}
                disabled={loading}
                className="mt-6 w-full bg-[#C1272D] text-[#FFF7E9] px-8 py-3.5 rounded-full text-sm font-semibold hover:bg-[#9C1C22] transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-sans"
              >
                {loading ? 'Calculating...' : 'Calculate Now'}
              </button>
            </>
          ) : (
            <>
              {/* Results */}
              <div className="space-y-4">
                {Object.entries(result).map(([key, value]) => {
                  if (key === 'strengths' || key === 'challenges' || key === 'remedies') {
                    return (
                      <div key={key} className="bg-[#FDECC8]/30 rounded-xl p-4">
                        <h4 className="font-display text-lg text-[#3C080D] capitalize mb-2">
                          {key}
                        </h4>
                        <ul className="space-y-1.5">
                          {value.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-[#2C1210]/70 font-sans">
                              <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#E9A534]" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  }
                  
                  if (typeof value === 'object') {
                    return (
                      <div key={key} className="bg-[#FDECC8]/30 rounded-xl p-4">
                        <h4 className="font-display text-lg text-[#3C080D] capitalize mb-2">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </h4>
                        <div className="space-y-1">
                          {Object.entries(value).map(([k, v]) => (
                            <p key={k} className="text-sm text-[#2C1210]/70 font-sans">
                              <span className="font-medium capitalize">{k}:</span> {v}
                            </p>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  
                  return (
                    <div key={key} className="bg-[#FDECC8]/30 rounded-xl p-4">
                      <h4 className="font-display text-lg text-[#3C080D] capitalize mb-2">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </h4>
                      <p className="text-[#2C1210]/70 font-sans text-sm">{value}</p>
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap gap-4">
                <button
                  onClick={handleReset}
                  className="flex-1 bg-[#5A0E14] text-[#FFF7E9] px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#3C080D] transition-all duration-300 font-sans"
                >
                  Calculate Again
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 border-2 border-[#C1272D] text-[#C1272D] px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#C1272D] hover:text-[#FFF7E9] transition-all duration-300 font-sans"
                >
                  Close
                </button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function CalculatorsPage() {
  const [selectedCalculator, setSelectedCalculator] = useState(null);

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#FFF7E9] pt-32 md:pt-40 pb-12 md:pb-16">
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-[#C1272D]/8 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#E9A534]/8 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-sm tracking-[0.3em] uppercase text-[#C1272D] font-sans font-semibold">
                Tools & Calculators
              </p>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-4 font-display text-4xl md:text-5xl lg:text-6xl text-[#3C080D]"
            >
              Discover Your{" "}
              <span className="inline-block bg-gradient-to-r from-[#5A0E14] via-[#C1272D] to-[#E9A534] bg-clip-text text-transparent bg-[length:200%_100%] animate-gradient-x">
                Cosmic Profile
              </span>
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-4 flex items-center justify-center gap-3"
            >
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#E9A534]" />
              <span className="text-[#E9A534] text-sm">✦</span>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#E9A534]" />
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="mt-4 max-w-2xl mx-auto text-[#5A0E14]/60 font-sans text-base md:text-lg"
            >
              Use our free astrology calculators to gain insights into your zodiac sign, numerology, compatibility, and more.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Calculators Grid */}
      <section className="relative overflow-hidden bg-[#FFF7E9] py-12 md:py-16">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C1272D]/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#E9A534]/5 blur-3xl pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CALCULATORS.map((calculator, index) => (
              <CalculatorCard
                key={calculator.id}
                calculator={calculator}
                index={index}
                onOpen={setSelectedCalculator}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="bg-[#FFF7E9] pb-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#E9A534]" />
            <span className="text-xs tracking-[0.2em] uppercase text-[#5A0E14]/40 font-sans">
              ✦ Disclaimer ✦
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#E9A534]" />
          </div>
          <p className="text-xs text-[#5A0E14]/40 font-sans leading-relaxed">
            These calculators provide astrological insights for entertainment and self-reflection purposes only. 
            They are not a substitute for professional advice. Results are based on traditional astrological principles 
            and should be considered as guidance, not absolute predictions.
          </p>
        </div>
      </section>

      {/* Modal */}
      {selectedCalculator && (
        <CalculatorModal
          calculator={selectedCalculator}
          isOpen={!!selectedCalculator}
          onClose={() => setSelectedCalculator(null)}
        />
      )}
    </>
  );
}