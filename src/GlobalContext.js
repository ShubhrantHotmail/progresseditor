import React from "react";
export const GlobalContext = React.createContext();

export function GlobalContextProvider({ children }) {
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
