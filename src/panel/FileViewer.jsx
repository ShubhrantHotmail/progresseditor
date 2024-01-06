import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Button,
  Col,
  Divider,
  Image,
  Input,
  Modal,
  Row,
  Space,
  Switch,
  Table,
  Typography,
  message,
  notification,
} from "antd";
import SplitPane from "react-split-pane-v2";
import "./style.css";
import ProEditor from "../editor/ProEditor";
import EditorFooter from "./Footer";
import Pane from "react-split-pane-v2/lib/Pane";

import Loader from "./Loader";
import CodeStructure from "./CodeStructure";
import {
  getFileIcon,
  getLang,
  setDynamicCompletion,
  setupEditor,
} from "../lib/editorConfig";
import { getCodeStructure } from "../lib/editorOperations";
import { theme } from "antd";
import { DownloadOutlined, TableOutlined } from "@ant-design/icons";
import { GlobalContext } from "../GlobalContext";
import { ENDPOINT } from "../lib/endpoints";
import { Request, downloadAsync, download } from "../lib/apiRequest";
import ThemeChanger from "./ThemeChanger";
import ControlButton from "./ControlButton";
import { FullFile, Refresh } from "../lib/Symbols";

const { useToken } = theme;

function FileViewer() {
  const param = useParams("token");
  const [fileDetails, setFileDetails] = React.useState(param ?? {});

  const { token } = useToken();
  const [state, payload] = React.useContext(GlobalContext);
  const [tableData, setTable] = React.useState({
    data: null,
    column: null,
  });
  const [fileHandle, setFileHandle] = React.useState(null);
  const [code, setCode] = React.useState("");
  const [fileText, setFileText] = React.useState("");
  const [fileSize, setFileSize] = React.useState("0 Bytes");
  const [file, setFile] = React.useState("Untitled");
  const [pos, setPos] = React.useState(0);
  const [startLineNum, setStartLineNum] = React.useState(0);
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
  const [editorProps, setEditorProps] = React.useState({
    fontSize: "13",
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
  const [autoSync, setAutoSync] = React.useState({
    checked: false,
    value: 60,
    interval: null,
  });

  const lineFunction = (lineNum, startNum) => {
    if (startNum === 0) return lineNum;
    return startNum + lineNum - 1;
  };
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

  React.useEffect(() => {
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

      editor.focus();

      recordCodeStructure();

      if (Number(pos) && cursorPosition?.lineNumber <= 1) {
        editor.revealLineInCenter(Number(pos));
        editor.setPosition({ lineNumber: Number(pos), column: 1 });
      } else {
        editor.revealLineInCenter(cursorPosition?.lineNumber);
        editor.setPosition(cursorPosition);
      }
      //   console.log(monaco.editor.tokenize(fileText, "log"));
      if (file && file !== "Untitled") {
        const lang = getLang(file);
        handleEditorContextChange("lang", lang);
      }
    }
  }, [fileText]);

  const fetchObjectData = async (file) => {
    // setFile(object);

    setLoading({ ...loading, main: true });
    const res = await Request({
      url: ENDPOINT.handleFileApi("read", file, 200, "tail"),
    });
    // console.log(res);

    setFileText(res?.fileContent);
    setStartLineNum(res?.startLine);
    setFileSize(res?.fileSize);
    setLoading({ ...loading, main: false });
    setFileHandle(null); // Reset local file handle
    console.log(cursorPosition);

    payload({ type: "FILE_OPEN_MODE", value: "remote" });
    payload({ type: "REMOTE_FILE", value: file });
    payload({ type: "SAVED", value: true });
    payload({ type: "FILE_STATE", value: "new" });

    if (res?.startLine > 0) {
      notification.info({
        message: "Large File Encountered",
        description: (
          <Space direction="vertical">
            <span>Showing last 200 lines from the file</span>
            <Button>Load Full File</Button>
          </Space>
        ),
        placement: "bottomRight",
        duration: 0,
      });
    }
  };

  const fetchRtbObject = async (object, version) => {
    // setFile(object);
    setLoading({ ...loading, main: true });
    const res = await Request({
      url: ENDPOINT.fetchRtbObject(object, version),
    });
    // console.log(res);

    setFileText(res?.fileContent);
    setStartLineNum(0);
    setLoading({ ...loading, main: false });
    setFileHandle(null); // Reset local file handle
    payload({ type: "FILE_OPEN_MODE", value: "rtb" });
    payload({ type: "REMOTE_FILE", value: object });
    payload({ type: "SAVED", value: true });
    payload({ type: "FILE_STATE", value: "new" });
  };

  const downloadFile = async () => {
    if (startLineNum > 1) {
      Modal.confirm({
        title: "Download File",
        content: `The size of this file is ${fileSize} and currently it is showing only last 200 lines. Do you want to download full file?`,
        cancelText: "No, only what is shown",
        okText: "Yes, Download full file",
        onCancel: () => download({ fileName: file, fileContent: fileText }),
        onOk: () => downloadAsync(file),
      });
      return;
    }
    download({ fileName: file, fileContent: fileText });
  };
  function generateExcelColumnHeaders(columnCount) {
    const headers = [];
    for (let i = 0; i < columnCount; i++) {
      headers.push({
        key: i,
        title: String.fromCharCode(65 + i),
        dataIndex: `cell_${i}`,
      });
    }
    console.log(headers);
    return headers;
  }

  const tableView = async () => {
    const lines = fileText.split("\n");
    let columnCount = lines?.[0]?.split(",")?.length;
    const data = lines?.map((line) => {
      const row = {};
      line?.split(",")?.map((cell, index) => {
        // const cellObj = {};
        row[`cell_${index}`] = cell;
        // row.push(cellObj);
      });
      return row;
    });
    console.log(data, columnCount);
    setTable({
      column: null,
      data,
      column: generateExcelColumnHeaders(columnCount),
    });
  };

  React.useEffect(() => {
    // console.log(atob(param.token), fileDetails);
    if (fileDetails?.token) {
      // try {
      const token = JSON.parse(atob(fileDetails?.token));
      //   setFileDetails(token);
      if (token?.file) {
        const fileArray = token?.file?.split("/");
        document.title = fileArray[fileArray?.length - 1] + " (READ-ONLY)";
        setFile(token?.file);
      } else {
        document.title = `${token?.object} (${token?.version})`;
        setFile(`[V-${token?.version}] ${token?.object}`);
      }
      if (cursorPosition?.lineNumber <= 1) setPos(token?.pos ?? 1);
      // console.log("Fetch file.....");

      if (token?.readMode === "readrtb")
        fetchRtbObject(token?.object, token?.version);
      else {
        fetchObjectData(token?.file);
      }
      // } catch (error) {
      //   console.error(
      //     "File viewer received invalid token for file properties",
      //     atob(param.token)
      //   );
      // }
    }
  }, [fileDetails]);

  useEffect(() => {
    if (editor) {
      // console.log("editor found");
      editor.updateOptions({
        lineNumbers: (lineNumber) => lineFunction(lineNumber, startLineNum),
      });
    }
  }, [editor, startLineNum]);

  useEffect(() => {
    if (autoSync.checked) {
      if (autoSync.value < 30 && autoSync.interval) {
        clearInterval(autoSync.interval);
        message.error("Sync interval should be smaller than 30 seconds");
        return;
      }
      const interval = setInterval(() => {
        // fetchObjectData(file);
        console.log(new Date(), "Syncing file...");
      }, autoSync.value * 1000);
      setAutoSync({ ...autoSync, interval: interval });
    } else {
      clearInterval(autoSync.interval);
      setAutoSync({ ...autoSync, interval: null });
      console.log("Auto sync disabled");
    }
  }, [autoSync.checked, autoSync.value]);

  return (
    <Loader loading={loading.main} message="Loading.....">
      <div>
        <Row style={{ borderBottom: `1px solid ${token.colorBorder}` }}>
          <Col span={16}>
            <Space>
              {/* <FileTypeTag mode={state?.fileOpenMode} /> */}
              <Typography.Text style={{ fontSize: 12, marginLeft: 12 }} strong>
                <Image src={getFileIcon(file)} preview={false} width={12} />{" "}
                {file}
              </Typography.Text>
              <Divider type="vertical" />
              <Typography.Text style={{ fontSize: 12 }} strong>
                Size: {fileSize}
              </Typography.Text>
              <Divider type="vertical" />
              {!tableData?.data ? (
                <ControlButton
                  icon={<TableOutlined />}
                  size="small"
                  text="Table View"
                  callback={tableView}
                  style={{ color: token.colorPrimaryActive }}
                />
              ) : (
                <ControlButton
                  icon={<TableOutlined />}
                  size="small"
                  text="Raw View"
                  callback={() => {
                    setTable({ ...tableData, data: null });
                    setFileText(fileText);
                  }}
                  style={{ color: token.colorPrimaryActive }}
                />
              )}
            </Space>
          </Col>
          <Col span={8} style={{ textAlign: "right" }}>
            <Space>
              <ControlButton
                icon={<DownloadOutlined />}
                size="small"
                text="Download"
                callback={downloadFile}
                style={{ color: token.colorPrimaryActive }}
              />
              <Divider type="vertical" style={{ margin: 0 }} />
              <Switch
                size="small"
                checked={autoSync.checked}
                onChange={(checked) =>
                  setAutoSync({ ...autoSync, checked: checked })
                }
              />
              <Typography.Text>Auto Sync</Typography.Text>
              <Input
                type="number"
                placeholder="Seconds"
                value={autoSync.value}
                size="small"
                style={{ width: 64 }}
                onChange={(e) =>
                  setAutoSync({ ...autoSync, value: e.target.value })
                }
                disabled={autoSync.checked === false}
              />
              <Typography.Text>Sec</Typography.Text>
              <Divider type="vertical" style={{ margin: 0 }} />
              <ControlButton
                icon={<Refresh />}
                size="small"
                type="primary"
                tooltip={startLineNum === 0 ? "Reload File" : "Sync File"}
                text={startLineNum === 0 ? "Reload" : "Sync"}
                callback={() => fetchObjectData(file)}
              />
              <Divider type="vertical" style={{ margin: 0 }} />
              <ControlButton
                icon={<FullFile />}
                size="small"
                tooltip="Load Full File"
                text="Load Full"
              />
            </Space>
          </Col>
        </Row>
        <SplitPane>
          <Pane>
            {/* {tableData?.data ? ( */}
            <div
              style={
                !tableData?.data ? { display: "none" } : { display: "block" }
              }
            >
              <Table
                dataSource={tableData?.data}
                columns={tableData?.column ?? []}
                size="small"
                scroll={{ x: "80%" }}
                bordered
                borderColor="#000"
              />
            </div>
            {/* ) : ( */}
            <div
              style={
                tableData?.data ? { display: "none" } : { display: "block" }
              }
            >
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
                readOnly={true}
                lineFunction={(lineNumber) =>
                  lineFunction(lineNumber, startLineNum)
                }
                firstLineNumber={startLineNum}
              />
            </div>
            {/* )} */}
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
        <EditorFooter
          position={cursorPosition}
          editorProps={editorProps}
          callback={handleEditorContextChange}
          file={file}
          size={fileSize}
          codeList={codeList}
          setCodeList={setCodeList}
          currentIndex={currentIndex}
          showThemeChanger={true}
        />
      </div>
    </Loader>
  );
}

export default FileViewer;
