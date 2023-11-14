import React from "react";
import {
  Col,
  Row,
  Input,
  Divider,
  Result,
  Image,
  Button,
  Typography,
} from "antd";
import { Request } from "../lib/apiRequest";
import { ENDPOINT } from "../lib/endpoints";
import { useState } from "react";
import NotFoundImage from "../icons/Oops.jpg";
import {
  FolderOutlined,
  FileTextOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemContent,
  ListItemDecorator,
} from "@mui/joy";
import "../styles/main.css";
import FolderIcon from "../icons/FolderWindows.png";
import { getFileIcon } from "../lib/editorConfig";
import { GlobalContext } from "../GlobalContext";
import { data } from "../data/tradesys.fields";

export default function FileExplorer(props) {
  const { loading, setLoading, setFileText, setFile } = props;
  const [currentDir, setCurrentDir] = useState("/");
  const [folderData, setFolderData] = useState([]);
  const { Search } = Input;
  const [state, payload] = React.useContext(GlobalContext);

  const handleSearch = async (value) => {
    setLoading({ ...loading, tasks: true });
    const res = await Request({ url: ENDPOINT.readDirectoryApi(value) });

    const list = [];
    if (res?.files) {
      res?.files?.map((file) => {
        list.push({
          ...file,
          icon:
            file?.fileindx === 0 ? (
              <Image src={FolderIcon} preview={false} width={20} />
            ) : (
              <Image
                src={getFileIcon(file?.filename)}
                preview={false}
                width={14}
              />
            ),
        });
      });
    }

    setFolderData(list);
    setCurrentDir(res?.Error ? null : value);

    setLoading({ ...loading, tasks: false });
  };

  const fetchObjectData = async (object, file) => {
    setFile(object);
    setLoading({ ...loading, object: true });
    const res = await Request({ url: ENDPOINT.handleFileApi("read", file) });
    // console.log(res);

    setFileText(res?.fileContent);
    setLoading({ ...loading, object: false });
    payload({ type: "FILE_OPEN_MODE", value: "remote" });
    payload({ type: "REMOTE_FILE", value: file });
  };

  const handleItemClick = (item) => {
    if (item?.fileindx === 0) handleSearch(item?.fullpath);
    else fetchObjectData(item?.filename, item?.fullpath);
  };

  const gotoPrevDirectory = () => {
    const dirArray = currentDir.split("/");
    console.log("Dir Array:", dirArray);
    let prevDir = "";
    for (let i = 1; i < dirArray.length - 1; i++) {
      const dir = dirArray[i];
      prevDir = prevDir === "" ? `/${dir}` : prevDir + `/${dir}`;
    }

    console.log("Prev Dir:", prevDir);
    setCurrentDir(prevDir);
    handleSearch(prevDir);
  };

  return (
    <Row>
      <Col span={24}>
        <Search
          placeholder="Directory full path"
          bordered={false}
          allowClear={true}
          enterButton="search"
          onSearch={handleSearch}
          value={currentDir}
          onChange={(e) => setCurrentDir(e.target.value)}
          prefix={
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={gotoPrevDirectory}
            />
          }
        />
        <Divider style={{ margin: 0 }} />
      </Col>
      <Col span={24} style={{ height: "70vh" }} className="scroll-on-hover">
        {!currentDir ? (
          <Result icon={<Image src={NotFoundImage} preview={false} />} />
        ) : (
          <List size="sm" sx={{}}>
            {folderData?.map((file) => {
              return (
                <ListItem key={file?.fullpath}>
                  <ListItemButton
                    onClick={() => handleItemClick(file)}
                    disabled={!file?.fileperm}
                  >
                    <ListItemDecorator>{file?.icon}</ListItemDecorator>
                    <ListItemContent>{file?.filename}</ListItemContent>
                    <Typography.Text style={{ fontSize: 12 }}>
                      {file?.filesize}
                    </Typography.Text>
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        )}
      </Col>
    </Row>
  );
}
