import { Button, Col, Drawer, Row } from "antd";
import { Setting } from "../lib/Symbols";
import { CloseOutlined } from "@ant-design/icons";
import { theme } from "antd";

const { useToken } = theme;

export default function EditorSettings(props) {
  const { token } = useToken();
  const { open, setOpen } = props;
  return (
    <Drawer
      open={open}
      onClose={() => setOpen(false)}
      closable={false}
      placement="right"
      width="100%"
      bodyStyle={{ padding: 0 }}
      title={
        <>
          <Setting style={{ fontSize: 24, marginRight: 8 }} />
          Settings
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
      headerStyle={{ backgroundColor: `${token.colorBgLayout}`, padding: 0 }}
    >
      <Row
        style={{ height: "96vh", backgroundColor: `${token.colorBgContainer}` }}
      >
        <Col
          span={8}
          style={{ borderRight: `1px solid ${token.colorBorderSecondary}` }}
        />
        <Col
          span={8}
          style={{ borderRight: `1px solid ${token.colorBorderSecondary}` }}
        />
        <Col span={8} />
      </Row>
    </Drawer>
  );
}
