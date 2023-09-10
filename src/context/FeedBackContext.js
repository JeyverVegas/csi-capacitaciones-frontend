import React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import SystemInfo from "../util/SystemInfo";

const FeedBackContext = createContext({ setLoading: false, customAlert: null, setCustomAlert: null, customLoading: null, setCustomToast: null, customToast: null, customAlertDialog: null, setCustomAlertDialog: null });

export const FeedBackProvider = ({ children }) => {

  const [customLoading, setLoading] = useState({ show: false, message: "", secondMessage: '' });
  const [customToast, setCustomToast] = useState({ message: '', severity: '', show: false, position: '' });
  const [customAlert, setCustomAlert] = useState({ show: false, message: "", severity: "success", title: '' });
  const [customAlertDialog, setCustomAlertDialog] = useState({ show: false, message: "", severity: "success" });

  const [title, setTitle] = useState('');

  useEffect(() => {

    if (customLoading.show && customLoading.message) {
      setTitle(document.querySelector('title').textContent);
      document.querySelector('title').textContent = `${customLoading.message} | ${SystemInfo?.name}`;
    } else {
      if (title) {
        document.querySelector('title').textContent = title;
      } else {
        document.querySelector('title').textContent = SystemInfo?.name;
      }
    }

  }, [customLoading.show, customLoading?.message])

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
