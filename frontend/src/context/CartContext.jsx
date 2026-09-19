import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const CartContext = createContext();

export const getCurrentUserId = () => {
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    const user = JSON.parse(userStr);
    return user?._id || user?.id || null;
  } catch {
    return null;
  }
};

export const getCartStorageKey = (userId) => {
  return userId ? `cart_user_${userId}` : 'cart_guest';
};

export const loadCartFromStorage = (userId) => {
  try {
    const key = getCartStorageKey(userId);
    const stored = localStorage.getItem(key);
    if (stored) {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    }
    return [];
  } catch (err) {
    console.error('Failed to parse cart from local storage', err);
    return [];
  }
};

export function CartProvider({ children }) {
  // Purge any legacy un-scoped 'cartItems' so stale items never leak
  useEffect(() => {
    try {
      localStorage.removeItem('cartItems');
    } catch {}
  }, []);

  const [currentUserId, setCurrentUserId] = useState(() => getCurrentUserId());
  const [cartItems, setCartItems] = useState(() => loadCartFromStorage(getCurrentUserId()));

  const isInitialMount = useRef(true);

  // Fetch cart directly from MongoDB on mount for logged-in users
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = getCurrentUserId();
    if (token && userId) {
      axios.get(`${API_URL}/users/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        if (res.data.success && Array.isArray(res.data.cart)) {
          const dbCart = res.data.cart;
          if (dbCart.length > 0) {
            setCartItems(dbCart);
            localStorage.setItem(getCartStorageKey(userId), JSON.stringify(dbCart));
          }
        }
      }).catch(err => {
        console.warn('Could not fetch cart from MongoDB:', err.message);
      });
    }
  }, []);

  // Sync to localStorage and Backend whenever cartItems or currentUserId change
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const key = getCartStorageKey(currentUserId);
    localStorage.setItem(key, JSON.stringify(cartItems));

    // If logged in, also sync to backend MongoDB in background
    if (currentUserId) {
      const token = localStorage.getItem('token');
      if (token) {
        axios.put(`${API_URL}/users/cart`, { cart: cartItems }, {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(err => {
          console.warn('Backend cart sync note:', err.message);
        });
      }
    }
  }, [cartItems, currentUserId]);

  // Listen to auth state changes (login, register, logout) & storage events
  useEffect(() => {
    const handleAuthChange = (e) => {
      const action = e?.detail?.action;
      const newUserId = getCurrentUserId();

      if (action === 'register') {
        // Fresh user registration -> guaranteed fresh empty cart
        setCurrentUserId(newUserId);
        setCartItems([]);
        if (newUserId) {
          localStorage.setItem(getCartStorageKey(newUserId), JSON.stringify([]));
        }
        localStorage.removeItem('cart_guest');
        localStorage.removeItem('cartItems');
        return;
      }

      if (action === 'logout') {
        // User logged out:
        // Do NOT remove user's cart_user_${userId} so their cart is saved!
        // Just reset active UI cart to [] and clear guest cart
        setCurrentUserId(null);
        setCartItems([]);
        localStorage.removeItem('cart_guest');
        localStorage.removeItem('cartItems');
        return;
      }

      if (action === 'login') {
        setCurrentUserId(newUserId);
        // 1. Check local storage for this user's saved items
        let userCart = loadCartFromStorage(newUserId);

        // 2. If local is empty, but user had cart saved in backend
        const backendCart = e?.detail?.user?.cart;
        if (userCart.length === 0 && Array.isArray(backendCart) && backendCart.length > 0) {
          userCart = backendCart;
          localStorage.setItem(getCartStorageKey(newUserId), JSON.stringify(userCart));
        }

        setCartItems(userCart);
        localStorage.removeItem('cart_guest');
        localStorage.removeItem('cartItems');
        return;
      }

      // Other updates or cross-tab storage events
      setCurrentUserId(newUserId);
      setCartItems(loadCartFromStorage(newUserId));
    };

    window.addEventListener('auth-state-changed', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);

    return () => {
      window.removeEventListener('auth-state-changed', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);

  const addToCart = (product, quantity = 1) => {
    const productId = product._id || product.id;
    setCartItems(prev => {
      const existing = prev.find(item => item.id === productId);
      if (existing) {
        return prev.map(item =>
          item.id === productId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, id: productId, quantity }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(prev =>
      prev.map(item => (item.id === id ? { ...item, quantity: newQuantity } : item))
    );
  };

  const clearCart = () => {
    setCartItems([]);
    const key = getCartStorageKey(currentUserId);
    localStorage.setItem(key, JSON.stringify([]));
    if (currentUserId) {
      const token = localStorage.getItem('token');
      if (token) {
        axios.put(`${API_URL}/users/cart`, { cart: [] }, {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(() => {});
      }
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const priceStr = String(item.price).replace(/[₹,]/g, "");
      const price = parseFloat(priceStr) || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartCount
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
