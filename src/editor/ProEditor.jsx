import React, { useCallback, useEffect } from "react";
import "../styles/main.css";

import { useMonaco } from "@monaco-editor/react";
import { setupABLLanguage, setupEditor } from "../lib/editorConfig";
import { getFileText } from "../lib/editorOperations";
import { GlobalContext } from "../GlobalContext";
import { toggleCase, cleanupComments } from "../lib/newFormatter";
import { setLanguageLog } from "../languages/log";

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
    readOnly,
    lineFunction,
    code,
    setMonaco,
    setEditor,
    setCode,
    setFileText,
    setSelectedText,
    setCursorPosition,
    setFile,
    fileHandle,
    setFileHandle,
    setStructure,
    firstLineNumber,
  } = props;

  var containerId = Math.random().toString(16).slice(2);
  const [state, payload] = React.useContext(GlobalContext);
  const [monacoEditor, setMonacoEditor] = React.useState(null);
  const editorTheme = localStorage.getItem("theme");
  const themeTokens = localStorage.getItem("themeTokens");
  const editorRef = React.useRef();

  try {
    var monaco = useMonaco();
  } catch (error) {
    console.error("Monaco Error:", error);
  }

  React.useEffect(() => {
    console.log("UseEffect:", firstLineNumber);
    // if (firstLineNumber !== 0 && monaco) {
    //   console.log(editor.LineNumbersType, lineFunction);
    //   editor.LineNumbersType = lineFunction;
    //   return;
    // }
    if (monaco) {
      const allLangs = monaco?.languages?.getLanguages();
      if (!allLangs.find((lang) => lang?.id === "abl"))
        setupABLLanguage(monaco);
      if (!allLangs.find((lang) => lang?.id === "log")) setLanguageLog(monaco);
      setMonaco(monaco);

      // console.log(monaco?.languages?.getLanguages());
      var editor = monaco.editor.create(document.getElementById(containerId), {
        height: height ?? "100vh",
        language: lang ?? "plaintext",
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
        readOnly: readOnly,
        lineNumbers: lineFunction ?? "on",
        lineNumbersMinChars: 0,
      });

      const tokens = themeTokens ? JSON.parse(themeTokens) : state?.themeTokens;
      if (monaco) {
        monaco.editor.defineTheme("myTheme", tokens);
        monaco.editor.setTheme("myTheme");
      }
      if (lang === "abl") {
        editor.addAction({
          id: "id__format__code",
          label: "Format Code",
          keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyI],
          precondition: null,
          keybindingContext: null,
          contextMenuGroupId: "formatting",
          contextMenuOrder: 0,
          run: () => editor.getAction("editor.action.formatDocument").run(),
        });

        editor.addAction({
          id: "id__keyword__upper__case",
          label: "Change Keyword Upper Case",
          keybindings: [
            monaco.KeyMod.Alt | monaco.KeyMod.Shift | monaco.KeyCode.KeyU,
          ],
          precondition: null,
          keybindingContext: null,
          contextMenuGroupId: "formatting",
          contextMenuOrder: 1,
          run: () => toggleCase(monaco, editor, "upper"),
        });
        editor.addAction({
          id: "id__keyword__lower__case",
          label: "Change Keyword Lower Case",
          keybindings: [
            monaco.KeyMod.Alt | monaco.KeyMod.Shift | monaco.KeyCode.KeyL,
          ],
          precondition: null,
          keybindingContext: null,
          contextMenuGroupId: "formatting",
          contextMenuOrder: 2,
          run: () => toggleCase(monaco, editor, "lower"),
        });
        editor.addAction({
          id: "id__keyword__remove_comments",
          label: "Cleanup Comments",
          keybindings: [
            monaco.KeyMod.Alt | monaco.KeyMod.Shift | monaco.KeyCode.KeyC,
          ],
          precondition: null,
          keybindingContext: null,
          contextMenuGroupId: "formatting",
          contextMenuOrder: 3,
          run: () => cleanupComments(monaco, editor),
        });
      }
      setEditor(editor);
      setMonacoEditor(editor);
      editorRef.current = editor;
      ref = editorRef.current;

      // setupEditor({
      //   monaco,
      //   editor,
      //   code,
      //   setCode,
      //   setFileText,
      //   setCursorPosition,
      //   setSelectedText,
      //   fileHandle,
      //   setFileHandle,
      //   setFile,
      //   payload,
      //   state,
      //   setStructure,
      // });
    }
  }, [monaco]);

  const showFileData = async (fileHandle) => {
    const fileDetail = fileHandle
      ? await getFileText(fileHandle)
      : { contents: code };

    if (fileHandle && monacoEditor) {
      setupEditor({
        monaco,
        editor: monacoEditor,
        code: fileDetail?.contents,
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

      localStorage.setItem("original", fileDetail?.contents);
      console.log(monaco.editor.tokenize(fileDetail?.contents, "log"));
    }
  };

  React.useEffect(() => {
    console.log("UseEffect: 2");
    showFileData(fileHandle);
    // console.log(state);
  }, [fileHandle]);

  React.useEffect(() => {
    console.log("UseEffect: 3");
    const tokens = themeTokens ? JSON.parse(themeTokens) : state?.themeTokens;
    if (monaco) {
      monaco.editor.defineTheme("myTheme", tokens);
      monaco.editor.setTheme("myTheme");
    }
  }, [editorTheme]);

  return (
    <div
      id={containerId}
      style={{
        height: height ?? "100vh",
        width: "100%",
        textAlign: "left",
        display: "flex",
        flexGrow: 1,
      }}
    ></div>
  );
}
