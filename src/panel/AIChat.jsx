import {
  Col,
  Row,
  Space,
  Input,
  Typography,
  Image,
  Card,
  Tag,
  Alert,
  Divider,
  Collapse,
  Descriptions,
  Table,
} from "antd";
import {
  BulbTwoTone,
  BulbOutlined,
  LoadingOutlined,
  CheckOutlined,
  ExclamationCircleOutlined,
  QuestionCircleTwoTone,
} from "@ant-design/icons";
import React from "react";
import { parseQuestion } from "./aiParser";
import { Request } from "../lib/apiRequest";
import { ENDPOINT } from "../lib/endpoints";
import { objectVersions, objectViewer, taskList } from "./aiResponse";

export function AIChat(props) {
  const { fetchObjectData, handleFile, handleSearch } = props;
  const [answers, setAnswers] = React.useState(null);
  const [query, setQuery] = React.useState("");
  const processQuery = async (query) => {
    const token = parseQuestion(query);
    console.log(token);
    setAnswers([token]);
    if (!token?.error && !token?.clarify) {
      if (token?.action === "openfile") {
        if (token?.date === "today") {
          const res = await handleSearch(token?.file, true);
          if (res?.Error) {
            setAnswers([{ error: "No files found for today" }]);
          } else {
            setAnswers([
              {
                response: "Search completed. Check file explorer panel",
                loaded: true,
              },
            ]);
          }
          return;
        }
        const res = await Request({
          url: ENDPOINT.handleFileApi("fileprops", token?.file),
        });
        if (res?.type === "error") {
          setAnswers([
            {
              error: `File not found ${token?.file}`,
            },
          ]);
          return;
        }
        setAnswers([
          {
            file: token?.file,
            response: `Opening file ${token?.file} in another tab.....`,
          },
        ]);
        setTimeout(() => {
          handleFile("read", token?.file);
          setAnswers([
            {
              file: token?.file,
              response: `${token?.file} has been opened in another tab`,
              loaded: true,
            },
          ]);
        }, 2000);
        return;
      }
      if (
        token?.action === "openfolder" ||
        token?.action === "folder" ||
        token?.action === "open"
      ) {
        const res = await handleSearch(token?.file);

        if (res?.Error) {
          setAnswers([{ error: res?.Error + " or file" }]);
        } else {
          setAnswers([
            {
              response: "Search completed. Check file explorer panel",
              loaded: true,
            },
          ]);
        }
        return;
      }
      if (token?.action === "objectversion") {
        objectVersions({ token, setAnswers, handleFile });
        return;
      }
      if (token?.action === "tasklist") {
        taskList({ token, setAnswers });
        return;
      }
      if (token?.action === "objectviewer") {
        objectViewer({ token, setAnswers });
        return;
      }
      setAnswers([
        { error: "I am bit confused at the moment. Try to be more specific" },
      ]);
    }
  };

  const Answers = ({ items }) => {
    return items?.map((item, index) => (
      <Card
        key={index}
        // title={item.query}
        size="small"
        bordered={false}
        style={{ marginBottom: 16, maxHeight: "72vh" }}
        className="scroll-on-hover"
      >
        {item?.error ? (
          <Space direction="vertical">
            <Alert
              type="default"
              description={item.error}
              showIcon
              style={{ fontFamily: "monospace", fontWeight: "bold" }}
              icon=<ExclamationCircleOutlined style={{ color: "#E74C3C" }} />
            />
            {item.suggest && (
              <>
                <Divider style={{ margin: 0 }} />
                <Alert
                  type="default"
                  icon={<BulbTwoTone />}
                  message="Tips"
                  description={item.suggest?.map((s, i) => {
                    return (
                      <Typography.Text
                        key={i}
                        style={{ fontFamily: "monospace" }}
                      >
                        <ul>
                          <li>{s}</li>
                        </ul>
                      </Typography.Text>
                    );
                  })}
                  showIcon
                />
              </>
            )}
          </Space>
        ) : item?.clarify ? (
          <Alert
            type="default"
            description={item?.clarify}
            showIcon
            style={{ fontFamily: "monospace", fontWeight: "bold" }}
            icon=<QuestionCircleTwoTone />
          />
        ) : (
          <Typography.Text style={{ fontFamily: "monospace" }}>
            {item?.loaded ? (
              //   <CheckOutlined style={{ color: "#28B463" }} />
              <Alert
                type="default"
                description={item?.response}
                message={item?.message}
                showIcon
                style={{ fontFamily: "monospace" }}
                icon=<ExclamationCircleOutlined style={{ color: "#28B463" }} />
              />
            ) : (
              <LoadingOutlined />
            )}{" "}
            {item?.loaded ? null : item?.response}
            {/* {JSON.stringify(item)} */}
          </Typography.Text>
        )}
      </Card>
    ));
  };
  return (
    <Row>
      <Col span={24}>
        <Space direction="vertical" style={{ width: "100%" }}>
          <Typography.Title level={4} style={{ margin: 4 }}>
            <Image
              width="24"
              height="24"
              src="https://img.icons8.com/fluency/40/artificial-intelligence--v1.png"
              alt="artificial-intelligence"
              preview={false}
            />{" "}
            Ask AI
          </Typography.Title>
          <Input.Search
            auoSize={true}
            onSearch={() => setAnswers(null)}
            onPressEnter={(e) => processQuery(e.target.value)}
            size="large"
            enterButton={<BulbOutlined />}
            placeholder="Ask your queries here..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div style={{ maxHeight: "80vh" }} className="scroll-on-hover">
            <Answers items={answers} />
            {!answers && (
              <div>
                <Space>
                  <Image
                    width="78"
                    height="78"
                    src="https://img.icons8.com/external-filled-color-icons-papa-vector/100/external-Suggestions-machine-learning-filled-color-icons-papa-vector.png"
                    alt="external-Suggestions-machine-learning-filled-color-icons-papa-vector"
                    preview={false}
                  />
                  <Typography.Title>Try asking the followings</Typography.Title>
                </Space>
                <ul>
                  <li>{`Open file <Full path of the file>`}</li>
                  <li>{`Open folder <Full path of the file>`}</li>
                  <li>
                    <a
                      onClick={() => {
                        setQuery("Open my home folder");
                        processQuery("Open my home folder");
                      }}
                    >
                      Open <b>my</b> home folder
                    </a>
                  </li>
                  <li>
                    <a
                      onClick={() => {
                        setQuery("Open my work folder");
                        processQuery("Open my work folder");
                      }}
                    >
                      Open <strong>my</strong> work folder
                    </a>
                  </li>
                  <li>{`Open DI folder in area ut... or any TIS area you like`}</li>
                  <li>
                    <a
                      onClick={() => {
                        setQuery("Open Appserver log folder");
                        processQuery("Open Appserver log folder");
                      }}
                    >
                      Open Appserver log folder
                    </a>
                  </li>
                  <li>{`Create file <filename> in <Full path of the file>`}</li>
                  <li>{`Create folder <foldername> in <Full path of the file>`}</li>
                  <li>
                    list .txt files from folder contracthub/log of trdimp in sp8
                  </li>
                </ul>
                <Typography.Title level={4} style={{ marginLeft: 24 }}>
                  More integrations coming soon.....
                </Typography.Title>
              </div>
            )}
          </div>
        </Space>
      </Col>
    </Row>
  );
}
