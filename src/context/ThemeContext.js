import React, { createContext, useContext, useEffect, useState } from "react";
import { dezThemeSet } from './ThemeDemo';

const ThemeContext = createContext();

export const ThemeContextProvider = (props) => {
  const [headerposition, setHeaderposition] = useState({ value: "fixed", label: "Fixed", });
  const [sidebarLayout, setSidebarLayout] = useState('horizontal');
  const [primaryColor, setPrimaryColor] = useState("color_1");
  const [navigationHader, setNavigationHader] = useState("color_1");
  const [haderColor, setHaderColor] = useState("color_1");
  const [sidebarColor, setSidebarColor] = useState("color_1");
  const [iconHover, setIconHover] = useState(false);
  const [menuToggle, setMenuToggle] = useState(false);
  const [background, setBackground] = useState({ value: "light", label: "Light", });
  const [containerPosition_, setcontainerPosition_] = useState({ value: "wide-boxed", label: "Wide Boxed", });

  const sideBarOption = [
    { value: "compact", label: "Compact" },
    { value: "full", label: "Full" },
    { value: "mini", label: "Mini" },
    { value: "modern", label: "Modern" },
    { value: "overlay", label: "Overlay" },
    { value: "icon-hover", label: "Icon-hover" },
  ];
  const backgroundOption = [
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" },
  ];
  const sidebarpositions = [
    { value: "fixed", label: "Fixed" },
    { value: "static", label: "Static" },
  ];
  const headerPositions = [
    { value: "fixed", label: "Fixed" },
    { value: "static", label: "Static" },
  ];
  const containerPosition = [
    { value: "wide-boxed", label: "Wide Boxed" },
    { value: "boxed", label: "Boxed" },
    { value: "wide", label: "Wide" },
  ];
  const colors = [
    "color_1",
    "color_2",
    "color_3",
    "color_4",
    "color_5",
    "color_6",
    "color_7",
    "color_8",
    "color_9",
    "color_10",
    "color_11",
    "color_12",
    "color_13",
    "color_14",
    "color_15",
  ];
  const directionPosition = [
    { value: "ltr", label: "LTR" },
    { value: "rtl", label: "RTL" },
  ];
  const fontFamily = [
    { value: "poppins", label: "Poppins" },
    { value: "roboto", label: "Roboto" },
    { value: "cairo", label: "Cairo" },
    { value: "opensans", label: "Open Sans" },
    { value: "HelveticaNeue", label: "HelveticaNeue" },
  ];
  const changePrimaryColor = (name) => {
    setPrimaryColor(name);
  };
  const changeNavigationHader = (name) => {
    setNavigationHader(name);
  };
  const chnageHaderColor = (name) => {
    setHaderColor(name);
  };
  const chnageSidebarColor = (name) => {
    setSidebarColor(name);
  };

  const changeHeaderPostion = (name) => {
    setHeaderposition(name);
  };

  const customMenuToggle = (open) => {
    setMenuToggle(open);
  }

  const changeBackground = (name) => {
    setBackground(name);
  };

  const setDemoTheme = (theme, direction) => {

    var setAttr = {};


    var themeSettings = dezThemeSet[theme];


    setAttr.value = themeSettings.version;
    changeBackground(setAttr);


    //setAttr.value = themeSettings.primary;
    changePrimaryColor(themeSettings.primary);

    //setAttr.value = themeSettings.navheaderBg;
    changeNavigationHader(themeSettings.navheaderBg);

    //setAttr.value = themeSettings.headerBg;
    chnageHaderColor(themeSettings.headerBg);

    //setAttr.value = themeSettings.sidebarBg;
    chnageSidebarColor(themeSettings.sidebarBg);

    setAttr.value = themeSettings.headerPosition;
    changeHeaderPostion(setAttr);
  };

  return (
    <ThemeContext.Provider
      value={{
        sideBarOption,
        backgroundOption,
        headerPositions,
        containerPosition,
        directionPosition,
        fontFamily,
        primaryColor,
        navigationHader,
        changePrimaryColor,
        changeNavigationHader,
        sidebarpositions,
        changeHeaderPostion,
        headerposition,
        sidebarLayout,
        colors,
        haderColor,
        chnageHaderColor,
        chnageSidebarColor,
        sidebarColor,
        iconHover,
        menuToggle,
        customMenuToggle,
        changeBackground,
        background,
        containerPosition_,
        setDemoTheme,
      }}
    >
      {props.children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);


