const Video = require('../models/Video');
const { extractYouTubeId, getYouTubeThumbnail } = require('../utils/youtube');

// @desc    Get all active videos for public website
// @route   GET /api/videos
// @access  Public
exports.getPublicVideos = async (req, res) => {
  try {
    const { category, search, limit } = req.query;
    const filter = { is_active: true };

    if (category && category !== 'All' && category !== 'all') {
      filter.category = category;
    }

    if (search && search.trim()) {
      filter.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const query = Video.find(filter).sort({ display_order: 1, createdAt: -1 });

    if (limit && Number(limit) > 0) {
      query.limit(Number(limit));
    }

    const videos = await query.exec();

    res.status(200).json({
      success: true,
      count: videos.length,
      videos,
      categories: Video.CATEGORIES,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error fetching videos',
    });
  }
};

// @desc    Get the featured video for homepage
// @route   GET /api/videos/featured
// @access  Public
exports.getFeaturedVideo = async (req, res) => {
  try {
    // 1. Try to find an explicitly marked featured active video
    let video = await Video.findOne({ is_active: true, is_featured: true });

    // 2. If none marked as featured, fallback to the top active video
    if (!video) {
      video = await Video.findOne({ is_active: true }).sort({ display_order: 1, createdAt: -1 });
    }

    res.status(200).json({
      success: true,
      video: video || null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error fetching featured video',
    });
  }
};

// @desc    Get active videos by specific category
// @route   GET /api/videos/category/:category
// @access  Public
exports.getVideosByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const videos = await Video.find({
      is_active: true,
      category: { $regex: new RegExp(`^${category}$`, 'i') },
    }).sort({ display_order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: videos.length,
      category,
      videos,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error fetching category videos',
    });
  }
};

// =========================================================================
// ADMIN CONTROLLERS
// =========================================================================

// @desc    Get all videos for Admin Panel
// @route   GET /api/admin/videos
// @access  Private/Admin
exports.getAdminVideos = async (req, res) => {
  try {
    const { category, search, status, featured } = req.query;
    const filter = {};

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (status === 'active') {
      filter.is_active = true;
    } else if (status === 'inactive') {
      filter.is_active = false;
    }

    if (featured === 'yes') {
      filter.is_featured = true;
    } else if (featured === 'no') {
      filter.is_featured = false;
    }

    if (search && search.trim()) {
      filter.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
        { youtube_video_id: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const videos = await Video.find(filter).sort({ display_order: 1, createdAt: -1 });

    const totalCount = await Video.countDocuments();
    const activeCount = await Video.countDocuments({ is_active: true });
    const featuredCount = await Video.countDocuments({ is_featured: true });

    res.status(200).json({
      success: true,
      count: videos.length,
      totalCount,
      activeCount,
      featuredCount,
      videos,
      categories: Video.CATEGORIES,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error fetching admin videos',
    });
  }
};

// @desc    Get single video by ID
// @route   GET /api/admin/videos/:id
// @access  Private/Admin
exports.getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }
    res.status(200).json({ success: true, video });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new video
// @route   POST /api/admin/videos
// @access  Private/Admin
exports.createVideo = async (req, res) => {
  try {
    const {
      title,
      description,
      youtube_url,
      category,
      thumbnail_url,
      is_active,
      is_featured,
      display_order,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Video title is required' });
    }

    if (!youtube_url || !youtube_url.trim()) {
      return res.status(400).json({ success: false, message: 'YouTube URL is required' });
    }

    const videoId = extractYouTubeId(youtube_url);
    if (!videoId) {
      return res.status(400).json({
        success: false,
        message: 'Invalid YouTube URL. Please provide a valid watch, share, or shorts link.',
      });
    }

    // Check duplicate video
    const existingVideo = await Video.findOne({ youtube_video_id: videoId });
    if (existingVideo) {
      return res.status(400).json({
        success: false,
        message: `This YouTube video is already added as "${existingVideo.title}". Duplicate videos are prevented.`,
      });
    }

    // Resolved thumbnail: custom or auto-generated high quality from YouTube
    const finalThumbnail = thumbnail_url && thumbnail_url.trim()
      ? thumbnail_url.trim()
      : getYouTubeThumbnail(videoId);

    // If marked as featured, unset other featured videos so only 1 primary featured video is active
    const willBeFeatured = is_featured === true || is_featured === 'true';
    if (willBeFeatured) {
      await Video.updateMany({ is_featured: true }, { is_featured: false });
    }

    // Default display order
    let order = Number(display_order);
    if (isNaN(order)) {
      const highest = await Video.findOne().sort({ display_order: -1 }).select('display_order');
      order = highest && typeof highest.display_order === 'number' ? highest.display_order + 1 : 0;
    }

    const video = await Video.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      youtube_url: youtube_url.trim(),
      youtube_video_id: videoId,
      thumbnail_url: finalThumbnail,
      category: category || 'Astrology',
      is_active: is_active !== undefined ? (is_active === true || is_active === 'true') : true,
      is_featured: willBeFeatured,
      display_order: order,
    });

    res.status(201).json({
      success: true,
      message: 'Video added successfully',
      video,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error creating video',
    });
  }
};

// @desc    Update existing video
// @route   PUT /api/admin/videos/:id
// @access  Private/Admin
exports.updateVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }

    const {
      title,
      description,
      youtube_url,
      category,
      thumbnail_url,
      is_active,
      is_featured,
      display_order,
    } = req.body;

    if (title && title.trim()) {
      video.title = title.trim();
    }

    if (description !== undefined) {
      video.description = description ? description.trim() : '';
    }

    if (category) {
      video.category = category;
    }

    if (youtube_url && youtube_url.trim()) {
      const newVideoId = extractYouTubeId(youtube_url);
      if (!newVideoId) {
        return res.status(400).json({ success: false, message: 'Invalid YouTube URL provided.' });
      }

      // Check if another video already uses this ID
      const conflict = await Video.findOne({
        youtube_video_id: newVideoId,
        _id: { $ne: video._id },
      });
      if (conflict) {
        return res.status(400).json({
          success: false,
          message: `Another video already uses this YouTube ID: "${conflict.title}"`,
        });
      }

      video.youtube_url = youtube_url.trim();
      video.youtube_video_id = newVideoId;

      // Update thumbnail if not customized
      if (!thumbnail_url || !thumbnail_url.trim()) {
        video.thumbnail_url = getYouTubeThumbnail(newVideoId);
      }
    }

    if (thumbnail_url !== undefined && thumbnail_url.trim()) {
      video.thumbnail_url = thumbnail_url.trim();
    }

    if (is_active !== undefined) {
      video.is_active = is_active === true || is_active === 'true';
    }

    if (is_featured !== undefined) {
      const willBeFeatured = is_featured === true || is_featured === 'true';
      if (willBeFeatured && !video.is_featured) {
        await Video.updateMany({ is_featured: true }, { is_featured: false });
      }
      video.is_featured = willBeFeatured;
    }

    if (display_order !== undefined && !isNaN(Number(display_order))) {
      video.display_order = Number(display_order);
    }

    await video.save();

    res.status(200).json({
      success: true,
      message: 'Video updated successfully',
      video,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error updating video',
    });
  }
};

// @desc    Delete video
// @route   DELETE /api/admin/videos/:id
// @access  Private/Admin
exports.deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }

    await Video.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Video deleted successfully',
      id: req.params.id,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error deleting video',
    });
  }
};

// @desc    Toggle video active status
// @route   PATCH /api/admin/videos/:id/status
// @access  Private/Admin
exports.toggleVideoStatus = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }

    video.is_active = !video.is_active;

    // If deactivating, also unset featured
    if (!video.is_active && video.is_featured) {
      video.is_featured = false;
    }

    await video.save();

    res.status(200).json({
      success: true,
      message: `Video ${video.is_active ? 'activated' : 'deactivated'} successfully`,
      video,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error toggling status',
    });
  }
};

// @desc    Toggle video featured status
// @route   PATCH /api/admin/videos/:id/featured
// @access  Private/Admin
exports.toggleVideoFeatured = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }

    const willBeFeatured = !video.is_featured;

    if (willBeFeatured) {
      // Unset all other featured videos
      await Video.updateMany({ is_featured: true }, { is_featured: false });
      video.is_featured = true;
      video.is_active = true; // Ensure featured video is active
    } else {
      video.is_featured = false;
    }

    await video.save();

    res.status(200).json({
      success: true,
      message: `Video ${video.is_featured ? 'marked as Featured' : 'unmarked from Featured'}`,
      video,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error toggling featured',
    });
  }
};

// @desc    Bulk reorder videos
// @route   PATCH /api/admin/videos/reorder
// @access  Private/Admin
exports.reorderVideos = async (req, res) => {
  try {
    const { orders } = req.body; // array of { id, display_order }

    if (!Array.isArray(orders) || orders.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of orders containing id and display_order',
      });
    }

    const bulkOps = orders.map(item => ({
      updateOne: {
        filter: { _id: item.id },
        update: { $set: { display_order: Number(item.display_order) || 0 } },
      },
    }));

    await Video.bulkWrite(bulkOps);

    res.status(200).json({
      success: true,
      message: 'Videos reordered successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error reordering videos',
    });
  }
};
