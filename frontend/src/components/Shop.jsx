import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

const products = [
  { name: 'Treasure Yellow Astrology', price: '$64.99', image: '🌟' },
  { name: 'Treasure Yellow Astrology', price: '$58.99', image: '🔮' },
  { name: 'Treasure Yellow Natal Chart', price: '$89.99', image: '📊' },
  { name: 'Treasure Yellow Transit Chart', price: '$52.99', image: '🌌' },
];

const Shop = () => {
  const { addToCart } = useCart();
  const [addedMap, setAddedMap] = useState({});

  const handleAddToCart = (product, i) => {
    addToCart({
      id: `shop-${i}`,
      name: product.name,
      price: product.price,
      image: product.image,
    });
    setAddedMap((prev) => ({ ...prev, [i]: true }));
    setTimeout(() => {
      setAddedMap((prev) => ({ ...prev, [i]: false }));
    }, 2000);
  };

  return (
    <section id="shop" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Our Best Products</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            As the leader of the pack, it is but hard to miss your charm, Leo and everything about you screams attention.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="text-6xl mb-4">{product.image}</div>
              <h3 className="font-bold text-lg mb-1">{product.name}</h3>
              <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{product.price}</p>
              <button
                onClick={() => handleAddToCart(product, i)}
                className="mt-4 w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-full hover:shadow-lg transition flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" /> {addedMap[i] ? "Added to Cart!" : "Add to Cart"}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Shop;