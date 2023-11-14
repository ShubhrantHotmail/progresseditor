import React, { useEffect } from "react";
// import ResizePanel from "react-resize-panel";
import SplitPane from "react-split-pane-v2";

import "./style.css";
import ProEditor from "../editor/ProEditor";
import EditorFooter from "./Footer";
import Pane from "react-split-pane-v2/lib/Pane";
import Menus from "./Meuns";
import ControlPanel from "./ControlPanel";
import {
  Affix,
  Button,
  Col,
  Row,
  Select,
  Space,
  Spin,
  Tabs,
  Tree,
  Typography,
} from "antd";

import Loader from "./Loader";
import {
  getAllFunctions,
  getAllIOParameters,
  getAllIncludes,
  getAllProcedures,
  getAllVariables,
  getSourceCode,
  getAllCommentedLines,
  getCurlyContent,
  getAssignPos,
} from "../parser/sourceParser";
import CodeStructure from "./CodeStructure";
import { getLang } from "../lib/editorConfig";
import RTBTasks from "./RTBTasks";
import FileExplorer from "./FileExplorer";
import { getCodeStructure } from "../lib/editorOperations";
import { data } from "../data/tradesys.fields";

// let cx = classNames.bind(style);

export default function EditorPanel(params) {
  const [decorations, setDecorations] = React.useState([]);
  const [fileHandle, setFileHandle] = React.useState(null);
  const [code, setCode] = React.useState("");
  const [fileText, setFileText] = React.useState("");
  const [file, setFile] = React.useState("Untitled");
  const [editor, setEditor] = React.useState(null);
  const [monaco, setMonaco] = React.useState(null);
  const [selectedText, setSelectedText] = React.useState("");
  const [cursorPosition, setCursorPosition] = React.useState({
    lineNumber: 1,
    column: 1,
  });
  const [editorProps, setEditorProps] = React.useState({
    fontSize: "13",
    fontFamily: "Monospace",
    lang: "abl",
  });

  const [loading, setLoading] = React.useState({
    main: false,
    tasks: false,
    object: false,
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

  function moreFormattig(codeText) {
    const parsedCode = getSourceCode(codeText);
    const includeFiles = getAllIncludes(parsedCode, editor);
    const definedVariables = getAllVariables(parsedCode, editor);
    const ioParameters = getAllIOParameters(parsedCode, editor);
    const procedures = getAllProcedures(parsedCode, editor);
    const functions = getAllFunctions(parsedCode, editor);
    // const comments = getAllCommentedLines(parsedCode, editor);
    const curls = getCurlyContent(parsedCode, editor);

    // const decor = [...curls, ...comments];
    const decor = [curls];

    const decoration = [];
    /*
    for (let i = 0; i < decor.length; i += 1) {
      const pos = decor[i];
      if (
        !pos.startLineNumber ||
        !pos.startColumn ||
        !pos.endLineNumber ||
        !pos.endColumn
      )
        continue;
      const codeRange = new monaco.Range(
        pos.startLineNumber,
        pos.startColumn,
        pos.endLineNumber,
        pos.endColumn
      );
      decoration.push({
        range: codeRange,
        options: { inlineClassName: pos?.class },
      });
    }
    */
    if (decoration.length > 0) {
      /**
       *  Save decoration to a variable handle so that the same will be cleared
       *  in the next action and overwritten with new decoration
       *  deltaDecorations: 1st argument is for the previous decorations to remove
       *                    2nd argument is for new decorations to apply
       */
      console.log(decorations, decoration);
      const newDecorations = editor.deltaDecorations([], decoration);

      setDecorations(newDecorations);
    }
    // editor.createDecorationsCollection([...decoration]);
    setStructure({
      ...structure,
      includeFiles,
      definedVariables,
      ioParameters,
      procedures,
      functions,
      decor,
    });
  }

  const recordCodeStructure = () => {
    const data = getCodeStructure(editor);
    setStructure({
      ...structure,
      ...data,
    });
  };

  useEffect(() => {
    // console.log(editor, fileText);
    if (editor) {
      editor.setValue(fileText);
      // moreFormattig(fileText);
      recordCodeStructure();
    }
  }, [fileText]);

  useEffect(() => {
    // s.log("More formatting");
    // if (editor) editor.setValue(code);
    // moreFormattig(code);
    // const fields = [];
    // data.map((field) => {
    //   fields.push({
    //     table: field.tableName,
    //     columns: field.fieldName["Progress.Json.ObjectModel.JsonArray"].ObjData,
    //   });
    // });
    // console.log(fields);
  }, [code]);

  useEffect(() => {
    if (file && file !== "Untitled") {
      // console.log("File", file);
      const lang = getLang(file);
      handleEditorContextChange("lang", lang);
    }
  }, [file]);

  const handleResize = (size) => {
    const editorWidth = `${size[1] / 100}px`;
    // console.log(size, editorWidth);

    setEditorProps({ ...editorProps, width: editorWidth });
  };
  return (
    <Loader loading={loading.main} message="Loading.....">
      <div className="monaco-editor" style={{ height: "calc(93vh + 6px)" }}>
        <div>
          {/* <input type="file" /> */}
          {/* <Menus monaco={monaco} editor={editor} /> */}
          <ControlPanel
            editor={editor}
            callback={handleEditorContextChange}
            editorProps={editorProps}
            code={fileText}
            setCode={setFileText}
            file={file}
            setFile={setFile}
            fileHandle={fileHandle}
            setFileHandle={setFileHandle}
          />
        </div>
        <SplitPane split="vertical">
          <Pane
            minSize="180px"
            maxSize="280px"
            style={{
              height: "100%",
              backgroundColor: "#f8f8f8",
              overflowY: "auto",
            }}
          >
            <CodeStructure structure={structure} editor={editor} />
          </Pane>
          <Pane
            minSize="55%"
            maxSize="100%"
            // style={{ height: "calc(100vh - 65px)",backgroundColor: "#f8f8f8" }}
            id="container"
          >
            <Loader loading={loading.object}>
              <ProEditor
                // theme="vs-dark"
                width={editorProps.width}
                height="calc(100vh - 55px)"
                code={code}
                setMonaco={setMonaco}
                setEditor={setEditor}
                setCode={setCode}
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
          <Pane>
            <Row>
              <Col span={24}>
                <Loader loading={loading.tasks}>
                  <Tabs
                    type="card"
                    style={{
                      margin: 0,
                      padding: 0,
                      backgroundColor: "#f8f8f8",
                    }}
                    size="small"
                    items={[
                      {
                        key: "rtb",
                        label: "RTB Tasks",
                        children: (
                          <div style={{ height: "70vh", overflowY: "auto" }}>
                            <RTBTasks
                              loading={loading}
                              setLoading={setLoading}
                              setFileText={setFileText}
                              setFile={setFile}
                            />
                          </div>
                        ),
                      },
                      {
                        key: "files",
                        label: "My Files",
                        children: (
                          <FileExplorer
                            loading={loading}
                            setLoading={setLoading}
                            setFileText={setFileText}
                            setFile={setFile}
                          />
                        ),
                      },
                    ]}
                  />
                </Loader>
              </Col>
              <Col
                span={24}
                style={{
                  height: 120,
                  borderTop: "1px solid #ddd",
                  overflowY: "auto",
                }}
              >
                {/* <ProEditor
                  setMonaco={setLogMonaco}
                  setEditor={setLogEditor}
                  setCode={setLogText}
                  setSelectedText={setSelectedLogText}
                  setCursorPosition={setLogCursorPosition}
                  lang="python"
                /> */}
              </Col>
            </Row>
          </Pane>
        </SplitPane>
        <div style={{ height: "24px" }}>
          <EditorFooter
            position={cursorPosition}
            editorProps={editorProps}
            callback={handleEditorContextChange}
            file={file}
          />
        </div>
      </div>
    </Loader>
  );
}
