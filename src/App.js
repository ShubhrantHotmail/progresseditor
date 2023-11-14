import "./App.css";
import { GlobalContextProvider } from "./GlobalContext";
import ProEditor from "./editor/ProEditor";
import EditorPanel from "./panel";

function App() {
  return (
    <GlobalContextProvider>
      <EditorPanel />
    </GlobalContextProvider>
  );
}

export default App;
