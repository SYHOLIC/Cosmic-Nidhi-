import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  Save,
  AlertCircle,
  CheckCircle,
  Loader2,
  Play,
  Eye,
  Star,
  ExternalLink,
  Film,
  Sparkles,
  ArrowUpDown,
} from "lucide-react";
import { API_URL } from "../../config/api";

export const VIDEO_CATEGORIES = [
  "Astrology",
  "Vedic Astrology",
  "Numerology",
  "Tarot Reading",
  "Horoscope",
  "Zodiac Signs",
  "Love & Relationship",
  "Career & Finance",
  "Marriage",
  "Planetary Analysis",
  "Spiritual Guidance",
  "Daily Horoscope",
  "Weekly Horoscope",
  "Monthly Horoscope",
  "Festival / Special",
  "Other",
];

// Helper to extract YouTube video ID on frontend for live preview
export function extractYouTubeIdFrontend(url) {
  if (!url || typeof url !== "string") return "";
  const trimmed = url.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }
  const regExp = /(?:youtube(?:-nocookie)?\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts|live)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = trimmed.match(regExp);
  return match && match[1] ? match[1] : "";
}

export default function VideoTab() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [previewVideo, setPreviewVideo] = useState(null); // For watching video in lightbox
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    youtube_url: "",
    category: "Astrology",
    thumbnail_url: "",
    is_active: true,
    is_featured: false,
    display_order: 0,
  });

  const [extractedId, setExtractedId] = useState("");

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/admin/videos`, getAuthHeaders());
      if (res.data.success) {
        setVideos(res.data.videos || []);
      }
    } catch (err) {
      console.error("Error fetching admin videos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  // Update extracted YouTube ID whenever youtube_url changes
  const handleUrlChange = (url) => {
    setFormData((prev) => ({ ...prev, youtube_url: url }));
    const id = extractYouTubeIdFrontend(url);
    setExtractedId(id);
    if (id && (!formData.thumbnail_url || formData.thumbnail_url.includes("img.youtube.com"))) {
      setFormData((prev) => ({
        ...prev,
        thumbnail_url: `https://img.youtube.com/vi/${id}/maxresdefault.jpg`,
      }));
    }
  };

  const openAddModal = () => {
    setEditingVideo(null);
    setFormData({
      title: "",
      description: "",
      youtube_url: "",
      category: "Astrology",
      thumbnail_url: "",
      is_active: true,
      is_featured: false,
      display_order: videos.length ? Math.max(...videos.map((v) => v.display_order || 0)) + 1 : 1,
    });
    setExtractedId("");
    setFormError("");
    setFormSuccess("");
    setModalOpen(true);
  };

  const openEditModal = (video) => {
    setEditingVideo(video);
    setFormData({
      title: video.title || "",
      description: video.description || "",
      youtube_url: video.youtube_url || "",
      category: video.category || "Astrology",
      thumbnail_url: video.thumbnail_url || "",
      is_active: video.is_active !== undefined ? video.is_active : true,
      is_featured: !!video.is_featured,
      display_order: video.display_order || 0,
    });
    setExtractedId(video.youtube_video_id || extractYouTubeIdFrontend(video.youtube_url));
    setFormError("");
    setFormSuccess("");
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (!formData.title.trim()) {
      setFormError("Please enter a video title.");
      return;
    }

    const id = extractYouTubeIdFrontend(formData.youtube_url);
    if (!id) {
      setFormError("Please enter a valid YouTube URL (e.g., https://youtu.be/ID or https://www.youtube.com/watch?v=ID).");
      return;
    }

    setSubmitting(true);
    try {
      if (editingVideo) {
        // Update
        const res = await axios.put(
          `${API_URL}/admin/videos/${editingVideo._id}`,
          formData,
          getAuthHeaders()
        );
        if (res.data.success) {
          setFormSuccess("Video updated successfully!");
          setTimeout(() => {
            setModalOpen(false);
            fetchVideos();
          }, 600);
        }
      } else {
        // Create
        const res = await axios.post(
          `${API_URL}/admin/videos`,
          formData,
          getAuthHeaders()
        );
        if (res.data.success) {
          setFormSuccess("Video added successfully!");
          setTimeout(() => {
            setModalOpen(false);
            fetchVideos();
          }, 600);
        }
      }
    } catch (err) {
      console.error(err);
      setFormError(err.response?.data?.message || "Failed to save video.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      return;
    }
    try {
      await axios.delete(`${API_URL}/admin/videos/${id}`, getAuthHeaders());
      setVideos((prev) => prev.filter((v) => v._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete video.");
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const res = await axios.patch(`${API_URL}/admin/videos/${id}/status`, {}, getAuthHeaders());
      if (res.data.success) {
        setVideos((prev) =>
          prev.map((v) => (v._id === id ? { ...v, is_active: res.data.video.is_active, is_featured: res.data.video.is_featured } : v))
        );
      }
    } catch (err) {
      alert("Failed to toggle status");
    }
  };

  const handleToggleFeatured = async (id) => {
    try {
      const res = await axios.patch(`${API_URL}/admin/videos/${id}/featured`, {}, getAuthHeaders());
      if (res.data.success) {
        // Only 1 featured video at a time
        setVideos((prev) =>
          prev.map((v) => ({
            ...v,
            is_featured: v._id === id ? res.data.video.is_featured : false,
            is_active: v._id === id && res.data.video.is_featured ? true : v.is_active,
          }))
        );
      }
    } catch (err) {
      alert("Failed to toggle featured status");
    }
  };

  // Filtered list
  const filteredVideos = videos.filter((v) => {
    const matchesSearch =
      searchQuery === "" ||
      v.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.youtube_video_id?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || v.category === selectedCategory;

    const matchesStatus =
      selectedStatus === "all" ||
      (selectedStatus === "active" && v.is_active) ||
      (selectedStatus === "inactive" && !v.is_active);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const activeCount = videos.filter((v) => v.is_active).length;
  const featuredVideo = videos.find((v) => v.is_featured);

  return (
    <div className="space-y-6">
      {/* Header & Stats Banner */}
      <div className="rounded-[9px] border border-[#5A0E14]/12 bg-[#FFFDF9] p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#5A0E14]/10 text-[#5A0E14]">
                <Film size={18} />
              </span>
              <h2 className="font-display text-[20px] font-semibold text-[#3C080D] sm:text-[22px]">
                YouTube Video Management
              </h2>
            </div>
            <p className="mt-1 font-sans text-[12px] text-[#6B3A2A]/80">
              Manage video insights, Vedic guidance, tarot sessions, and featured homepage videos dynamically.
            </p>
          </div>

          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[#D8A948]/75 bg-gradient-to-r from-[#F3D49B] to-[#DDB56D] px-5 py-2.5 font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-[#3C080D] shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md cursor-pointer shrink-0"
          >
            <Plus size={15} strokeWidth={2.5} />
            <span>Add Video</span>
          </button>
        </div>

        {/* Quick summary badges */}
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 border-t border-[#5A0E14]/10 pt-4">
          <div className="rounded-lg bg-[#FDECC8]/25 p-3 border border-[#5A0E14]/10">
            <p className="font-sans text-[10px] font-bold uppercase tracking-wider text-[#8A5A1F]">Total Videos</p>
            <p className="font-display text-[20px] font-semibold text-[#3C080D] mt-0.5">{videos.length}</p>
          </div>
          <div className="rounded-lg bg-green-50 p-3 border border-green-200">
            <p className="font-sans text-[10px] font-bold uppercase tracking-wider text-green-800">Active Online</p>
            <p className="font-display text-[20px] font-semibold text-green-900 mt-0.5">{activeCount}</p>
          </div>
          <div className="rounded-lg bg-amber-50 p-3 border border-amber-200">
            <p className="font-sans text-[10px] font-bold uppercase tracking-wider text-amber-800">Featured Video</p>
            <p className="font-display text-[13px] font-semibold text-amber-900 mt-1 truncate">
              {featuredVideo ? featuredVideo.title : "None Set"}
            </p>
          </div>
          <div className="rounded-lg bg-[#5A0E14]/5 p-3 border border-[#5A0E14]/10">
            <p className="font-sans text-[10px] font-bold uppercase tracking-wider text-[#5A0E14]">Categories</p>
            <p className="font-display text-[20px] font-semibold text-[#5A0E14] mt-0.5">{VIDEO_CATEGORIES.length}</p>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="rounded-[9px] border border-[#5A0E14]/12 bg-[#FFFDF9] p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5A0E14]/50" size={15} />
            <input
              type="text"
              placeholder="Search by title, description, or video ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-[#5A0E14]/15 bg-[#FFFDF9] py-1.5 pl-9 pr-4 font-sans text-[12px] text-[#3C080D] focus:border-[#E9A534]/60 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Category Dropdown Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-full border border-[#5A0E14]/15 bg-[#FFFDF9] px-3 py-1.5 font-sans text-[11px] font-medium text-[#3C080D] focus:border-[#E9A534]/60 focus:outline-none cursor-pointer"
            >
              <option value="All">All Categories ({videos.length})</option>
              {VIDEO_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="rounded-full border border-[#5A0E14]/15 bg-[#FFFDF9] px-3 py-1.5 font-sans text-[11px] font-medium text-[#3C080D] focus:border-[#E9A534]/60 focus:outline-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Videos Table */}
      <div className="overflow-hidden rounded-[9px] border border-[#5A0E14]/12 bg-[#FFFDF9] shadow-sm">
        {loading ? (
          <div className="py-20 text-center">
            <Loader2 className="mx-auto h-7 w-7 animate-spin text-[#A2691F]" />
            <p className="mt-3 font-sans text-[12px] text-[#5A0E14]/60">Loading video library...</p>
          </div>
        ) : filteredVideos.length === 0 ? (
          <div className="py-16 text-center">
            <Film className="mx-auto h-10 w-10 text-[#5A0E14]/25" />
            <p className="mt-3 font-display text-[16px] text-[#3C080D]">No YouTube videos found</p>
            <p className="mt-1 font-sans text-[12px] text-[#5A0E14]/60">
              {searchQuery || selectedCategory !== "All"
                ? "Try clearing your filters or search terms."
                : "Click '+ Add Video' above to publish your first YouTube video."}
            </p>
            {(!searchQuery && selectedCategory === "All") && (
              <button
                type="button"
                onClick={openAddModal}
                className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#5A0E14] px-4 py-2 font-sans text-[11px] font-bold uppercase text-white hover:bg-[#3C080D] cursor-pointer"
              >
                <Plus size={14} /> Add First Video
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-[12px]">
              <thead className="border-b border-[#5A0E14]/12 bg-[#FDECC8]/30 font-bold uppercase tracking-[0.08em] text-[#8A5A1F] text-[10px]">
                <tr>
                  <th className="px-4 py-3">Thumbnail</th>
                  <th className="px-4 py-3">Title & Video ID</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-center">Featured</th>
                  <th className="px-4 py-3 text-center">Order</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#5A0E14]/08">
                {filteredVideos.map((video) => (
                  <tr
                    key={video._id}
                    className="transition-colors hover:bg-[#FDECC8]/15"
                  >
                    {/* Thumbnail & Quick Play */}
                    <td className="px-4 py-3">
                      <div
                        onClick={() => setPreviewVideo(video)}
                        className="group relative h-14 w-24 overflow-hidden rounded border border-[#5A0E14]/15 bg-black cursor-pointer shadow-xs shrink-0"
                        title="Click to preview video"
                      >
                        <img
                          src={
                            video.thumbnail_url ||
                            `https://img.youtube.com/vi/${video.youtube_video_id}/hqdefault.jpg`
                          }
                          alt={video.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            e.target.src = `https://img.youtube.com/vi/${video.youtube_video_id}/hqdefault.jpg`;
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/35 opacity-0 transition-opacity group-hover:opacity-100">
                          <Play className="h-5 w-5 fill-white text-white drop-shadow" />
                        </div>
                      </div>
                    </td>

                    {/* Title & Video ID */}
                    <td className="px-4 py-3 max-w-[280px]">
                      <p className="font-semibold text-[#3C080D] line-clamp-1">
                        {video.title}
                      </p>
                      {video.description && (
                        <p className="mt-0.5 line-clamp-1 text-[11px] text-[#6B3A2A]/70">
                          {video.description}
                        </p>
                      )}
                      <div className="mt-1 flex items-center gap-2">
                        <span className="font-mono text-[10px] text-[#8A5A1F] bg-[#FDECC8]/40 px-1.5 py-0.5 rounded">
                          ID: {video.youtube_video_id}
                        </span>
                        <a
                          href={video.youtube_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#5A0E14]/50 hover:text-[#5A0E14] inline-flex items-center gap-0.5 text-[10px]"
                          title="Open on YouTube"
                        >
                          <ExternalLink size={10} />
                          <span>YouTube</span>
                        </a>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="inline-flex rounded-full bg-[#5A0E14]/08 px-2.5 py-0.5 text-[10px] font-bold text-[#5A0E14]">
                        {video.category}
                      </span>
                    </td>

                    {/* Status Toggle */}
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(video._id)}
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                          video.is_active
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                        title="Click to toggle Active / Inactive"
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            video.is_active ? "bg-green-600" : "bg-gray-400"
                          }`}
                        />
                        {video.is_active ? "Active" : "Inactive"}
                      </button>
                    </td>

                    {/* Featured Toggle */}
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(video._id)}
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide transition-all cursor-pointer ${
                          video.is_featured
                            ? "bg-amber-100 text-amber-900 border border-amber-300 shadow-xs"
                            : "bg-transparent text-gray-400 hover:text-amber-600 hover:bg-amber-50"
                        }`}
                        title={video.is_featured ? "Featured on Homepage" : "Click to set as Featured"}
                      >
                        <Star
                          size={12}
                          className={video.is_featured ? "fill-amber-500 text-amber-500" : ""}
                        />
                        {video.is_featured ? "Featured" : "Set Featured"}
                      </button>
                    </td>

                    {/* Display Order */}
                    <td className="px-4 py-3 text-center font-mono font-semibold text-[#8A5A1F]">
                      {video.display_order ?? 0}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setPreviewVideo(video)}
                          className="rounded-md border border-[#5A0E14]/15 bg-white p-1.5 text-[#5A0E14]/70 hover:border-[#E9A534] hover:text-[#5A0E14] transition-colors cursor-pointer shadow-xs"
                          title="Preview Video Player"
                        >
                          <Eye size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => openEditModal(video)}
                          className="rounded-md border border-[#5A0E14]/15 bg-white p-1.5 text-[#8A5A1F] hover:border-[#E9A534] hover:text-[#5A0E14] transition-colors cursor-pointer shadow-xs"
                          title="Edit Video"
                        >
                          <Edit size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(video._id, video.title)}
                          className="rounded-md border border-[#5A0E14]/15 bg-white p-1.5 text-red-600/70 hover:border-red-400 hover:text-red-700 transition-colors cursor-pointer shadow-xs"
                          title="Delete Video"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* =========================================================================
          ADD / EDIT VIDEO MODAL
      ========================================================================= */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-[#170205]/70 backdrop-blur-sm"
              onClick={() => setModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border border-[#E9A534]/30 bg-[#FFFDF9] p-6 shadow-2xl z-10"
              style={{ scrollbarWidth: "thin" }}
            >
              <div className="mb-5 flex items-center justify-between border-b border-[#5A0E14]/12 pb-3">
                <div className="flex items-center gap-2">
                  <Film className="h-5 w-5 text-[#8A5A1F]" />
                  <h3 className="font-display text-[18px] font-semibold text-[#3C080D]">
                    {editingVideo ? "Edit YouTube Video" : "Add YouTube Video"}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-full p-1 text-[#5A0E14]/50 hover:bg-[#5A0E14]/10 hover:text-[#3C080D] cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {formError && (
                <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-[12px] text-red-700 border border-red-200">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {formSuccess && (
                <div className="mb-4 flex items-center gap-2 rounded-lg bg-green-50 p-3 text-[12px] text-green-700 border border-green-200">
                  <CheckCircle size={16} className="shrink-0" />
                  <span>{formSuccess}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* YouTube URL */}
                <div>
                  <label className="mb-1 block font-sans text-[11px] font-bold uppercase tracking-wider text-[#6B3A2A]/80">
                    YouTube URL *
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="e.g. https://www.youtube.com/watch?v=ABC123 or https://youtu.be/ABC123"
                    value={formData.youtube_url}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    className="w-full rounded-lg border border-[#5A0E14]/20 p-2.5 font-sans text-[13px] text-[#3C080D] focus:border-[#E9A534] focus:outline-none"
                  />
                  <p className="mt-1 font-sans text-[11px] text-[#5A0E14]/60">
                    Supports watch links, short links (youtu.be), YouTube Shorts, and embeds.
                  </p>
                </div>

                {/* LIVE PREVIEW BOX */}
                {extractedId ? (
                  <div className="rounded-xl border border-[#E9A534]/40 bg-[#FDECC8]/20 p-3.5 shadow-inner">
                    <p className="mb-2 font-sans text-[10px] font-bold uppercase tracking-wider text-[#8A5A1F] flex items-center gap-1.5">
                      <Sparkles size={12} className="text-[#E9A534]" />
                      Live Video Preview (ID: {extractedId})
                    </p>
                    <div className="aspect-video w-full overflow-hidden rounded-lg bg-black shadow-md">
                      <iframe
                        src={`https://www.youtube.com/embed/${extractedId}`}
                        title="YouTube Preview"
                        className="h-full w-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                ) : (
                  formData.youtube_url && (
                    <div className="rounded-lg bg-amber-50 p-3 text-[11px] text-amber-800 border border-amber-200">
                      Enter a valid YouTube URL to display the live player preview.
                    </div>
                  )
                )}

                {/* Video Title */}
                <div>
                  <label className="mb-1 block font-sans text-[11px] font-bold uppercase tracking-wider text-[#6B3A2A]/80">
                    Video Title *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={150}
                    placeholder="e.g. Vedic Astrology Insights: Your Destiny Unveiled"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full rounded-lg border border-[#5A0E14]/20 p-2.5 font-sans text-[13px] text-[#3C080D] focus:border-[#E9A534] focus:outline-none"
                  />
                </div>

                {/* Category & Display Order */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block font-sans text-[11px] font-bold uppercase tracking-wider text-[#6B3A2A]/80">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full rounded-lg border border-[#5A0E14]/20 p-2.5 font-sans text-[13px] text-[#3C080D] focus:border-[#E9A534] focus:outline-none cursor-pointer"
                    >
                      {VIDEO_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block font-sans text-[11px] font-bold uppercase tracking-wider text-[#6B3A2A]/80">
                      Display Order
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={formData.display_order}
                      onChange={(e) =>
                        setFormData({ ...formData, display_order: Number(e.target.value) })
                      }
                      className="w-full rounded-lg border border-[#5A0E14]/20 p-2.5 font-sans text-[13px] text-[#3C080D] focus:border-[#E9A534] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="mb-1 block font-sans text-[11px] font-bold uppercase tracking-wider text-[#6B3A2A]/80">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    maxLength={2000}
                    placeholder="Short summary of this video and what the viewer will learn..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full resize-none rounded-lg border border-[#5A0E14]/20 p-2.5 font-sans text-[13px] text-[#3C080D] focus:border-[#E9A534] focus:outline-none"
                  />
                </div>

                {/* Custom Thumbnail URL (Optional) */}
                <div>
                  <label className="mb-1 block font-sans text-[11px] font-bold uppercase tracking-wider text-[#6B3A2A]/80">
                    Thumbnail Image URL (Auto-Generated / Custom)
                  </label>
                  <input
                    type="url"
                    placeholder="Auto-generated from YouTube if left as is"
                    value={formData.thumbnail_url}
                    onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                    className="w-full rounded-lg border border-[#5A0E14]/20 p-2.5 font-sans text-[13px] text-[#3C080D] focus:border-[#E9A534] focus:outline-none"
                  />
                </div>

                {/* Toggles: Featured & Active */}
                <div className="flex flex-wrap items-center gap-6 border-t border-[#5A0E14]/10 pt-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_featured}
                      onChange={(e) =>
                        setFormData({ ...formData, is_featured: e.target.checked })
                      }
                      className="h-4 w-4 rounded border-[#5A0E14]/30 text-[#E9A534] focus:ring-[#E9A534]"
                    />
                    <span className="font-sans text-[12px] font-semibold text-[#3C080D]">
                      🌟 Mark as Featured Video (Homepage Spotlight)
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="h-4 w-4 rounded border-[#5A0E14]/30 text-[#5A0E14] focus:ring-[#5A0E14]"
                    />
                    <span className="font-sans text-[12px] font-semibold text-[#3C080D]">
                      Visible to Website Visitors (Active)
                    </span>
                  </label>
                </div>

                {/* Buttons */}
                <div className="mt-6 flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="flex-1 rounded-full border border-[#5A0E14]/20 py-2.5 font-sans text-[11px] font-bold uppercase text-[#5A0E14]/70 hover:bg-[#5A0E14]/5 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 rounded-full bg-[#5A0E14] py-2.5 font-sans text-[11px] font-bold uppercase tracking-wider text-[#FFF8EC] hover:bg-[#3C080D] disabled:opacity-50 transition-colors cursor-pointer shadow-md"
                  >
                    {submitting ? (
                      <span className="inline-flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                      </span>
                    ) : editingVideo ? (
                      "Update Video"
                    ) : (
                      "Save Video"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          LIGHTBOX PREVIEW PLAYER MODAL
      ========================================================================= */}
      <AnimatePresence>
        {previewVideo && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
              onClick={() => setPreviewVideo(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-[#E9A534]/30 bg-[#170205] p-4 text-[#FFF8EC] shadow-2xl z-10"
            >
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <span className="inline-block rounded-full bg-[#E9A534]/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#E9C76D]">
                    {previewVideo.category}
                  </span>
                  <h3 className="mt-1 font-display text-[16px] font-medium text-[#FFF8EC] line-clamp-1">
                    {previewVideo.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewVideo(null)}
                  className="rounded-full bg-white/10 p-2 text-white/80 hover:bg-white/20 transition cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${previewVideo.youtube_video_id}?autoplay=1&rel=0`}
                  title={previewVideo.title}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {previewVideo.description && (
                <p className="mt-3 font-sans text-[12px] leading-relaxed text-[#F5E5C7]/80 line-clamp-2">
                  {previewVideo.description}
                </p>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
