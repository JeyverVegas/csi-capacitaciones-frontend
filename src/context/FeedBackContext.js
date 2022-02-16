import React from "react";
import { createContext, useContext, useEffect, useState } from "react";

const FeedBackContext = createContext({ setLoading: false, customAlert: null, setCustomAlert: null, customLoading: null, setCustomToast: null, customToast: null, customAlertDialog: null, setCustomAlertDialog: null });

export const FeedBackProvider = ({ children }) => {

  const [customLoading, setLoading] = useState({ show: false, message: "" });
  const [customToast, setCustomToast] = useState({ message: '', severity: '', show: false, position: '' });
  const [customAlert, setCustomAlert] = useState({ show: false, message: "", severity: "success", title: '' });
  const [customAlertDialog, setCustomAlertDialog] = useState({ show: false, message: "", severity: "success" });

  useEffect(() => {
    if (customAlert?.show) {
      setTimeout(() => {
        setCustomAlert({ show: false, message: "", severity: "success", title: '' });
      }, [5000])
    }
  }, [customAlert])

  return <FeedBackContext.Provider value={{
    customLoading,
    setLoading,
    customAlert,
    setCustomAlert,
    customToast,
    setCustomToast,
    customAlertDialog,
    setCustomAlertDialog
  }}>
    {children}
  </FeedBackContext.Provider>;
};

export const useFeedBack = () => useContext(FeedBackContext);
