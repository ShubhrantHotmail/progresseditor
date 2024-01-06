import { Card, Col, Divider, Image, Input, Row, Typography, theme } from "antd";
import "../styles/main.css";
import { Request } from "../lib/apiRequest";
import { ENDPOINT } from "../lib/endpoints";
import { useState } from "react";
import ProEditor from "../editor/ProEditor";
import { CodeLanguage } from "../lib/Symbols";
import Code from "../icons/CodeSmall.png";
import Version from "../icons/VersionSmall.png";
import Module from "../icons/ModuleSmall.png";
import { useContext } from "react";
import { GlobalContext } from "../GlobalContext";

const { useToken } = theme;

export default function GoogleSearch(props) {
  const { loading, setLoading, setFileText, setFileHandle, setFile } = props;
  const { Search } = Input;
  const { token } = useToken();
  const [state, payload] = useContext(GlobalContext);
  const [searchText, setSearchText] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [m, setM] = useState(null);
  const [e, setE] = useState(null);
  const [f, setF] = useState(null);
  const [c, setC] = useState(null);
  const [s, setS] = useState(null);
  const [p, setP] = useState(null);

  const showCode = async (obj) => {
    setLoading({ ...loading, main: true });
    const res = await Request({
      url: ENDPOINT.codeTextGetter(obj?.object, obj?.version),
    });

    if (res?.codeText) {
      setFileText(res?.codeText);
      setFileHandle(null); // Reset local file handle
      setFile(obj?.object);
      localStorage.setItem("original", res?.codeText);
      payload({ type: "FILE_OPEN_MODE", value: "rtb" });
      payload({ type: "REMOTE_FILE", value: null });
      payload({ type: "SAVED", value: true });
      payload({ type: "FILE_STATE", value: "new" });
    }
    setLoading({ ...loading, main: false });
  };
  const lineFunction = (lineNum, list) => {
    return list[lineNum - 1] ?? lineNum;
  };

  const handleCodeSearch = async () => {
    const el = document.getElementById("search-result-container");
    const cards = el.querySelectorAll(".ant-card");
    // console.log(cards.length);
    cards.forEach((card) => {
      el.removeChild(card);
    });

    const res = await Request({
      url: ENDPOINT.searchRtb(searchText, "4-prod", false, false),
    });
    setSearchResult(res?.codes || []);
  };

  return (
    <Row>
      <Col span={24}>
        <Search
          placeholder="Search RTB Codebase"
          // bordered={false}
          allowClear={true}
          enterButton="Search"
          onSearch={handleCodeSearch}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          size="large"
        />
        <div>
          <Typography.Paragraph type="warning" style={{ paddingTop: 8 }} code>
            Search result: {searchResult?.length} objects matched
          </Typography.Paragraph>
        </div>
        <Divider style={{ marginTop: 8, marginBottom: 8 }} />
      </Col>
      <Col
        span={24}
        style={{ height: "78vh", padding: 4 }}
        className="scroll-on-hover"
      >
        <div id="search-result-container">
          {searchResult?.map((result, index) => {
            let resultLines = "";
            result?.codelines?.map((lines) => {
              resultLines =
                resultLines === ""
                  ? lines?.codeline
                  : resultLines + "\n" + lines?.codeline;
            });
            const lines = result?.codelines?.map((line) => {
              return line?.linenum;
            });
            const editorHeight =
              result?.codelines?.length * 24 < 40
                ? 40
                : result?.codelines?.length * 20 + 12;
            return (
              <div
                key={`${result?.object}_${index}_${result?.codelines?.length}`}
                style={{
                  padding: 4,
                  border: `1px solid ${token.colorBorder}`,
                  borderRadius: 8,
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    padding: "0px 12px 8px 8px",
                    borderBottom: `1px solid ${token.colorBorder}`,
                  }}
                >
                  <Typography.Link code strong onClick={() => showCode(result)}>
                    <Image src={Code} preview={false} /> {result?.object}
                  </Typography.Link>
                  <Typography.Text code>
                    <Image src={Version} preview={false} /> {result?.version}
                  </Typography.Text>
                  <Typography.Text code type="warning">
                    <Image src={Module} preview={false} /> {result?.module}
                  </Typography.Text>
                </div>
                <ProEditor
                  height={`${editorHeight}px`}
                  code={resultLines}
                  lang="abl"
                  fontSize="13px"
                  setMonaco={setM}
                  setEditor={setE}
                  setFileText={setF}
                  setCode={setC}
                  setSelectedText={setS}
                  setCursorPosition={setP}
                  lineFunction={(lineNumber) => lineFunction(lineNumber, lines)}
                  readOnly={true}
                />
              </div>
            );
          })}
        </div>
      </Col>
    </Row>
  );
}
