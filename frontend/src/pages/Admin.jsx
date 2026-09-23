import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Users,
  Package,
  ShoppingBag,
  Calendar,
  DollarSign,
  User,
  Mail,
  Phone,
  Edit,
  Trash2,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Search,
  LogOut,
  BarChart3,
  Compass,
  ChevronRight,
  ChevronDown,
  Gem,
  Star,
  Bell,
  Menu,
  X,
  FolderTree,
  Layers,
  Plus,
  Save,
  AlertCircle,
  Image as ImageIcon,
} from "lucide-react";
import CategoryTab from "../components/admin/CategoryTab";
import ProductTab from "../components/admin/ProductTab";
import CouponTab from "../components/admin/CouponTab";
import ReviewTab from "../components/admin/ReviewTab";
import SeoTab from "../components/admin/SeoTab";
import PageTab from "../components/admin/PageTab";
import BookingTab from "../components/admin/BookingTab";
import AdminNotifications from "../components/admin/AdminNotifications";

import { API_URL } from "../config/api";

/* ================================================================
   SIDEBAR NAV ITEMS
================================================================ */

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "users", label: "Users", icon: Users },
  { id: "orders", label: "Orders", icon: ShoppingBag },
  { id: "bookings", label: "Bookings", icon: Calendar },
  { id: "categories", label: "Categories", icon: FolderTree },
  { id: "products", label: "Products", icon: Package },
  { id: "coupons", label: "Coupons", icon: DollarSign },
  { id: "reviews", label: "Reviews", icon: Star },
  { id: "seo", label: "SEO Settings", icon: Search },
  { id: "pages", label: "Static Pages", icon: Layers },
];

const TAB_LABELS = {
  overview: "Overview",
  users: "Users",
  orders: "Orders",
  bookings: "Bookings",
  categories: "Categories",
  products: "Products",
  coupons: "Coupons",
  reviews: "Reviews",
  seo: "SEO Settings",
  pages: "Static Pages",
};

/* ================================================================
   STATUS PILL
================================================================ */

function StatusPill({ status }) {
  const map = {
    confirmed: { bg: "border-green-700/30 bg-green-700/[0.08]", text: "text-green-800", dot: "bg-green-700" },
    delivered: { bg: "border-green-700/30 bg-green-700/[0.08]", text: "text-green-800", dot: "bg-green-700" },
    completed: { bg: "border-blue-700/30 bg-blue-700/[0.08]", text: "text-blue-800", dot: "bg-blue-700" },
    pending: { bg: "border-[#C1892F]/45 bg-[#E9A534]/[0.12]", text: "text-[#8A5A1F]", dot: "bg-[#C1892F]" },
    pending_appointment: { bg: "border-[#C1892F]/45 bg-[#E9A534]/[0.12]", text: "text-[#8A5A1F]", dot: "bg-[#C1892F]" },
    "pending appointment": { bg: "border-[#C1892F]/45 bg-[#E9A534]/[0.12]", text: "text-[#8A5A1F]", dot: "bg-[#C1892F]" },
    processing: { bg: "border-[#C1892F]/45 bg-[#E9A534]/[0.12]", text: "text-[#8A5A1F]", dot: "bg-[#C1892F]" },
    ongoing: { bg: "border-purple-600/30 bg-purple-600/[0.10]", text: "text-purple-800", dot: "bg-purple-600" },
    follow_up: { bg: "border-sky-600/30 bg-sky-600/[0.10]", text: "text-sky-800", dot: "bg-sky-600" },
    "follow-up": { bg: "border-sky-600/30 bg-sky-600/[0.10]", text: "text-sky-800", dot: "bg-sky-600" },
    rescheduled: { bg: "border-amber-600/30 bg-amber-600/[0.10]", text: "text-amber-900", dot: "bg-amber-600" },
    cancelled: { bg: "border-[#C1272D]/30 bg-[#C1272D]/[0.08]", text: "text-[#8B2F2B]", dot: "bg-[#C1272D]" },
    canceled: { bg: "border-[#C1272D]/30 bg-[#C1272D]/[0.08]", text: "text-[#8B2F2B]", dot: "bg-[#C1272D]" },
  };

  const normalized = status?.toLowerCase();
  const style = map[normalized] || map.pending;

  const labelMap = {
    pending: "Pending",
    pending_appointment: "Pending Appointment",
    "pending appointment": "Pending Appointment",
    ongoing: "Ongoing (In-Session)",
    follow_up: "Follow-up",
    "follow-up": "Follow-up",
    cancelled: "Canceled",
    canceled: "Canceled",
  };

  const displayLabel = labelMap[normalized] || status;

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 whitespace-nowrap
        rounded-full border px-2.5 py-0.5
        font-sans text-[9px] font-bold uppercase tracking-[0.14em]
        ${style.bg} ${style.text}
      `}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {displayLabel}
    </span>
  );
}

function formatRelativeOrderAge(dateString) {
  if (!dateString) return "";
  const now = new Date();
  const past = new Date(dateString);
  const diffInMs = now.getTime() - past.getTime();
  if (isNaN(diffInMs)) return "";
  const diffInSec = Math.max(0, Math.floor(diffInMs / 1000));
  if (diffInSec < 60) return "just now";
  const diffInMin = Math.floor(diffInSec / 60);
  if (diffInMin < 60) return `${diffInMin} min${diffInMin === 1 ? "" : "s"} ago`;
  const diffInHours = Math.floor(diffInMin / 60);
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours === 1 ? "" : "s"} ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays} day${diffInDays === 1 ? "" : "s"} ago`;
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths} month${diffInMonths === 1 ? "" : "s"} ago`;
  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} year${diffInYears === 1 ? "" : "s"} ago`;
}

/* ================================================================
   STAT CARD
================================================================ */

function StatCard({ label, value, icon: Icon }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="
        group relative overflow-hidden
        rounded-[7px] border border-[#5A0E14]/12
        bg-[#FFFDF9] p-4
        shadow-[0_8px_22px_rgba(60,8,13,0.05)]
        transition-all duration-300
        hover:-translate-y-0.5
        hover:border-[#E9A534]/45
        hover:shadow-[0_14px_32px_rgba(60,8,13,0.10)]
      "
    >
      <span className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E9A534]/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#E9A534]/45 bg-gradient-to-br from-[#E9A534]/[0.18] to-[#E9A534]/[0.02] text-[#A2691F]">
          <Icon className="h-4 w-4" strokeWidth={1.7} />
        </div>
        <div className="min-w-0">
          <p className="font-display text-[22px] font-semibold leading-none text-[#3C080D]">
            {value}
          </p>
          <p className="mt-1 truncate font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6B3A2A]/75">
            {label}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/* ================================================================
   SIDEBAR
================================================================ */

function Sidebar({
  activeTab,
  setActiveTab,
  handleLogout,
  mobileOpen,
  setMobileOpen,
}) {
  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[80] bg-[#170205]/70 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`
          fixed left-0 top-[74px] bottom-0 z-[90]
          w-[240px] overflow-y-auto
          border-r border-[#E9A534]/12
          bg-[#260005]
          transition-transform duration-300
          lg:top-[78px]
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="relative border-b border-[#E9A534]/15 px-4 py-5">
          <span className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E9A534]/60 to-transparent" />

          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#E9A534]/45 bg-[#E9A534]/[0.12] text-[#E9C76D]">
              <Shield className="h-4 w-4" strokeWidth={1.7} />
            </div>
            <div className="min-w-0">
              <p className="font-display text-[14px] font-semibold text-[#FFF8EC]">
                Admin Panel
              </p>
              <p className="truncate font-sans text-[9px] font-medium uppercase tracking-[0.18em] text-[#E9C76D]/60">
                Cosmic Nidhi
              </p>
            </div>

            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="ml-auto flex h-7 w-7 items-center justify-center rounded-full border border-[#E9A534]/30 text-[#E9C76D] lg:hidden"
              aria-label="Close menu"
            >
              <X className="h-3.5 w-3.5" strokeWidth={1.8} />
            </button>
          </div>
        </div>

        <nav className="p-2.5">
          <p className="mb-2 px-2 font-sans text-[9px] font-bold uppercase tracking-[0.22em] text-[#E9C76D]/50">
            Manage
          </p>

          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileOpen(false);
                }}
                className={`
                  group mb-1 flex w-full items-center gap-3
                  rounded-[6px] px-3 py-2.5
                  font-sans text-[13px] font-semibold
                  transition-all duration-300
                  ${
                    isActive
                      ? "bg-[#5A0E14] text-[#FFF8EC] shadow-[0_8px_20px_rgba(90,14,20,0.24)]"
                      : "text-[#F5E5C7]/70 hover:bg-[#E9A534]/[0.08] hover:text-[#E9C76D]"
                  }
                `}
              >
                <Icon
                  className={`shrink-0 ${
                    isActive
                      ? "text-[#E9C76D]"
                      : "text-[#E9C76D]/50 group-hover:text-[#E9C76D]"
                  }`}
                  style={{ height: "16px", width: "16px" }}
                  strokeWidth={1.7}
                />
                <span className="truncate">{item.label}</span>
                {isActive && (
                  <ChevronRight className="ml-auto h-3.5 w-3.5 text-[#E9C76D]" />
                )}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-[#E9A534]/15 p-2.5">
          <p className="mb-2 px-2 font-sans text-[9px] font-bold uppercase tracking-[0.22em] text-[#E9C76D]/50">
            Account
          </p>

          <button
            onClick={handleLogout}
            className="
              flex w-full items-center gap-3 rounded-[6px]
              px-3 py-2.5 font-sans text-[13px] font-semibold
              text-[#E9A0A0]/85 transition-all duration-300
              hover:bg-[#C1272D]/[0.10] hover:text-[#E9A0A0]
            "
          >
            <LogOut style={{ height: "16px", width: "16px" }} strokeWidth={1.7} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

/* ================================================================
   TOP BAR
================================================================ */

function TopBar({ activeTab, setActiveTab, onMenuClick, handleLogout, orders, bookings }) {
  return (
    <div className="sticky top-0 z-30 border-b border-[#5A0E14]/12 bg-[#FFFDF9]/95 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open sidebar"
            className="
              flex h-9 w-9 items-center justify-center rounded-full
              border border-[#5A0E14]/15 text-[#5A0E14]
              transition-colors hover:border-[#E9A534]/50 hover:text-[#8B2F2B]
              lg:hidden
            "
          >
            <Menu className="h-4 w-4" strokeWidth={1.8} />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="h-px w-4 bg-[#C89846]" />
              <p className="font-sans text-[9px] font-bold uppercase tracking-[0.24em] text-[#8A5A1F]">
                Admin / {TAB_LABELS[activeTab] || "Overview"}
              </p>
            </div>
            <p className="mt-0.5 font-display text-[16px] font-semibold leading-none text-[#3C080D] sm:text-[18px]">
              {TAB_LABELS[activeTab] || "Overview"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <AdminNotifications
            onSelectTab={setActiveTab}
            fallbackOrders={orders}
            fallbackBookings={bookings}
          />

          <div className="flex items-center gap-2 rounded-full border border-[#5A0E14]/15 bg-[#FDECC8]/30 py-1 pl-1 pr-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#3C080D] to-[#5A0E14]">
              <span className="font-display text-[11px] font-semibold text-[#E9C76D]">
                A
              </span>
            </div>
            <span className="hidden font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-[#5A0E14]/75 sm:inline">
              Admin
            </span>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            aria-label="Logout"
            className="
              hidden h-9 w-9 items-center justify-center rounded-full
              border border-[#C1272D]/25 text-[#C1272D]
              transition-colors hover:bg-[#C1272D]/[0.08]
              lg:flex
            "
          >
            <LogOut className="h-4 w-4" strokeWidth={1.7} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   TAB: OVERVIEW
================================================================ */

function OverviewTab({ orders, bookings }) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <section className="rounded-[9px] border border-[#5A0E14]/12 bg-[#FFFDF9] p-5">
        <div className="mb-4 flex items-center gap-3">
          <span className="h-px w-6 bg-[#E9A534]" />
          <p className="font-sans text-[10px] font-bold uppercase tracking-[0.24em] text-[#8A5A1F]">
            Recent Orders
          </p>
        </div>

        <div className="space-y-2">
          {orders.slice(0, 5).map((order) => {
            const itemNames =
              order.items
                ?.map((i) => i.name || i.product?.name)
                .filter(Boolean)
                .join(", ") || "1 Item";
            return (
              <div
                key={order._id}
                className="flex items-center justify-between gap-3 rounded-[7px] border border-[#5A0E14]/12 bg-[#FDECC8]/30 p-3 transition-all duration-300 hover:border-[#E9A534]/50"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-display text-[13px] font-semibold text-[#3C080D]">
                      #{order._id?.slice(-6).toUpperCase()}
                    </p>
                    <span className="font-sans text-[10px] font-medium text-[#8A5A1F]">
                      {formatRelativeOrderAge(order.createdAt)}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate font-sans text-[11px] text-[#6B3A2A]/80">
                    <span className="font-semibold text-[#3C080D]">
                      {order.shippingAddress?.name || order.user?.name || "Customer"}
                    </span>
                    {" · "}
                    <span className="text-[#8A5A1F]">{itemNames}</span>
                  </p>
                </div>
                <span className="shrink-0 font-display text-[14px] font-semibold text-[#C1272D]">
                  ₹{order.totalAmount?.toLocaleString("en-IN") || 0}
                </span>
              </div>
            );
          })}

          {orders.length === 0 && (
            <div className="rounded-[7px] border border-dashed border-[#5A0E14]/20 bg-[#FDECC8]/20 py-8 text-center">
              <p className="font-sans text-[11px] text-[#5A0E14]/50">
                No orders yet.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="rounded-[9px] border border-[#5A0E14]/12 bg-[#FFFDF9] p-5">
        <div className="mb-4 flex items-center gap-3">
          <span className="h-px w-6 bg-[#E9A534]" />
          <p className="font-sans text-[10px] font-bold uppercase tracking-[0.24em] text-[#8A5A1F]">
            Recent Bookings
          </p>
        </div>

        <div className="space-y-2">
          {bookings.slice(0, 5).map((booking) => (
            <div
              key={booking._id}
              className="flex items-center justify-between gap-3 rounded-[7px] border border-[#5A0E14]/12 bg-[#FDECC8]/30 p-3 transition-all duration-300 hover:border-[#E9A534]/50"
            >
              <div className="min-w-0">
                <p className="truncate font-display text-[13px] font-semibold text-[#3C080D]">
                  {booking.serviceName}
                </p>
                <p className="mt-0.5 truncate font-sans text-[11px] text-[#6B3A2A]/70">
                  {booking.user?.name || "Unknown"}
                </p>
              </div>
              <StatusPill status={booking.status} />
            </div>
          ))}

          {bookings.length === 0 && (
            <div className="rounded-[7px] border border-dashed border-[#5A0E14]/20 bg-[#FDECC8]/20 py-8 text-center">
              <p className="font-sans text-[11px] text-[#5A0E14]/50">
                No bookings yet.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

/* ================================================================
   TAB: USERS
================================================================ */

function UsersTab({
  users,
  searchQuery,
  setSearchQuery,
  handleUserRoleUpdate,
  handleDeleteUser,
}) {
  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="rounded-[9px] border border-[#5A0E14]/12 bg-[#FFFDF9]">
      <div className="flex flex-col gap-3 border-b border-[#5A0E14]/12 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-sans text-[10px] font-bold uppercase tracking-[0.22em] text-[#8A5A1F]">
            Users ({filteredUsers.length})
          </p>
          <p className="mt-1 font-display text-[15px] font-semibold text-[#3C080D]">
            Manage Accounts
          </p>
        </div>

        <div className="relative w-full sm:max-w-[280px]">
          <Search
            className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#5A0E14]/40"
            strokeWidth={1.7}
          />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="
              w-full rounded-full border border-[#5A0E14]/15 bg-[#FFFDF9]
              py-2 pl-9 pr-4 font-sans text-[12px] text-[#2C1210]
              placeholder:text-[#5A0E14]/40
              focus:border-[#E9A534]/60 focus:outline-none focus:ring-2 focus:ring-[#E9A534]/15
            "
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-[#5A0E14]/12 bg-[#FDECC8]/30">
              <th className="px-4 py-2.5 text-left font-sans text-[9px] font-bold uppercase tracking-[0.16em] text-[#6B3A2A]/70">
                User
              </th>
              <th className="px-4 py-2.5 text-left font-sans text-[9px] font-bold uppercase tracking-[0.16em] text-[#6B3A2A]/70">
                Email
              </th>
              <th className="px-4 py-2.5 text-left font-sans text-[9px] font-bold uppercase tracking-[0.16em] text-[#6B3A2A]/70">
                Role
              </th>
              <th className="px-4 py-2.5 text-left font-sans text-[9px] font-bold uppercase tracking-[0.16em] text-[#6B3A2A]/70">
                Joined
              </th>
              <th className="px-4 py-2.5 text-right font-sans text-[9px] font-bold uppercase tracking-[0.16em] text-[#6B3A2A]/70">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr
                key={user._id}
                className="border-b border-[#5A0E14]/[0.06] last:border-0 transition-colors hover:bg-[#FDECC8]/20"
              >
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#3C080D] to-[#5A0E14]">
                      <span className="font-display text-[11px] font-semibold text-[#E9C76D]">
                        {user.name?.charAt(0) || "U"}
                      </span>
                    </div>
                    <span className="font-sans text-[12.5px] font-medium text-[#3C080D]">
                      {user.name}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-2.5 font-sans text-[12px] text-[#6B3A2A]/75">
                  {user.email}
                </td>
                <td className="px-4 py-2.5">
                  <select
                    value={user.role}
                    onChange={(e) => handleUserRoleUpdate(user._id, e.target.value)}
                    className="
                      rounded-full border border-[#5A0E14]/15 bg-[#FFFDF9]
                      px-2.5 py-1 font-sans text-[11px] font-semibold text-[#3C080D]
                      focus:border-[#E9A534]/60 focus:outline-none
                    "
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-4 py-2.5 font-sans text-[11px] text-[#6B3A2A]/65">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-2.5 text-right">
                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    aria-label="Delete user"
                    className="rounded-full p-1.5 text-[#C1272D] transition-colors hover:bg-[#C1272D]/[0.08]"
                  >
                    <Trash2 className="h-3.5 w-3.5" strokeWidth={1.7} />
                  </button>
                </td>
              </tr>
            ))}

            {filteredUsers.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center font-sans text-[12px] text-[#5A0E14]/50"
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ================================================================
   TAB: ORDERS
================================================================ */

function OrdersTab({ orders, onUpdateStatus }) {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderSearch, setOrderSearch] = useState("");

  const filteredOrders = orders.filter((order) => {
    if (!orderSearch.trim()) return true;
    const q = orderSearch.toLowerCase().trim();
    const idMatch =
      order._id?.toLowerCase().includes(q) ||
      order._id?.slice(-6).toLowerCase().includes(q);
    const userMatch = (
      order.shippingAddress?.name ||
      order.user?.name ||
      ""
    )
      .toLowerCase()
      .includes(q);
    const productMatch = order.items?.some((i) =>
      (i.name || i.product?.name || "").toLowerCase().includes(q)
    );
    return idMatch || userMatch || productMatch;
  });

  return (
    <div className="rounded-[9px] border border-[#5A0E14]/12 bg-[#FFFDF9]">
      <div className="border-b border-[#5A0E14]/12 px-4 py-3 sm:px-5 sm:py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="font-sans text-[10px] font-bold uppercase tracking-[0.22em] text-[#8A5A1F]">
              Orders Management ({orders.length})
            </p>
            <p className="mt-1 font-display text-[16px] font-semibold text-[#3C080D]">
              All Orders & Purchased Products
            </p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#8A5A1F]/60" />
            <input
              type="text"
              value={orderSearch}
              onChange={(e) => setOrderSearch(e.target.value)}
              placeholder="Search by product, customer, or ID..."
              className="w-full rounded-md border border-[#5A0E14]/15 bg-white py-1.5 pl-8 pr-3 font-sans text-[11px] text-[#3C080D] placeholder-[#6B3A2A]/40 focus:border-[#E9A534] focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px]">
          <thead>
            <tr className="border-b border-[#5A0E14]/12 bg-[#FDECC8]/30">
              <th className="px-4 py-2.5 text-left font-sans text-[9px] font-bold uppercase tracking-[0.16em] text-[#6B3A2A]/70">
                Order ID
              </th>
              <th className="px-4 py-2.5 text-left font-sans text-[9px] font-bold uppercase tracking-[0.16em] text-[#6B3A2A]/70">
                Customer
              </th>
              <th className="px-4 py-2.5 text-left font-sans text-[9px] font-bold uppercase tracking-[0.16em] text-[#6B3A2A]/70">
                Item Name
              </th>
              <th className="px-4 py-2.5 text-left font-sans text-[9px] font-bold uppercase tracking-[0.16em] text-[#6B3A2A]/70">
                Total
              </th>
              <th className="px-4 py-2.5 text-left font-sans text-[9px] font-bold uppercase tracking-[0.16em] text-[#6B3A2A]/70">
                Status
              </th>
              <th className="px-4 py-2.5 text-left font-sans text-[9px] font-bold uppercase tracking-[0.16em] text-[#6B3A2A]/70">
                Order Age / Date
              </th>
              <th className="px-4 py-2.5 text-right font-sans text-[9px] font-bold uppercase tracking-[0.16em] text-[#6B3A2A]/70">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => {
              const customerName =
                order.shippingAddress?.name || order.user?.name || "Customer";
              const customerPhone =
                order.shippingAddress?.phone || order.user?.phone || "";
              const customerCity = order.shippingAddress?.city || "";

              return (
                <tr
                  key={order._id}
                  className="border-b border-[#5A0E14]/[0.06] last:border-0 transition-colors hover:bg-[#FDECC8]/20"
                >
                  <td className="px-4 py-3 font-mono text-[11px] font-semibold text-[#8A5A1F]">
                    #{order._id?.slice(-6).toUpperCase()}
                  </td>
                  <td className="px-4 py-3 font-sans text-[12px]">
                    <p className="font-semibold text-[#3C080D]">
                      {customerName}
                    </p>
                    {customerPhone && (
                      <p className="text-[10px] text-[#6B3A2A]/70">
                        {customerPhone}
                      </p>
                    )}
                    {customerCity && (
                      <p className="text-[10px] text-[#6B3A2A]/50">
                        {customerCity}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1.5 max-w-[280px]">
                      {order.items && order.items.length > 0 ? (
                        order.items.map((item, idx) => {
                          const itemName =
                            item.name ||
                            item.product?.name ||
                            "Astrology Product";
                          const itemImg =
                            item.image || item.product?.images?.[0] || "";
                          return (
                            <div key={idx} className="flex items-center gap-2">
                              {itemImg ? (
                                <img
                                  src={itemImg}
                                  alt={itemName}
                                  className="h-8 w-8 shrink-0 rounded-[4px] border border-[#5A0E14]/10 object-cover"
                                />
                              ) : (
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[4px] border border-[#5A0E14]/10 bg-[#FDECC8]/40 text-[#8A5A1F]">
                                  <Package className="h-3.5 w-3.5" />
                                </div>
                              )}
                              <div className="min-w-0">
                                <p
                                  className="truncate font-sans text-[12px] font-semibold text-[#3C080D]"
                                  title={itemName}
                                >
                                  {itemName}
                                </p>
                                <p className="font-sans text-[10px] text-[#6B3A2A]/70">
                                  Qty: <strong>{item.quantity || 1}</strong> · ₹
                                  {(item.price || 0).toLocaleString("en-IN")}
                                </p>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <span className="font-sans text-[11px] text-[#6B3A2A]/50">
                          No items recorded
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-display text-[14px] font-semibold text-[#C1272D]">
                    ₹{order.totalAmount?.toLocaleString("en-IN") || 0}
                    <p className="font-sans text-[9px] uppercase tracking-wider text-[#6B3A2A]/60 font-normal">
                      {order.paymentMethod || "razorpay"} ·{" "}
                      {order.paymentStatus || "pending"}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <StatusPill status={order.orderStatus} />
                      <select
                        value={order.orderStatus}
                        onChange={(e) =>
                          onUpdateStatus(order._id, e.target.value)
                        }
                        className="rounded-md border border-[#5A0E14]/15 bg-[#FFFDF9] px-2 py-0.5 font-sans text-[10px] text-[#3C080D] focus:border-[#E9A534]/60 focus:outline-none"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-sans text-[11px]">
                    <p className="font-semibold text-[#3C080D]">
                      {formatRelativeOrderAge(order.createdAt)}
                    </p>
                    <p className="text-[10px] text-[#6B3A2A]/70">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedOrder(order)}
                      className="inline-flex items-center gap-1 rounded border border-[#5A0E14]/15 bg-white p-1.5 text-[#6B3A2A] transition-colors hover:border-[#E9A534] hover:bg-[#FDECC8]/30 cursor-pointer"
                      title="View Order Details"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}

            {filteredOrders.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-10 text-center font-sans text-[12px] text-[#5A0E14]/50"
                >
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Selected Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-xl border border-[#E9A534]/30 bg-[#FFFDF9] p-5 sm:p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#5A0E14]/12 pb-3.5">
              <div>
                <h3 className="font-display text-[16px] font-semibold text-[#3C080D]">
                  Order Details
                </h3>
                <p className="font-mono text-[11px] text-[#8A5A1F]">
                  #{selectedOrder._id}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 space-y-4 font-sans text-xs">
              {/* Items List */}
              <div className="rounded-lg border border-[#5A0E14]/10 bg-[#FDECC8]/15 p-3">
                <h4 className="font-bold uppercase tracking-wider text-[11px] text-[#8A5A1F] mb-2">
                  Products in Order:
                </h4>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-3 border-b border-[#5A0E14]/10 pb-2 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center gap-2.5">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-9 w-9 rounded object-cover border border-[#5A0E14]/10"
                          />
                        ) : (
                          <div className="h-9 w-9 rounded bg-[#FDECC8]/40 border border-[#5A0E14]/10 flex items-center justify-center">
                            <Package className="h-4 w-4 text-[#8A5A1F]" />
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-[#3C080D]">
                            {item.name || item.product?.name || "Product"}
                          </p>
                          <p className="text-[10px] text-[#6B3A2A]/70">
                            Unit: ₹{item.price} × {item.quantity}
                          </p>
                        </div>
                      </div>
                      <span className="font-display font-semibold text-[13px] text-[#C1272D]">
                        ₹
                        {(item.price * item.quantity).toLocaleString(
                          "en-IN"
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              {selectedOrder.shippingAddress && (
                <div className="rounded-lg border border-[#5A0E14]/10 p-3">
                  <h4 className="font-bold uppercase tracking-wider text-[11px] text-[#3C080D] mb-1.5">
                    Shipping Address:
                  </h4>
                  <p className="font-semibold text-[#3C080D]">
                    {selectedOrder.shippingAddress.name}
                  </p>
                  <p className="text-[#6B3A2A]/80">
                    {selectedOrder.shippingAddress.address}
                  </p>
                  <p className="text-[#6B3A2A]/80">
                    {selectedOrder.shippingAddress.city}
                    {selectedOrder.shippingAddress.state
                      ? `, ${selectedOrder.shippingAddress.state}`
                      : ""}{" "}
                    - {selectedOrder.shippingAddress.pincode}
                  </p>
                  <p className="text-[#6B3A2A]/80 font-medium mt-1">
                    Phone: {selectedOrder.shippingAddress.phone}
                  </p>
                </div>
              )}

              {/* Payment Summary */}
              <div className="rounded-lg border border-[#5A0E14]/10 p-3 flex justify-between items-center">
                <div>
                  <p className="text-[#6B3A2A]/70 text-[10px] uppercase font-bold">
                    Payment Method
                  </p>
                  <p className="font-semibold text-[#3C080D] capitalize">
                    {selectedOrder.paymentMethod || "Online"} (
                    {selectedOrder.paymentStatus})
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[#6B3A2A]/70 text-[10px] uppercase font-bold">
                    Total Paid
                  </p>
                  <p className="font-display text-[18px] font-bold text-[#C1272D]">
                    ₹{selectedOrder.totalAmount?.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="rounded-md bg-[#5A0E14] px-4 py-2 font-sans text-xs font-semibold text-[#FFF8EC] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}



/* ================================================================
   MAIN COMPONENT
================================================================ */

export default function AdminPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalBookings: 0,
    totalRevenue: 0,
  });
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!token || user.role !== "admin") {
      navigate("/");
      return;
    }

    fetchAdminData(token);
  }, [navigate]);

  const fetchAdminData = async (token) => {
    try {
      const [statsRes, usersRes, ordersRes, bookingsRes] = await Promise.all([
        axios.get(`${API_URL}/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/admin/users`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/admin/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/admin/bookings`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setStats(statsRes.data.stats);
      setUsers(usersRes.data.users);
      setOrders(ordersRes.data.orders);
      setBookings(bookingsRes.data.bookings);
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("cart_guest");
    localStorage.removeItem("cartItems");
    window.dispatchEvent(new CustomEvent("auth-state-changed", {
      detail: { action: "logout" }
    }));
    navigate("/");
  };

  const handleUserRoleUpdate = async (userId, newRole) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_URL}/admin/users/${userId}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const usersRes = await axios.get(`${API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(usersRes.data.users);
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const usersRes = await axios.get(`${API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(usersRes.data.users);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_URL}/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Refresh orders and stats so revenue updates immediately
      const [ordersRes, statsRes] = await Promise.all([
        axios.get(`${API_URL}/admin/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setOrders(ordersRes.data.orders);
      setStats(statsRes.data.stats);
    } catch (error) {
      console.error("Error updating order status:", error);
      alert(error.response?.data?.message || "Failed to update status");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[calc(100svh-78px)] items-center justify-center bg-[#FFF7E9] pt-[78px]">
        <div className="text-center">
          <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-2 border-[#E9A534]/30 border-t-[#E9A534]" />
          <p className="font-sans text-[13px] font-semibold uppercase tracking-[0.20em] text-[#6B3A2A]/75">
            Loading admin panel
          </p>
        </div>
      </div>
    );
  }

  const statItems = [
    { label: "Total Users", value: stats.totalUsers, icon: Users },
    { label: "Products", value: stats.totalProducts, icon: Package },
    { label: "Orders", value: stats.totalOrders, icon: ShoppingBag },
    { label: "Bookings", value: stats.totalBookings, icon: Calendar },
    {
      label: "Revenue",
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
    },
  ];

  return (
    <div className="min-h-[calc(100svh-78px)] bg-[#FFF7E9]">

      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handleLogout={handleLogout}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="lg:pl-[240px]">

        <TopBar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onMenuClick={() => setMobileOpen(true)}
          handleLogout={handleLogout}
          orders={orders}
          bookings={bookings}
        />

        <main className="px-4 py-5 sm:px-6 sm:py-6">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {statItems.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>

          <div className="mt-5">
            {activeTab === "overview" && (
              <OverviewTab orders={orders} bookings={bookings} />
            )}
            {activeTab === "users" && (
              <UsersTab
                users={users}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                handleUserRoleUpdate={handleUserRoleUpdate}
                handleDeleteUser={handleDeleteUser}
              />
            )}
            {activeTab === "orders" && (
              <OrdersTab orders={orders} onUpdateStatus={handleUpdateOrderStatus} />
            )}
            {activeTab === "bookings" && (
              <BookingTab
                bookings={bookings}
                onRefreshBookings={fetchAdminData}
              />
            )}
            {activeTab === "categories" && <CategoryTab />}
            {activeTab === "products" && <ProductTab />}
            {activeTab === "coupons" && <CouponTab />}
            {activeTab === "reviews" && <ReviewTab />}
            {activeTab === "seo" && <SeoTab />}
            {activeTab === "pages" && <PageTab />}
          </div>
        </main>
        {/* Footer */}
        <footer className="border-t border-[#5A0E14]/10 bg-[#FFFDF9] py-4 px-6 text-center">
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 font-sans text-xs text-[#6B3A2A]/70">
            <span>© {new Date().getFullYear()} All rights reserved By: Cosmic Nidhi.</span>
            <span className="text-[#5A0E14]/25 select-none">|</span>
            <a href="/page/privacy-policy" className="transition-colors duration-300 hover:text-[#A2691F]">Privacy Policy</a>
            <span className="text-[#5A0E14]/25 select-none">|</span>
            <a href="/page/return-policy" className="transition-colors duration-300 hover:text-[#A2691F]">Return Policy</a>
          </div>
        </footer>
      </div>
    </div>
  );
}