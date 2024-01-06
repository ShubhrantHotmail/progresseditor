import {
  Drawer,
  Button,
  Input,
  Row,
  Col,
  Card,
  Breadcrumb,
  Image,
  Table,
  Typography,
  Modal,
} from "antd";
import { theme } from "antd";
import { CloseOutlined, FilterOutlined } from "@ant-design/icons";
import { AddNew, OpenFolder, Server } from "../lib/Symbols";
import { useState } from "react";
import { ENDPOINT } from "../lib/endpoints";
import FolderIcon from "../icons/FolderWindows.png";
import { getFileIcon } from "../lib/editorConfig";
import { Request } from "../lib/apiRequest";
import NotFoundImage from "../icons/Oops.jpg";
import { useContext } from "react";
import { GlobalContext } from "../GlobalContext";
import ControlButton from "./ControlButton";
import { useEffect } from "react";

const { useToken } = theme;

export default function RemoteFS(props) {
  const { open, setOpen, setFile, setFileHandle, setFileText } = props;
  const { token } = useToken();
  const { Search } = Input;
  const [currentDir, setCurrentDir] = useState("/");
  const [folderData, setFolderData] = useState([]);
  const [favs, setFavs] = useState([]);
  const [bcData, setBcData] = useState([
    { title: "Path of searched directory" },
  ]);
  const [loading, setLoading] = useState(false);
  const [state, payload] = useContext(GlobalContext);

  const fetchObjectData = async (object, file) => {
    setFile(object);
    setLoading(true);
    const res = await Request({ url: ENDPOINT.handleFileApi("read", file) });
    // console.log(res);

    setFileText(res?.fileContent);
    setLoading(false);
    setFileHandle(null); // Reset local file handle
    localStorage.setItem("original", res?.fileContent);
    payload({ type: "FILE_OPEN_MODE", value: "remote" });
    payload({ type: "REMOTE_FILE", value: file });
    payload({ type: "SAVED", value: true });
    payload({ type: "FILE_STATE", value: "new" });
    setOpen(false);
  };
  const favPaths = localStorage.getItem("favPaths");

  const favColumns = [{ key: 0, title: "Folder Path", dataIndex: "path" }];
  const fsColumns = [
    {
      key: 0,
      title: "Name",
      dataIndex: "filename",
      width: 540,
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
              style={{ marginLeft: 12, fontSize: 12 }}
              onClick={() =>
                rec?.fileindx === 0
                  ? handleSearch(`${currentDir}/${rec.filename}`)
                  : fetchObjectData(rec?.filename, rec?.fullpath)
              }
            >
              {rec.filename}
            </Typography.Link>
          </>
        );
      },
    },
    { key: 1, title: "Changed", dataIndex: "filetime", width: 120 },
    { key: 2, title: "Size", dataIndex: "filesize" },
    { key: 3, title: "Perm", dataIndex: "fileperm" },
  ];

  const changeDirectory = (len) => {
    const pathArray = currentDir.split("/");
    let newPath = "";

    for (let i = 1; i <= len; i++) {
      const dir = pathArray[i];
      newPath = newPath === "" ? `/${dir}` : newPath + `/${dir}`;
    }
    handleSearch(newPath);
  };

  const makeBcItems = (path) => {
    const arr = path.split("/");
    const list = [];
    for (let i = 1; i < arr.length; i++) {
      const dir = arr[i];
      list.push({
        title:
          arr.length - 1 === i ? (
            dir
          ) : (
            <a onClick={() => changeDirectory(i)}>{dir}</a>
          ),
      });
    }
    setBcData(list);
  };

  const handleSearch = async (value) => {
    setLoading(true);
    const res = await Request({ url: ENDPOINT.readDirectoryApi(value) });

    setFolderData(res?.files);
    setCurrentDir(value);
    makeBcItems(value);
    setLoading(false);
  };

  const addToFav = () => {
    const list = favs ?? [];
    if (currentDir === "") {
      Modal.error({
        title: "Save Error",
        content: "Directory path must be entered",
        okText: "Oops",
        style: { backgroundColor: `${token?.colorBgContainer}` },
      });
      return;
    }

    if (list.find((item) => item?.path === currentDir)) {
      Modal.error({
        title: "Save Error",
        content: "Directory already available in your favorite list",
        okText: "Oops",
        style: { backgroundColor: `${token?.colorBgContainer}` },
      });
      return;
    }
    list.push({ path: currentDir });
    // console.log(list);
    setFavs(list);
    localStorage.setItem("favPaths", JSON.stringify(list));
  };

  useEffect(() => {
    console.log("UseEffect");
    try {
      const arr = JSON.parse(favPaths);
      setFavs(arr);
    } catch (error) {}
  }, [favPaths]);

  return (
    <Drawer
      open={open}
      onClose={() => setOpen(false)}
      closable={false}
      placement="left"
      width="70%"
      bodyStyle={{ backgroundColor: `${token.colorBgContainer}` }}
      title={
        <>
          <Server style={{ fontSize: 24, marginRight: 8 }} />
          {/* File Explorer */}
          <Search
            bordered={false}
            placeholder="Enter Remote Folder"
            style={{ width: "50%", fontWeight: "500" }}
            allowClear={true}
            enterButton={false}
            onSearch={handleSearch}
            value={currentDir}
            onChange={(e) => setCurrentDir(e.target.value)}
          />
          <ControlButton
            icon={<AddNew />}
            text="Add To Favorites"
            callback={addToFav}
          />
        </>
      }
      extra={
        <Button
          type="text"
          icon={<CloseOutlined />}
          danger
          onClick={() => setOpen(false)}
        />
      }
      headerStyle={{
        backgroundColor: `${token.colorBgLayout}`,
        padding: 0,
        paddingLeft: 8,
      }}
    >
      <Row style={{ backgroundColor: `${token.colorBgContainer}` }} gutter={8}>
        <Col span={16}>
          <Card
            size="small"
            width="100%"
            title={<Breadcrumb items={bcData} />}
            bodyStyle={{ padding: 0 }}
            extra={<Input prefix={<FilterOutlined />} />}
          >
            <Table
              dataSource={folderData}
              columns={fsColumns}
              size="small"
              pagination={false}
              scroll={{ y: "80vh" }}
              className="scroll-on-hover"
              loading={loading}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            size="small"
            width="100%"
            // title={
            //   <>
            //     <Input
            //       placeholder="Enter Directory to save to favorites"
            //       bordered={false}
            //       style={{ width: "85%" }}
            //     />
            //     <ControlButton icon={<AddNew />} text="Add" />
            //   </>
            // }
            title="Favorites"
          >
            <Table
              dataSource={favs}
              columns={favColumns}
              size="small"
              pagination={false}
              scroll={{ y: "80vh" }}
              className="scroll-on-hover"
              showHeader={false}
            />
          </Card>
        </Col>
      </Row>
    </Drawer>
  );
}
