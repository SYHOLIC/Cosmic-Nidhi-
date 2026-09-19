import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const testimonials = [
  { name: 'Stephie J. Bellamy', text: 'The astrology reading was incredibly accurate and insightful. Highly recommend!', rating: 5 },
  { name: 'Sonny V. Love', text: 'Life-changing experience! The guidance I received helped me make better decisions.', rating: 5 },
  { name: 'Karen J. Hogan', text: 'Best astrology website in India! The birth chart analysis was spot on.', rating: 5 },
];

const Testimonials = () => {
  return (
    <section className="py-20 px-6 bg-white/50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">
          <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">What Clients Are Saying</span>
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-lg"
            >
              <Quote className="w-8 h-8 text-purple-400 mb-4" />
              <p className="text-gray-600 mb-4">"{testimonial.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold">
                  {testimonial.name[0]}
                </div>
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <div className="flex text-yellow-400">★★★★★</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;