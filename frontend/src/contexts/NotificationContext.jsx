// src/contexts/NotificationContext.jsx
import React, { createContext, useState, useContext } from "react";

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [message, setMessage] = useState("");
  const [type, setType] = useState("success"); // success | error | info
  const [visible, setVisible] = useState(false);

  const showNotification = (msg, msgType = "success", duration = 3000) => {
    setMessage(msg);
    setType(msgType);
    setVisible(true);

    setTimeout(() => setVisible(false), duration);
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {visible && (
        <div
          className={`fixed top-5 z-50 right-5 px-4 py-2 rounded shadow-lg text-white 
          ${
            type === "success"
              ? "bg-green-500"
              : type === "error"
              ? "bg-red-500"
              : "bg-blue-500"
          }`}
        >
          {message}
        </div>
      )}
    </NotificationContext.Provider>
  );
};
