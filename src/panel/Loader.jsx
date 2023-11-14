import React from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";

export default function Loader({ children, loading, message }) {
  // console.log(loading, message);
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
  return (
    <Spin indicator={antIcon} spinning={loading} tip={message}>
      {children}
    </Spin>
  );
}
