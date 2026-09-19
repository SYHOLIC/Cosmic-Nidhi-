const Seo = require('../models/Seo');

exports.getSeo = async (req, res) => {
  try {
    const seoList = await Seo.find();
    res.json({ success: true, seoList });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateSeo = async (req, res) => {
  try {
    const { pageName, title, description, keywords } = req.body;
    let seo = await Seo.findOne({ pageName });
    if (seo) {
      seo.title = title;
      seo.description = description;
      seo.keywords = keywords;
      await seo.save();
    } else {
      seo = await Seo.create(req.body);
    }
    res.json({ success: true, seo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
