import { Col, Image, Row, Tag, Tree, Typography } from "antd";
import { DownOutlined } from "@ant-design/icons";
import React, { useEffect } from "react";
import VariableIcon from "../icons/Variable.png";
import CurlyBracesIcon from "../icons/CurlyBraces.png";
import ProcedureIcon from "../icons/Procedure.png";
import FunctionIcon from "../icons/Function.png";
import TempTableIcon from "../icons/Temp-Table.png";
import TableIcon from "../icons/Table.png";
import "../styles/main.css";
import { Category, ReturnSign } from "../lib/Symbols";
import { theme } from "antd";

const { useToken } = theme;

export default function CodeStructure(props) {
  const { token } = useToken();
  const { structure, editor } = props;
  const [treeData, setTreeData] = React.useState([]);
  const [expandedKeys, setExpandedKey] = React.useState(["root"]);

  const onSelect = (selectedKeys, info) => {
    const arr = selectedKeys[0].split("|");
    // console.log(Number(arr?.[1]), editor?.action);
    if (Number(arr?.[1])) {
      editor.revealLineInCenter(Number(arr?.[1]));
      editor.setPosition({ lineNumber: Number(arr?.[1]), column: 1 });
    }
  };

  const getIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "variables":
        return <Image src={VariableIcon} width={20} preview={false} />;
      case "include files":
        return <Image src={CurlyBracesIcon} width={16} preview={false} />;
      case "input output parameters":
        return <Image src={VariableIcon} width={20} preview={false} />;
      case "procedures":
        return <Image src={ProcedureIcon} width={20} preview={false} />;
      case "functions":
        return <Image src={FunctionIcon} width={20} preview={false} />;
      case "temp-tables":
        return <Image src={TempTableIcon} width={20} preview={false} />;
      default:
        break;
    }
  };

  const getDataTypeTag = (type, icon) => {
    switch (type?.toLowerCase()) {
      case "character":
      case "char":
        return (
          <Tag
            color="blue"
            title={type}
            style={{ fontSize: 10, lineHeight: "14px", fontWeight: "bold" }}
          >
            {icon ?? null} CHAR
          </Tag>
        );

      case "int":
      case "integer":
        return (
          <Tag
            color="gold"
            title={type}
            style={{ fontSize: 10, lineHeight: "14px", fontWeight: "bold" }}
          >
            {icon ?? null} INTG
          </Tag>
        );

      case "dec":
      case "decimal":
        return (
          <Tag
            color="orange"
            title={type}
            style={{ fontSize: 10, lineHeight: "14px", fontWeight: "bold" }}
          >
            {icon ?? null} DECI
          </Tag>
        );

      case "log":
      case "logical":
        return (
          <Tag
            color="purple"
            title={type}
            style={{ fontSize: 10, lineHeight: "14px", fontWeight: "bold" }}
          >
            {icon ?? null} LOGI
          </Tag>
        );

      case "date":
        return (
          <Tag
            color="cyan"
            title={type}
            style={{ fontSize: 10, lineHeight: "14px", fontWeight: "bold" }}
          >
            {icon ?? null} DATE
          </Tag>
        );
      case "datetime":
      case "datetime-tz":
        return (
          <Tag
            color="magenta"
            title={type}
            style={{ fontSize: 10, lineHeight: "14px", fontWeight: "bold" }}
          >
            {icon ?? null} DTTM
          </Tag>
        );
      case "handle":
        return (
          <Tag
            color="lime"
            title={type}
            style={{ fontSize: 10, lineHeight: "14px", fontWeight: "bold" }}
          >
            {icon ?? null} HNDL
          </Tag>
        );
      default:
        return (
          <Tag
            color="lime"
            title={type}
            style={{ fontSize: 10, lineHeight: "14px", fontWeight: "bold" }}
          >
            {icon ?? null} {type}
          </Tag>
        );
    }
  };

  const buildChildren = (arr, type) => {
    const list = [];
    arr?.map((variable) => {
      list.push({
        key: `${variable?.name}|${variable?.line?.lineNumber}`,
        title: (
          <>
            {type?.toLowerCase() === "functions" &&
              getDataTypeTag(variable?.retuns, <ReturnSign />)}
            {type?.toLowerCase() === "variables" &&
              getDataTypeTag(variable?.dataType)}
            <Typography.Text style={{ fontSize: 12, fontWeight: "normal" }}>
              {variable?.name}
            </Typography.Text>{" "}
            {/* {type?.toLowerCase() === "functions" && (
              <Typography.Text
                type="secondary"
                italic
                style={{ fontSize: 10 }}
                strong
              >
                {`() - Returns ${variable?.retuns}`}
              </Typography.Text>
            )}
            {type?.toLowerCase() === "variables" && (
              <Typography.Text
                type="secondary"
                italic
                style={{ fontSize: 10 }}
                strong
              >
                ({variable?.dataType})
              </Typography.Text>
            )} */}
          </>
        ),
        children: variable?.children || [],
        icon: variable?.icon || null,
      });
    });
    return {
      key: type,
      title: type,
      icon: getIcon(type),
      children: list,
    };
  };
  const makeTreeData = () => {
    const obj = {
      key: "root",
      title: (
        <>
          <Category /> <Typography.Text strong>Structure</Typography.Text>
        </>
      ),
      // structure?.object?.split("/")?.[
      //   structure?.object?.split("/")?.length - 1
      // ] +
      // " (Structure)",
      children: [],
    };

    const tempTableData = [];
    structure?.tempTables?.map((table) => {
      const fieldNodes = [];
      table?.fields?.map((field) => {
        fieldNodes.push({
          key: `${table?.name}-${field?.name}`,
          title: (
            <>
              {getDataTypeTag(field?.dataType?.replace(".", ""))}
              {field?.name}
            </>
          ),
        });
      });
      table.children = fieldNodes;
      table.icon = <Image src={TableIcon} width={16} preview={false} />;
      tempTableData.push(table);
    });
    // console.log(tempTableData);
    const variableTreeData = buildChildren(
      structure?.definedVariables,
      "Variables"
    );
    const includeTreeData = buildChildren(
      structure?.includeFiles,
      "Include Files"
    );
    const ioParamTreeData = buildChildren(
      structure?.ioParameters,
      "Input Output Parameters"
    );
    const procTreeData = buildChildren(structure?.procedures, "Procedures");
    const funcTreeData = buildChildren(structure?.functions, "Functions");
    const tempTableTreeData = buildChildren(tempTableData, "Temp-Tables");

    obj.children.push(
      includeTreeData,
      variableTreeData,
      ioParamTreeData,
      procTreeData,
      funcTreeData,
      tempTableTreeData
    );

    // console.log(obj);

    setTreeData([obj]);
    setExpandedKey(["root"]);
  };

  useEffect(() => {
    console.log("UseEffect");
    makeTreeData();
  }, [structure]);

  const treeExpand = (key) => {
    // console.log(key);
    setExpandedKey(key);
  };
  return (
    <Row>
      <Col
        span={24}
        style={{ height: "90vh", backgroundColor: `${token.colorBgLayout}` }}
        className="scroll-on-hover"
      >
        <Tree
          treeData={treeData}
          showLine
          showIcon={true}
          switcherIcon={<DownOutlined />}
          onSelect={onSelect}
          blockNode={true}
          style={{
            backgroundColor: `${token.colorBgLayout}`,
            fontSize: 13,
            // fontWeight: "bold",
          }}
          onExpand={treeExpand}
          expandedKeys={expandedKeys}
        />
      </Col>
    </Row>
  );
}
