const Review = require('../models/Review');
const Product = require('../models/Product');

exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find().populate('user', 'name email').populate('product', 'name').sort('-createdAt');
    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createReview = async (req, res) => {
  try {
    const { product, rating, comment } = req.body;
    
    // Check if user already reviewed
    const existingReview = await Review.findOne({ user: req.user._id, product });
    if (existingReview) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this product' });
    }

    const review = await Review.create({
      user: req.user._id,
      product,
      rating: Number(rating),
      comment
    });

    // Synchronize review into Product.reviews array and recalculate average rating
    const productDoc = await Product.findById(product);
    if (productDoc) {
      if (!Array.isArray(productDoc.reviews)) {
        productDoc.reviews = [];
      }
      productDoc.reviews.push({
        user: req.user._id,
        name: req.user.name || 'Verified Customer',
        rating: Number(rating),
        comment,
        date: new Date()
      });

      const allProductReviews = await Review.find({ product });
      const avg = allProductReviews.reduce((sum, r) => sum + r.rating, 0) / (allProductReviews.length || 1);
      productDoc.rating = Math.round(avg * 10) / 10;
      await productDoc.save();
    }

    res.status(201).json({ success: true, review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    const productId = review.product;
    await Review.findByIdAndDelete(req.params.id);

    // Sync product reviews array
    const productDoc = await Product.findById(productId);
    if (productDoc && Array.isArray(productDoc.reviews)) {
      productDoc.reviews = productDoc.reviews.filter(r => r.user?.toString() !== review.user?.toString());
      const remainingReviews = await Review.find({ product: productId });
      if (remainingReviews.length > 0) {
        const avg = remainingReviews.reduce((sum, r) => sum + r.rating, 0) / remainingReviews.length;
        productDoc.rating = Math.round(avg * 10) / 10;
      } else {
        productDoc.rating = 0;
      }
      await productDoc.save();
    }

    res.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
