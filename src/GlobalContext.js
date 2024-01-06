import React from "react";
import { themePelette } from "./lib/theme";
export const GlobalContext = React.createContext();

export function GlobalContextProvider({ children }) {
  const currentTheme = localStorage.getItem("theme") ?? "defaultLight";
  // console.log("currentTheme", currentTheme);
  const initialState = {
    file: {
      originalContent: "",
      changedContent: "",
      saved: true,
      name: "Untitled",
      type: "local",
      handle: null,
    },
    fileOpenMode: "local",
    remoteFile: "",
    saved: true,
    fileState: "new",
    theme: currentTheme,
    themeTokens: themePelette?.[currentTheme],
    fileList: [],
  };

  const reducer = (state, action) => {
    switch (action?.type) {
      case "FILE_CHANGE":
        return {
          ...state,
          file: action?.value,
        };
      case "FILE_OPEN_MODE":
        return {
          ...state,
          fileOpenMode: action?.value,
        };
      case "REMOTE_FILE":
        return {
          ...state,
          remoteFile: action?.value,
        };
      case "THEME":
        return {
          ...state,
          theme: action?.value,
        };
      case "THEME_TOKENS":
        return {
          ...state,
          themeTokens: action?.value,
        };
      case "FILE_STATE":
        return {
          ...state,
          fileState: action?.value,
        };
      case "SAVED":
        return {
          ...state,
          saved: action?.value,
        };
      case "FILE_LIST":
        return {
          ...state,
          fileList: action?.value,
        };
      default:
        break;
    }
  };
  const [state, payload] = React.useReducer(reducer, initialState);
  return (
    <GlobalContext.Provider value={[state, payload]}>
      {children}
    </GlobalContext.Provider>
  );
}
