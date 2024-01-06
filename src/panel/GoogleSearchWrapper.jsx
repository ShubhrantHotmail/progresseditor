import { Button, Col, Drawer, Row, Spin, Tabs } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import GoogleSearch from "./GoogleSearch";
import RTBTasks from "./RTBTasks";
import { useState } from "react";
import { useEffect } from "react";

export default function GoogleSearchWrapper(props) {
  const {
    open,
    setOpen,
    setFile,
    setFileHandle,
    setFileText,
    loading,
    setLoading,
  } = props;
  //   const [loading, setLoading] = useState({ object: false, task: false });

  useEffect(() => {
    console.log("UseEffect");
    if (loading.object === true) setOpen(false);
  }, [loading.object]);
  return (
    <Drawer
      //   title="RTB Google Search"
      closable={false}
      open={open}
      onClose={() => setOpen(false)}
      width="50%"
      bodyStyle={{ padding: 0, paddingLeft: 8 }}
    >
      {/* <Row justify="center">
        <Col span={24}>
          <GoogleSearch />
        </Col>
      </Row> */}
      <Spin
        spinning={
          loading.object === true ||
          loading.task === true ||
          loading.main === true
        }
      >
        <Tabs
          items={[
            {
              key: "rtb_task",
              label: "Tasks",
              children: (
                <RTBTasks
                  loading={loading}
                  setLoading={setLoading}
                  setFileText={setFileText}
                  setFile={setFile}
                  setFileHandle={setFileHandle}
                />
              ),
            },
            {
              key: "rtb_search",
              label: "Google Search",
              children: (
                <GoogleSearch
                  loading={loading}
                  setLoading={setLoading}
                  setFileText={setFileText}
                  setFile={setFile}
                  setFileHandle={setFileHandle}
                />
              ),
            },
          ]}
          tabBarExtraContent={
            <Button
              danger
              type="text"
              icon={<CloseOutlined />}
              onClick={() => setOpen(false)}
            >
              Close
            </Button>
          }
        />
      </Spin>
    </Drawer>
  );
}
