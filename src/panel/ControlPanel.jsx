// import Button from "../editor/Button";
import React from "react";
import {
  Avatar,
  Button,
  Col,
  Dropdown,
  Image,
  Input,
  Row,
  Select,
  Space,
  Tooltip,
  Typography,
} from "antd";
import { DownOutlined, CaretDownOutlined } from "@ant-design/icons";
import OpenFolderColor from "../icons/OpenFolderColor.png";
import SaveColor from "../icons/SaveColor.png";
import NewFileColor from "../icons/NewFileColor.png";
import RcodeIcon from "../icons/RCode.png";
import { useState } from "react";
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
} from "../lib/Symbols";
import ControlButton from "./ControlButton";
import { saveFile, saveAsFile, OpenFile } from "../lib/editorOperations";
import { GlobalContext } from "../GlobalContext";
// import { SaveAs } from "../lib/editorOperations";
// import { FileSystemDirectoryEntry } from "typescript/lib/lib.dom";
export default function ControlPanel(props) {
  const {
    editor,
    editorProps,
    callback,
    code,
    setCode,
    file,
    setFile,
    fileHandle,
    setFileHandle,
  } = props;
  const [state, payload] = React.useContext(GlobalContext);

  return (
    <div
      style={{
        width: "100%",
        borderBottom: "1px solid #eee",
        textAlign: "left",
        // paddingLeft: 8,
        boxSizing: "border-box",
        backgroundColor: "#f4f4f4",
      }}
    >
      <Row>
        <Col span={8} style={{ textAlign: "left" }}>
          <Space size={1}>
            <ControlButton
              tooltip="Add New File"
              icon={<AddNew />}
              text="New"
            />
            <ControlButton
              tooltip="Open File"
              icon={<OpenFolder />}
              callback={() =>
                OpenFile(setFileHandle, setFile, setCode, payload)
              }
            />
            <ControlButton
              tooltip="Save File"
              icon={<Save />}
              callback={() => saveFile(fileHandle, editor, state)}
            />
            <ControlButton
              tooltip="Save As"
              icon={<SaveAs />}
              callback={() => saveAsFile(setFileHandle, editor, state)}
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
              style={{ backgroundColor: "#ddd" }}
              title="Compile"
            >
              <Rcode />
            </Dropdown.Button>

            <ControlButton tooltip="Check Syntax" icon={<CheckSyntax />} />
            <ControlButton tooltip="File Diff" icon={<FileDiff />} />
          </Space>
        </Col>
        <Col span={8} style={{ textAlign: "center" }}></Col>
        <Col span={8} style={{ textAlign: "right" }}>
          <Space></Space>
        </Col>
      </Row>
    </div>
  );
}
