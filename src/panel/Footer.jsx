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
  Button,
  Divider,
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
import { theme } from "antd";
import ThemeChanger from "./ThemeChanger";

const { useToken } = theme;

export default function EditorFooter(props) {
  const { token } = useToken();
  const {
    position,
    editorProps,
    callback,
    file,
    size,
    codeList,
    setCodeList,
    currentIndex,
    showThemeChanger,
    showFileDetails,
  } = props;
  const [state, payload] = React.useContext(GlobalContext);
  const [filename, setFilename] = React.useState(file);
  const originalCode = localStorage.getItem("original");

  const fonts = [
    { label: "Courier New", value: "Courier New" },
    { label: "Monospace", value: "Monospace" },
    { label: "Lucida Console", value: "Lucida Console" },
  ];

  // console.log(state);
  const langs = [
    { label: "Progress 4GL", value: "abl" },
    { label: "Plain Text", value: "plaintext" },
    { label: "Java", value: "java" },
    { label: "C Lang", value: "c" },
    { label: "Javascript", value: "javascript" },
    { label: "JSON", value: "json" },
    { label: "XML", value: "html" },
    { label: "HTML", value: "html" },
    { label: "Shell Script", value: "shell" },
    { label: "Python", value: "python" },
    { label: "Log File", value: "log" },
    { label: "INI File", value: "ini" },
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

  React.useEffect(() => {
    console.log("UseEffect", state, file);
    if (state?.saved === false) setFilename(file + "*");
    else setFilename(file);

    const obj = codeList?.find((item) => item?.fileIndex === currentIndex);
    if (obj) obj.saved = state?.saved;
    setCodeList([...codeList]);
  }, [state?.saved, state?.remoteFile]);

  return (
    <div
      className="footer"
      style={{
        backgroundColor: `${token.colorBgLayout}`,
        borderTop: `1px solid ${token.colorBorder}`,
      }}
    >
      <Row>
        <Col span={12} style={{ textAlign: "left" }}>
          {showFileDetails === true && (
            <Space>
              <FileTypeTag mode={state?.fileOpenMode} />
              <Typography.Text style={{ fontSize: 12 }} strong>
                {filename}
              </Typography.Text>
              <Divider type="vertical" />
              <Typography.Text style={{ fontSize: 12 }} strong>
                Size: {size}
              </Typography.Text>
            </Space>
          )}
        </Col>
        <Col span={4} style={{ textAlign: "right", fontSize: 11 }}>
          <Space>
            <span
              style={{ color: token.colorText }}
            >{`Line ${position.lineNumber}, `}</span>
            <span
              style={{ color: token.colorText }}
            >{`Col ${position.column}`}</span>
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
            {showThemeChanger === true && (
              <ThemeChanger
                bordered={false}
                style={{ width: 140, textAlign: "left" }}
              />
            )}
          </Space>
        </Col>
      </Row>
    </div>
  );
}
