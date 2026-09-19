import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  Save,
  ChevronRight,
  ChevronDown,
  FolderTree,
  Package,
  AlertCircle,
  CheckCircle,
  Upload,
  Image as ImageIcon,
  Layers,
  Loader2,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/* ================================================================
   STATUS BADGE
================================================================ */

function ActiveBadge({ isActive }) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 whitespace-nowrap
        rounded-full border px-2.5 py-0.5
        font-sans text-[9px] font-bold uppercase tracking-[0.14em]
        ${
          isActive
            ? "border-green-700/30 bg-green-700/[0.08] text-green-800"
            : "border-[#5A0E14]/20 bg-[#5A0E14]/[0.05] text-[#5A0E14]/60"
        }
      `}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isActive ? "bg-green-700" : "bg-[#5A0E14]/40"
        }`}
      />
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}

/* ================================================================
   IMAGE UPLOAD BOX — Base64 to MongoDB
================================================================ */

function ImageUploadBox({ image, onChange, onRemove }) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setUploadError("Please select an image file");
      return;
    }

    // Validate size (max 2MB for base64 in MongoDB)
    if (file.size > 2 * 1024 * 1024) {
      setUploadError("Image must be less than 2MB");
      return;
    }

    setUploadError("");
    setUploading(true);

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      onChange(reader.result); // "data:image/png;base64,..."
      setUploading(false);
    };
    reader.onerror = () => {
      setUploadError("Failed to read image");
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <label className="mb-1.5 block font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-[#6B3A2A]/80">
        Category Image
      </label>

      {image ? (
        <div className="relative overflow-hidden rounded-[7px] border border-[#5A0E14]/12">
          <img
            src={image}
            alt="Category"
            className="h-40 w-full object-cover"
            onError={(e) => {
              e.target.src =
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23FDECC8' width='100' height='100'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' fill='%235A0E14' font-size='12'%3EImage Error%3C/text%3E%3C/svg%3E";
            }}
          />
          <div className="absolute inset-0 flex items-end justify-between gap-2 bg-gradient-to-t from-[#170205]/80 via-transparent to-transparent p-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 font-sans text-[11px] font-semibold text-[#3C080D] transition-colors hover:bg-white"
            >
              <Upload className="h-3 w-3" strokeWidth={2} />
              Change
            </button>
            <button
              type="button"
              onClick={onRemove}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-[#C1272D] text-white transition-colors hover:bg-[#9C1C22]"
              aria-label="Remove image"
            >
              <X className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="
            group flex h-40 w-full flex-col items-center justify-center gap-3
            rounded-[7px] border-2 border-dashed border-[#5A0E14]/20
            bg-[#FDECC8]/20 transition-all duration-300
            hover:border-[#E9A534]/60 hover:bg-[#FDECC8]/40
            disabled:opacity-60 disabled:cursor-not-allowed
          "
        >
          {uploading ? (
            <>
              <Loader2
                className="h-8 w-8 animate-spin text-[#A2691F]"
                strokeWidth={1.5}
              />
              <p className="font-sans text-[12px] text-[#6B3A2A]/70">
                Processing...
              </p>
            </>
          ) : (
            <>
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#E9A534]/40 bg-[#E9A534]/[0.10] text-[#A2691F] transition-transform duration-300 group-hover:scale-110">
                <Upload className="h-5 w-5" strokeWidth={1.7} />
              </div>
              <div className="text-center">
                <p className="font-sans text-[12px] font-semibold text-[#3C080D]">
                  Click to upload image
                </p>
                <p className="mt-0.5 font-sans text-[10px] text-[#6B3A2A]/60">
                  PNG, JPG, WEBP up to 2MB
                </p>
              </div>
            </>
          )}
        </button>
      )}

      {uploadError && (
        <p className="mt-1.5 flex items-center gap-1 font-sans text-[11px] text-[#C1272D]">
          <AlertCircle className="h-3 w-3" /> {uploadError}
        </p>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}

/* ================================================================
   CATEGORY FORM MODAL
================================================================ */

function CategoryFormModal({
  isOpen,
  onClose,
  onSave,
  editingCategory,
  parentCategories,
  loading,
}) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "",
    image: "",
    parentCategory: "",
    isActive: true,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingCategory) {
      setFormData({
        name: editingCategory.name || "",
        description: editingCategory.description || "",
        icon: editingCategory.icon || "",
        image: editingCategory.image || "",
        parentCategory:
          editingCategory.parentCategory?._id ||
          editingCategory.parentCategory ||
          "",
        isActive: editingCategory.isActive !== false,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        icon: "",
        image: "",
        parentCategory: "",
        isActive: true,
      });
    }
    setErrors({});
  }, [editingCategory, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleImageChange = (imageUrl) => {
    setFormData({ ...formData, image: imageUrl });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (formData.name.trim().length < 2)
      newErrors.name = "Name must be at least 2 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-[#170205]/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="
          relative w-full max-w-lg max-h-[90vh] overflow-y-auto
          rounded-[10px] border border-[#E9A534]/25
          bg-[#FFFDF9] shadow-[0_30px_70px_rgba(23,2,5,0.35)]
        "
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#5A0E14]/12 bg-[#FFFDF9] px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E9A534]/45 bg-[#E9A534]/[0.10] text-[#A2691F]">
              <FolderTree className="h-4 w-4" strokeWidth={1.7} />
            </div>
            <div>
              <p className="font-sans text-[9px] font-bold uppercase tracking-[0.22em] text-[#8A5A1F]">
                {editingCategory ? "Edit" : "Create"}
              </p>
              <h3 className="font-display text-[17px] font-semibold leading-tight text-[#3C080D]">
                {editingCategory ? "Edit Category" : "New Category"}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[#5A0E14]/15 text-[#5A0E14]/60 transition-colors hover:border-[#C1272D]/30 hover:text-[#C1272D]"
            aria-label="Close"
          >
            <X className="h-4 w-4" strokeWidth={1.8} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          {/* Image Upload — FIRST */}
          <ImageUploadBox
            image={formData.image}
            onChange={handleImageChange}
            onRemove={() => setFormData({ ...formData, image: "" })}
          />

          {/* Name */}
          <div>
            <label className="mb-1.5 block font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-[#6B3A2A]/80">
              Category Name <span className="text-[#C1272D]">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Crystals & Gemstones"
              className={`
                w-full rounded-[7px] border bg-[#FFFDF9]
                px-3.5 py-2.5 font-sans text-[13px] text-[#2C1210]
                placeholder:text-[#5A0E14]/35
                focus:outline-none focus:ring-2 focus:ring-[#E9A534]/20
                ${
                  errors.name
                    ? "border-[#C1272D]/60"
                    : "border-[#5A0E14]/15 focus:border-[#E9A534]/60"
                }
              `}
            />
            {errors.name && (
              <p className="mt-1 flex items-center gap-1 font-sans text-[11px] text-[#C1272D]">
                <AlertCircle className="h-3 w-3" /> {errors.name}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="mb-1.5 block font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-[#6B3A2A]/80">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Short description of this category..."
              className="
                w-full resize-none rounded-[7px] border border-[#5A0E14]/15 bg-[#FFFDF9]
                px-3.5 py-2.5 font-sans text-[13px] text-[#2C1210]
                placeholder:text-[#5A0E14]/35
                focus:border-[#E9A534]/60 focus:outline-none focus:ring-2 focus:ring-[#E9A534]/20
              "
            />
          </div>

          {/* Parent Category */}
          <div>
            <label className="mb-1.5 block font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-[#6B3A2A]/80">
              Parent Category (Optional)
            </label>
            <select
              name="parentCategory"
              value={formData.parentCategory}
              onChange={handleChange}
              className="
                w-full rounded-[7px] border border-[#5A0E14]/15 bg-[#FFFDF9]
                px-3.5 py-2.5 font-sans text-[13px] text-[#2C1210]
                focus:border-[#E9A534]/60 focus:outline-none focus:ring-2 focus:ring-[#E9A534]/20
              "
            >
              <option value="">— None (Top-level category) —</option>
              {parentCategories
                .filter((cat) => cat._id !== editingCategory?._id)
                .map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
            </select>
            <p className="mt-1 font-sans text-[10px] text-[#5A0E14]/50">
              Leave empty for a main category, or select a parent to create a
              subcategory.
            </p>
          </div>

          {/* Icon */}
          <div>
            <label className="mb-1.5 block font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-[#6B3A2A]/80">
              Icon (Emoji or Icon Name)
            </label>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[7px] border border-[#5A0E14]/15 bg-[#FDECC8]/40 text-2xl">
                {formData.icon || "💎"}
              </div>
              <input
                type="text"
                name="icon"
                value={formData.icon}
                onChange={handleChange}
                placeholder="e.g., 💎 or gem"
                className="
                  flex-1 rounded-[7px] border border-[#5A0E14]/15 bg-[#FFFDF9]
                  px-3.5 py-2.5 font-sans text-[13px] text-[#2C1210]
                  placeholder:text-[#5A0E14]/35
                  focus:border-[#E9A534]/60 focus:outline-none focus:ring-2 focus:ring-[#E9A534]/20
                "
              />
            </div>
          </div>

          {/* Active Toggle */}
          <div className="flex items-center gap-3 rounded-[7px] border border-[#5A0E14]/12 bg-[#FDECC8]/25 p-3">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="h-4 w-4 cursor-pointer rounded border-[#5A0E14]/25 text-[#C1272D] accent-[#C1272D]"
            />
            <label
              htmlFor="isActive"
              className="cursor-pointer font-sans text-[12px] font-medium text-[#3C080D]"
            >
              Active (visible on website)
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="
                flex-1 rounded-full border border-[#5A0E14]/20 py-2.5
                font-sans text-[12px] font-semibold uppercase tracking-[0.14em]
                text-[#5A0E14]/70 transition-colors
                hover:border-[#5A0E14]/40 hover:text-[#3C080D]
              "
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="
                flex flex-1 items-center justify-center gap-2 rounded-full
                bg-[#C1272D] py-2.5
                font-sans text-[12px] font-semibold uppercase tracking-[0.14em]
                text-[#FFF7E9] transition-all duration-300
                hover:bg-[#9C1C22] disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              {loading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={2} />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5" strokeWidth={1.8} />
                  {editingCategory ? "Update" : "Create"}
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

/* ================================================================
   DELETE CONFIRM MODAL
================================================================ */

function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  categoryName,
  loading,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-[#170205]/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="
          relative w-full max-w-sm rounded-[10px]
          border border-[#C1272D]/25 bg-[#FFFDF9]
          p-6 shadow-[0_30px_70px_rgba(23,2,5,0.35)]
        "
      >
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#C1272D]/10 text-[#C1272D]">
          <Trash2 className="h-5 w-5" strokeWidth={1.8} />
        </div>
        <h3 className="font-display text-[18px] font-semibold text-[#3C080D]">
          Delete Category?
        </h3>
        <p className="mt-2 font-sans text-[13px] leading-relaxed text-[#6B3A2A]/80">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-[#3C080D]">"{categoryName}"</span>?
          This action cannot be undone.
        </p>
        <div className="mt-5 flex gap-3">
          <button
            onClick={onClose}
            className="
              flex-1 rounded-full border border-[#5A0E14]/20 py-2.5
              font-sans text-[12px] font-semibold uppercase tracking-[0.14em]
              text-[#5A0E14]/70 transition-colors
              hover:border-[#5A0E14]/40 hover:text-[#3C080D]
            "
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="
              flex-1 rounded-full bg-[#C1272D] py-2.5
              font-sans text-[12px] font-semibold uppercase tracking-[0.14em]
              text-[#FFF7E9] transition-all duration-300
              hover:bg-[#9C1C22] disabled:opacity-50
            "
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* ================================================================
   CATEGORY ROW
================================================================ */

function CategoryRow({ category, level = 0, onEdit, onDelete, onAddSub }) {
  const [expanded, setExpanded] = useState(level === 0);
  const hasChildren = category.children && category.children.length > 0;

  return (
    <>
      <tr className="border-b border-[#5A0E14]/[0.06] transition-colors hover:bg-[#FDECC8]/20">
        <td className="px-4 py-3">
          <div
            className="flex items-center gap-2.5"
            style={{ paddingLeft: `${level * 24}px` }}
          >
            {hasChildren ? (
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-[#5A0E14]/60 hover:text-[#C1272D]"
              >
                {expanded ? (
                  <ChevronDown className="h-3.5 w-3.5" strokeWidth={2} />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5" strokeWidth={2} />
                )}
              </button>
            ) : (
              <span className="h-5 w-5 shrink-0" />
            )}

            {category.image ? (
              <img
                src={category.image}
                alt={category.name}
                className="h-10 w-10 shrink-0 rounded-[6px] border border-[#5A0E14]/10 object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            ) : (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[6px] border border-[#5A0E14]/10 bg-[#FDECC8]/40 text-xl">
                {category.icon || (
                  <FolderTree
                    className="h-4 w-4 text-[#A2691F]"
                    strokeWidth={1.7}
                  />
                )}
              </div>
            )}

            <div className="min-w-0">
              <p className="font-sans text-[13px] font-semibold text-[#3C080D]">
                {category.name}
              </p>
              <p className="font-sans text-[10px] text-[#6B3A2A]/60">
                /{category.slug}
              </p>
            </div>
          </div>
        </td>

        <td className="px-4 py-3">
          <p className="line-clamp-2 font-sans text-[12px] text-[#6B3A2A]/75">
            {category.description || "—"}
          </p>
        </td>

        <td className="px-4 py-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E9A534]/40 bg-[#E9A534]/[0.10] px-2.5 py-0.5 font-sans text-[11px] font-semibold text-[#8A5A1F]">
            <Package className="h-3 w-3" strokeWidth={1.7} />
            {category.productCount || 0}
          </span>
        </td>

        <td className="px-4 py-3">
          <ActiveBadge isActive={category.isActive !== false} />
        </td>

        <td className="px-4 py-3">
          <div className="flex items-center justify-end gap-1.5">
            <button
              onClick={() => onAddSub(category)}
              className="rounded-full border border-[#5A0E14]/15 p-1.5 text-[#5A0E14]/60 transition-colors hover:border-[#E9A534]/50 hover:text-[#A2691F]"
              aria-label="Add subcategory"
              title="Add subcategory"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={1.8} />
            </button>
            <button
              onClick={() => onEdit(category)}
              className="rounded-full border border-[#5A0E14]/15 p-1.5 text-[#5A0E14]/60 transition-colors hover:border-[#E9A534]/50 hover:text-[#A2691F]"
              aria-label="Edit"
              title="Edit"
            >
              <Edit className="h-3.5 w-3.5" strokeWidth={1.8} />
            </button>
            <button
              onClick={() => onDelete(category)}
              className="rounded-full border border-[#C1272D]/20 p-1.5 text-[#C1272D]/70 transition-colors hover:border-[#C1272D]/50 hover:bg-[#C1272D]/[0.08] hover:text-[#C1272D]"
              aria-label="Delete"
              title="Delete"
            >
              <Trash2 className="h-3.5 w-3.5" strokeWidth={1.8} />
            </button>
          </div>
        </td>
      </tr>

      {expanded &&
        hasChildren &&
        category.children.map((child) => (
          <CategoryRow
            key={child._id}
            category={child}
            level={level + 1}
            onEdit={onEdit}
            onDelete={onDelete}
            onAddSub={onAddSub}
          />
        ))}
    </>
  );
}

/* ================================================================
   MAIN CATEGORY TAB
================================================================ */

export default function CategoryTab() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [preselectedParent, setPreselectedParent] = useState(null);

  const [deleteModal, setDeleteModal] = useState({
    open: false,
    category: null,
  });
  const [deleting, setDeleting] = useState(false);

  /* ─── Fetch ─── */
  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/admin/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const allCats = res.data.categories || [];
      const topLevel = allCats.filter((c) => !c.parentCategory);
      const withChildren = topLevel.map((parent) => ({
        ...parent,
        children: allCats.filter(
          (c) =>
            c.parentCategory?._id === parent._id ||
            c.parentCategory === parent._id
        ),
      }));

      setCategories(withChildren);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError(err.response?.data?.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  /* ─── Flat list for parent dropdown ─── */
  const getAllFlat = () => {
    const flat = [];
    categories.forEach((cat) => {
      flat.push(cat);
      if (cat.children) {
        cat.children.forEach((child) => flat.push(child));
      }
    });
    return flat;
  };

  /* ─── Save ─── */
  const handleSave = async (formData) => {
    try {
      setSaving(true);
      setError("");
      const token = localStorage.getItem("token");

      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        icon: formData.icon.trim(),
        image: formData.image, // base64 or URL
        parentCategory: formData.parentCategory || null,
        isActive: formData.isActive,
      };

      if (editingCategory) {
        await axios.put(
          `${API_URL}/admin/categories/${editingCategory._id}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSuccess("Category updated successfully!");
      } else {
        await axios.post(`${API_URL}/admin/categories`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess("Category created successfully!");
      }

      setFormOpen(false);
      setEditingCategory(null);
      setPreselectedParent(null);
      fetchCategories();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error saving category:", err);
      setError(err.response?.data?.message || "Failed to save category");
    } finally {
      setSaving(false);
    }
  };

  /* ─── Delete ─── */
  const handleDelete = async () => {
    if (!deleteModal.category) return;
    try {
      setDeleting(true);
      setError("");
      const token = localStorage.getItem("token");
      await axios.delete(
        `${API_URL}/admin/categories/${deleteModal.category._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess("Category deleted successfully!");
      setDeleteModal({ open: false, category: null });
      fetchCategories();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error deleting category:", err);
      setError(err.response?.data?.message || "Failed to delete category");
      setDeleteModal({ open: false, category: null });
    } finally {
      setDeleting(false);
    }
  };

  /* ─── Handlers ─── */
  const handleAddNew = () => {
    setEditingCategory(null);
    setPreselectedParent(null);
    setFormOpen(true);
  };

  const handleEdit = (cat) => {
    setEditingCategory(cat);
    setPreselectedParent(null);
    setFormOpen(true);
  };

  const handleAddSub = (parent) => {
    setEditingCategory(null);
    setPreselectedParent(parent);
    setFormOpen(true);
  };

  const handleDeleteClick = (cat) => {
    setDeleteModal({ open: true, category: cat });
  };

  /* ─── Filtered ─── */
  const filteredCategories = categories.filter((cat) => {
    const q = searchQuery.toLowerCase();
    const parentMatch = cat.name?.toLowerCase().includes(q);
    const childMatch = cat.children?.some((c) =>
      c.name?.toLowerCase().includes(q)
    );
    return parentMatch || childMatch;
  });

  const totalCount = getAllFlat().length;

  return (
    <div className="space-y-5">
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-start gap-2.5 rounded-[7px] border border-[#C1272D]/25 bg-[#C1272D]/[0.06] p-3"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#C1272D]" />
            <p className="font-sans text-[12px] text-[#8B2F2B]">{error}</p>
          </motion.div>
        )}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-start gap-2.5 rounded-[7px] border border-green-700/25 bg-green-700/[0.06] p-3"
          >
            <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-700" />
            <p className="font-sans text-[12px] text-green-800">{success}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="rounded-[9px] border border-[#5A0E14]/12 bg-[#FFFDF9]">
        <div className="flex flex-col gap-3 border-b border-[#5A0E14]/12 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-sans text-[10px] font-bold uppercase tracking-[0.22em] text-[#8A5A1F]">
              Categories ({totalCount})
            </p>
            <p className="mt-1 font-display text-[15px] font-semibold text-[#3C080D]">
              Manage Categories & Subcategories
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-[240px]">
              <Search
                className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#5A0E14]/40"
                strokeWidth={1.7}
              />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="
                  w-full rounded-full border border-[#5A0E14]/15 bg-[#FFFDF9]
                  py-2 pl-9 pr-4 font-sans text-[12px] text-[#2C1210]
                  placeholder:text-[#5A0E14]/40                  focus:border-[#E9A534]/60 focus:outline-none focus:ring-2 focus:ring-[#E9A534]/15
                "
              />
            </div>
            <button
              onClick={handleAddNew}
              className="
                flex items-center justify-center gap-2 rounded-full
                bg-[#C1272D] px-4 py-2
                font-sans text-[12px] font-semibold uppercase tracking-[0.14em]
                text-[#FFF7E9] shadow-[0_8px_20px_rgba(193,39,45,0.24)]
                transition-all duration-300 hover:bg-[#9C1C22]
              "
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={2} />
              Add Category
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-[#E9A534]/30 border-t-[#E9A534]" />
              <p className="font-sans text-[12px] text-[#6B3A2A]/70">
                Loading categories...
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-[#5A0E14]/12 bg-[#FDECC8]/30">
                  <th className="px-4 py-2.5 text-left font-sans text-[9px] font-bold uppercase tracking-[0.16em] text-[#6B3A2A]/70">
                    Name
                  </th>
                  <th className="px-4 py-2.5 text-left font-sans text-[9px] font-bold uppercase tracking-[0.16em] text-[#6B3A2A]/70">
                    Description
                  </th>
                  <th className="px-4 py-2.5 text-left font-sans text-[9px] font-bold uppercase tracking-[0.16em] text-[#6B3A2A]/70">
                    Products
                  </th>
                  <th className="px-4 py-2.5 text-left font-sans text-[9px] font-bold uppercase tracking-[0.16em] text-[#6B3A2A]/70">
                    Status
                  </th>
                  <th className="px-4 py-2.5 text-right font-sans text-[9px] font-bold uppercase tracking-[0.16em] text-[#6B3A2A]/70">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((cat) => (
                  <CategoryRow
                    key={cat._id}
                    category={cat}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                    onAddSub={handleAddSub}
                  />
                ))}

                {filteredCategories.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-16 text-center">
                      <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#E9A534]/10">
                        <Layers
                          className="h-6 w-6 text-[#A2691F]"
                          strokeWidth={1.6}
                        />
                      </div>
                      <p className="font-display text-[16px] font-semibold text-[#3C080D]">
                        {searchQuery
                          ? "No matching categories"
                          : "No categories yet"}
                      </p>
                      <p className="mt-1 font-sans text-[12px] text-[#6B3A2A]/60">
                        {searchQuery
                          ? "Try a different search term."
                          : "Click 'Add Category' to create your first one."}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AnimatePresence>
        {formOpen && (
          <CategoryFormModal
            isOpen={formOpen}
            onClose={() => {
              setFormOpen(false);
              setEditingCategory(null);
              setPreselectedParent(null);
            }}
            onSave={handleSave}
            editingCategory={
              editingCategory ||
              (preselectedParent
                ? { parentCategory: preselectedParent._id }
                : null)
            }
            parentCategories={getAllFlat()}
            loading={saving}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteModal.open && (
          <DeleteConfirmModal
            isOpen={deleteModal.open}
            onClose={() => setDeleteModal({ open: false, category: null })}
            onConfirm={handleDelete}
            categoryName={deleteModal.category?.name}
            loading={deleting}
          />
        )}
      </AnimatePresence>
    </div>
  );
}