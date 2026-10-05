/**
 * YouTube Utility Helper
 * Robustly parses YouTube URLs (watch, share/youtu.be, shorts, embed, live, mobile)
 * and generates high-res thumbnail links.
 */

function extractYouTubeId(url) {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();

  // If already an 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // Common YouTube URL formats
  const regExp = /(?:youtube(?:-nocookie)?\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts|live)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = trimmed.match(regExp);
  return match && match[1] ? match[1] : null;
}

function getYouTubeThumbnail(videoId, quality = 'maxresdefault') {
  if (!videoId) return '';
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
}

function formatStandardYouTubeUrl(videoId) {
  if (!videoId) return '';
  return `https://www.youtube.com/watch?v=${videoId}`;
}

function isValidYouTubeUrl(url) {
  return !!extractYouTubeId(url);
}

module.exports = {
  extractYouTubeId,
  getYouTubeThumbnail,
  formatStandardYouTubeUrl,
  isValidYouTubeUrl,
};
