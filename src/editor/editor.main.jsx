import React from "react";
// import { Editor, useMonaco } from "@monaco-editor/react";
import "@fontsource/roboto-mono"; // Defaults to weight 400
import "@fontsource/roboto-mono/400.css"; // Specify weight
import "@fontsource/roboto-mono/400-italic.css"; // Specify weight and style
import "../styles/main.css";
import { highlight } from "../languages/abl";

export default function OEeditor() {
  const [text, setText] = React.useState("");
  // const monaco = useMonaco();

  // const editorWillMount = (monaco) => {
  //   if (!monaco.languages.getLanguages().some(({ id }) => id === "openedge")) {
  //     monaco.languages.register({ id: "openedge" });
  //     console.log(monaco?.languages?.getLanguages());
  //   }
  // };
  // monaco.languages.register({ id: "openedge" });
  // console.log(monaco?.languages?.getLanguages());
  var editor, editorUnderlay;
  function initialize() {
    const editorContainer = document.querySelector(".container");
    editor = editorContainer.querySelector(".editor");
    editor.setAttribute("contenteditable", "true");

    const editorContainerUnderlay = document.querySelector(
      ".container-underlay"
    );
    editorUnderlay = editorContainerUnderlay.querySelector(".editor");
  }

  React.useEffect(() => {
    initialize();
  }, [text]);

  function checkChange(e) {
    const highlitedText = highlight(e.currentTarget.innerText);
    console.log(editorUnderlay.innerHTML);
    editorUnderlay.innerHTML = `<div>${highlitedText}</div>`;
    // if (!editor?.innerText?.trim())
    // setCursorToEnd(editor);
  }
  return (
    // <Editor
    //   height="90vh"
    //   defaultLanguage="openedge"
    //   // editorWillMount={editorWillMount}
    // />
    <div>
      <div className="container">
        <div className="code-line">
          <div>1</div>
        </div>
        <div className="editor" spellCheck={false} onKeyUp={checkChange} />
      </div>
      <div className="container-underlay">
        <div className="code-line">
          <div>1</div>
        </div>
        <div className="editor" spellCheck={false} />
      </div>
    </div>
  );
}
