import React from "react";
import "./App.css";
import { ConfigProvider, theme } from "antd";
import { GlobalContext } from "./GlobalContext";
import EditorPanel from "./panel";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import FileViewer from "./panel/FileViewer";
// import hiIN from "antd/locale/hi_IN";

function App() {
  const [state] = React.useContext(GlobalContext);
  const [algorithm, setAlgorithm] = React.useState(
    state?.themeTokens?.algorithm
  );
  const [tokens, setTokens] = React.useState(state?.themeTokens?.antThemeToken);
  let myTheme = localStorage.getItem("theme") ?? "defaultLight";
  let myThemeTokens = localStorage.getItem("themeTokens") ?? null;

  // console.log(myTheme, myThemeTokens);
  const { token } = theme.useToken();

  React.useEffect(() => {
    console.log("UseEffect: App");
    const tokens = JSON.parse(myThemeTokens);

    setAlgorithm(tokens?.algorithm ?? state?.themeTokens?.algorithm);
    setTokens(tokens?.antThemeToken ?? state?.themeTokens?.antThemeToken);
    document.body.style.backgroundColor = state?.themeTokens?.bodyBackground;
  }, [myTheme, myThemeTokens]);

  return (
    <ConfigProvider
      theme={{
        algorithm:
          algorithm === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: tokens,
        components: {
          Table: {
            cellFontSize: 12,
            cellFontSizeSM: 12,
            stickyScrollBarBg: "transparent",
            // algorithm: true,
            headerBg: "transparent",
            // borderColor: "transparent",
            cellPaddingBlockSM: 4,
            rowHoverBg: tokens?.colorInfoBgHover,
          },
          Button: {
            colorPrimaryTextHover: tokens?.colorLink,
          },
        },
      }}
      // locale={hiIN}
    >
      <BrowserRouter>
        <Routes>
          <Route exact path="/apps/proeditor" element={<EditorPanel />} />
          <Route path="/apps/proeditor/view/:token" element={<FileViewer />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
