import { Button, Drawer } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { theme } from "antd";
import { useMonaco } from "@monaco-editor/react";
import { useEffect } from "react";
// import { setupABLLanguage } from "../lib/editorConfig";

const { useToken } = theme;
const diffContainerId = Math.random().toString(16).slice(2);

export default function DiffProEditor(props) {
  const { open, setOpen } = props;
  const { token } = useToken();

  try {
    var monaco = useMonaco();
    // console.log(monaco.KeyCode);
  } catch (error) {
    console.error("Monaco Error:", error);
  }

  useEffect(() => {
    console.log("UseEffect");
    if (document.getElementById(diffContainerId)) {
      document.getElementById(diffContainerId).remove();
    }
    if (!monaco || !document.getElementById("diff-container")) return;
    const container = document.createElement("div");
    container.setAttribute("id", diffContainerId);
    container.style.height = "100%";
    document.getElementById("diff-container").appendChild(container);
    // setupABLLanguage(monaco);
    const originalModel = monaco.editor.createModel(
      localStorage.getItem("original"),
      "abl"
    );
    const modifiedModel = monaco.editor.createModel(
      localStorage.getItem("changed"),
      "abl"
    );
    const diffEditor = monaco.editor.createDiffEditor(container, {
      originalEditable: true,
      automaticLayout: true,
      language: "abl",
      fontSize: "13px",
      copyWithSyntaxHighlighting: true,
    });
    monaco.editor.setTheme("myTheme");
    diffEditor.setModel({
      original: originalModel,
      modified: modifiedModel,
    });
  }, [monaco, open]);

  const handleClose = () => {
    setOpen(false);
    if (monaco) {
      // monaco.editor.getModels().forEach((model) => model.dispose());
      document.getElementById(diffContainerId).remove();
    }
  };

  return (
    <Drawer
      open={open}
      onClose={handleClose}
      placement="left"
      width="100%"
      closable={false}
      title="Diff Viewer"
      bodyStyle={{ padding: 0 }}
      headerStyle={{
        backgroundColor: `${token?.colorBgContainer}`,
        padding: 0,
        paddingLeft: 8,
      }}
      extra={
        <Button
          type="text"
          icon={<CloseOutlined />}
          danger
          onClick={handleClose}
        />
      }
    >
      <div
        style={{ height: "96vh", backgroundColor: `${token?.colorBgLayout}` }}
        id="diff-container"
      />
    </Drawer>
  );
}
