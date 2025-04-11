// ToastContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
} from "react-icons/fa";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  
  // Use useCallback to prevent recreation of this function on each render
  const showToast = useCallback((message, type = "success") => {
    // Generate a truly unique ID by combining timestamp with random string
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast = { id, message, type };
    
    // Use functional state update to avoid issues with stale closures
    setToasts(prevToasts => [...prevToasts, newToast]);

    // Auto-remove this specific toast after 3 seconds
    setTimeout(() => {
      setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
    }, 3000);
  }, []);

  // Context value with memoized showToast function
  const contextValue = { showToast };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-3 items-end">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 min-w-[250px] max-w-xs rounded shadow-md bg-white border-l-4 animate-slide-in-right
              ${toast.type === "success" ? "border-green-600" : ""}
              ${toast.type === "warning" ? "border-yellow-500" : ""}
              ${toast.type === "error" ? "border-red-600" : ""}
              ${toast.type === "info" ? "border-blue-500" : ""}`}
          >
            {toast.type === "success" && (
              <FaCheckCircle className="text-green-600 text-lg animate-pop" />
            )}
            {toast.type === "warning" && (
              <FaExclamationTriangle className="text-yellow-500 text-lg animate-pop" />
            )}
            {toast.type === "error" && (
              <FaTimesCircle className="text-red-600 text-lg animate-pop" />
            )}
            {toast.type === "info" && (
              <FaExclamationTriangle className="text-blue-500 text-lg animate-pop" />
            )}
            <span className="text-sm text-gray-700 font-medium">
              {toast.message}
            </span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
