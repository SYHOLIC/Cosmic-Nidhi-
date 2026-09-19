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
  Package,
  AlertCircle,
  Upload,
  Loader2,
  Tag,
  DollarSign,
  Layers
} from "lucide-react";

import { API_URL } from "../../config/api";

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
   IMAGE UPLOAD BOX
================================================================ */

function ImageUploadBox({ image, onChange, onRemove }) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Please select an image file");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setUploadError("Image must be less than 2MB");
      return;
    }

    setUploadError("");
    setUploading(true);

    const reader = new FileReader();
    reader.onloadend = () => {
      onChange(reader.result);
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
        Product Image
      </label>

      {image ? (
        <div className="relative overflow-hidden rounded-[7px] border border-[#5A0E14]/12">
          <img
            src={image}
            alt="Product"
            className="h-40 w-full object-cover"
            onError={(e) => {
              e.target.style.display = "none";
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
   PRODUCT FORM MODAL
================================================================ */

function ProductFormModal({
  isOpen,
  onClose,
  onSave,
  editingProduct,
  categories,
  loading,
}) {
  const [formData, setFormData] = useState({
    name: "",
    shortDescription: "",
    description: "",
    price: "",
    originalPrice: "",
    stock: 0,
    category: "",
    image: "",
    badge: "",
    features: "",
    isActive: true,
    isFeatured: false,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name || "",
        shortDescription: editingProduct.shortDescription || "",
        description: editingProduct.description || "",
        price: editingProduct.price || "",
        originalPrice: editingProduct.originalPrice || "",
        stock: editingProduct.stock || 0,
        category: editingProduct.category?._id || editingProduct.category || "",
        image: editingProduct.images?.[0] || "",
        badge: editingProduct.badge || "",
        features: editingProduct.features?.join("\n") || "",
        isActive: editingProduct.isActive !== false,
        isFeatured: editingProduct.isFeatured || false,
      });
    } else {
      setFormData({
        name: "",
        shortDescription: "",
        description: "",
        price: "",
        originalPrice: "",
        stock: 0,
        category: categories.length > 0 ? categories[0]._id : "",
        image: "",
        badge: "",
        features: "",
        isActive: true,
        isFeatured: false,
      });
    }
    setErrors({});
  }, [editingProduct, isOpen, categories]);

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
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.price || isNaN(formData.price)) newErrors.price = "Valid price is required";
    if (!formData.category) newErrors.category = "Category is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    // Parse features from text area
    const parsedFeatures = formData.features
      .split('\n')
      .map(f => f.trim())
      .filter(f => f.length > 0);

    onSave({
      ...formData,
      images: formData.image ? [formData.image] : [],
      features: parsedFeatures,
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
      stock: Number(formData.stock),
    });
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
          relative w-full max-w-2xl max-h-[90vh] overflow-y-auto
          rounded-[10px] border border-[#E9A534]/25
          bg-[#FFFDF9] shadow-[0_30px_70px_rgba(23,2,5,0.35)]
        "
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#5A0E14]/12 bg-[#FFFDF9] px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E9A534]/45 bg-[#E9A534]/[0.10] text-[#A2691F]">
              <Package className="h-4 w-4" strokeWidth={1.7} />
            </div>
            <div>
              <p className="font-sans text-[9px] font-bold uppercase tracking-[0.22em] text-[#8A5A1F]">
                {editingProduct ? "Edit" : "Create"}
              </p>
              <h3 className="font-display text-[17px] font-semibold leading-tight text-[#3C080D]">
                {editingProduct ? "Edit Product" : "New Product"}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[#5A0E14]/15 text-[#5A0E14]/60 transition-colors hover:border-[#C1272D]/30 hover:text-[#C1272D]"
          >
            <X className="h-4 w-4" strokeWidth={1.8} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-4">
              <ImageUploadBox
                image={formData.image}
                onChange={handleImageChange}
                onRemove={() => setFormData({ ...formData, image: "" })}
              />

              <div>
                <label className="mb-1.5 block font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-[#6B3A2A]/80">
                  Product Name <span className="text-[#C1272D]">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Rose Quartz Bracelet"
                  className="w-full rounded-[7px] border border-[#5A0E14]/15 bg-[#FFFDF9] px-3.5 py-2.5 font-sans text-[13px] text-[#2C1210] placeholder:text-[#5A0E14]/35 focus:border-[#E9A534]/60 focus:outline-none focus:ring-2 focus:ring-[#E9A534]/20"
                />
                {errors.name && (
                  <p className="mt-1 flex items-center gap-1 font-sans text-[11px] text-[#C1272D]">
                    <AlertCircle className="h-3 w-3" /> {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-[#6B3A2A]/80">
                  Category <span className="text-[#C1272D]">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full rounded-[7px] border border-[#5A0E14]/15 bg-[#FFFDF9] px-3.5 py-2.5 font-sans text-[13px] text-[#2C1210] focus:border-[#E9A534]/60 focus:outline-none focus:ring-2 focus:ring-[#E9A534]/20"
                >
                  <option value="" disabled>Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 flex items-center gap-1 font-sans text-[11px] text-[#C1272D]">
                    <AlertCircle className="h-3 w-3" /> {errors.category}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-[#6B3A2A]/80">
                    Price (₹) <span className="text-[#C1272D]">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full rounded-[7px] border border-[#5A0E14]/15 bg-[#FFFDF9] px-3.5 py-2.5 font-sans text-[13px] text-[#2C1210] focus:border-[#E9A534]/60 focus:outline-none focus:ring-2 focus:ring-[#E9A534]/20"
                  />
                  {errors.price && (
                    <p className="mt-1 flex items-center gap-1 font-sans text-[11px] text-[#C1272D]">
                      <AlertCircle className="h-3 w-3" /> {errors.price}
                    </p>
                  )}
                </div>
                <div>
                  <label className="mb-1.5 block font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-[#6B3A2A]/80">
                    Original Price (₹)
                  </label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleChange}
                    className="w-full rounded-[7px] border border-[#5A0E14]/15 bg-[#FFFDF9] px-3.5 py-2.5 font-sans text-[13px] text-[#2C1210] focus:border-[#E9A534]/60 focus:outline-none focus:ring-2 focus:ring-[#E9A534]/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-[#6B3A2A]/80">
                    Stock
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    className="w-full rounded-[7px] border border-[#5A0E14]/15 bg-[#FFFDF9] px-3.5 py-2.5 font-sans text-[13px] text-[#2C1210] focus:border-[#E9A534]/60 focus:outline-none focus:ring-2 focus:ring-[#E9A534]/20"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-[#6B3A2A]/80">
                    Badge
                  </label>
                  <select
                    name="badge"
                    value={formData.badge}
                    onChange={handleChange}
                    className="w-full rounded-[7px] border border-[#5A0E14]/15 bg-[#FFFDF9] px-3.5 py-2.5 font-sans text-[13px] text-[#2C1210] focus:border-[#E9A534]/60 focus:outline-none focus:ring-2 focus:ring-[#E9A534]/20"
                  >
                    <option value="">None</option>
                    <option value="Best Seller">Best Seller</option>
                    <option value="New">New</option>
                    <option value="Popular">Popular</option>
                    <option value="Sacred">Sacred</option>
                    <option value="Limited">Limited</option>
                    <option value="Handmade">Handmade</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-[#6B3A2A]/80">
                  Short Description
                </label>
                <textarea
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleChange}
                  rows={2}
                  maxLength={200}
                  className="w-full resize-none rounded-[7px] border border-[#5A0E14]/15 bg-[#FFFDF9] px-3.5 py-2.5 font-sans text-[13px] text-[#2C1210] placeholder:text-[#5A0E14]/35 focus:border-[#E9A534]/60 focus:outline-none focus:ring-2 focus:ring-[#E9A534]/20"
                />
              </div>

              <div>
                <label className="mb-1.5 block font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-[#6B3A2A]/80">
                  Full Description <span className="text-[#C1272D]">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  className="w-full resize-none rounded-[7px] border border-[#5A0E14]/15 bg-[#FFFDF9] px-3.5 py-2.5 font-sans text-[13px] text-[#2C1210] placeholder:text-[#5A0E14]/35 focus:border-[#E9A534]/60 focus:outline-none focus:ring-2 focus:ring-[#E9A534]/20"
                />
                {errors.description && (
                  <p className="mt-1 flex items-center gap-1 font-sans text-[11px] text-[#C1272D]">
                    <AlertCircle className="h-3 w-3" /> {errors.description}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-[#6B3A2A]/80">
                  Features (One per line)
                </label>
                <textarea
                  name="features"
                  value={formData.features}
                  onChange={handleChange}
                  rows={3}
                  placeholder="e.g. Cleanses negative energy&#10;Hand-crafted&#10;Free shipping"
                  className="w-full resize-none rounded-[7px] border border-[#5A0E14]/15 bg-[#FFFDF9] px-3.5 py-2.5 font-sans text-[13px] text-[#2C1210] placeholder:text-[#5A0E14]/35 focus:border-[#E9A534]/60 focus:outline-none focus:ring-2 focus:ring-[#E9A534]/20"
                />
              </div>

              <div className="flex gap-4">
                <div className="flex flex-1 items-center gap-3 rounded-[7px] border border-[#5A0E14]/12 bg-[#FDECC8]/25 p-3">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="h-4 w-4 cursor-pointer rounded border-[#5A0E14]/25 text-[#C1272D] accent-[#C1272D]"
                  />
                  <label htmlFor="isActive" className="cursor-pointer font-sans text-[12px] font-medium text-[#3C080D]">
                    Active
                  </label>
                </div>
                
                <div className="flex flex-1 items-center gap-3 rounded-[7px] border border-[#5A0E14]/12 bg-[#FDECC8]/25 p-3">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleChange}
                    className="h-4 w-4 cursor-pointer rounded border-[#5A0E14]/25 text-[#C1272D] accent-[#C1272D]"
                  />
                  <label htmlFor="isFeatured" className="cursor-pointer font-sans text-[12px] font-medium text-[#3C080D]">
                    Featured
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-[#5A0E14]/12">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-full border border-[#5A0E14]/20 py-2.5 font-sans text-[12px] font-semibold uppercase tracking-[0.14em] text-[#5A0E14]/70 transition-colors hover:border-[#5A0E14]/40 hover:text-[#3C080D]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#C1272D] py-2.5 font-sans text-[12px] font-semibold uppercase tracking-[0.14em] text-[#FFF7E9] transition-all duration-300 hover:bg-[#9C1C22] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={2} />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5" strokeWidth={1.8} />
                  {editingProduct ? "Update" : "Create"}
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
  productName,
  loading,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#170205]/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="relative w-full max-w-sm rounded-[10px] border border-[#C1272D]/25 bg-[#FFFDF9] p-6 shadow-[0_30px_70px_rgba(23,2,5,0.35)]"
      >
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#C1272D]/10 text-[#C1272D]">
          <Trash2 className="h-5 w-5" strokeWidth={1.8} />
        </div>
        <h3 className="font-display text-[18px] font-semibold text-[#3C080D]">
          Delete Product?
        </h3>
        <p className="mt-2 font-sans text-[13px] leading-relaxed text-[#6B3A2A]/80">
          Are you sure you want to delete <span className="font-semibold text-[#3C080D]">"{productName}"</span>? This action cannot be undone.
        </p>
        <div className="mt-5 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-full border border-[#5A0E14]/20 py-2.5 font-sans text-[12px] font-semibold uppercase tracking-[0.14em] text-[#5A0E14]/70 transition-colors hover:border-[#5A0E14]/40 hover:text-[#3C080D]"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 rounded-full bg-[#C1272D] py-2.5 font-sans text-[12px] font-semibold uppercase tracking-[0.14em] text-[#FFF7E9] transition-all duration-300 hover:bg-[#9C1C22] disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* ================================================================
   MAIN PRODUCT TAB
================================================================ */

export default function ProductTab() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [deleteModal, setDeleteModal] = useState({
    open: false,
    product: null,
  });
  const [deleting, setDeleting] = useState(false);

  /* ─── Fetch Data ─── */
  const fetchData = async (pageOverride) => {
    const targetPage = pageOverride ?? page;
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      
      // Fetch products and categories concurrently
      const [productsRes, categoriesRes] = await Promise.all([
        axios.get(`${API_URL}/products?page=${targetPage}&limit=${limit}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/admin/categories`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      ]);

      setProducts(productsRes.data.products || []);
      setTotalPages(productsRes.data.pagination?.pages || 1);
      
      // Flatten categories for dropdown
      const allCats = categoriesRes.data.categories || [];
      const flatCats = [];
      allCats.forEach(c => {
        flatCats.push(c);
        if(c.children) c.children.forEach(child => flatCats.push(child));
      });
      setCategories(flatCats);
      
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.response?.data?.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  /* ─── Save ─── */
  const handleSave = async (payload) => {
    try {
      setSaving(true);
      setError("");
      const token = localStorage.getItem("token");

      if (editingProduct) {
        await axios.put(`${API_URL}/products/${editingProduct._id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuccess("Product updated successfully!");
        setFormOpen(false);
        setEditingProduct(null);
        await fetchData(page); // explicitly pass page to avoid stale closure
      } else {
        await axios.post(`${API_URL}/products`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess("Product created successfully!");
        setFormOpen(false);
        setEditingProduct(null);
        // Go to page 1 so the new product is visible
        if (page === 1) {
          await fetchData(1);
        } else {
          setPage(1); // triggers useEffect → fetchData
        }
      }

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error saving product:", err);
      setError(err.response?.data?.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  /* ─── Delete ─── */
  const handleDelete = async () => {
    if (!deleteModal.product) return;
    try {
      setDeleting(true);
      setError("");
      const token = localStorage.getItem("token");

      await axios.delete(`${API_URL}/products/${deleteModal.product._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess("Product deleted successfully!");
      setDeleteModal({ open: false, product: null });

      // If we deleted the last item on this page, go back one page
      const remainingOnPage = products.length - 1;
      const targetPage = remainingOnPage === 0 && page > 1 ? page - 1 : page;

      if (targetPage !== page) {
        setPage(targetPage); // triggers useEffect → fetchData
      } else {
        await fetchData(targetPage); // explicitly pass page to avoid stale closure
      }

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error deleting product:", err);
      setError(err.response?.data?.message || "Failed to delete product");
    } finally {
      setDeleting(false);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStock = showLowStockOnly ? p.stock < 5 : true;
    return matchesSearch && matchesStock;
  });

  return (
    <div className="rounded-[9px] border border-[#5A0E14]/12 bg-[#FFFDF9]">
      {/* ─── Header ─── */}
      <div className="flex flex-col gap-4 border-b border-[#5A0E14]/12 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-sans text-[10px] font-bold uppercase tracking-[0.22em] text-[#8A5A1F]">
            Products
          </p>
          <p className="mt-1 font-display text-[15px] font-semibold text-[#3C080D]">
            Manage Products
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-[240px]">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#5A0E14]/40" strokeWidth={1.7} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-[#5A0E14]/15 bg-[#FFFDF9] py-2 pl-9 pr-4 font-sans text-[12px] text-[#2C1210] placeholder:text-[#5A0E14]/40 focus:border-[#E9A534]/60 focus:outline-none focus:ring-2 focus:ring-[#E9A534]/15"
            />
          </div>
          
          <div className="flex items-center gap-2 pr-2">
            <input
              type="checkbox"
              id="lowStockToggle"
              checked={showLowStockOnly}
              onChange={(e) => setShowLowStockOnly(e.target.checked)}
              className="h-4 w-4 cursor-pointer rounded border-[#5A0E14]/25 text-[#C1272D] accent-[#C1272D]"
            />
            <label htmlFor="lowStockToggle" className="cursor-pointer font-sans text-[11px] font-bold uppercase tracking-[0.1em] text-[#5A0E14]/70 hover:text-[#C1272D]">
              Low Stock
            </label>
          </div>

          <button
            onClick={() => {
              setEditingProduct(null);
              setFormOpen(true);
            }}
            className="flex items-center justify-center gap-1.5 rounded-full bg-[#5A0E14] px-4 py-2 font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-[#FFF8EC] transition-all duration-300 hover:bg-[#3C080D] hover:shadow-[0_8px_20px_rgba(90,14,20,0.24)]"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2} />
            Add Product
          </button>
        </div>
      </div>

      {/* ─── Alerts ─── */}
      {(error || success) && (
        <div className="border-b border-[#5A0E14]/12 p-4">
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 rounded-[7px] border border-[#C1272D]/30 bg-[#C1272D]/[0.06] p-3"
              >
                <AlertCircle className="h-4 w-4 text-[#C1272D]" />
                <p className="font-sans text-[12px] text-[#8B2F2B]">{error}</p>
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 rounded-[7px] border border-green-700/30 bg-green-700/[0.06] p-3"
              >
                <CheckCircle className="h-4 w-4 text-green-700" />
                <p className="font-sans text-[12px] text-green-800">{success}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* ─── Table ─── */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-[#5A0E14]/12 bg-[#FDECC8]/30">
              <th className="px-4 py-2.5 text-left font-sans text-[9px] font-bold uppercase tracking-[0.16em] text-[#6B3A2A]/70">Product Name</th>
              <th className="px-4 py-2.5 text-left font-sans text-[9px] font-bold uppercase tracking-[0.16em] text-[#6B3A2A]/70">Category</th>
              <th className="px-4 py-2.5 text-left font-sans text-[9px] font-bold uppercase tracking-[0.16em] text-[#6B3A2A]/70">Price</th>
              <th className="px-4 py-2.5 text-left font-sans text-[9px] font-bold uppercase tracking-[0.16em] text-[#6B3A2A]/70">Stock</th>
              <th className="px-4 py-2.5 text-left font-sans text-[9px] font-bold uppercase tracking-[0.16em] text-[#6B3A2A]/70">Status</th>
              <th className="px-4 py-2.5 text-right font-sans text-[9px] font-bold uppercase tracking-[0.16em] text-[#6B3A2A]/70">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin text-[#A2691F]" />
                </td>
              </tr>
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center font-sans text-[12px] text-[#5A0E14]/50">
                  No products found.
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product._id} className="border-b border-[#5A0E14]/[0.06] last:border-0 transition-colors hover:bg-[#FDECC8]/20">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {product.images?.[0] ? (
                        <img src={product.images[0]} alt={product.name} className="h-10 w-10 shrink-0 rounded-[6px] border border-[#5A0E14]/10 object-cover" />
                      ) : (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[6px] border border-[#5A0E14]/10 bg-[#FDECC8]/40">
                          <Package className="h-4 w-4 text-[#A2691F]" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-sans text-[13px] font-semibold text-[#3C080D] truncate">
                          {product.name}
                        </p>
                        {product.badge && (
                          <p className="font-sans text-[10px] text-[#C1272D] font-semibold">
                            {product.badge}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-sans text-[12px] text-[#6B3A2A]/75">
                    {product.category?.name || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-display text-[13px] font-semibold text-[#C1272D]">
                      ₹{product.price}
                    </p>
                    {product.originalPrice && (
                      <p className="font-sans text-[10px] text-[#6B3A2A]/60 line-through">
                        ₹{product.originalPrice}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3 font-sans text-[12px] text-[#6B3A2A]/75">
                    <span className={product.stock < 5 ? "font-bold text-[#C1272D]" : ""}>
                      {product.stock} units
                    </span>
                    {product.stock < 5 && (
                      <span className="ml-2 inline-flex items-center rounded-full bg-[#C1272D]/[0.12] px-2 py-0.5 font-sans text-[9px] font-bold uppercase tracking-[0.14em] text-[#C1272D]">
                        Low Stock
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <ActiveBadge isActive={product.isActive} />
                    {product.isFeatured && (
                      <span className="ml-2 inline-flex items-center rounded-full bg-[#E9A534]/[0.12] px-2 py-0.5 font-sans text-[9px] font-bold uppercase tracking-[0.14em] text-[#8A5A1F]">
                        Featured
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => {
                          setEditingProduct(product);
                          setFormOpen(true);
                        }}
                        className="rounded-full border border-[#5A0E14]/15 p-1.5 text-[#5A0E14]/60 transition-colors hover:border-[#E9A534]/50 hover:text-[#A2691F]"
                      >
                        <Edit className="h-3.5 w-3.5" strokeWidth={1.8} />
                      </button>
                      <button
                        onClick={() => setDeleteModal({ open: true, product })}
                        className="rounded-full border border-[#C1272D]/20 p-1.5 text-[#C1272D]/70 transition-colors hover:border-[#C1272D]/50 hover:bg-[#C1272D]/[0.08] hover:text-[#C1272D]"
                      >
                        <Trash2 className="h-3.5 w-3.5" strokeWidth={1.8} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* ─── Pagination ─── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-[#5A0E14]/12 px-4 py-3">
          <p className="font-sans text-[11px] text-[#6B3A2A]/70">
            Page {page} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded border border-[#5A0E14]/15 px-2 py-1 font-sans text-[11px] font-semibold text-[#5A0E14]/70 disabled:opacity-50"
            >
              Prev
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="rounded border border-[#5A0E14]/15 px-2 py-1 font-sans text-[11px] font-semibold text-[#5A0E14]/70 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* ─── Modals ─── */}
      <AnimatePresence>
        <ProductFormModal
          isOpen={formOpen}
          onClose={() => setFormOpen(false)}
          onSave={handleSave}
          editingProduct={editingProduct}
          categories={categories}
          loading={saving}
        />

        <DeleteConfirmModal
          isOpen={deleteModal.open}
          onClose={() => setDeleteModal({ open: false, product: null })}
          onConfirm={handleDelete}
          productName={deleteModal.product?.name}
          loading={deleting}
        />
      </AnimatePresence>
    </div>
  );
}
