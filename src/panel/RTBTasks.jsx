import { Row, Col, Typography, Select, Tree, Table } from "antd";
import React from "react";

import { DownOutlined } from "@ant-design/icons";
import { Request } from "../lib/apiRequest";
import { ENDPOINT } from "../lib/endpoints";
import "../styles/main.css";
import { GlobalContext } from "../GlobalContext";

export default function RTBTasks(props) {
  const { loading, setLoading, setFileText, setFile } = props;
  const [, payload] = React.useContext(GlobalContext);

  const [object, setObject] = React.useState([]);
  const [tasks, setTasks] = React.useState([]);
  const [taskObj, setTaskObj] = React.useState([]);
  //   const [rtbWspaces, setRtbWspaces] = React.useState([]);
  const [rtbWspaces, setRtbWspaces] = React.useState([
    {
      key: "root",
      title: "Workspaces",
      children: [],
    },
  ]);
  const { DirectoryTree } = Tree;

  const fetchObjectData = async (object, file) => {
    setFile(object);
    setLoading({ ...loading, object: true });
    const res = await Request({ url: ENDPOINT.handleFileApi("read", file) });
    // console.log(res);

    setFileText(res?.fileContent);
    setLoading({ ...loading, object: false });
    payload({ type: "FILE_OPEN_MODE", value: "rtb" });
    payload({ type: "REMOTE_FILE", value: file });
  };

  const fetchTasks = async (value) => {
    setLoading({ ...loading, tasks: true });
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
    setLoading({ ...loading, tasks: false });
  };

  const onSelect = (selectedKeys, info) => {
    fetchTasks(selectedKeys[0]);
  };
  const fetchRTBWorkspace = async () => {
    setLoading({ ...loading, main: true });
    const res = await Request({ url: ENDPOINT.rtbWspaceApi() });
    const list = [];
    const obj = [];
    // const obj = { key: "root", title: `RTB ${value}`, children: [] };
    res?.wspace?.map((wspace) => {
      list.push({ value: wspace?.key, label: wspace?.title });
      obj.push({ key: wspace?.key, title: wspace?.title, children: [] });
    });
    // console.log(obj);
    setRtbWspaces([{ key: "root", title: "Workspaces", children: obj }]);
    // setRtbWspaces(list);
    setLoading({ ...loading, main: false });
    // console.log(res);
  };

  const taskSelection = (value) => {
    const list = taskObj?.filter((item) => item?.task_num === value);
    console.log(list?.[0]?.all_version);
    const treeData = [];
    list?.[0]?.all_version?.map((obj) => {
      treeData.push({
        key: obj?.object,
        title: `${obj?.object} ${obj?.version}`,
        // children: [
        //   {
        //     key: `${obj?.object}_${obj?.version}_${obj?.module}`,
        //     title: `${obj?.version} ${obj?.module}`,
        //   },
        // ],
        file: obj?.objectPath,
        module: obj?.module,
        version: obj?.version,
      });
    });
    // setObject(list?.[0]?.all_version);
    console.log(treeData);
    setObject([{ key: "objects", title: "Objects", children: treeData }]);
  };

  React.useEffect(() => {
    fetchRTBWorkspace();
  }, []);

  const handleObjectSelect = (selectedKeys, info) => {
    console.log(selectedKeys, info);

    fetchObjectData(info?.node?.key, info?.node?.file);
  };
  return (
    <Row style={{ backgroundColor: "#f8f8f8" }}>
      <Col
        span={6}
        style={{
          height: "100%",
        }}
      >
        <DirectoryTree
          treeData={rtbWspaces}
          showLine
          switcherIcon={<DownOutlined />}
          onSelect={onSelect}
          expandedKeys={["root"]}
          style={{ backgroundColor: "#f8f8f8" }}
          blockNode={true}
        />
      </Col>
      <Col
        span={18}
        style={{
          paddingLeft: 8,
          borderLeft: "1px solid #ddd",
          height: "70vh",
        }}
      >
        <>Tasks: </>
        <Select
          options={tasks}
          style={{ width: 100 }}
          onChange={taskSelection}
        />
        {/* <Table
          dataSource={object}
          columns={columns}
          size="small"
          pagination={false}
          //   showHeader={false}
          scroll={{ y: "62vh", x: 500 }}
          style={{ backgroundColor: "#f8f8f8", fontSize: 11 }}
          rowClassName="table-row"
          className="scroll-on-hover"
        /> */}
        <Tree
          treeData={object}
          showLine
          switcherIcon={<DownOutlined />}
          onSelect={handleObjectSelect}
          //   expandedKeys={["objects"]}
          style={{ backgroundColor: "#f8f8f8" }}
          blockNode={true}
        />
      </Col>
    </Row>
  );
}
