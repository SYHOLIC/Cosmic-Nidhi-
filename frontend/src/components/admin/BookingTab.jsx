import { useState, useMemo } from "react";
import axios from "axios";
import {
  Calendar,
  Clock,
  Search,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ChevronDown,
  User,
  Phone,
  Mail,
  ArrowUpDown,
  Filter,
  Eye,
  CalendarCheck,
  CalendarClock,
  X,
  Sparkles,
} from "lucide-react";
import { API_URL } from "../../config/api";

export const TIME_SLOT_OPTIONS = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
  "07:00 PM",
  "07:30 PM",
  "08:00 PM",
];

export const STATUS_CONFIG = {
  pending: {
    label: "Pending Appointment",
    bg: "border-[#C1892F]/45 bg-[#E9A534]/[0.12]",
    text: "text-[#8A5A1F]",
    dot: "bg-[#C1892F]",
  },
  pending_appointment: {
    label: "Pending Appointment",
    bg: "border-[#C1892F]/45 bg-[#E9A534]/[0.12]",
    text: "text-[#8A5A1F]",
    dot: "bg-[#C1892F]",
  },
  confirmed: {
    label: "Confirmed",
    bg: "border-emerald-600/35 bg-emerald-600/[0.10]",
    text: "text-emerald-800",
    dot: "bg-emerald-600",
  },
  ongoing: {
    label: "Ongoing (In-Session)",
    bg: "border-purple-600/35 bg-purple-600/[0.12]",
    text: "text-purple-800",
    dot: "bg-purple-600 animate-ping",
  },
  follow_up: {
    label: "Follow-up",
    bg: "border-sky-600/35 bg-sky-600/[0.10]",
    text: "text-sky-800",
    dot: "bg-sky-600",
  },
  "follow-up": {
    label: "Follow-up",
    bg: "border-sky-600/35 bg-sky-600/[0.10]",
    text: "text-sky-800",
    dot: "bg-sky-600",
  },
  completed: {
    label: "Completed",
    bg: "border-blue-700/35 bg-blue-700/[0.10]",
    text: "text-blue-800",
    dot: "bg-blue-700",
  },
  cancelled: {
    label: "Canceled",
    bg: "border-[#C1272D]/35 bg-[#C1272D]/[0.10]",
    text: "text-[#8B2F2B]",
    dot: "bg-[#C1272D]",
  },
  rescheduled: {
    label: "Rescheduled",
    bg: "border-amber-600/35 bg-amber-600/[0.12]",
    text: "text-amber-900",
    dot: "bg-amber-600",
  },
};

// Helper: Get timestamp from booking date and time
export const getBookingTimestamp = (booking) => {
  if (!booking?.date) return 0;
  const d = new Date(booking.date);
  let hours = 10;
  let minutes = 0;

  if (booking.time) {
    const parts = booking.time.trim().split(" ");
    const timePart = parts[0];
    const modifier = parts[1]?.toUpperCase();

    if (timePart) {
      const [h, m] = timePart.split(":").map(Number);
      hours = isNaN(h) ? 10 : h;
      minutes = isNaN(m) ? 0 : m;
      if (modifier === "PM" && hours < 12) hours += 12;
      if (modifier === "AM" && hours === 12) hours = 0;
    }
  }

  return new Date(
    d.getFullYear(),
    d.getMonth(),
    d.getDate(),
    hours,
    minutes
  ).getTime();
};

// Helper: Check if slot has expired
export const isBookingSlotExpired = (booking) => {
  const ts = getBookingTimestamp(booking);
  if (!ts) return false;
  const isPast = ts < Date.now();
  const normalizedStatus = (booking.status || "").toLowerCase().replace("-", "_");
  const isFinished =
    normalizedStatus === "completed" || normalizedStatus === "cancelled";
  return isPast && !isFinished;
};

// Enhanced Status Pill Component
export function BookingStatusPill({ status, isExpired = false }) {
  const key = (status || "pending").toLowerCase();
  const conf =
    STATUS_CONFIG[key] ||
    STATUS_CONFIG[key.replace("-", "_")] ||
    STATUS_CONFIG.pending;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span
        className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 font-sans text-[10px] font-bold uppercase tracking-[0.12em] ${conf.bg} ${conf.text}`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${conf.dot}`} />
        {conf.label}
      </span>
      {isExpired && (
        <span
          title="Scheduled appointment slot time has already passed"
          className="inline-flex items-center gap-1 rounded-full border border-red-500/40 bg-red-500/10 px-2 py-0.5 font-sans text-[9px] font-bold uppercase tracking-[0.14em] text-red-700 animate-pulse"
        >
          <AlertTriangle className="h-2.5 w-2.5" />
          Expired
        </span>
      )}
    </div>
  );
}

export default function BookingTab({ bookings = [], onRefreshBookings }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest"); // "newest" | "oldest"
  const [updatingId, setUpdatingId] = useState(null);
  const [statusMessage, setStatusMessage] = useState({ text: "", type: "" });

  // Reschedule Modal State
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [activeBooking, setActiveBooking] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState(TIME_SLOT_OPTIONS[1]);
  const [rescheduleStatus, setRescheduleStatus] = useState("rescheduled");
  const [rescheduleNotes, setRescheduleNotes] = useState("");
  const [rescheduleSubmitting, setRescheduleSubmitting] = useState(false);

  // Client Details View Modal State
  const [viewModalBooking, setViewModalBooking] = useState(null);

  // Quick Time Change Dropdown
  const handleQuickTimeChange = async (bookingId, newTime) => {
    try {
      setUpdatingId(bookingId);
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_URL}/bookings/${bookingId}/reschedule`,
        { time: newTime },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStatusMessage({
        text: `Time slot updated to ${newTime}`,
        type: "success",
      });
      setTimeout(() => setStatusMessage({ text: "", type: "" }), 3000);
      if (onRefreshBookings) onRefreshBookings(token);
    } catch (error) {
      console.error("Error updating time slot:", error);
      setStatusMessage({
        text: error.response?.data?.message || "Failed to update time slot",
        type: "error",
      });
      setTimeout(() => setStatusMessage({ text: "", type: "" }), 4000);
    } finally {
      setUpdatingId(null);
    }
  };

  // Status Change Handler
  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      setUpdatingId(bookingId);
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_URL}/bookings/${bookingId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStatusMessage({
        text: `Status updated to ${
          STATUS_CONFIG[newStatus]?.label || newStatus
        }`,
        type: "success",
      });
      setTimeout(() => setStatusMessage({ text: "", type: "" }), 3000);
      if (onRefreshBookings) onRefreshBookings(token);
    } catch (error) {
      console.error("Error updating status:", error);
      setStatusMessage({
        text: error.response?.data?.message || "Failed to update status",
        type: "error",
      });
      setTimeout(() => setStatusMessage({ text: "", type: "" }), 4000);
    } finally {
      setUpdatingId(null);
    }
  };

  // Open Reschedule Modal
  const openRescheduleModal = (booking) => {
    setActiveBooking(booking);
    if (booking.date) {
      const d = new Date(booking.date);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      setRescheduleDate(`${yyyy}-${mm}-${dd}`);
    } else {
      setRescheduleDate("");
    }
    setRescheduleTime(booking.time || TIME_SLOT_OPTIONS[1]);
    setRescheduleStatus("rescheduled");
    setRescheduleNotes(booking.notes || "");
    setRescheduleModalOpen(true);
  };

  // Submit Reschedule
  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();
    if (!activeBooking) return;
    if (!rescheduleDate) {
      alert("Please select a valid date");
      return;
    }

    try {
      setRescheduleSubmitting(true);
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_URL}/bookings/${activeBooking._id}/reschedule`,
        {
          date: rescheduleDate,
          time: rescheduleTime,
          status: rescheduleStatus,
          notes: rescheduleNotes,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setStatusMessage({
        text: `Booking for ${
          activeBooking.clientDetails?.name ||
          activeBooking.user?.name ||
          "Client"
        } rescheduled to ${rescheduleDate} at ${rescheduleTime}!`,
        type: "success",
      });
      setTimeout(() => setStatusMessage({ text: "", type: "" }), 4000);
      setRescheduleModalOpen(false);
      setActiveBooking(null);
      if (onRefreshBookings) onRefreshBookings(token);
    } catch (error) {
      console.error("Error rescheduling booking:", error);
      alert(error.response?.data?.message || "Failed to reschedule booking");
    } finally {
      setRescheduleSubmitting(false);
    }
  };

  // Filter and Sort Bookings
  const processedBookings = useMemo(() => {
    let list = [...bookings];

    // 1. Search filter: by Customer Name or Booking ID
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((b) => {
        const idMatch =
          b._id?.toLowerCase().includes(q) ||
          b._id?.slice(-6).toLowerCase().includes(q);
        const nameMatch =
          b.clientDetails?.name?.toLowerCase().includes(q) ||
          b.user?.name?.toLowerCase().includes(q);
        const emailMatch =
          b.clientDetails?.email?.toLowerCase().includes(q) ||
          b.user?.email?.toLowerCase().includes(q);
        const phoneMatch =
          b.clientDetails?.phone?.toLowerCase().includes(q) ||
          b.user?.phone?.toLowerCase().includes(q);
        const serviceMatch = b.serviceName?.toLowerCase().includes(q);

        return idMatch || nameMatch || emailMatch || phoneMatch || serviceMatch;
      });
    }

    // 2. Status filter
    if (selectedStatusFilter !== "all") {
      if (selectedStatusFilter === "expired") {
        list = list.filter((b) => isBookingSlotExpired(b));
      } else {
        list = list.filter((b) => {
          const norm = (b.status || "").toLowerCase().replace("-", "_");
          const target = selectedStatusFilter.toLowerCase().replace("-", "_");
          if (target === "pending" || target === "pending_appointment") {
            return norm === "pending" || norm === "pending_appointment";
          }
          if (target === "follow_up") {
            return norm === "follow_up" || norm === "follow-up";
          }
          return norm === target;
        });
      }
    }

    // 3. Chronological sort by date and time (newest on top by default)
    list.sort((a, b) => {
      const tsA = getBookingTimestamp(a);
      const tsB = getBookingTimestamp(b);
      return sortOrder === "newest" ? tsB - tsA : tsA - tsB;
    });

    return list;
  }, [bookings, searchQuery, selectedStatusFilter, sortOrder]);

  // Counts for pills
  const counts = useMemo(() => {
    let pending = 0;
    let confirmed = 0;
    let ongoing = 0;
    let followUp = 0;
    let completed = 0;
    let cancelled = 0;
    let rescheduled = 0;
    let expired = 0;

    bookings.forEach((b) => {
      const norm = (b.status || "").toLowerCase().replace("-", "_");
      if (norm === "pending" || norm === "pending_appointment") pending++;
      else if (norm === "confirmed") confirmed++;
      else if (norm === "ongoing") ongoing++;
      else if (norm === "follow_up") followUp++;
      else if (norm === "completed") completed++;
      else if (norm === "cancelled") cancelled++;
      else if (norm === "rescheduled") rescheduled++;

      if (isBookingSlotExpired(b)) expired++;
    });

    return {
      total: bookings.length,
      pending,
      confirmed,
      ongoing,
      followUp,
      completed,
      cancelled,
      rescheduled,
      expired,
    };
  }, [bookings]);

  return (
    <div className="space-y-4">
      {/* Toast Alert */}
      {statusMessage.text && (
        <div
          className={`flex items-center justify-between rounded-lg px-4 py-3 text-xs font-semibold shadow-sm transition-all ${
            statusMessage.type === "success"
              ? "border border-emerald-600/30 bg-emerald-50 text-emerald-900"
              : "border border-red-600/30 bg-red-50 text-red-900"
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMessage.type === "success" ? (
              <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-red-600 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
          <button
            onClick={() => setStatusMessage({ text: "", type: "" })}
            className="text-gray-400 hover:text-gray-700"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Main Container */}
      <div className="rounded-[9px] border border-[#5A0E14]/12 bg-[#FFFDF9] shadow-[0_4px_20px_rgba(60,8,13,0.03)]">
        {/* Header Section */}
        <div className="border-b border-[#5A0E14]/12 p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#E9A534]" />
                <p className="font-sans text-[10px] font-bold uppercase tracking-[0.22em] text-[#8A5A1F]">
                  Bookings Management ({bookings.length})
                </p>
              </div>
              <h2 className="mt-1 font-display text-[18px] sm:text-[20px] font-semibold text-[#3C080D]">
                Scheduled Appointments & Consultations
              </h2>
            </div>

            {/* Quick Sort Control */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setSortOrder((prev) =>
                    prev === "newest" ? "oldest" : "newest"
                  )
                }
                className="inline-flex items-center gap-1.5 rounded-md border border-[#5A0E14]/15 bg-white px-3 py-1.5 font-sans text-[11px] font-semibold text-[#3C080D] transition-colors hover:border-[#E9A534]/50 hover:bg-[#FDECC8]/20"
                title="Toggle chronological sorting"
              >
                <ArrowUpDown className="h-3.5 w-3.5 text-[#8A5A1F]" />
                <span>
                  Sort:{" "}
                  <strong className="text-[#8A5A1F]">
                    {sortOrder === "newest" ? "Newest First" : "Oldest First"}
                  </strong>
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const token = localStorage.getItem("token");
                  if (onRefreshBookings) onRefreshBookings(token);
                }}
                className="inline-flex items-center gap-1.5 rounded-md border border-[#5A0E14]/15 bg-white px-3 py-1.5 font-sans text-[11px] font-semibold text-[#6B3A2A] transition-colors hover:border-[#E9A534]/50 hover:bg-[#FDECC8]/20"
                title="Refresh Bookings"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>

          {/* Search Bar & Filter Controls */}
          <div className="mt-4 flex flex-col md:flex-row gap-3">
            {/* Search Filter Field */}
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A5A1F]/60" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search filter by Customer Name or Booking ID..."
                className="w-full rounded-md border border-[#5A0E14]/15 bg-white py-2 pl-9 pr-8 font-sans text-[12px] text-[#3C080D] placeholder-[#6B3A2A]/40 transition-colors focus:border-[#E9A534] focus:outline-none focus:ring-1 focus:ring-[#E9A534]/40"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Filter Pills Scroll Container */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              <button
                onClick={() => setSelectedStatusFilter("all")}
                className={`whitespace-nowrap rounded-md px-2.5 py-1.5 font-sans text-[11px] font-semibold transition-all ${
                  selectedStatusFilter === "all"
                    ? "bg-[#5A0E14] text-[#FFF8EC] shadow-sm"
                    : "border border-[#5A0E14]/15 bg-white text-[#6B3A2A]/80 hover:bg-[#FDECC8]/30"
                }`}
              >
                All ({counts.total})
              </button>

              <button
                onClick={() => setSelectedStatusFilter("pending")}
                className={`whitespace-nowrap rounded-md px-2.5 py-1.5 font-sans text-[11px] font-semibold transition-all ${
                  selectedStatusFilter === "pending"
                    ? "bg-[#C1892F] text-white shadow-sm"
                    : "border border-[#5A0E14]/15 bg-white text-[#8A5A1F] hover:bg-[#FDECC8]/30"
                }`}
              >
                Pending ({counts.pending})
              </button>

              <button
                onClick={() => setSelectedStatusFilter("confirmed")}
                className={`whitespace-nowrap rounded-md px-2.5 py-1.5 font-sans text-[11px] font-semibold transition-all ${
                  selectedStatusFilter === "confirmed"
                    ? "bg-emerald-700 text-white shadow-sm"
                    : "border border-[#5A0E14]/15 bg-white text-emerald-800 hover:bg-[#FDECC8]/30"
                }`}
              >
                Confirmed ({counts.confirmed})
              </button>

              <button
                onClick={() => setSelectedStatusFilter("ongoing")}
                className={`whitespace-nowrap rounded-md px-2.5 py-1.5 font-sans text-[11px] font-semibold transition-all ${
                  selectedStatusFilter === "ongoing"
                    ? "bg-purple-700 text-white shadow-sm"
                    : "border border-[#5A0E14]/15 bg-white text-purple-800 hover:bg-[#FDECC8]/30"
                }`}
              >
                Ongoing ({counts.ongoing})
              </button>

              <button
                onClick={() => setSelectedStatusFilter("follow_up")}
                className={`whitespace-nowrap rounded-md px-2.5 py-1.5 font-sans text-[11px] font-semibold transition-all ${
                  selectedStatusFilter === "follow_up"
                    ? "bg-sky-700 text-white shadow-sm"
                    : "border border-[#5A0E14]/15 bg-white text-sky-800 hover:bg-[#FDECC8]/30"
                }`}
              >
                Follow-up ({counts.followUp})
              </button>

              <button
                onClick={() => setSelectedStatusFilter("rescheduled")}
                className={`whitespace-nowrap rounded-md px-2.5 py-1.5 font-sans text-[11px] font-semibold transition-all ${
                  selectedStatusFilter === "rescheduled"
                    ? "bg-amber-700 text-white shadow-sm"
                    : "border border-[#5A0E14]/15 bg-white text-amber-900 hover:bg-[#FDECC8]/30"
                }`}
              >
                Rescheduled ({counts.rescheduled})
              </button>

              <button
                onClick={() => setSelectedStatusFilter("completed")}
                className={`whitespace-nowrap rounded-md px-2.5 py-1.5 font-sans text-[11px] font-semibold transition-all ${
                  selectedStatusFilter === "completed"
                    ? "bg-blue-700 text-white shadow-sm"
                    : "border border-[#5A0E14]/15 bg-white text-blue-800 hover:bg-[#FDECC8]/30"
                }`}
              >
                Completed ({counts.completed})
              </button>

              <button
                onClick={() => setSelectedStatusFilter("cancelled")}
                className={`whitespace-nowrap rounded-md px-2.5 py-1.5 font-sans text-[11px] font-semibold transition-all ${
                  selectedStatusFilter === "cancelled"
                    ? "bg-[#C1272D] text-white shadow-sm"
                    : "border border-[#5A0E14]/15 bg-white text-[#8B2F2B] hover:bg-[#FDECC8]/30"
                }`}
              >
                Canceled ({counts.cancelled})
              </button>

              <button
                onClick={() => setSelectedStatusFilter("expired")}
                className={`flex items-center gap-1 whitespace-nowrap rounded-md px-2.5 py-1.5 font-sans text-[11px] font-semibold transition-all ${
                  selectedStatusFilter === "expired"
                    ? "bg-red-700 text-white shadow-sm"
                    : "border border-red-300 bg-red-50/50 text-red-700 hover:bg-red-100/50"
                }`}
              >
                <AlertTriangle className="h-3 w-3" />
                Expired ({counts.expired})
              </button>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px]">
            <thead>
              <tr className="border-b border-[#5A0E14]/12 bg-[#FDECC8]/30">
                <th className="px-4 py-3 text-left font-sans text-[9px] font-bold uppercase tracking-[0.16em] text-[#6B3A2A]/70">
                  Booking ID & Service
                </th>
                <th className="px-4 py-3 text-left font-sans text-[9px] font-bold uppercase tracking-[0.16em] text-[#6B3A2A]/70">
                  Customer
                </th>
                <th className="px-4 py-3 text-left font-sans text-[9px] font-bold uppercase tracking-[0.16em] text-[#6B3A2A]/70">
                  Date & Scheduled Slot
                </th>
                <th className="px-4 py-3 text-left font-sans text-[9px] font-bold uppercase tracking-[0.16em] text-[#6B3A2A]/70">
                  Status Management
                </th>
                <th className="px-4 py-3 text-left font-sans text-[9px] font-bold uppercase tracking-[0.16em] text-[#6B3A2A]/70">
                  Amount
                </th>
                <th className="px-4 py-3 text-right font-sans text-[9px] font-bold uppercase tracking-[0.16em] text-[#6B3A2A]/70">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {processedBookings.map((booking) => {
                const isExpired = isBookingSlotExpired(booking);
                const customerName =
                  booking.clientDetails?.name ||
                  booking.user?.name ||
                  "Guest Client";
                const customerEmail =
                  booking.clientDetails?.email || booking.user?.email || "";
                const customerPhone =
                  booking.clientDetails?.phone || booking.user?.phone || "";

                return (
                  <tr
                    key={booking._id}
                    className={`border-b border-[#5A0E14]/[0.06] last:border-0 transition-colors hover:bg-[#FDECC8]/20 ${
                      isExpired ? "bg-red-50/20" : ""
                    }`}
                  >
                    {/* Booking ID & Service */}
                    <td className="px-4 py-3.5">
                      <div className="flex flex-col">
                        <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#8A5A1F]">
                          #{booking._id?.slice(-6).toUpperCase()}
                        </span>
                        <p className="mt-0.5 font-sans text-[13px] font-semibold text-[#3C080D]">
                          {booking.serviceName}
                        </p>
                        <span className="mt-0.5 font-sans text-[10px] text-[#6B3A2A]/60">
                          {booking.duration || "Consultation"}
                        </span>
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="px-4 py-3.5">
                      <div className="flex flex-col">
                        <span className="font-sans text-[12px] font-semibold text-[#3C080D]">
                          {customerName}
                        </span>
                        {customerEmail && (
                          <span className="mt-0.5 flex items-center gap-1 font-sans text-[11px] text-[#6B3A2A]/75">
                            <Mail className="h-3 w-3 text-[#8A5A1F]/70" />
                            {customerEmail}
                          </span>
                        )}
                        {customerPhone && (
                          <span className="mt-0.5 flex items-center gap-1 font-sans text-[10px] text-[#6B3A2A]/65">
                            <Phone className="h-2.5 w-2.5 text-[#8A5A1F]/70" />
                            {customerPhone}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Date & Scheduled Slot with Time Dropdown */}
                    <td className="px-4 py-3.5">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 font-sans text-[11px] font-medium text-[#3C080D]">
                          <Calendar className="h-3.5 w-3.5 text-[#8A5A1F]" />
                          <span>
                            {new Date(booking.date).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              }
                            )}
                          </span>
                        </div>

                        {/* Scheduled Time Slot Selection Dropdown */}
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3 w-3 text-[#8A5A1F]" />
                          <div className="relative inline-block">
                            <select
                              value={booking.time || TIME_SLOT_OPTIONS[1]}
                              disabled={updatingId === booking._id}
                              onChange={(e) =>
                                handleQuickTimeChange(
                                  booking._id,
                                  e.target.value
                                )
                              }
                              className="rounded border border-[#5A0E14]/15 bg-white px-2 py-0.5 font-sans text-[11px] font-semibold text-[#8A5A1F] transition-colors focus:border-[#E9A534] focus:outline-none"
                              title="Select appointment time slot"
                            >
                              {TIME_SLOT_OPTIONS.map((slot) => (
                                <option key={slot} value={slot}>
                                  {slot}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Expired Slot Tag */}
                        {isExpired && (
                          <div className="flex items-center gap-1 text-[10px] font-bold text-red-700">
                            <AlertTriangle className="h-3 w-3" />
                            <span>Slot Passed</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Status Management Dropdown */}
                    <td className="px-4 py-3.5">
                      <div className="flex flex-col gap-1.5">
                        <BookingStatusPill
                          status={booking.status}
                          isExpired={isExpired}
                        />

                        {/* Dropdown with all expanded status options */}
                        <div className="flex items-center gap-1 mt-0.5">
                          <select
                            value={
                              (booking.status || "pending").toLowerCase() ===
                              "pending_appointment"
                                ? "pending"
                                : (
                                    booking.status || "pending"
                                  ).toLowerCase() === "follow-up"
                                ? "follow_up"
                                : (booking.status || "pending").toLowerCase()
                            }
                            disabled={updatingId === booking._id}
                            onChange={(e) =>
                              handleStatusChange(booking._id, e.target.value)
                            }
                            className="rounded border border-[#5A0E14]/20 bg-white px-2 py-1 font-sans text-[11px] font-medium text-[#3C080D] transition-colors focus:border-[#E9A534] focus:outline-none"
                          >
                            <option value="pending">Pending Appointment</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="ongoing">
                              Ongoing (In-Session)
                            </option>
                            <option value="follow_up">Follow-up</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Canceled</option>
                            <option value="rescheduled">Rescheduled</option>
                          </select>
                        </div>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="px-4 py-3.5">
                      <span className="font-display text-[14px] font-semibold text-[#C1272D]">
                        ₹{booking.amount?.toLocaleString("en-IN") || 0}
                      </span>
                      <p className="font-sans text-[10px] text-[#6B3A2A]/60 uppercase">
                        {booking.paymentStatus || "pending"}
                      </p>
                    </td>

                    {/* Actions Column: Reschedule & View Details */}
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Explicit Reschedule Action */}
                        <button
                          type="button"
                          onClick={() => openRescheduleModal(booking)}
                          className="inline-flex items-center gap-1 rounded-md border border-[#8A5A1F]/30 bg-[#FFFDF9] px-2.5 py-1.5 font-sans text-[11px] font-bold text-[#8A5A1F] shadow-sm transition-all hover:border-[#8A5A1F] hover:bg-[#8A5A1F]/10 hover:shadow cursor-pointer"
                          title="Reschedule appointment date and time"
                        >
                          <CalendarClock className="h-3.5 w-3.5 text-[#8A5A1F]" />
                          <span>Reschedule</span>
                        </button>

                        {/* View Client Details Button */}
                        <button
                          type="button"
                          onClick={() => setViewModalBooking(booking)}
                          className="inline-flex items-center justify-center rounded-md border border-[#5A0E14]/15 bg-white p-1.5 text-[#6B3A2A] transition-colors hover:border-[#E9A534] hover:bg-[#FDECC8]/30 cursor-pointer"
                          title="View complete client details"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {processedBookings.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-12 text-center font-sans text-[13px] text-[#5A0E14]/60"
                  >
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#FDECC8]/40 text-[#8A5A1F]">
                      <Calendar className="h-6 w-6" />
                    </div>
                    <p className="mt-3 font-semibold text-[#3C080D]">
                      No bookings found
                    </p>
                    <p className="mt-1 text-[11px] text-[#6B3A2A]/70">
                      {searchQuery
                        ? "Try adjusting your search criteria or filters."
                        : "There are currently no bookings in this category."}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================================================================
          EXPLICIT RESCHEDULE ACTION MODAL
      ================================================================ */}
      {rescheduleModalOpen && activeBooking && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-xl border border-[#E9A534]/30 bg-[#FFFDF9] p-5 sm:p-6 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#5A0E14]/12 pb-3.5">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E9A534]/15 text-[#8A5A1F]">
                  <CalendarClock className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-display text-[16px] font-semibold text-[#3C080D]">
                    Reschedule Appointment
                  </h3>
                  <p className="font-sans text-[10px] text-[#6B3A2A]/70">
                    Booking #{activeBooking._id?.slice(-6).toUpperCase()}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setRescheduleModalOpen(false)}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Current Details Summary */}
            <div className="mt-3.5 rounded-lg border border-[#5A0E14]/10 bg-[#FDECC8]/25 p-3">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-[#6B3A2A]/70">Client:</span>
                <span className="font-bold text-[#3C080D]">
                  {activeBooking.clientDetails?.name ||
                    activeBooking.user?.name ||
                    "Guest Client"}
                </span>
              </div>
              <div className="mt-1 flex justify-between text-xs">
                <span className="font-medium text-[#6B3A2A]/70">Service:</span>
                <span className="font-bold text-[#3C080D]">
                  {activeBooking.serviceName}
                </span>
              </div>
              <div className="mt-1 flex justify-between text-xs">
                <span className="font-medium text-[#6B3A2A]/70">
                  Current Slot:
                </span>
                <span className="font-bold text-[#C1272D]">
                  {new Date(activeBooking.date).toLocaleDateString("en-IN")} at{" "}
                  {activeBooking.time || "Not Set"}
                </span>
              </div>
            </div>

            {/* Reschedule Form */}
            <form onSubmit={handleRescheduleSubmit} className="mt-4 space-y-3.5">
              {/* New Date Picker */}
              <div>
                <label className="block font-sans text-[11px] font-bold uppercase tracking-wider text-[#6B3A2A]">
                  New Appointment Date *
                </label>
                <input
                  type="date"
                  required
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="mt-1 w-full rounded-md border border-[#5A0E14]/20 bg-white px-3 py-2 font-sans text-xs text-[#3C080D] transition-colors focus:border-[#E9A534] focus:outline-none focus:ring-1 focus:ring-[#E9A534]"
                />
              </div>

              {/* Time Selection Dropdown */}
              <div>
                <label className="block font-sans text-[11px] font-bold uppercase tracking-wider text-[#6B3A2A]">
                  New Time Slot *
                </label>
                <select
                  value={rescheduleTime}
                  onChange={(e) => setRescheduleTime(e.target.value)}
                  className="mt-1 w-full rounded-md border border-[#5A0E14]/20 bg-white px-3 py-2 font-sans text-xs font-semibold text-[#3C080D] transition-colors focus:border-[#E9A534] focus:outline-none focus:ring-1 focus:ring-[#E9A534]"
                >
                  {TIME_SLOT_OPTIONS.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>

              {/* Update Status */}
              <div>
                <label className="block font-sans text-[11px] font-bold uppercase tracking-wider text-[#6B3A2A]">
                  Appointment Status
                </label>
                <select
                  value={rescheduleStatus}
                  onChange={(e) => setRescheduleStatus(e.target.value)}
                  className="mt-1 w-full rounded-md border border-[#5A0E14]/20 bg-white px-3 py-2 font-sans text-xs text-[#3C080D] transition-colors focus:border-[#E9A534] focus:outline-none focus:ring-1 focus:ring-[#E9A534]"
                >
                  <option value="rescheduled">Rescheduled</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending Appointment</option>
                  <option value="follow_up">Follow-up</option>
                </select>
              </div>

              {/* Reschedule Notes */}
              <div>
                <label className="block font-sans text-[11px] font-bold uppercase tracking-wider text-[#6B3A2A]">
                  Admin Notes / Reason (Optional)
                </label>
                <textarea
                  rows={2}
                  value={rescheduleNotes}
                  onChange={(e) => setRescheduleNotes(e.target.value)}
                  placeholder="e.g. Rescheduled as per client phone request..."
                  className="mt-1 w-full rounded-md border border-[#5A0E14]/20 bg-white px-3 py-2 font-sans text-xs text-[#3C080D] placeholder-[#6B3A2A]/40 transition-colors focus:border-[#E9A534] focus:outline-none"
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setRescheduleModalOpen(false)}
                  className="rounded-md border border-[#5A0E14]/15 bg-white px-3.5 py-2 font-sans text-xs font-semibold text-[#6B3A2A] transition-colors hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={rescheduleSubmitting}
                  className="inline-flex items-center gap-1.5 rounded-md bg-[#5A0E14] px-4 py-2 font-sans text-xs font-bold uppercase tracking-wider text-[#FFF8EC] shadow-md transition-all hover:bg-[#43090E] disabled:opacity-50 cursor-pointer"
                >
                  {rescheduleSubmitting ? (
                    <span>Saving...</span>
                  ) : (
                    <>
                      <CalendarCheck className="h-3.5 w-3.5 text-[#E9C76D]" />
                      <span>Confirm Reschedule</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================
          CLIENT DETAILS MODAL
      ================================================================ */}
      {viewModalBooking && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-xl border border-[#E9A534]/30 bg-[#FFFDF9] p-5 sm:p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#5A0E14]/12 pb-3.5">
              <h3 className="font-display text-[16px] font-semibold text-[#3C080D]">
                Consultation Details
              </h3>
              <button
                type="button"
                onClick={() => setViewModalBooking(null)}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3 font-sans text-xs">
              <div className="grid grid-cols-2 gap-2 rounded-lg border border-[#5A0E14]/10 bg-[#FDECC8]/20 p-3">
                <div>
                  <span className="font-bold text-[#8A5A1F] uppercase text-[10px]">
                    Service:
                  </span>
                  <p className="font-semibold text-[#3C080D]">
                    {viewModalBooking.serviceName}
                  </p>
                </div>
                <div>
                  <span className="font-bold text-[#8A5A1F] uppercase text-[10px]">
                    Scheduled:
                  </span>
                  <p className="font-semibold text-[#3C080D]">
                    {new Date(viewModalBooking.date).toLocaleDateString("en-IN")}{" "}
                    at {viewModalBooking.time}
                  </p>
                </div>
                <div>
                  <span className="font-bold text-[#8A5A1F] uppercase text-[10px]">
                    Status:
                  </span>
                  <p className="font-semibold capitalize text-[#3C080D]">
                    {viewModalBooking.status}
                  </p>
                </div>
                <div>
                  <span className="font-bold text-[#8A5A1F] uppercase text-[10px]">
                    Amount / Payment:
                  </span>
                  <p className="font-semibold text-[#C1272D]">
                    ₹{viewModalBooking.amount} (
                    {viewModalBooking.paymentStatus || "pending"})
                  </p>
                </div>
              </div>

              {/* Client Info */}
              <div className="rounded-lg border border-[#5A0E14]/10 p-3 space-y-1.5">
                <h4 className="font-bold text-[#3C080D] uppercase text-[11px] border-b pb-1">
                  Primary Client Info
                </h4>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                  <div>
                    <span className="text-[#6B3A2A]/70">Name:</span>{" "}
                    <strong>
                      {viewModalBooking.clientDetails?.name ||
                        viewModalBooking.user?.name ||
                        "N/A"}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[#6B3A2A]/70">Phone:</span>{" "}
                    <strong>
                      {viewModalBooking.clientDetails?.phone ||
                        viewModalBooking.user?.phone ||
                        "N/A"}
                    </strong>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[#6B3A2A]/70">Email:</span>{" "}
                    <strong>
                      {viewModalBooking.clientDetails?.email ||
                        viewModalBooking.user?.email ||
                        "N/A"}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[#6B3A2A]/70">DOB:</span>{" "}
                    <strong>
                      {viewModalBooking.clientDetails?.dateOfBirth || "N/A"}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[#6B3A2A]/70">Time of Birth:</span>{" "}
                    <strong>
                      {viewModalBooking.clientDetails?.timeOfBirth || "N/A"}
                    </strong>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[#6B3A2A]/70">Place of Birth:</span>{" "}
                    <strong>
                      {viewModalBooking.clientDetails?.placeOfBirth || "N/A"}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Partner Details if kundli-matching */}
              {viewModalBooking.clientDetails?.partnerName && (
                <div className="rounded-lg border border-[#5A0E14]/10 p-3 space-y-1.5">
                  <h4 className="font-bold text-[#3C080D] uppercase text-[11px] border-b pb-1">
                    Partner Info (Matching)
                  </h4>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                    <div>
                      <span className="text-[#6B3A2A]/70">Name:</span>{" "}
                      <strong>
                        {viewModalBooking.clientDetails.partnerName}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[#6B3A2A]/70">DOB:</span>{" "}
                      <strong>
                        {viewModalBooking.clientDetails.partnerDateOfBirth ||
                          "N/A"}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[#6B3A2A]/70">Time:</span>{" "}
                      <strong>
                        {viewModalBooking.clientDetails.partnerTimeOfBirth ||
                          "N/A"}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[#6B3A2A]/70">Place:</span>{" "}
                      <strong>
                        {viewModalBooking.clientDetails.partnerPlaceOfBirth ||
                          "N/A"}
                      </strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Questions / Notes */}
              {viewModalBooking.clientDetails?.questions && (
                <div className="rounded-lg border border-[#5A0E14]/10 p-3">
                  <h4 className="font-bold text-[#3C080D] uppercase text-[11px] mb-1">
                    Specific Questions / Concerns:
                  </h4>
                  <p className="text-[#3C080D] bg-white p-2 rounded border border-[#5A0E14]/10 whitespace-pre-wrap">
                    {viewModalBooking.clientDetails.questions}
                  </p>
                </div>
              )}

              {viewModalBooking.notes && (
                <div className="rounded-lg border border-[#5A0E14]/10 p-3">
                  <h4 className="font-bold text-[#3C080D] uppercase text-[11px] mb-1">
                    Admin / Booking Notes:
                  </h4>
                  <p className="text-[#3C080D] bg-white p-2 rounded border border-[#5A0E14]/10 whitespace-pre-wrap">
                    {viewModalBooking.notes}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setViewModalBooking(null)}
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
