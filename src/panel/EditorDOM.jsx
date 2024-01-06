import React, { useEffect } from "react";
// import ResizePanel from "react-resize-panel";
import SplitPane from "react-split-pane-v2";

import "./style.css";
import ProEditor from "../editor/ProEditor";
import EditorFooter from "./Footer";
import Pane from "react-split-pane-v2/lib/Pane";
// import ControlPanel from "./ControlPanel";
// import {
//     getAllFunctions,
//     getAllIOParameters,
//     getAllIncludes,
//     getAllProcedures,
//     getAllVariables,
//     getSourceCode,
//     getCurlyContent,
//   } from "../parser/sourceParser";
import CodeStructure from "./CodeStructure";
import {
  getLang,
  setDynamicCompletion,
  setupEditor,
} from "../lib/editorConfig";
import { getCodeStructure } from "../lib/editorOperations";
import { theme } from "antd";
import { GlobalContext } from "../GlobalContext";
import Loader from "./Loader";
import { logger } from "../lib/util";

const { useToken } = theme;

export default function EditorDOM(props) {
  const {
    loading,
    tabProps,
    tabList,
    setTabList,
    // fileText,
    // setFileText,
    // file,
    // setFile,
    // fileHandle,
    // setFileHandle,
    // monaco,
    // setMonaco,
    // editor,
    // setEditor,
  } = props;

  const { token } = useToken();
  const [state, payload] = React.useContext(GlobalContext);
  //   const [decorations, setDecorations] = React.useState([]);
  const [selectedText, setSelectedText] = React.useState("");
  const [fileHandle, setFileHandle] = React.useState(null);
  const [code, setCode] = React.useState("");
  const [fileText, setFileText] = React.useState(tabProps?.fileText ?? "");
  const [file, setFile] = React.useState(tabProps?.file ?? "");
  const [editor, setEditor] = React.useState(tabProps?.editor);
  const [monaco, setMonaco] = React.useState(tabProps?.monaco);
  // const [language, setLanguage] = React.useState("abl");

  const [cursorPosition, setCursorPosition] = React.useState({
    lineNumber: 1,
    column: 1,
  });
  const [editorProps, setEditorProps] = React.useState({
    fontSize: "13",
    fontFamily: "Monospace",
    lang: tabProps?.language,
  });
  const [structure, setStructure] = React.useState({
    definedVariables: null,
    includeFiles: null,
    ioParameters: null,
    tempTables: null,
    procedures: null,
    functions: null,
    object: file,
  });

  const handleEditorContextChange = (context, value) => {
    // console.log(editorProps);
    switch (context) {
      case "fontsize":
        setEditorProps({ ...editorProps, fontSize: value });
        editor.updateOptions({ fontSize: value });
        break;
      case "fontfamily":
        setEditorProps({ ...editorProps, fontFamily: value });
        editor.updateOptions({ fontFamily: value });
        break;
      case "lang":
        // console.log(value);
        setEditorProps({ ...editorProps, lang: value });
        monaco.editor.setModelLanguage(monaco.editor.getModels()[0], value);
        break;
      default:
        break;
    }
  };

  const recordCodeStructure = () => {
    const data = getCodeStructure(editor);
    setDynamicCompletion(monaco, data);
    setStructure({
      ...structure,
      ...data,
    });
  };

  useEffect(() => {
    console.log("UseEffect");
    if (editor) {
      // editor.setValue(fileText);
      setupEditor({
        monaco,
        editor,
        code: fileText,
        setCode,
        setFileText,
        setCursorPosition,
        setSelectedText,
        fileHandle,
        setFileHandle,
        setFile,
        payload,
        state,
        setStructure,
      });
      recordCodeStructure();
      // if (tabProps?.file && tabProps?.file !== "Untitled") {
      //   setLanguage(lang);
      //   handleEditorContextChange("lang", lang);
      // }
      if (tabProps.language)
        handleEditorContextChange("lang", tabProps.language);
      // tabProps.setMonaco(monaco);
      // tabProps.setEditor(editor);
      const obj = tabList.find((item) => item?.tabIndex === tabProps.tabIndex);
      const objIndex = tabList.findIndex(
        (item) => item?.tabIndex === tabProps.tabIndex
      );
      logger(tabList);
      if (obj) {
        logger(obj);
        obj.setMonaco = setMonaco;
        obj.monaco = monaco;
        obj.setEditor = setEditor;
        obj.editor = editor;
        obj.setFileText = setFileText;
        console.log(objIndex, obj);
        tabList.splice(objIndex, obj);
        setTabList([...tabList]);
      }
    }
  }, [editor, fileText]);

  // useEffect(() => {
  //   if (file && file !== "Untitled") {
  //     const lang = getLang(file);
  //     handleEditorContextChange("lang", lang);
  //   }
  // }, [file]);
  return (
    <>
      <SplitPane split="vertical">
        <Pane
          minSize="55%"
          maxSize="100%"
          // style={{ height: "calc(100vh - 65px)",backgroundColor: "#f8f8f8" }}
          id="container"
        >
          <Loader loading={loading.object}>
            <ProEditor
              width={editorProps.width}
              height="calc(100vh - 60px)"
              code={code}
              setMonaco={setMonaco}
              setEditor={setEditor}
              setCode={setCode}
              setFileText={setFileText}
              setSelectedText={setSelectedText}
              setCursorPosition={setCursorPosition}
              lang={editorProps.lang}
              fontFamily={editorProps.fontFamily}
              fontSize={editorProps.fontSize}
              setFile={setFile}
              fileHandle={fileHandle}
              setFileHandle={setFileHandle}
              setStructure={setStructure}
            />
          </Loader>
        </Pane>
        <Pane
          minSize="180px"
          maxSize="280px"
          style={{
            height: "100%",
            backgroundColor: `${token.colorBgLayout}`,
            overflowY: "auto",
          }}
        >
          <CodeStructure structure={structure} editor={editor} />
        </Pane>
      </SplitPane>
      <div>
        <EditorFooter
          position={cursorPosition}
          editorProps={editorProps}
          callback={handleEditorContextChange}
          file={file}
        />
      </div>
    </>
  );
}
