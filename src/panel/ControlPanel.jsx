// import Button from "../editor/Button";
import React from "react";
import { Col, Dropdown, Row, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import {
  AddNew,
  CheckSyntax,
  DotVertical,
  FileDiff,
  Fix,
  OpenFolder,
  Rcode,
  Save,
  SaveAs,
  Setting,
} from "../lib/Symbols";
import ControlButton from "./ControlButton";
import { saveFile, saveAsFile, OpenFile } from "../lib/editorOperations";
import { GlobalContext } from "../GlobalContext";
import EditorSettings from "./EditorSettings";
import { theme } from "antd";
import ThemeChanger from "./ThemeChanger";
import DiffProEditor from "../editor/DiffProEditor";
import RemoteFS from "./RemoteExplorer";
import GoogleSearchWrapper from "./GoogleSearchWrapper";

const { useToken } = theme;
// import { SaveAs } from "../lib/editorOperations";
// import { FileSystemDirectoryEntry } from "typescript/lib/lib.dom";
export default function ControlPanel(props) {
  const {
    editor,
    monaco,
    setFileText,
    setFile,
    fileHandle,
    setFileHandle,
    loading,
    setLoading,
  } = props;
  const { token } = useToken();
  const [state, payload] = React.useContext(GlobalContext);
  const [open, setOpen] = React.useState(false);
  const [openDiff, setOpenDiff] = React.useState(false);
  const [openRemoteFs, setOpenRemoteFs] = React.useState(false);
  const [openRtb, setOpenRtb] = React.useState(false);
  return (
    <div
      style={{
        width: "100%",
        borderBottom: `1px solid ${token.colorBorder}`,
        textAlign: "left",
        // paddingLeft: 8,
        boxSizing: "border-box",
        backgroundColor: `${token.colorBgLayout}`,
      }}
    >
      <Row>
        <Col span={8} style={{ textAlign: "left" }}>
          <Space size={1}>
            {/* <ControlButton
              tooltip="Add New File"
              icon={<AddNew />}
              text="New"
            /> */}
            <ControlButton
              tooltip="Open File"
              icon={<OpenFolder />}
              callback={() =>
                // OpenFile(setFileHandle, setFile, setCode, payload)
                setOpenRemoteFs(true)
              }
            />
            <ControlButton
              tooltip="Save File"
              icon={<Save />}
              callback={() =>
                saveFile(
                  setFileHandle,
                  fileHandle,
                  editor,
                  setFile,
                  setFileText,
                  payload,
                  state
                )
              }
            />
            <ControlButton
              tooltip="Save As"
              icon={<SaveAs />}
              callback={() =>
                saveAsFile(
                  setFileHandle,
                  editor,
                  setFile,
                  setFileText,
                  payload,
                  state
                )
              }
            />

            <Dropdown.Button
              type="default"
              // size="small"
              icon={<DotVertical />}
              // onClick={() => handleRun(item)}
              trigger={["click"]}
              // disabled={connError}
              menu={{
                items: [
                  {
                    key: "uppercase",
                    label: "Keyword Uppercase",
                    // disabled: inProgress === true,
                    // onClick: () => handleBuild(item, "edit"),
                  },
                  {
                    key: "lowercase",
                    label: "Keyword Lowercase",
                    // onClick: () => handleBuild(item, "share"),
                  },
                ],
              }}
              // style={{ backgroundColor: "#ddd" }}
              title="Format code"
            >
              <Fix />
            </Dropdown.Button>
            <Dropdown.Button
              disabled={state?.fileOpenMode === "local"}
              type="default"
              // size="small"
              icon={<DotVertical />}
              // onClick={() => handleRun(item)}
              trigger={["click"]}
              // disabled={connError}
              menu={{
                items: [
                  {
                    key: "xref",
                    label: "With Xref",
                    // disabled: inProgress === true,
                    // onClick: () => handleBuild(item, "edit"),
                  },
                  {
                    key: "list",
                    label: "With Listing",
                    // onClick: () => handleBuild(item, "share"),
                  },
                ],
              }}
              // style={{ backgroundColor: `${token.colorBorderSecondary}` }}
              title="Compile"
            >
              <Rcode />
            </Dropdown.Button>

            <ControlButton tooltip="Check Syntax" icon={<CheckSyntax />} />
            <ControlButton
              tooltip="File Diff"
              icon={<FileDiff />}
              callback={() => setOpenDiff(true)}
            />
            <ControlButton
              tooltip="RTB Tasks and Google Search"
              text="RTB"
              // icon={<SearchOutlined />}
              callback={() => setOpenRtb(true)}
              style={{
                border: `1px solid ${token.colorBorder}`,
                color: `${token.colorLink}`,
                fontWeight: "500",
              }}
            />
          </Space>
        </Col>
        <Col span={8} style={{ textAlign: "center" }}>
          {/* <Search
            placeholder="RTB Google Search On The Go"
            size="small"
            style={{ marginTop: 4 }}
          /> */}
        </Col>
        <Col span={8} style={{ textAlign: "right", paddingRight: 8 }}>
          <Space>
            <ThemeChanger
              style={{ width: 140, textAlign: "left" }}
              bordered={false}
            />
            <ControlButton
              tooltip="Settings"
              icon={<Setting />}
              text="Settings"
              callback={() => setOpen(true)}
            />
          </Space>
        </Col>
      </Row>
      <EditorSettings open={open} setOpen={setOpen} />
      <DiffProEditor open={openDiff} setOpen={setOpenDiff} monaco={monaco} />
      <RemoteFS
        open={openRemoteFs}
        setOpen={setOpenRemoteFs}
        setFile={setFile}
        setFileHandle={setFileHandle}
        setFileText={setFileText}
      />
      <GoogleSearchWrapper
        open={openRtb}
        setOpen={setOpenRtb}
        setFile={setFile}
        setFileHandle={setFileHandle}
        setFileText={setFileText}
        loading={loading}
        setLoading={setLoading}
      />
    </div>
  );
}
