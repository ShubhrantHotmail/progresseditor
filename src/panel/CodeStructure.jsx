import { Col, Image, Row, Tree, Typography } from "antd";
import { DownOutlined } from "@ant-design/icons";
import React, { useEffect } from "react";
import VariableIcon from "../icons/Variable.png";
import CurlyBracesIcon from "../icons/CurlyBraces.png";
import ProcedureIcon from "../icons/Procedure.png";
import FunctionIcon from "../icons/Function.png";
import "../styles/main.css";
import { Category } from "../lib/Symbols";

export default function CodeStructure(props) {
  const { structure, editor } = props;
  const [treeData, setTreeData] = React.useState([]);

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

      default:
        break;
    }
  };
  const buildChildren = (arr, type) => {
    const list = [];
    arr?.map((variable) => {
      list.push({
        key: `${variable?.name}|${variable?.line?.lineNumber}`,
        title: (
          <>
            <Typography.Text>{variable?.name}</Typography.Text>{" "}
            {type?.toLowerCase() === "functions" && (
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
            )}
          </>
        ),
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
    obj.children.push(
      includeTreeData,
      variableTreeData,
      ioParamTreeData,
      procTreeData,
      funcTreeData
    );
    setTreeData([obj]);
  };

  useEffect(() => {
    // console.log(structure);
    makeTreeData();
  }, [structure]);

  return (
    <Row>
      <Col
        span={24}
        style={{ height: "93vh", backgroundColor: "#f8f8f8" }}
        className="scroll-on-hover"
      >
        <Tree
          treeData={treeData}
          showLine
          showIcon={true}
          switcherIcon={<DownOutlined />}
          onSelect={onSelect}
          blockNode={true}
          style={{ backgroundColor: "#f8f8f8" }}
          defaultExpandedKeys={["root"]}
        />
      </Col>
    </Row>
  );
}
