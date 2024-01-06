import React, { useEffect, useRef } from "react";
import {
  Col,
  Row,
  Input,
  Divider,
  Result,
  Image,
  Button,
  Typography,
  Spin,
  theme,
  Table,
  Space,
  Collapse,
  AutoComplete,
  message,
  Dropdown,
  Modal,
  Tag,
  Badge,
} from "antd";
import { createUseStyles } from "react-jss";
import { Request, downloadAsync } from "../lib/apiRequest";
import { ENDPOINT } from "../lib/endpoints";
import { useState } from "react";
import NotFoundImage from "../icons/Oops.jpg";
import {
  FolderOutlined,
  FileTextOutlined,
  FilterOutlined,
  FilterTwoTone,
  ArrowLeftOutlined,
  SyncOutlined,
  LinkOutlined,
  ExportOutlined,
  EditOutlined,
  EllipsisOutlined,
  DownloadOutlined,
  DeleteOutlined,
  FormOutlined,
  ProfileOutlined,
  MoreOutlined,
  CopyOutlined,
  ToolTwoTone,
  FileTextTwoTone,
  MailTwoTone,
  CodeTwoTone,
  FilePptTwoTone,
  FileExcelTwoTone,
  BugTwoTone,
  PlaySquareTwoTone,
  MehOutlined,
  FileAddTwoTone,
  FolderAddTwoTone,
  PlusCircleTwoTone,
} from "@ant-design/icons";

import "../styles/main.css";
import FolderIcon from "../icons/FolderWindows.png";
import { getFileIcon } from "../lib/editorConfig";
import { GlobalContext } from "../GlobalContext";
import ControlButton from "./ControlButton";
import { AIChat } from "./AIChat";
import styled from "styled-components";

const { useToken } = theme;

export default function FileExplorer(props) {
  const { token } = useToken();
  const {
    loading,
    setLoading,
    setFileText,
    setFile,
    setFileHandle,
    setReadText,
  } = props;
  const [currentDir, setCurrentDir] = useState("/");
  const [folderData, setFolderData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [showFilterInput, setShowFilterInput] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const { Search } = Input;
  const [state, payload] = React.useContext(GlobalContext);
  const [spin, setSpin] = React.useState(false);
  const [deleteFile, setDeleteFile] = React.useState({
    mode: "delete",
    open: false,
    file: "",
    loading: false,
  });
  const [fileProperties, setFileProperties] = React.useState({
    open: false,
    file: null,
  });
  const [contextMenu, setContextMenu] = useState({ open: false, x: 0, y: 0 });
  const [headerContextMenu, setHeaderContextMenu] = useState({
    open: false,
    x: 0,
    y: 0,
  });
  var searchMode = "auto";
  const [classes, setClasses] = React.useState(null);
  const lastOpenedDirectory =
    localStorage.getItem("lastDirectory") ?? "/home/sn3";
  const searchList = JSON.parse(localStorage.getItem("searchList")) ?? [];
  const [searchHistory, setSearchHistory] = React.useState(searchList);
  const [options, setOptions] = React.useState([]);
  const [rename, setRename] = React.useState({
    open: false,
    fileObject: null,
    newname: "",
  });
  const [addFile, setAddFile] = React.useState({
    open: false,
    loading: false,
    newname: "",
  });
  const [copyMove, setCopyMove] = React.useState({
    mode: "copy",
    open: false,
    fileObject: null,
    newfullpath: "",
  });
  const [selectedRowKeys, setSelectedRowKeys] = React.useState([]);

  const fileRef = useRef(null);
  const styles = createUseStyles({
    selectedrow: {
      backgroundColor: state?.themeTokens?.antThemeToken?.colorInfoBgHover,
    },
  });
  const newclass = styles();

  useEffect(() => {
    console.log(state);
    setClasses(newclass);
  }, [state]);

  function unsecuredCopyToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand("copy");
      message.success("File link has been copied to clipboard");
    } catch (err) {
      message.error("Failed to copy text to clipboard:", err);
    }
    document.body.removeChild(textArea);
  }

  const selectRow = (record) => {
    const newSelectedRowKeys = [...selectedRowKeys];
    if (newSelectedRowKeys.indexOf(record.key) >= 0) {
      newSelectedRowKeys.splice(newSelectedRowKeys.indexOf(record.key), 1);
    } else {
      newSelectedRowKeys.push(record.key);
    }
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const handleFile = (mode, file) => {
    const fileObj = {
      file,
      mode: "read",
      loadFull: true,
    };
    const encodedText = btoa(JSON.stringify(fileObj));
    // console.log(encodedText);
    const fileUrl = `http://tisdev/apps/proeditor/view/${encodedText}`;
    if (mode === "link") {
      // navigator.clipboard
      //   .writeText(fileUrl)
      //   .then(() => {
      //     // console.log("Text copied to clipboard");
      //     message.success("File link has been copied to clipboard");
      //   })
      //   .catch((error) => {
      //     message.error("Failed to copy text to clipboard:", error);
      //   });
      unsecuredCopyToClipboard(fileUrl);
    } else {
      window.open(fileUrl, "_blank");
    }
  };

  const renameFile = async () => {
    setRename({ ...rename, loading: true });
    const res = await Request({
      url: ENDPOINT.fileOperationApi(),
      method: "post",
      data: {
        fullpath: rename?.fileObject?.fullpath,
        newname: rename?.newname,
        action: "rename",
      },
    });

    if (res?.type === "error") {
      Modal.error({ title: "Operation Failed", content: res?.message });
      setRename({ fileObject: null, open: false, newname: "", loading: false });
      return;
    }
    const fileIndex = filteredData?.findIndex(
      (file) => file.filename === rename?.fileObject?.filename
    );
    console.log(fileIndex);

    filteredData[fileIndex].filename = res?.filename;
    filteredData[fileIndex].fullpath = res?.fullpath;
    setRename({ fileObject: null, open: false, newname: "", loading: false });
  };
  const showContextMenu = (rec, event) => {
    event.preventDefault();

    // if (!contextMenu.open) {
    document.addEventListener(`click`, function onClickOutside() {
      setContextMenu({ visible: false });
      document.removeEventListener(`click`, onClickOutside);
    });
    // }

    setSelectedRow(rec);
    setContextMenu({
      open: true,
      x: event.clientX,
      y: event.clientY > 600 ? 600 : event.clientY,
    });
  };

  const showHeaderContextMenu = (event) => {
    event.preventDefault();

    // if (!contextMenu.open) {
    document.addEventListener(`click`, function onClickOutside() {
      setHeaderContextMenu({ visible: false });
      document.removeEventListener(`click`, onClickOutside);
    });
    // }

    setHeaderContextMenu({
      open: true,
      x: event.clientX,
      y: event.clientY > 600 ? 600 : event.clientY,
    });
  };

  const fsColumns = [
    {
      key: 0,
      title: "Name",
      dataIndex: "filename",
      width: 600,
      render: (_, rec) => {
        return (
          <>
            {rec?.fileindx === 0 ? (
              <Image src={FolderIcon} preview={false} width={20} />
            ) : (
              <Image
                src={getFileIcon(rec?.filename)}
                preview={false}
                width={14}
              />
            )}
            <Typography.Link
              style={{ marginLeft: 12, fontSize: 12, color: token.colorText }}
              onClick={() =>
                rec?.fileindx === 0
                  ? handleSearch(`${currentDir}/${rec.filename}`, false)
                  : fetchObjectData(rec)
              }
              // disabled={rec?.fileindx > 0 && rec?.fileperm !== "write"}
            >
              {rec?.fileindx === 2 ? (
                <Badge
                  size="small"
                  count="soft link"
                  color="cyan"
                  offset={[36, 8]}
                >
                  {rec.filename}
                </Badge>
              ) : (
                rec.filename
              )}

              {/* {rec.filename} */}
            </Typography.Link>
          </>
        );
      },
    },
    {
      key: 1,
      title: "Changed",
      dataIndex: "filetime",
      width: 120,
    },
    { key: 2, title: "Size", dataIndex: "filesize", width: 80 },
    {
      key: 3,
      title: "Rights",
      dataIndex: "permstring",
      width: 90,
      render: (_, record) => {
        return (
          <span style={{ fontFamily: "monospace" }}>{record?.permstring}</span>
        );
        // switch (record?.fileperm) {
        //   case "write":
        //     return (
        //       <Tag color="blue" style={{ fontSize: 10 }}>
        //         {record?.permstring}
        //       </Tag>
        //     );
        //   case "read":
        //     return (
        //       <Tag color="geekblue" style={{ fontSize: 10 }}>
        //         {record?.permstring}
        //       </Tag>
        //     );
        //   default:
        //     return (
        //       <Tag color="default" style={{ fontSize: 10 }}>
        //         {record?.permstring ?? "NO PERM"}
        //       </Tag>
        //     );
        // }
      },
    },
    { key: 4, title: "Owner", dataIndex: "fileowner" },
    {
      key: 5,
      width: 24,
      render: (_, rec) => {
        return rec?.fileindx > 0 ? (
          <Dropdown
            menu={{
              items: [
                {
                  key: "1",
                  label: "Edit File",
                  icon: <EditOutlined />,
                  onClick: () => fetchObjectData(rec),
                  disabled: rec?.fileperm !== "write",
                },
                {
                  key: "2",
                  label: "Open in new tab",
                  icon: <ExportOutlined />,
                  onClick: () => handleFile("open", rec?.fullpath),
                },
                {
                  key: "3",
                  label: "Copy Link",
                  icon: <LinkOutlined />,
                  onClick: () => handleFile("link", rec?.fullpath),
                },
                {
                  key: "9",
                  label: "Copy File as Path",
                  icon: <LinkOutlined />,
                  onClick: () => unsecuredCopyToClipboard(rec?.fullpath),
                },
                {
                  key: "4",
                  label: "Download File",
                  icon: <DownloadOutlined />,
                  onClick: () => downloadAsync(rec?.fullpath),
                },
                {
                  type: "divider",
                },
                {
                  key: "5",
                  label: "Rename",
                  icon: <FormOutlined />,
                  onClick: () => {
                    console.log(rec);
                    setRename({
                      open: true,
                      fileObject: rec,
                    });
                  },
                },
                {
                  key: "8",
                  label: "Copy file to...",
                  icon: <CopyOutlined />,
                  onClick: () =>
                    setCopyMove({
                      mode: "copy",
                      open: true,
                      fileObject: rec,
                      newfullpath: rec.filename,
                    }),
                },
                {
                  key: "6",
                  label: "Delete File",
                  icon: <DeleteOutlined />,
                  danger: true,
                  onClick: () =>
                    setDeleteFile({
                      mode: rec?.fileindx === 0 ? "deletedir" : "delete",
                      file: rec?.fullpath,
                      open: true,
                      loading: false,
                    }),
                },
                {
                  type: "divider",
                },
                {
                  key: "7",
                  label: "Properties",
                  icon: <ProfileOutlined />,
                  onClick: () => setFileProperties({ open: true, file: rec }),
                },
              ],
            }}
            placement="bottomRight"
          >
            <span>
              <MoreOutlined style={{ fontSize: 16, fontWeight: "700" }} />
            </span>
          </Dropdown>
        ) : null;
      },
    },
  ];

  const handleSearch = async (value, today) => {
    console.log(today);
    searchMode = "manual";
    setLoading({ ...loading, task: true });
    setSpin(true);
    setCurrentDir(value);

    const res = await Request({
      url: ENDPOINT.readDirectoryApi(value, today ?? false),
    });

    const list = [];
    if (res?.files) {
      const obj = JSON.parse(localStorage.getItem("searchList")) ?? [];
      const index = obj?.indexOf(value);
      if (index < 0 && value !== "/") {
        obj?.push(value);
        setSearchHistory([...searchHistory, value]);
        localStorage.setItem("searchList", JSON.stringify(obj));

        const opt = [];
        obj?.map((path) => {
          opt.push({ value: path });
        });
        setOptions(opt);
      }

      res?.files?.map((file) => {
        list.push({
          ...file,
          icon:
            file?.fileindx === 0 ? (
              <Image src={FolderIcon} preview={false} width={20} />
            ) : (
              <>
                <Image
                  src={getFileIcon(file?.filename)}
                  preview={false}
                  width={14}
                />
              </>
            ),
        });
      });

      localStorage.setItem("lastDirectory", value);
    }

    setFolderData(list);
    setFilteredData(list);
    setSpin(false);
    setLoading({ ...loading, task: false });

    return res;
  };

  const fetchObjectData = async (object) => {
    if (object?.fileperm && object?.fileperm !== "write") {
      Modal.confirm({
        title: "No write permission",
        okText: "Open",
        cancelText: "Not Now",
        onOk: () => handleFile("read", object?.fullpath),
        content:
          "You do not have edit rights to the file your are trying to open. Do you want to open the file in read only mode?",
      });
      return;
    }
    if (!object?.fileperm) {
      Modal.error({
        title: "No read or write permission",
        okText: (
          <>
            Alright <MehOutlined />
          </>
        ),
        // cancelText: "Not Now",
        // onOk: () => handleFile("read", object?.fullpath),
        content: "You do not have any rights to view or edit this file",
      });
      return;
    }
    setFile(object?.fullpath);
    setLoading({ ...loading, main: true });
    const res = await Request({
      url: ENDPOINT.handleFileApi("read", object?.fullpath),
    });
    // console.log(res);

    setFileText(res?.fileContent);
    setLoading({ ...loading, main: false });
    setFileHandle(null); // Reset local file handle
    localStorage.setItem("original", res?.fileContent);
    localStorage.setItem("changed", res?.fileContent);
    payload({ type: "FILE_OPEN_MODE", value: "remote" });
    payload({ type: "REMOTE_FILE", value: object?.fullpath });
    payload({ type: "SAVED", value: true });
    payload({ type: "FILE_STATE", value: "new" });
  };

  const viewFileData = async (object, file) => {
    setFile(object);
    setLoading({ ...loading, main: true });
    const res = await Request({ url: ENDPOINT.handleFileApi("read", file) });
    // console.log(res);

    setReadText(res?.fileContent);
    setLoading({ ...loading, main: false });
    setFileHandle(null); // Reset local file handle
    // localStorage.setItem("original", res?.fileContent);
    // localStorage.setItem("changed", res?.fileContent);
    payload({ type: "FILE_OPEN_MODE", value: "Read-Only" });
    payload({ type: "REMOTE_FILE", value: file });
    payload({ type: "SAVED", value: true });
    // payload({ type: "FILE_STATE", value: "new" });
  };

  const handleItemClick = (item) => {
    if (item?.fileindx === 0) handleSearch(item?.fullpath, false);
    else fetchObjectData(item);
    searchMode = "manual";
  };

  const gotoPrevDirectory = () => {
    const dirArray = currentDir.split("/");
    // console.log("Dir Array:", dirArray);
    let prevDir = "";
    for (let i = 1; i < dirArray.length - 1; i++) {
      const dir = dirArray[i];
      prevDir = prevDir === "" ? `/${dir}` : prevDir + `/${dir}`;
    }

    // console.log("Prev Dir:", prevDir);
    setCurrentDir(prevDir);
    handleSearch(prevDir, false);
  };

  const handleFilter = (e) => {
    const newList = folderData?.filter(
      (item) =>
        item?.filename?.toLowerCase()?.indexOf(e.target.value?.toLowerCase()) >
        -1
    );
    setFilteredData(newList);
  };

  const copyMoveFile = async (mode, obj) => {
    const res = await Request({
      url: ENDPOINT.fileOperationApi(),
      method: "post",
      data: {
        action: mode,
        fullpath: obj?.fullpath,
        newfullpath: copyMove?.newfullpath,
      },
    });

    if (res?.type === "error") {
      Modal.error({ title: "File copy error", content: res?.message });
      return;
    }
    setCopyMove({
      mode: "",
      fileObject: null,
      open: false,
      newfullpath: "",
      loading: false,
    });
    if (res?.fullpath === currentDir) handleSearch(currentDir, false);
  };

  const addNewFile = async (openFile) => {
    const res = await Request({
      url: ENDPOINT.fileOperationApi(),
      method: "post",
      data: {
        action: addFile?.mode,
        fullpath: currentDir,
        newname: addFile?.newname,
      },
    });

    if (res?.type === "error") {
      Modal.error({ title: "File Add error", content: res?.message });
      return;
    }

    if (openFile === true) {
      message.error("This functionality is not available yet");
    }
    setAddFile({
      mode: "",
      open: false,
      newname: "",
      loading: false,
    });
    handleSearch(currentDir, false);
  };

  const handleDelete = async () => {
    const res = await Request({
      url: ENDPOINT.fileOperationApi(),
      method: "post",
      data: {
        action: deleteFile?.mode,
        fullpath: deleteFile?.file,
      },
    });

    if (res?.type === "error") {
      Modal.error({ title: "File Delete error", content: res?.message });
      return;
    }
    setDeleteFile({
      mode: "delete",
      open: false,
      file: "",
      loading: false,
    });
    handleSearch(currentDir, false);
  };

  React.useEffect(() => {
    // const lastDir = localStorage.getItem("lastDirectory");
    // console.log(searchMode, lastOpenedDirectory);
    // if (searchMode === "manual") return;
    // if (lastOpenedDirectory) handleSearch(lastOpenedDirectory);
    setCurrentDir(lastOpenedDirectory);
  }, [lastOpenedDirectory]);

  return (
    <Spin spinning={spin === true}>
      <Row>
        <Col span={16}>
          <Row style={{ backgroundColor: `${token.colorBgLayout}` }}>
            <Col span={24}>
              <AutoComplete
                options={options}
                // onSearch={handleSearch}
                onSelect={(value) => handleSearch(value, false)}
                filterOption={(inputValue, option) =>
                  option.value
                    .toUpperCase()
                    .indexOf(inputValue.toUpperCase()) !== -1
                }
                style={{ width: "100%" }}
                size="large"
                value={currentDir}
              >
                <Search
                  placeholder="Directory full path"
                  bordered={false}
                  allowClear={true}
                  enterButton={<SyncOutlined />}
                  onSearch={(value) => handleSearch(value, false)}
                  value={currentDir}
                  onChange={(e) => setCurrentDir(e.target.value)}
                  prefix={
                    <Space>
                      <Button
                        type="text"
                        icon={
                          showFilterInput ? (
                            <FilterTwoTone />
                          ) : (
                            <FilterOutlined />
                          )
                        }
                        onClick={() => setShowFilterInput(!showFilterInput)}
                      />
                      <Button
                        type="text"
                        icon={<ArrowLeftOutlined />}
                        onClick={gotoPrevDirectory}
                      />
                    </Space>
                  }
                />
              </AutoComplete>
              <div
                style={
                  showFilterInput
                    ? { height: "36px", transition: "all .2s ease-in-out" }
                    : { height: 0, transition: "all .2s ease-in-out" }
                }
              >
                <Input placeholder="Filter files" onChange={handleFilter} />
              </div>
              <Divider style={{ margin: 0 }} />
            </Col>
            <Col
              span={24}
              style={{ height: "80vh" }}
              className="scroll-on-hover"
            >
              {!currentDir ? (
                <Result icon={<Image src={NotFoundImage} preview={false} />} />
              ) : (
                <Table
                  dataSource={filteredData}
                  columns={fsColumns}
                  size="small"
                  // pagination={false}
                  pagination={{ pageSize: 20 }}
                  // scroll={{ y: "75vh" }}
                  className="scroll-on-hover"
                  rowClassName={(record, index) =>
                    record?.fullpath === selectedRow?.fullpath
                      ? classes.selectedrow
                      : null
                  }
                  style={{
                    backgroundColor: token?.colorBgLayout,
                    border: "0px",
                  }}
                  // loading={loading}
                  bordered={false}
                  // rowSelection={selectedRowKeys}
                  onRow={(record, rowIndex) => {
                    return {
                      onClick: () => {
                        setSelectedRow(record);
                        console.log(record.fullpath);
                      },
                      onDoubleClick: () => fetchObjectData(record),
                      onContextMenu: (event) => showContextMenu(record, event),
                    };
                  }}
                  onHeaderRow={(column) => {
                    return {
                      onContextMenu: (event) => showHeaderContextMenu(event),
                    };
                  }}
                />
              )}
            </Col>
          </Row>
        </Col>
        <Divider type="vertical" />
        <Col span={7}>
          <AIChat
            handleFile={handleFile}
            fetchObjectData={fetchObjectData}
            handleSearch={handleSearch}
          />
        </Col>
      </Row>

      <Modal
        open={rename.open}
        title="Rename File"
        onCancel={() =>
          setRename({ fileObject: null, open: false, newname: "" })
        }
        onOk={renameFile}
        confirmLoading={rename?.loading}
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          <Input
            value={rename?.newname}
            onChange={(e) => setRename({ ...rename, newname: e.target.value })}
            ref={fileRef}
          />
        </Space>
      </Modal>
      <Modal
        open={addFile.open}
        title={
          addFile.mode === "create" ? "Enter File Name" : "Enter Folder Name"
        }
        cancelText="Cancel"
        okText="Create"
        // onCancel={() => setAddFile(() => addNewFile(true))}
        onCancel={() =>
          setAddFile({ newname: "", open: false, loading: false, mode: "" })
        }
        onOk={() => addNewFile(false)}
        confirmLoading={addFile?.loading}
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          <Input
            onChange={(e) =>
              setAddFile({ ...addFile, newname: e.target.value })
            }
          />
        </Space>
      </Modal>
      <Modal
        open={copyMove?.open}
        title={copyMove?.mode === "copy" ? "Copy File" : "Move File"}
        onCancel={() =>
          setCopyMove({
            mode: "",
            fileObject: null,
            open: false,
            newfullpath: "",
            loading: false,
          })
        }
        onOk={() => copyMoveFile(copyMove?.mode, copyMove?.fileObject)}
        confirmLoading={copyMove?.loading}
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          <Typography.Text type="secondary">
            {copyMove?.fileObject?.fullpath}
          </Typography.Text>
          <Typography.Text strong>{`Target File :`}</Typography.Text>
          <Input.TextArea
            autoSize
            value={copyMove?.newfullpath}
            onChange={(e) =>
              setCopyMove({ ...copyMove, newfullpath: e.target.value })
            }
          />
        </Space>
      </Modal>
      <Modal
        open={deleteFile?.open}
        title=<Typography.Title level={3} type="danger" style={{ margin: 0 }}>
          {deleteFile?.mode === "delete" ? "Delete File" : "Delete Folder"}
        </Typography.Title>
        onCancel={() =>
          setDeleteFile({ open: false, file: "", loading: false })
        }
        cancelText="Not now"
        onOk={() => handleDelete(selectedRow?.fullpath)}
        okText="Delete"
        okButtonProps={{ danger: true }}
      >
        Delete file <a>{deleteFile?.file}</a> permanently from server? Once
        deleted could not be recovered.
      </Modal>
      <Modal
        open={fileProperties?.open}
        title="File Properties"
        onOk={() => setFileProperties({ open: false, file: null })}
        cancelButtonProps={{ style: { display: "none" } }}
        onCancel={() => setFileProperties({ open: false, file: null })}
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          <Typography.Text strong>File Name</Typography.Text>
          <Typography.Link
            style={{ fontSize: 12 }}
            // type="success"
            onClick={() =>
              unsecuredCopyToClipboard(fileProperties?.file?.filename)
            }
            title="Click to copy file name to clipboard"
          >
            {fileProperties?.file?.icon} {fileProperties?.file?.filename}
          </Typography.Link>
          <Divider style={{ margin: 0 }} />
          <Typography.Text strong>File Full Path</Typography.Text>
          <Typography.Link
            style={{ fontSize: 12 }}
            onClick={() =>
              unsecuredCopyToClipboard(fileProperties?.file?.fullpath)
            }
            title="Click to copy full file path to clipboard"
          >
            {fileProperties?.file?.fullpath}
          </Typography.Link>
          <Divider style={{ margin: 0 }} />

          <Typography.Text strong>File Last Changed</Typography.Text>
          {fileProperties?.file?.filetime}
          <Divider style={{ margin: 0 }} />

          <Typography.Text strong>File Size</Typography.Text>
          {fileProperties?.file?.filesize}
          <Divider style={{ margin: 0 }} />

          <Typography.Text strong>File Permission</Typography.Text>
          {fileProperties?.file?.fileperm?.toUpperCase()}
          <Divider style={{ margin: 0 }} />
        </Space>
      </Modal>
      <Dropdown
        overlayStyle={{ left: `${contextMenu.x}px`, top: `${contextMenu.y}px` }}
        open={contextMenu.open}
        menu={{
          items: [
            {
              key: "0",
              label: "Code Action",
              icon: <CodeTwoTone />,
              disabled: selectedRow?.filetype !== "p",
              children: [
                {
                  key: "0-0",
                  label: "Compile",
                  icon: <FilePptTwoTone />,
                },

                {
                  key: "0-1",
                  label: "Compile with Xref",
                  icon: <FileExcelTwoTone />,
                },
                {
                  key: "0-2",
                  label: "Check Syntax",
                  icon: <BugTwoTone />,
                },
                {
                  key: "0-3",
                  label: "Run",
                  icon: <PlaySquareTwoTone />,
                },
              ],
            },
            { type: "divider" },
            {
              key: "12",
              label: "Add New",
              children: [
                {
                  key: "12-1",
                  label: "File",
                  onClick: () =>
                    setAddFile({
                      ...addFile,
                      newname: "",
                      open: true,
                      mode: "create",
                    }),
                  icon: <FileAddTwoTone />,
                },
                {
                  key: "12-2",
                  label: "Folder",
                  onClick: () =>
                    setAddFile({
                      ...addFile,
                      newname: "",
                      open: true,
                      mode: "createdir",
                    }),
                  icon: <FolderAddTwoTone />,
                },
              ],
              icon: <PlusCircleTwoTone />,
            },
            {
              key: "1",
              label: "Edit File",
              icon: <EditOutlined />,
              onClick: () => fetchObjectData(selectedRow),
              disabled: selectedRow?.fileperm !== "write",
            },
            {
              key: "2",
              label: "Open in new tab",
              icon: <ExportOutlined />,
              onClick: () => handleFile("open", selectedRow?.fullpath),
            },
            {
              key: "3",
              label: "Copy Link",
              icon: <LinkOutlined />,
              onClick: () => handleFile("link", selectedRow?.fullpath),
            },
            {
              key: "9",
              label: "Copy File as Path",
              icon: <FileTextTwoTone />,
              onClick: () => unsecuredCopyToClipboard(selectedRow?.fullpath),
            },
            {
              key: "10",
              label: "Email File",
              icon: <MailTwoTone />,
            },
            {
              key: "4",
              label: "Download File",
              icon: <DownloadOutlined />,
              onClick: () => downloadAsync(selectedRow?.fullpath),
            },
            {
              type: "divider",
            },
            {
              key: "5",
              label: "Rename",
              icon: <FormOutlined />,
              onClick: () => {
                setRename({
                  open: true,
                  fileObject: selectedRow,
                });
              },
            },
            {
              key: "8",
              label: "Copy file to...",
              icon: <CopyOutlined />,
              onClick: () =>
                setCopyMove({
                  mode: "copy",
                  open: true,
                  fileObject: selectedRow,
                  newfullpath: selectedRow.filename,
                }),
            },
            {
              key: "6",
              label: "Delete File",
              icon: <DeleteOutlined />,
              danger: true,
              onClick: () =>
                setDeleteFile({
                  mode: selectedRow?.fileindx === 0 ? "deletedir" : "delete",
                  file: selectedRow?.fullpath,
                  open: true,
                  loading: false,
                }),
            },
            {
              type: "divider",
            },
            {
              key: "7",
              label: "Properties",
              icon: <ToolTwoTone />,
              onClick: () =>
                setFileProperties({ open: true, file: selectedRow }),
            },
          ],
        }}
        placement="bottomRight"
      >
        <span></span>
      </Dropdown>
      <Dropdown
        overlayStyle={{
          left: `${headerContextMenu.x}px`,
          top: `${headerContextMenu.y}px`,
        }}
        open={headerContextMenu.open}
        menu={{
          items: [
            {
              key: "0",
              label: "Add New File",
              onClick: () =>
                setAddFile({
                  ...addFile,
                  newname: "",
                  open: true,
                  mode: "create",
                }),
              icon: <FileAddTwoTone />,
            },
            {
              key: "1",
              label: "Add New Folder",
              onClick: () =>
                setAddFile({
                  ...addFile,
                  newname: "",
                  open: true,
                  mode: "createdir",
                }),
              icon: <FolderAddTwoTone />,
            },
          ],
        }}
        placement="bottomRight"
      >
        <span></span>
      </Dropdown>
    </Spin>
  );
}
