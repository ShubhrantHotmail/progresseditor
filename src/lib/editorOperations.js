import { notification } from "antd";
import { Request } from "./apiRequest";
import { ENDPOINT } from "./endpoints";
import {
  getAllFunctions,
  getAllIOParameters,
  getAllIncludes,
  getAllProcedures,
  getAllVariables,
  getCurlyContent,
  getSourceCode,
  getTempTables,
} from "../parser/sourceParser";

export function recordFileChange() {
  let changed = false;

  return changed;
}

export async function getFileText(fileHandle) {
  if (!fileHandle) return { file: null, contents: "" };
  const file = await fileHandle.getFile();
  const contents = await file.text();
  return { file, contents };
}

export async function OpenFile(setFileHandle, setFile, setCode, payload) {
  try {
    const [handle] = await window.showOpenFilePicker();
    setFileHandle(handle);
    // we don't want to handle e.g. folders in this example
    if (handle.kind !== "file") {
      alert("Please select a file, not a folder");
      return;
    }

    // const file = await handle.getFile();
    // setFile(file?.name);
    // console.log(file);
    // const contents = await file.text();

    const fileDetail = await getFileText(handle);
    setFile(fileDetail?.file?.name);
    // console.log(await file.stream());
    setCode(fileDetail?.contents);

    if (payload) {
      payload({ type: "FILE_OPEN_MODE", value: "local" });
      payload({ type: "REMOTE_FILE", value: null });
    }
  } catch (error) {
    console.error("Open File", error);
  }
}

export async function saveAsFile(
  setFileHandle,
  editor,
  setFile,
  setCode,
  payload
) {
  try {
    const handle = await window.showSaveFilePicker();
    setFileHandle(handle);

    const writable = await handle.createWritable();
    await writable.write(editor?.getValue());
    await writable.close();

    const fileDetail = await getFileText(handle);
    setFile(fileDetail?.file?.name);
    setCode(fileDetail?.contents);

    if (payload) {
      payload({ type: "FILE_OPEN_MODE", value: "local" });
      payload({ type: "REMOTE_FILE", value: null });
    }
  } catch (error) {
    console.error("Save AS", error);
  }
}

export async function saveFile(
  setFileHandle,
  fileHandle,
  editor,
  setFile,
  setCode,
  payload,
  state
) {
  // console.log(state?.fileOpenMode, state?.remoteFile);
  if (state?.fileOpenMode !== "local" && state?.remoteFile) {
    const res = await Request({
      url: ENDPOINT.fileHandlerApi(),
      method: "post",
      data: {
        filename: state?.remoteFile,
        targetFile: state?.targetFile,
        content: editor?.getValue(),
        action: "modify",
        tisid: "sn3",
      },
    });
    if (res?.type === "error") {
      notification.error({
        placement: "topLeft",
        description: res?.message,
        message: "Save Error",
        duration: 0,
      });
      return;
    }
    payload({ type: "SAVED", value: true });
    const fileList = state?.fileList;

    if (fileList) {
      const obj = fileList?.find(
        (item) => item?.filePath === state?.remoteFile
      );
      if (obj) obj.saved = true;
      payload({ type: "FILE_LIST", value: fileList });
    }
  } else {
    if (!fileHandle) {
      saveAsFile(setFileHandle, editor, setFile, setCode, payload);
      return;
    }
    window.onbeforeunload = null;
    // event.preventDefault();
    // Request permission to edit the file
    await fileHandle.requestPermission({ mode: "readwrite" });
    // console.log(editor?.getValue());
    const writable = await fileHandle.createWritable();
    await writable.write(editor?.getValue());
    await writable.close();
  }
}

export function getCodeStructure(editor) {
  const parsedCode = getSourceCode(editor.getValue());
  const includeFiles = getAllIncludes(parsedCode, editor);
  const definedVariables = getAllVariables(parsedCode, editor);
  const ioParameters = getAllIOParameters(parsedCode, editor);
  const procedures = getAllProcedures(parsedCode, editor);
  const functions = getAllFunctions(parsedCode, editor);
  const tempTables = getTempTables(parsedCode, editor);
  // const comments = getAllCommentedLines(parsedCode, editor);
  const curls = getCurlyContent(parsedCode, editor);

  // const decor = [...curls, ...comments];
  const decor = [curls];
  return {
    includeFiles,
    definedVariables,
    ioParameters,
    procedures,
    functions,
    tempTables,
    decor,
  };
}
