import React, { useEffect } from "react";
import SplitPane from "react-split-pane-v2";

import "./style.css";
import ProEditor from "../editor/ProEditor";
import EditorFooter from "./Footer";
import Pane from "react-split-pane-v2/lib/Pane";
import ControlPanel from "./ControlPanel";

import Loader from "./Loader";
import CodeStructure from "./CodeStructure";
import {
  getLang,
  setDynamicCompletion,
  setupEditor,
} from "../lib/editorConfig";
import { getCodeStructure } from "../lib/editorOperations";
import { Col, Row, Tabs, theme } from "antd";
import { GlobalContext } from "../GlobalContext";
import RTBTasks from "./RTBTasks";
import FileExplorer from "./FileExplorer";
import FileList from "./FileList";

const { useToken } = theme;

export default function EditorPanel(params) {
  const { token } = useToken();
  const [state, payload] = React.useContext(GlobalContext);
  // const [decorations, setDecorations] = React.useState([]);
  const [fileHandle, setFileHandle] = React.useState(null);
  const [code, setCode] = React.useState("");
  const [fileText, setFileText] = React.useState("");
  const [readText, setReadText] = React.useState("");
  const [file, setFile] = React.useState("Untitled");
  const [editor, setEditor] = React.useState(null);
  const [monaco, setMonaco] = React.useState(null);
  const [mode, setMode] = React.useState("explorer");
  const [codeList, setCodeList] = React.useState([]);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [selectedText, setSelectedText] = React.useState("");
  const [cursorPosition, setCursorPosition] = React.useState({
    lineNumber: 1,
    column: 1,
  });

  const [codeRead, setCodeRead] = React.useState("");
  // const [fileRead, setFileRead] = React.useState("Untitled");
  const [editorRead, setEditorRead] = React.useState(null);
  const [monacoRead, setMonacoRead] = React.useState(null);
  const [selectedTextRead, setSelectedTextRead] = React.useState("");
  const [cursorPositionRead, setCursorPositionRead] = React.useState({
    lineNumber: 1,
    column: 1,
  });
  const [editorProps, setEditorProps] = React.useState({
    fontSize: "14",
    fontFamily: "Monospace",
    lang: "abl",
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

  const [loading, setLoading] = React.useState({
    main: false,
    tasks: false,
    object: false,
  });

  const handleEditorContextChange = (context, value) => {
    // console.log(editorProps);
    switch (context) {
      case "fontsize":
        setEditorProps({ ...editorProps, fontSize: value });
        if (editor) editor.updateOptions({ fontSize: value });
        // if (editorRead) editorRead.updateOptions({ fontSize: value });
        break;
      case "fontfamily":
        setEditorProps({ ...editorProps, fontFamily: value });
        if (editor) editor.updateOptions({ fontFamily: value });
        // if (editorRead) editorRead.updateOptions({ fontFamily: value });

        break;
      case "lang":
        // console.log(monaco.editor.getModels());
        setEditorProps({ ...editorProps, lang: value });

        monaco.editor.setModelLanguage(monaco.editor.getModels()[0], value);
        // monaco.editor.setModelLanguage(monaco.editor.getModels()[1], value);

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
    if (fileText === null) return;
    if (editor) {
      // editor.setValue(fileText);
      const fileEditMode = state?.fileState ?? "new";
      setMode("code");
      // console.log(fileEditMode, file);
      if (fileEditMode === "new") {
        const codeObject = {
          fileIndex: codeList.length + 1,
          fileName: file,
          originalText: fileText,
          modifiedText: fileText,
          filePath: state?.remoteFile,
          fileSource: state?.fileOpenMode,
          saved: true,
        };
        setCodeList([...codeList, codeObject]);
        setCurrentIndex(codeList.length + 1);
        payload({ type: "FILE_LIST", value: [...codeList, codeObject] });
        // localStorage.setItem("currentFile", JSON.stringify(codeObject));
      }
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
      console.log(monaco.editor.tokenize(fileText, "log"));
      if (file && file !== "Untitled") {
        const lang = getLang(file);
        handleEditorContextChange("lang", lang);
      }
    }
  }, [fileText]);

  useEffect(() => {
    // console.log("UseEffect");
    if (readText === null) return;
    if (editorRead) {
      setupEditor({
        monaco: monacoRead,
        editor: editorRead,
        code: readText,
        setCode: setCodeRead,
        setFileText: setReadText,
        setCursorPosition: setCursorPositionRead,
        setSelectedText: setSelectedTextRead,
        fileHandle,
        setFileHandle,
        setFile,
        payload,
        state,
        setStructure,
      });

      if (file && file !== "Untitled") {
        const lang = getLang(file);
        handleEditorContextChange("lang", lang);
      }
    }
  }, [readText]);

  return (
    <Loader loading={loading.main} message="Loading.....">
      <ControlPanel
        editor={editor}
        monaco={monaco}
        setFileText={setFileText}
        setFile={setFile}
        fileHandle={fileHandle}
        setFileHandle={setFileHandle}
        loading={loading}
        setLoading={setLoading}
      />
      <SplitPane split="vertical">
        <Pane
          minSize="180px"
          maxSize="400px"
          style={{
            height: "100%",
            backgroundColor: `${token.colorBgLayout}`,
            overflowY: "auto",
          }}
        >
          <FileList
            token={token}
            setMode={setMode}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
            codeList={codeList}
            setCodeList={setCodeList}
            setFileText={setFileText}
            setFile={setFile}
          />
        </Pane>
        <Pane minSize="55%" maxSize="100%" id="container">
          <Row
            style={
              mode === "explorer" ? { display: null } : { display: "none" }
            }
          >
            <Col span={24}>
              <Tabs
                defaultActiveKey="1"
                tabPosition="top"
                style={{ margin: 8, marginLeft: 8 }}
                items={[
                  {
                    key: "2",
                    label: "RTB Tasks",
                    children: (
                      <>
                        <RTBTasks
                          setFileText={setFileText}
                          setFile={setFile}
                          fileHandle={fileHandle}
                          setFileHandle={setFileHandle}
                          loading={loading}
                          setLoading={setLoading}
                        />
                      </>
                    ),
                  },
                  {
                    key: "1",
                    label: "File Explorer",
                    children: (
                      <>
                        <FileExplorer
                          setFileText={setFileText}
                          setReadText={setReadText}
                          setFile={setFile}
                          fileHandle={fileHandle}
                          setFileHandle={setFileHandle}
                          loading={loading}
                          setLoading={setLoading}
                        />
                      </>
                    ),
                  },
                ]}
              />
            </Col>
            {/* <Divider type="vertical" style={{ height: "93vh" }} />
            <Col span={9}>
              <AIChat />
            </Col> */}
          </Row>
          <Loader loading={loading.object}>
            <div
              style={
                mode === "code" ? { display: "block" } : { display: "none" }
              }
            >
              <SplitPane>
                <Pane>
                  <ProEditor
                    width={editorProps.width}
                    height="calc(100vh - 66px)"
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
            </div>
            {/* <Pane
              minSize="180px"
              maxSize="280px"
              style={{
                height: "100%",
                backgroundColor: `${token.colorBgLayout}`,
                overflowY: "auto",
              }}
            >
              <CodeStructure structure={structure} editor={editor} />
            </Pane> */}
          </Loader>
        </Pane>
        {/* <Pane
          minSize="180px"
          maxSize="280px"
          style={{
            height: "100%",
            backgroundColor: `${token.colorBgLayout}`,
            overflowY: "auto",
          }}
        >
          <CodeStructure structure={structure} editor={editor} />
        </Pane> */}
      </SplitPane>
      <div>
        <EditorFooter
          position={cursorPosition}
          editorProps={editorProps}
          callback={handleEditorContextChange}
          file={file}
          codeList={codeList}
          setCodeList={setCodeList}
          currentIndex={currentIndex}
          showFileDetails={true}
        />
      </div>
    </Loader>
  );
}
