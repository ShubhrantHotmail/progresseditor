import { List, ListItem, ListItemButton, ListItemDecorator } from "@mui/joy";
import { Close } from "../lib/Symbols";
import ConnectionIcon from "../icons/Connection.png";
import {
  Image,
  Button,
  Typography,
  Modal,
  notification,
  Badge,
  Tag,
  Space,
} from "antd";
import { getFileIcon } from "../lib/editorConfig";
import { useContext } from "react";
import { GlobalContext } from "../GlobalContext";
import { Request } from "../lib/apiRequest";
import { ENDPOINT } from "../lib/endpoints";

export default function FileList(props) {
  const [state, payload] = useContext(GlobalContext);
  const {
    token,
    setMode,
    currentIndex,
    setCurrentIndex,
    codeList,
    setCodeList,
    setFileText,
    setFile,
  } = props;

  const handleItemClick = (index) => {
    setCurrentIndex(index);
    setMode(index === 0 ? "explorer" : "code");
    if (index === 0) {
      setFileText(null);
      // setCodeList([]);
      payload({ type: "FILE_OPEN_MODE", value: null });
      payload({ type: "REMOTE_FILE", value: "" });
      payload({ type: "SAVED", value: null });
      payload({ type: "FILE_STATE", value: "new" });
      return;
    }
    const obj = codeList?.find((item) => item?.fileIndex === index);

    setFile(obj?.fileName);
    setFileText(obj?.modifiedText);
    localStorage.setItem("original", obj?.originalText);
    localStorage.setItem("changed", obj?.modifiedText);
    payload({ type: "FILE_OPEN_MODE", value: obj?.fileSource });
    payload({ type: "REMOTE_FILE", value: obj?.filePath });
    payload({ type: "SAVED", value: obj?.saved });
    payload({ type: "FILE_STATE", value: "edit" });
    console.log(state?.fileList);
    // localStorage.setItem("currentFile", JSON.stringify(obj));
  };

  const closeItem = (index) => {
    codeList.splice(index, 1);

    setCodeList([...codeList]);
    payload({ type: "FILE_LIST", value: [...codeList] });
    handleItemClick(index);
  };

  const handleFileSave = async (fileObject) => {
    console.log(fileObject);
    const res = await Request({
      url: ENDPOINT.fileHandlerApi(),
      method: "post",
      data: {
        filename: fileObject?.filePath,
        targetFile: fileObject?.filePath,
        content: fileObject?.modifiedText,
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
    return;
  };

  const handleItemClose = (index) => {
    if (codeList[index]?.saved === false) {
      Modal.confirm({
        title: "Unsaved File",
        content: (
          <>
            <p>{`${codeList[index]?.fileName} has been modified. Save changes?`}</p>
          </>
        ),
        // okText: "Save",
        onOk: () => handleFileSave(codeList[index]),
        footer: (
          <div style={{ textAlign: "right", marginTop: 32 }}>
            <Space>
              <Button key="submit" type="primary" size="small">
                Save
              </Button>
              <Button onClick={() => closeItem(index)} size="small">
                Don't Save
              </Button>
              <Button key="back" size="small">
                Cancel
              </Button>
            </Space>
          </div>
        ),
      });
      return;
    }

    closeItem(index);
  };

  return (
    <>
      <List size="sm">
        <ListItem>
          <ListItemButton
            selected={currentIndex === 0}
            style={
              currentIndex === 0
                ? {
                    color: `${token.colorPrimaryActive}`,
                    backgroundColor: `${token.colorPrimaryBgHover}`,
                    borderBottom: `2px solid ${token.colorBorder}`,
                  }
                : {
                    color: `${token.colorText}`,
                    borderBottom: `2px solid ${token.colorBorder}`,
                  }
            }
            onClick={() => handleItemClick(0)}
          >
            <ListItemDecorator>
              <Image preview={false} width={24} src={ConnectionIcon} />
            </ListItemDecorator>
            Code Explorer
          </ListItemButton>
        </ListItem>
        {codeList?.map((code, index) => {
          return (
            <ListItem
              endAction={
                <Button
                  type="text"
                  icon={<Close />}
                  size="small"
                  onClick={() => handleItemClose(index)}
                />
              }
              color={token.colorPrimary}
              key={`filelist-item-${index}`}
              title={code?.fileName?.length > 20 ? code?.fileName : ""}
            >
              <ListItemButton
                selected={currentIndex === index + 1}
                style={
                  currentIndex === index + 1
                    ? {
                        color: `${token.colorPrimaryActive}`,
                        backgroundColor: `${token.colorPrimaryBgHover}`,
                        fontSize: 12,
                      }
                    : { color: `${token.colorText}`, fontSize: 12 }
                }
                onClick={() => handleItemClick(index + 1)}
              >
                <ListItemDecorator>
                  <Image
                    src={getFileIcon(code?.fileName)}
                    width={12}
                    preview={false}
                  />
                </ListItemDecorator>
                <Typography.Text
                  ellipsis
                  style={{ fontSize: 12 }}
                  title={code?.fileName?.length > 20 ? code?.fileName : ""}
                >
                  {code?.fileName}
                </Typography.Text>
                {code?.saved === false && (
                  <Badge status="warning" dot title="Unsaved" />
                )}
                {/* <Tag
                color="error"
                style={{ fontSize: 9, padding: 2, lineHeight: "10px" }}
              >
                unsaved
              </Tag> */}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Modal></Modal>
    </>
  );
}
