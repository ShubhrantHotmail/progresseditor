import React from "react";
import {
  Col,
  Dropdown,
  Row,
  Select,
  Space,
  Input,
  Typography,
  Tag,
} from "antd";
import "./style.css";
import {
  CodeLanguage,
  Computer,
  FontFamily,
  FontSize,
  RTB,
  Server,
} from "../lib/Symbols";
import { GlobalContext } from "../GlobalContext";

export default function EditorFooter(props) {
  const { position, editorProps, callback, file } = props;
  const [state, payload] = React.useContext(GlobalContext);
  const fonts = [
    { label: "Courier New", value: "Courier New" },
    { label: "Monospace", value: "Monospace" },
    { label: "Lucida Console", value: "Lucida Console" },
  ];

  // console.log(state);
  const langs = [
    { label: "Progress 4GL", value: "abl" },
    { label: "Plain Text", value: "plaintext" },
    { label: "Javascript", value: "javascript" },
    { label: "JSON", value: "json" },
    { label: "XML", value: "xml" },
    { label: "HTML", value: "html" },
    { label: "Shell Script", value: "shell" },
    { label: "Python", value: "python" },
    { label: "Log File", value: "restructuredtext" },
  ];

  const sizes = [
    { label: "9", value: "9" },
    { label: "10", value: "10" },
    { label: "11", value: "11" },
    { label: "12", value: "12" },
    { label: "13", value: "13" },
    { label: "14", value: "14" },
    { label: "15", value: "15" },
    { label: "16", value: "16" },
    { label: "17", value: "17" },
    { label: "18", value: "18" },
  ];

  const FileTypeTag = ({ mode }) => {
    switch (mode) {
      case "rtb":
        return (
          <Tag color="green">
            <RTB style={{ fontSize: 18, color: "green", marginRight: 4 }} />
            RTB FILE
          </Tag>
        );
      case "remote":
        return (
          <Tag color="orange">
            <Server style={{ fontSize: 18, marginRight: 4 }} />
            REMOTE FILE
          </Tag>
        );
      default:
        return (
          <Tag color="geekblue">
            <Computer style={{ fontSize: 18, color: "blue", marginRight: 4 }} />
            LOCAL FILE
          </Tag>
        );
    }
  };

  return (
    <div className="footer">
      <Row>
        <Col span={8} style={{ textAlign: "left" }}>
          <Space>
            <FileTypeTag mode={state?.fileOpenMode} />
            <Typography.Text style={{ fontSize: 12 }} strong>
              {file}
            </Typography.Text>
          </Space>
        </Col>
        <Col span={8} style={{ textAlign: "right", fontSize: 11 }}>
          <Space>
            <span>{`Line ${position.lineNumber}, `}</span>
            <span>{`Col ${position.column}`}</span>
          </Space>
        </Col>
        <Col span={8} style={{ textAlign: "right", fontSize: 11 }}>
          <Space>
            <CodeLanguage style={{ fontSize: 16 }} />
            <Select
              bordered={false}
              size="small"
              options={langs}
              style={{ width: 120, textAlign: "left" }}
              value={editorProps?.lang}
              onChange={(value) => callback && callback("lang", value)}
              suffixIcon={null}
              listHeight={
                320
              } /* Number of options * 32. In this case there are 9 option, 1 more included as placeholderr */
            />
            <FontFamily style={{ fontSize: 16 }} />
            <Select
              options={fonts}
              size="small"
              bordered={false}
              style={{ width: 120, textAlign: "left" }}
              value={editorProps?.fontFamily}
              onChange={(value) => callback && callback("fontfamily", value)}
              suffixIcon={null}
            />
            <FontSize style={{ fontSize: 16 }} />
            <Select
              options={sizes}
              size="small"
              bordered={false}
              style={{ width: 64, textAlign: "left" }}
              value={editorProps?.fontSize}
              onChange={(value) => callback && callback("fontsize", value)}
              suffixIcon={null}
            />
          </Space>
        </Col>
      </Row>
    </div>
  );
}
