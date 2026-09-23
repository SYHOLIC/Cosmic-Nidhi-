import React, { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message, type = "info", duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 5);
    const newToast = { id, message, type };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const toast = {
    success: (msg, duration) => addToast(msg, "success", duration),
    error: (msg, duration) => addToast(msg, "error", duration),
    info: (msg, duration) => addToast(msg, "info", duration),
    warning: (msg, duration) => addToast(msg, "warning", duration),
  };

  const getToastIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-rose-400 shrink-0" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0" />;
      case "info":
      default:
        return <Info className="h-5 w-5 text-[#E9A534] shrink-0" />;
    }
  };

  const getToastBorder = (type) => {
    switch (type) {
      case "success":
        return "border-emerald-500/40 shadow-[0_10px_30px_rgba(16,185,129,0.18)]";
      case "error":
        return "border-rose-500/40 shadow-[0_10px_30px_rgba(244,63,94,0.18)]";
      case "warning":
        return "border-amber-500/40 shadow-[0_10px_30px_rgba(245,158,11,0.18)]";
      case "info":
      default:
        return "border-[#E9A534]/50 shadow-[0_10px_30px_rgba(233,165,52,0.22)]";
    }
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast Notification Container */}
      <div
        className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none max-w-sm w-full px-4 sm:px-0"
        aria-live="polite"
      >
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.9, transition: { duration: 0.2 } }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className={`
                pointer-events-auto flex items-center gap-3.5 px-4 py-3.5 rounded-xl
                bg-[#240307]/95 text-[#FFF8EC] border backdrop-blur-md
                ${getToastBorder(t.type)}
              `}
            >
              {getToastIcon(t.type)}
              <div className="flex-1 text-[13px] font-sans font-medium leading-snug">
                {t.message}
              </div>
              <button
                type="button"
                onClick={() => removeToast(t.id)}
                className="text-[#FFF8EC]/60 hover:text-[#FFF8EC] p-1 rounded-md transition-colors"
                aria-label="Dismiss toast"
              >
                <X size={15} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    // Safe fallback if used outside provider
    return {
      success: (msg) => console.log("[Toast Success]", msg),
      error: (msg) => console.error("[Toast Error]", msg),
      info: (msg) => console.log("[Toast Info]", msg),
      warning: (msg) => console.warn("[Toast Warning]", msg),
    };
  }
  return context;
}
