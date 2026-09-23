import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  Bell,
  ShoppingBag,
  Calendar,
  AlertTriangle,
  CheckCheck,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Clock,
  Package,
} from "lucide-react";
import { API_URL } from "../../config/api";

function formatRelativeTime(dateInput) {
  if (!dateInput) return "";
  const now = new Date();
  const date = new Date(dateInput);
  const diffSec = Math.floor((now - date) / 1000);

  if (diffSec < 60) return "Just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
}

export default function AdminNotifications({ onSelectTab, fallbackOrders = [], fallbackBookings = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all"); // "all" | "order" | "booking" | "alert"
  const [loading, setLoading] = useState(false);
  const [readIds, setReadIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("admin_read_notifications") || "[]");
    } catch {
      return [];
    }
  });

  const dropdownRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/admin/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success && Array.isArray(res.data.notifications)) {
        setNotifications(res.data.notifications);
        return;
      }
    } catch (err) {
      // Fallback synthesis from props if notifications route is not reached
      const synth = [];
      (fallbackOrders || []).slice(0, 8).forEach((ord) => {
        synth.push({
          id: `ord_${ord._id}`,
          type: "order",
          title: ord.orderStatus === "pending" ? "New Order" : `Order ${ord.orderNumber ? (ord.orderNumber.startsWith('#') ? ord.orderNumber : '#' + ord.orderNumber.replace(/^CN-/, '')) : '#' + (ord._id?.slice(-6)?.toUpperCase() || '')}`,
          message: `₹${ord.totalAmount?.toLocaleString("en-IN") || 0} by ${ord.user?.name || "Customer"} · ${ord.orderStatus?.toUpperCase()}`,
          status: ord.orderStatus,
          paymentStatus: ord.paymentStatus,
          createdAt: ord.createdAt,
          linkTab: "orders",
        });
      });
      (fallbackBookings || []).slice(0, 8).forEach((b) => {
        synth.push({
          id: `bk_${b._id}`,
          type: "booking",
          title: `${b.serviceName || "Consultation"} Booking`,
          message: `${b.clientDetails?.name || "Client"} · ${new Date(b.date).toLocaleDateString()} at ${b.time}`,
          status: b.status,
          paymentStatus: b.paymentStatus,
          createdAt: b.createdAt,
          linkTab: "bookings",
        });
      });
      synth.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setNotifications(synth);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 45000); // 45s refresh
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter((n) => !readIds.includes(n.id)).length;

  const markAllAsRead = () => {
    const allIds = notifications.map((n) => n.id);
    const updated = Array.from(new Set([...readIds, ...allIds]));
    setReadIds(updated);
    try {
      localStorage.setItem("admin_read_notifications", JSON.stringify(updated));
    } catch {}
  };

  const handleItemClick = (item) => {
    if (!readIds.includes(item.id)) {
      const updated = [...readIds, item.id];
      setReadIds(updated);
      try {
        localStorage.setItem("admin_read_notifications", JSON.stringify(updated));
      } catch {}
    }
    if (item.linkTab && onSelectTab) {
      onSelectTab(item.linkTab);
    }
    setIsOpen(false);
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "all") return true;
    return n.type === filter;
  });

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => {
          setIsOpen((prev) => !prev);
          if (!isOpen) fetchNotifications();
        }}
        aria-label="Notifications"
        className={`
          relative flex h-9 w-9 items-center justify-center rounded-full
          border transition-all duration-300
          ${
            isOpen
              ? "border-[#E9A534] bg-[#FDECC8]/40 text-[#5A0E14] ring-2 ring-[#E9A534]/30"
              : "border-[#5A0E14]/15 text-[#5A0E14] hover:border-[#E9A534]/50 hover:text-[#8B2F2B]"
          }
        `}
      >
        <Bell className="h-4 w-4" strokeWidth={1.7} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#C1272D] px-1 text-[9px] font-bold text-white shadow-sm ring-2 ring-[#FFF7E9] animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Popover Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="
              absolute right-0 top-full mt-2.5 z-[150]
              w-[340px] sm:w-[380px]
              overflow-hidden rounded-[14px]
              border border-[#E9A534]/30 bg-[#FFFDF9]/98
              shadow-[0_22px_70px_rgba(24,2,5,0.25)]
              backdrop-blur-xl
            "
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#5A0E14]/10 bg-gradient-to-r from-[#210307] to-[#3C080D] px-4 py-3 text-[#FFF8EC]">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#E9A534]/20 text-[#E9C76D]">
                  <Sparkles size={11} />
                </span>
                <h4 className="font-display text-[14px] font-semibold text-[#FFF8EC]">
                  Notifications
                </h4>
                {unreadCount > 0 && (
                  <span className="rounded-full bg-[#C1272D] px-2 py-0.5 font-sans text-[9px] font-bold uppercase tracking-[0.1em] text-white">
                    {unreadCount} New
                  </span>
                )}
              </div>

              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="flex items-center gap-1 font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-[#E9C76D] hover:text-[#FFF8EC] transition-colors"
                >
                  <CheckCheck size={12} />
                  Mark All Read
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 border-b border-[#5A0E14]/10 bg-[#FDECC8]/20 px-3 py-2">
              {[
                { id: "all", label: "All" },
                { id: "order", label: "Orders" },
                { id: "booking", label: "Bookings" },
                { id: "alert", label: "Alerts" },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setFilter(t.id)}
                  className={`
                    rounded-full px-2.5 py-1 font-sans text-[10px] font-semibold uppercase tracking-[0.1em] transition-colors
                    ${
                      filter === t.id
                        ? "bg-[#5A0E14] text-[#FFF8EC]"
                        : "text-[#6B3A2A]/70 hover:bg-[#5A0E14]/10 hover:text-[#3C080D]"
                    }
                  `}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Notification Items List */}
            <div className="max-h-[360px] overflow-y-auto divide-y divide-[#5A0E14]/[0.06]">
              {filteredNotifications.length === 0 ? (
                <div className="py-10 text-center">
                  <div className="mx-auto mb-2.5 flex h-10 w-10 items-center justify-center rounded-full bg-[#FDECC8]/40 text-[#8A5A1F]">
                    <Bell size={18} strokeWidth={1.5} />
                  </div>
                  <p className="font-display text-[13px] font-medium text-[#3C080D]">
                    All caught up!
                  </p>
                  <p className="mt-0.5 font-sans text-[11px] text-[#6B3A2A]/60">
                    No new notifications in this category.
                  </p>
                </div>
              ) : (
                filteredNotifications.map((n) => {
                  const isRead = readIds.includes(n.id);
                  let Icon = Bell;
                  let iconBg = "bg-[#FDECC8]/40 text-[#8A5A1F]";
                  let badgeBg = "bg-[#FDECC8]/50 text-[#8A5A1F]";

                  if (n.type === "order") {
                    Icon = ShoppingBag;
                    iconBg = "bg-[#5A0E14]/10 text-[#5A0E14]";
                    badgeBg = n.status === "completed" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800";
                  } else if (n.type === "booking") {
                    Icon = Calendar;
                    iconBg = "bg-[#E9A534]/15 text-[#8A5A1F]";
                    badgeBg = n.status === "confirmed" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800";
                  } else if (n.type === "alert") {
                    Icon = AlertTriangle;
                    iconBg = "bg-[#C1272D]/10 text-[#C1272D]";
                    badgeBg = "bg-red-100 text-red-800";
                  }

                  return (
                    <div
                      key={n.id}
                      onClick={() => handleItemClick(n)}
                      className={`
                        group flex items-start gap-3 p-3.5 transition-colors cursor-pointer
                        hover:bg-[#FDECC8]/30
                        ${isRead ? "bg-transparent opacity-75" : "bg-[#FDECC8]/15 font-semibold"}
                      `}
                    >
                      <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${iconBg}`}>
                        <Icon size={14} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p className="font-display text-[12.5px] font-semibold text-[#3C080D] truncate">
                            {n.title}
                          </p>
                          <span className="shrink-0 font-sans text-[9.5px] text-[#6B3A2A]/60 flex items-center gap-0.5">
                            <Clock size={9} />
                            {formatRelativeTime(n.createdAt)}
                          </span>
                        </div>

                        <p className="mt-0.5 line-clamp-2 font-sans text-[11px] leading-snug text-[#6B3A2A]/80">
                          {n.message}
                        </p>

                        <div className="mt-1.5 flex items-center justify-between">
                          {n.status && (
                            <span className={`inline-block rounded px-1.5 py-0.5 font-sans text-[8.5px] font-bold uppercase tracking-[0.08em] ${badgeBg}`}>
                              {n.status}
                            </span>
                          )}
                          <span className="font-sans text-[10px] text-[#A2691F] group-hover:text-[#5A0E14] inline-flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            View <ChevronRight size={10} />
                          </span>
                        </div>
                      </div>

                      {!isRead && (
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#C1272D]" />
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-[#5A0E14]/10 bg-[#FFFDF9] px-4 py-2.5">
              <button
                type="button"
                onClick={() => {
                  onSelectTab?.("orders");
                  setIsOpen(false);
                }}
                className="font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-[#8A5A1F] hover:text-[#5A0E14] transition-colors flex items-center gap-1"
              >
                <ShoppingBag size={11} /> Orders
              </button>
              <button
                type="button"
                onClick={() => {
                  onSelectTab?.("bookings");
                  setIsOpen(false);
                }}
                className="font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-[#8A5A1F] hover:text-[#5A0E14] transition-colors flex items-center gap-1"
              >
                <Calendar size={11} /> Bookings
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
