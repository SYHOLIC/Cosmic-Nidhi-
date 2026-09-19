const Page = require('../models/Page');

exports.getPages = async (req, res) => {
  try {
    const pages = await Page.find();
    res.json({ success: true, pages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPageBySlug = async (req, res) => {
  try {
    const page = await Page.findOne({ slug: req.params.slug });
    if (!page) {
      return res.status(404).json({ success: false, message: 'Page not found' });
    }
    res.json({ success: true, page });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createOrUpdatePage = async (req, res) => {
  try {
    const { slug, title, content } = req.body;
    let page = await Page.findOne({ slug });
    if (page) {
      page.title = title;
      page.content = content;
      await page.save();
    } else {
      page = await Page.create(req.body);
    }
    res.json({ success: true, page });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deletePage = async (req, res) => {
  try {
    await Page.findOneAndDelete({ slug: req.params.slug });
    res.json({ success: true, message: 'Page deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
