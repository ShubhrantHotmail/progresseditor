import React, { useCallback, useEffect } from "react";
import "../styles/main.css";

import { useMonaco } from "@monaco-editor/react";
import { setupABLLanguage, setupEditor } from "../lib/editorConfig";
import { getFileText } from "../lib/editorOperations";
import { GlobalContext } from "../GlobalContext";

export default function ProEditor(props) {
  var {
    ref,
    lang,
    height,
    width,
    theme,
    fontSize,
    fontFamily,
    tabSize,
    showMinimap,
    showRuler,
    rulerSize,
    code,
    setMonaco,
    setEditor,
    setCode,
    setSelectedText,
    setCursorPosition,
    setFile,
    fileHandle,
    setFileHandle,
    setStructure,
  } = props;

  var containerId = Math.random().toString(16).slice(2);
  const [state, payload] = React.useContext(GlobalContext);
  const [monacoEditor, setMonacoEditor] = React.useState(null);
  // const [code, setCode] = React.useState("");
  const editorRef = React.useRef();
  var editorComponent;
  try {
    var monaco = useMonaco();
    // console.log(monaco.KeyCode);
  } catch (error) {
    console.error("Monaco Error:", error);
  }

  React.useEffect(() => {
    if (monaco) {
      setupABLLanguage(monaco);
      setMonaco(monaco);

      monaco.editor.defineTheme("myTheme", {
        base: "vs",
        inherit: true,
        rules: [],
        colors: {
          "editor.foreground": "#000000",
          "editor.background": "#FFFFFF",
          "editorCursor.foreground": "#8B0000",
          "editor.lineHighlightBackground": "#EFF5FC",
          "editorLineNumber.foreground": "#848484",
          "editorLineNumber.activeForeground": "#C30615",
          "editorLineNumber.activeBackground": "#EFF5FC",
          "editor.selectionBackground": "#0080ff66",
          "editor.inactiveSelectionBackground": "#88000015",
          // "editorIndentGuide.background": "#000000",
        },
      });
      monaco.editor.setTheme("myTheme");
      var editor = monaco.editor.create(document.getElementById(containerId), {
        height: height ?? "100vh",
        // theme: theme ?? "vs",
        language: lang ?? "abl",
        fontSize: fontSize ?? "13px",
        fontFamily: fontFamily ?? "Monospace",
        automaticLayout: true,
        tabSize: tabSize ?? 4,
        minimap: { enabled: showMinimap ?? false },
        showUnused: true,
        tabCompletion: true,
        autoIndent: "full",
        detectIndentation: true,
        formatOnType: true,
        formatOnPaste: true,
        rulers: showRuler && rulerSize ? [rulerSize] : [],
        scrollBeyondLastLine: false,
        extraEditorClassName: "custom-style",
        readOnly: false,
      });

      setEditor(editor);
      setMonacoEditor(editor);
      editorRef.current = editor;
      ref = editorRef.current;

      setupEditor({
        monaco,
        editor,
        code,
        setCode,
        setCursorPosition,
        setSelectedText,
        fileHandle,
        setFileHandle,
        setFile,
        payload,
        state,
        setStructure,
      });
    }
  }, [monaco]);

  const showFileData = async (fileHandle) => {
    const fileDetail = fileHandle
      ? await getFileText(fileHandle)
      : { contents: code };

    if (fileHandle && monacoEditor)
      setupEditor({
        monaco,
        editor: monacoEditor,
        code: fileDetail?.contents,
        setCode,
        setCursorPosition,
        setSelectedText,
        fileHandle,
        setFileHandle,
        setFile,
        payload,
        state,
        setStructure,
      });
  };

  React.useEffect(() => {
    showFileData(fileHandle);
  }, [state, fileHandle]);

  // React.useEffect(() => {

  //   if (monacoEditor && state?.fileOpenMode !== "local") {
  //     console.log(state?.fileOpenMode);
  //     setupEditor({
  //       monaco,
  //       editor: monacoEditor,
  //       code: code,
  //       setCode,
  //       setCursorPosition,
  //       setSelectedText,
  //       fileHandle: null,
  //       setFileHandle,
  //       setFile,
  //       payload,
  //       state,
  //       setStructure,
  //     });
  //   }
  // }, [state]);

  return (
    <div
      id={containerId}
      style={{
        height: height ?? "100vh",
        width: "100%",
        textAlign: "left",
        // position: "absolute",
        display: "flex",
        flexGrow: 1,
      }}
    ></div>
  );
}
