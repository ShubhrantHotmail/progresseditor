import {
  Row,
  Col,
  Typography,
  Select,
  Tree,
  Table,
  theme,
  Image,
  Spin,
} from "antd";
import React from "react";

import { DownOutlined } from "@ant-design/icons";
import { Request } from "../lib/apiRequest";
import { ENDPOINT } from "../lib/endpoints";
import "../styles/main.css";
import { GlobalContext } from "../GlobalContext";
import FolderOpenIcon from "../icons/OpenFolderColor.png";
import FolderIcon from "../icons/FolderWindows.png";
import { getFileIcon } from "../lib/editorConfig";

const { useToken } = theme;

export default function RTBTasks(props) {
  const { token } = useToken();
  const { setFileText, setFile, setFileHandle } = props;
  const [, payload] = React.useContext(GlobalContext);
  const [spin, setSpin] = React.useState(false);

  const [object, setObject] = React.useState([]);
  const [tasks, setTasks] = React.useState([]);
  const [currentTask, setCurrentTask] = React.useState(null);
  const [taskObj, setTaskObj] = React.useState([]);
  //   const [rtbWspaces, setRtbWspaces] = React.useState([]);
  const [rtbWspaces, setRtbWspaces] = React.useState([
    {
      key: "root",
      title: "Workspaces",
      icon: <Image preview={false} width={20} src={FolderIcon} />,
      children: [],
    },
  ]);
  const { DirectoryTree } = Tree;

  const fetchObjectData = async (object, file) => {
    setFile(object);
    setSpin(true);
    const res = await Request({ url: ENDPOINT.handleFileApi("read", file) });
    // console.log(res);

    setFileText(res?.fileContent);
    setSpin(false);
    setFileHandle(null); // Reset local file handle
    localStorage.setItem("original", res?.fileContent);
    payload({ type: "FILE_OPEN_MODE", value: "rtb" });
    payload({ type: "REMOTE_FILE", value: file });
    payload({ type: "SAVED", value: true });
    payload({ type: "FILE_STATE", value: "new" });
  };

  const fetchTasks = async (value) => {
    setSpin(true);
    const res = await Request({
      url: ENDPOINT.rtbTaskApi("mytask", "sn3", value, true, false, false),
    });

    const list = [];
    setTaskObj(res?.tasks);
    res?.tasks?.map((task) => {
      list.push({
        value: task?.task_num,
        label: task?.task_num,
      });
    });

    setTasks(list);
    setCurrentTask(list?.[0]?.value ?? "");
    taskSelection(list?.[0]?.value ?? "", res?.tasks);
    setSpin(false);
  };

  const onSelect = (selectedKeys, info) => {
    fetchTasks(selectedKeys[0]);
  };
  const fetchRTBWorkspace = async () => {
    setSpin(true);
    const res = await Request({ url: ENDPOINT.rtbWspaceApi() });
    // const list = [];
    const obj = [];
    // const obj = { key: "root", title: `RTB ${value}`, children: [] };
    res?.wspace?.map((wspace) => {
      // list.push({ value: wspace?.key, label: wspace?.title });
      obj.push({
        key: wspace?.key,
        title: wspace?.title,
        children: [],
        icon: <Image preview={false} width={16} src={FolderIcon} />,
      });
    });
    // console.log(obj);
    setRtbWspaces([
      {
        key: "root",
        title: "Workspaces",
        children: obj,
        icon: <Image preview={false} width={20} src={FolderOpenIcon} />,
      },
    ]);
    // setRtbWspaces(list);

    setSpin(false);
    // console.log(res);
  };

  const taskSelection = async (value, objectList) => {
    const fullList = objectList ?? taskObj;
    const list = fullList?.filter((item) => item?.task_num === value);
    // console.log(value, list);
    const treeData = [];
    await list?.[0]?.all_version?.map((obj) => {
      treeData.push({
        key: obj?.object,
        title: `${obj?.object} ${obj?.version}`,
        icon: (
          <Image preview={false} width={16} src={getFileIcon(obj?.object)} />
        ),
        file: obj?.objectPath,
        module: obj?.module,
        version: obj?.version,
        children: [],
      });
      setCurrentTask(value);
    });

    setObject([{ key: "objects", title: "Objects", children: treeData }]);
  };

  React.useEffect(() => {
    console.log("UseEffect");
    fetchRTBWorkspace();
  }, []);

  const handleObjectSelect = (selectedKeys, info) => {
    // console.log(selectedKeys, info);

    fetchObjectData(info?.node?.key, info?.node?.file);
  };
  return (
    <Spin spinning={spin}>
      <Row style={{ backgroundColor: `${token.colorBgLayout}` }}>
        <Col
          // span={6}
          style={{
            height: "100%",
            width: 200,
          }}
        >
          <DirectoryTree
            treeData={rtbWspaces}
            showLine
            switcherIcon={<DownOutlined />}
            onSelect={onSelect}
            expandedKeys={["root"]}
            style={{ backgroundColor: `${token.colorBgLayout}` }}
            blockNode={true}
          />
        </Col>
        <Col
          // span={18}
          style={{
            paddingLeft: 8,
            borderLeft: `1px solid ${token.colorBorder}`,
            height: "85vh",
          }}
        >
          <>Tasks: </>
          <Select
            options={tasks}
            style={{ width: 100 }}
            value={currentTask}
            onChange={(value) => taskSelection(value, null)}
          />
          <Tree
            treeData={object}
            showLine
            switcherIcon={<DownOutlined />}
            onSelect={handleObjectSelect}
            expandedKeys={["objects"]}
            style={{ backgroundColor: `${token.colorBgLayout}` }}
            blockNode={true}
            showIcon
          />
        </Col>
      </Row>
    </Spin>
  );
}
