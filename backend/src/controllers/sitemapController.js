const Product = require('../models/Product');
const Category = require('../models/Category');
const Page = require('../models/Page');

exports.generateSitemap = async (req, res) => {
  try {
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    
    const products = await Product.find({ isActive: true }).select('slug updatedAt');
    const categories = await Category.find().select('slug updatedAt');
    const pages = await Page.find().select('slug updatedAt');

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Static core routes
    const coreRoutes = [
      { url: '/', priority: '1.0' },
      { url: '/products', priority: '0.9' },
      { url: '/services', priority: '0.8' },
    ];

    coreRoutes.forEach(route => {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}${route.url}</loc>\n`;
      xml += `    <changefreq>daily</changefreq>\n`;
      xml += `    <priority>${route.priority}</priority>\n`;
      xml += `  </url>\n`;
    });

    // Dynamic Product routes
    products.forEach(p => {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/product/${p.slug}</loc>\n`;
      xml += `    <lastmod>${p.updatedAt.toISOString()}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += `  </url>\n`;
    });

    // Dynamic Category routes
    categories.forEach(c => {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/category/${c.slug}</loc>\n`;
      xml += `    <lastmod>${c.updatedAt ? c.updatedAt.toISOString() : new Date().toISOString()}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.7</priority>\n`;
      xml += `  </url>\n`;
    });

    // Dynamic Static Page routes
    pages.forEach(p => {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/page/${p.slug}</loc>\n`;
      xml += `    <lastmod>${p.updatedAt ? p.updatedAt.toISOString() : new Date().toISOString()}</lastmod>\n`;
      xml += `    <changefreq>monthly</changefreq>\n`;
      xml += `    <priority>0.6</priority>\n`;
      xml += `  </url>\n`;
    });

    xml += `</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (error) {
    res.status(500).send('Error generating sitemap');
  }
};
