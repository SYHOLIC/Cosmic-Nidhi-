import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  Mail,
  MailOpen,
  Search,
  RefreshCw,
  Trash2,
  CheckCheck,
  Eye,
  X,
  ExternalLink,
  Clock,
  User,
  Inbox,
  AlertTriangle,
  Send,
  Calendar,
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
  return date.toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatFullDateTime(dateInput) {
  if (!dateInput) return "";
  const date = new Date(dateInput);
  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function MessageTab() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all"); // 'all' | 'unread' | 'read'
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const fetchMessages = async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) setRefreshing(true);
      else setLoading(true);

      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/contact`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success && Array.isArray(res.data.messages)) {
        setMessages(res.data.messages);
      }
    } catch (err) {
      console.error("Error fetching contact messages:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleToggleRead = async (id, currentStatus, e) => {
    if (e) e.stopPropagation();
    try {
      setActionLoadingId(id);
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${API_URL}/contact/${id}/read`,
        { isRead: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === id ? { ...msg, isRead: res.data.isRead } : msg
          )
        );

        if (selectedMessage && selectedMessage._id === id) {
          setSelectedMessage((prev) => ({
            ...prev,
            isRead: res.data.isRead,
          }));
        }
      }
    } catch (err) {
      console.error("Error toggling message read status:", err);
      alert("Failed to update message status.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      setActionLoadingId(id);
      const token = localStorage.getItem("token");
      const res = await axios.delete(`${API_URL}/contact/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setMessages((prev) => prev.filter((msg) => msg._id !== id));
        if (selectedMessage && selectedMessage._id === id) {
          setSelectedMessage(null);
        }
        setDeleteConfirmId(null);
      }
    } catch (err) {
      console.error("Error deleting message:", err);
      alert("Failed to delete message.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleOpenMessage = (msg) => {
    setSelectedMessage(msg);
    // If opening an unread message, mark it as read automatically
    if (!msg.isRead) {
      handleToggleRead(msg._id, false);
    }
  };

  // Filtered and searched messages
  const filteredMessages = useMemo(() => {
    return messages.filter((msg) => {
      const matchesFilter =
        filter === "all"
          ? true
          : filter === "unread"
          ? !msg.isRead
          : msg.isRead;

      if (!matchesFilter) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      return (
        msg.name?.toLowerCase().includes(q) ||
        msg.email?.toLowerCase().includes(q) ||
        msg.subject?.toLowerCase().includes(q) ||
        msg.message?.toLowerCase().includes(q)
      );
    });
  }, [messages, filter, searchQuery]);

  const unreadCount = useMemo(() => {
    return messages.filter((m) => !m.isRead).length;
  }, [messages]);

  const readCount = messages.length - unreadCount;

  return (
    <div className="space-y-5">
      {/* Top Header Card */}
      <div className="rounded-[9px] border border-[#5A0E14]/12 bg-[#FFFDF9] p-5 shadow-[0_4px_16px_rgba(60,8,13,0.04)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-6 bg-[#E9A534]" />
              <p className="font-sans text-[10px] font-bold uppercase tracking-[0.24em] text-[#8A5A1F]">
                Inquiries & Feedback
              </p>
            </div>
            <div className="mt-1 flex items-center gap-3">
              <h2 className="font-display text-[20px] font-bold text-[#3C080D]">
                Contact Us Messages
              </h2>
              <div className="flex items-center gap-2">
                <span className="rounded-full border border-[#5A0E14]/15 bg-[#FDECC8]/40 px-2.5 py-0.5 font-sans text-[10px] font-bold uppercase tracking-wider text-[#6B3A2A]">
                  {messages.length} Total
                </span>
                {unreadCount > 0 && (
                  <span className="flex items-center gap-1 rounded-full bg-[#C1272D] px-2.5 py-0.5 font-sans text-[10px] font-bold uppercase tracking-wider text-white shadow-sm animate-pulse">
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    {unreadCount} Unread
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fetchMessages(true)}
              disabled={refreshing || loading}
              className="flex items-center gap-1.5 rounded-[7px] border border-[#5A0E14]/15 bg-[#FFFDF9] px-3.5 py-2 font-sans text-[11px] font-semibold text-[#5A0E14] transition-all hover:border-[#E9A534] hover:bg-[#FDECC8]/30 disabled:opacity-50"
            >
              <RefreshCw
                size={13}
                className={refreshing ? "animate-spin text-[#8A5A1F]" : ""}
              />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Filter Controls & Search */}
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-[#5A0E14]/10 pt-4">
          <div className="flex items-center gap-2">
            {[
              { id: "all", label: "All Messages", count: messages.length },
              { id: "unread", label: "Unread", count: unreadCount },
              { id: "read", label: "Read", count: readCount },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                className={`
                  flex items-center gap-1.5 rounded-full px-3 py-1 font-sans text-[11px] font-semibold transition-all
                  ${
                    filter === tab.id
                      ? "bg-[#5A0E14] text-[#FFF8EC] shadow-sm"
                      : "bg-[#FDECC8]/35 text-[#6B3A2A] hover:bg-[#FDECC8]/70 hover:text-[#3C080D]"
                  }
                `}
              >
                <span>{tab.label}</span>
                <span
                  className={`
                    rounded-full px-1.5 py-0.2 text-[9px] font-bold
                    ${
                      filter === tab.id
                        ? "bg-[#E9A534] text-[#210307]"
                        : "bg-[#5A0E14]/10 text-[#6B3A2A]"
                    }
                  `}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <div className="relative w-full sm:max-w-[280px]">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A5A1F]"
            />
            <input
              type="text"
              placeholder="Search by name, email, subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-[7px] border border-[#5A0E14]/15 bg-[#FFFDF9] py-1.5 pl-8 pr-3 font-sans text-[12px] text-[#3C080D] placeholder-[#6B3A2A]/45 outline-none transition-all focus:border-[#E9A534] focus:ring-1 focus:ring-[#E9A534]"
            />
          </div>
        </div>
      </div>

      {/* Messages List / Table */}
      <div className="overflow-hidden rounded-[9px] border border-[#5A0E14]/12 bg-[#FFFDF9] shadow-[0_4px_16px_rgba(60,8,13,0.04)]">
        {loading ? (
          <div className="py-20 text-center">
            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-[#E9A534]/30 border-t-[#E9A534]" />
            <p className="font-sans text-[12px] font-semibold uppercase tracking-[0.18em] text-[#6B3A2A]/70">
              Loading inquiries...
            </p>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="py-16 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#FDECC8]/40 text-[#8A5A1F]">
              <Inbox size={22} strokeWidth={1.5} />
            </div>
            <h4 className="font-display text-[16px] font-semibold text-[#3C080D]">
              No Messages Found
            </h4>
            <p className="mt-1 font-sans text-[12px] text-[#6B3A2A]/70">
              {searchQuery
                ? "No contact inquiries match your search keywords."
                : filter === "unread"
                ? "You're all caught up! No unread messages."
                : "No inquiries have been received through Contact Us yet."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#5A0E14]/10">
            {filteredMessages.map((msg) => {
              const isUnread = !msg.isRead;
              const isSelected = selectedMessage?._id === msg._id;
              const isActionLoading = actionLoadingId === msg._id;

              return (
                <div
                  key={msg._id}
                  onClick={() => handleOpenMessage(msg)}
                  className={`
                    group flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 transition-all cursor-pointer
                    ${
                      isUnread
                        ? "bg-[#FDECC8]/25 hover:bg-[#FDECC8]/45"
                        : "bg-[#FFFDF9] hover:bg-[#FDECC8]/15"
                    }
                    ${isSelected ? "ring-1 ring-inset ring-[#E9A534]" : ""}
                  `}
                >
                  {/* Left Column: Avatar & Sender Info */}
                  <div className="flex items-start gap-3.5 min-w-0 md:w-[32%]">
                    {/* Unread indicator / Avatar */}
                    <div className="relative shrink-0 mt-0.5">
                      <div
                        className={`
                          flex h-9 w-9 items-center justify-center rounded-full font-display text-[13px] font-bold uppercase
                          ${
                            isUnread
                              ? "bg-gradient-to-br from-[#5A0E14] to-[#210307] text-[#E9C76D] ring-2 ring-[#E9A534]/50"
                              : "bg-[#5A0E14]/10 text-[#5A0E14]"
                          }
                        `}
                      >
                        {msg.name?.charAt(0) || "U"}
                      </div>
                      {isUnread && (
                        <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[#C1272D] ring-2 ring-white" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`truncate font-display text-[14px] ${
                            isUnread
                              ? "font-bold text-[#210307]"
                              : "font-semibold text-[#3C080D]"
                          }`}
                        >
                          {msg.name}
                        </span>
                        {isUnread ? (
                          <span className="shrink-0 rounded bg-[#E9A534]/30 px-1.5 py-0.2 font-sans text-[8.5px] font-bold uppercase tracking-wider text-[#8A5A1F]">
                            New
                          </span>
                        ) : (
                          <span className="shrink-0 rounded bg-green-100 px-1.5 py-0.2 font-sans text-[8.5px] font-semibold uppercase tracking-wider text-green-700">
                            Read
                          </span>
                        )}
                      </div>
                      <a
                        href={`mailto:${msg.email}`}
                        onClick={(e) => e.stopPropagation()}
                        className="block truncate font-sans text-[11px] text-[#8A5A1F] hover:text-[#5A0E14] hover:underline"
                      >
                        {msg.email}
                      </a>
                    </div>
                  </div>

                  {/* Middle Column: Subject & Message Excerpt */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`truncate font-sans text-[13px] ${
                        isUnread
                          ? "font-bold text-[#210307]"
                          : "font-medium text-[#3C080D]"
                      }`}
                    >
                      {msg.subject || "(No Subject)"}
                    </p>
                    <p className="mt-0.5 line-clamp-1 font-sans text-[12px] text-[#6B3A2A]/75">
                      {msg.message}
                    </p>
                  </div>

                  {/* Right Column: Time & Actions */}
                  <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#5A0E14]/10">
                    <div className="flex items-center gap-1 font-sans text-[11px] text-[#6B3A2A]/60">
                      <Clock size={11} />
                      <span>{formatRelativeTime(msg.createdAt)}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      {/* View Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenMessage(msg);
                        }}
                        title="View Full Message"
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-[#5A0E14]/10 bg-white text-[#5A0E14] transition-all hover:border-[#E9A534] hover:bg-[#FDECC8]/40 hover:text-[#8A5A1F]"
                      >
                        <Eye size={13} />
                      </button>

                      {/* Reply Button */}
                      <a
                        href={`mailto:${msg.email}?subject=${encodeURIComponent(
                          `Re: ${msg.subject || "Cosmic Nidhi Inquiry"}`
                        )}`}
                        onClick={(e) => e.stopPropagation()}
                        title={`Reply to ${msg.email}`}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-[#5A0E14]/10 bg-white text-[#5A0E14] transition-all hover:border-[#E9A534] hover:bg-[#FDECC8]/40 hover:text-[#8A5A1F]"
                      >
                        <Send size={13} />
                      </a>

                      {/* Toggle Read/Unread Button */}
                      <button
                        type="button"
                        disabled={isActionLoading}
                        onClick={(e) => handleToggleRead(msg._id, msg.isRead, e)}
                        title={msg.isRead ? "Mark as Unread" : "Mark as Read"}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-[#5A0E14]/10 bg-white text-[#5A0E14] transition-all hover:border-[#E9A534] hover:bg-[#FDECC8]/40 hover:text-[#8A5A1F] disabled:opacity-50"
                      >
                        {msg.isRead ? (
                          <Mail size={13} />
                        ) : (
                          <CheckCheck size={14} className="text-[#8A5A1F]" />
                        )}
                      </button>

                      {/* Delete Button */}
                      {deleteConfirmId === msg._id ? (
                        <div
                          className="flex items-center gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={(e) => handleDelete(msg._id, e)}
                            className="rounded bg-[#C1272D] px-2 py-1 font-sans text-[10px] font-bold text-white transition-opacity hover:opacity-90"
                          >
                            Confirm
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(null)}
                            className="rounded border border-[#5A0E14]/20 bg-white px-2 py-1 font-sans text-[10px] text-[#6B3A2A]"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteConfirmId(msg._id);
                          }}
                          title="Delete message"
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-[#5A0E14]/10 bg-white text-[#6B3A2A] transition-all hover:border-[#C1272D]/50 hover:bg-[#C1272D]/10 hover:text-[#C1272D]"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setSelectedMessage(null)}
        >
          <div
            className="w-full max-w-2xl overflow-hidden rounded-[16px] border border-[#E9A534]/40 bg-[#FFFDF9] shadow-[0_25px_80px_rgba(24,2,5,0.35)] animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#5A0E14]/12 bg-gradient-to-r from-[#210307] to-[#3C080D] px-6 py-4 text-[#FFF8EC]">
              <div className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#E9A534]/20 text-[#E9C76D]">
                  <Mail size={15} />
                </span>
                <div>
                  <h3 className="font-display text-[16px] font-bold text-[#FFF8EC]">
                    Contact Inquiry Details
                  </h3>
                  <p className="font-sans text-[11px] text-[#E9C76D]/80">
                    Received on {formatFullDateTime(selectedMessage.createdAt)}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedMessage(null)}
                className="rounded-full p-1 text-[#FFF8EC]/70 hover:bg-white/10 hover:text-[#FFF8EC] transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* Sender Details Grid */}
              <div className="grid gap-3 sm:grid-cols-2 rounded-[10px] border border-[#5A0E14]/10 bg-[#FDECC8]/25 p-4">
                <div>
                  <p className="font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-[#8A5A1F]">
                    Sender Name
                  </p>
                  <p className="mt-0.5 font-display text-[15px] font-semibold text-[#3C080D]">
                    {selectedMessage.name}
                  </p>
                </div>

                <div>
                  <p className="font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-[#8A5A1F]">
                    Email Address
                  </p>
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="mt-0.5 inline-flex items-center gap-1 font-sans text-[13px] font-medium text-[#5A0E14] hover:text-[#A2691F] hover:underline"
                  >
                    <span>{selectedMessage.email}</span>
                    <ExternalLink size={12} />
                  </a>
                </div>

                <div className="sm:col-span-2 pt-2 border-t border-[#5A0E14]/10 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-sans text-[11px] text-[#6B3A2A]/70">
                    <Calendar size={12} className="text-[#8A5A1F]" />
                    <span>Sent: {formatFullDateTime(selectedMessage.createdAt)}</span>
                  </div>

                  <span
                    className={`
                      inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-sans text-[10px] font-bold uppercase tracking-wider
                      ${
                        selectedMessage.isRead
                          ? "bg-green-100 text-green-800"
                          : "bg-[#E9A534]/30 text-[#8A5A1F]"
                      }
                    `}
                  >
                    {selectedMessage.isRead ? "Read" : "Unread"}
                  </span>
                </div>
              </div>

              {/* Subject */}
              <div>
                <p className="font-sans text-[11px] font-bold uppercase tracking-[0.16em] text-[#8A5A1F]">
                  Subject
                </p>
                <div className="mt-1 rounded-[8px] border border-[#5A0E14]/12 bg-[#FFFDF9] p-3 font-display text-[15px] font-bold text-[#3C080D]">
                  {selectedMessage.subject || "(No Subject)"}
                </div>
              </div>

              {/* Message Content */}
              <div>
                <p className="font-sans text-[11px] font-bold uppercase tracking-[0.16em] text-[#8A5A1F]">
                  Message Content
                </p>
                <div className="mt-1 whitespace-pre-wrap rounded-[8px] border border-[#5A0E14]/12 bg-[#FFFDF9] p-4 font-sans text-[13px] leading-relaxed text-[#3C080D] shadow-inner min-h-[120px]">
                  {selectedMessage.message}
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#5A0E14]/12 bg-[#FDECC8]/20 px-6 py-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    handleToggleRead(selectedMessage._id, selectedMessage.isRead)
                  }
                  className="flex items-center gap-1.5 rounded-[7px] border border-[#5A0E14]/20 bg-white px-3 py-1.5 font-sans text-[11px] font-semibold text-[#5A0E14] transition-all hover:bg-[#FDECC8]/40"
                >
                  {selectedMessage.isRead ? (
                    <>
                      <Mail size={13} />
                      <span>Mark as Unread</span>
                    </>
                  ) : (
                    <>
                      <CheckCheck size={13} className="text-green-700" />
                      <span>Mark as Read</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(selectedMessage._id)}
                  className="flex items-center gap-1.5 rounded-[7px] border border-[#C1272D]/20 bg-white px-3 py-1.5 font-sans text-[11px] font-semibold text-[#C1272D] transition-all hover:bg-[#C1272D]/10"
                >
                  <Trash2 size={13} />
                  <span>Delete</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedMessage(null)}
                  className="rounded-[7px] border border-[#5A0E14]/20 bg-white px-4 py-2 font-sans text-[12px] font-semibold text-[#6B3A2A] hover:bg-gray-50"
                >
                  Close
                </button>

                <a
                  href={`mailto:${selectedMessage.email}?subject=${encodeURIComponent(
                    `Re: ${selectedMessage.subject || "Cosmic Nidhi Inquiry"}`
                  )}`}
                  className="flex items-center gap-1.5 rounded-[7px] bg-gradient-to-r from-[#5A0E14] to-[#3C080D] px-4 py-2 font-sans text-[12px] font-bold text-[#FFF8EC] shadow transition-all hover:from-[#3C080D] hover:to-[#210307]"
                >
                  <Send size={13} />
                  <span>Reply via Email</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
