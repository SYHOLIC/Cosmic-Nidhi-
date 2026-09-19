import { motion } from 'framer-motion';

const zodiacSigns = [
  { name: 'Aries', date: 'Mar 21 - Apr 19', emoji: '♈', color: '#FF6B6B' },
  { name: 'Taurus', date: 'Apr 20 - May 20', emoji: '♉', color: '#4CAF50' },
  { name: 'Gemini', date: 'May 21 - Jun 20', emoji: '♊', color: '#FFD93D' },
  { name: 'Cancer', date: 'Jun 21 - Jul 22', emoji: '♋', color: '#6C5CE7' },
  { name: 'Leo', date: 'Jul 23 - Aug 22', emoji: '♌', color: '#FF8C00' },
  { name: 'Virgo', date: 'Aug 23 - Sep 22', emoji: '♍', color: '#00B894' },
  { name: 'Libra', date: 'Sep 23 - Oct 22', emoji: '♎', color: '#FD79A8' },
  { name: 'Scorpio', date: 'Oct 23 - Nov 21', emoji: '♏', color: '#6C5CE7' },
  { name: 'Sagittarius', date: 'Nov 22 - Dec 21', emoji: '♐', color: '#FDCB6E' },
  { name: 'Capricorn', date: 'Dec 22 - Jan 19', emoji: '♑', color: '#2D3436' },
  { name: 'Aquarius', date: 'Jan 20 - Feb 18', emoji: '♒', color: '#74B9FF' },
  { name: 'Pisces', date: 'Feb 19 - Mar 20', emoji: '♓', color: '#A29BFE' },
];

const ZodiacSigns = () => {
  return (
    <section id="zodiac" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Choose Your Zodiac Sign</span>
          </h2>
          <p className="text-gray-600 text-lg">What's Your Sign? Read Your Daily Horoscope Today</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {zodiacSigns.map((sign) => (
            <motion.div
              key={sign.name}
              whileHover={{ y: -10, scale: 1.05 }}
              className="bg-white/80 backdrop-blur-md rounded-2xl p-6 text-center border border-white/30 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
              style={{ borderBottom: `4px solid ${sign.color}` }}
            >
              <div className="text-5xl mb-2">{sign.emoji}</div>
              <h3 className="font-bold text-lg">{sign.name}</h3>
              <p className="text-xs text-gray-500">{sign.date}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ZodiacSigns;