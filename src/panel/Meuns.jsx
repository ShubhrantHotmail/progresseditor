import React, { useState } from "react";
import { Keys, Menu, MenuBar, Separator } from "react-app-menu";
// import {
//   AiFillFolderOpen,
//   FaPencilAlt,
//   FaRegFile,
//   FiBook,
//   GoSearch,
//   MdSettings,
// } from "react-icons/all";
import "react-app-menu/dist/styles/react-app-menu.css";

export default function Menus(props) {
  const { monaco, editor } = props;
  let [showToolbar, setShowToolbar] = useState(true);
  let [showTooltip, setShowTooltip] = useState(false);

  console.log(monaco, editor);
  const handleMenuSelect = (menuId) => {
    switch (menuId) {
      case "toolbar":
        return setShowToolbar(!showToolbar);
      case "toolTips":
        return setShowTooltip(!showTooltip);
      default:
        console.log(`menu selected ${menuId}`);
    }
  };

  const onFolderSelect = () => {
    console.log("Folder selected");
  };

  const handleFileSave = () => {
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      console.log("Save");
    });
  };

  return (
    <div
      style={{
        background: "#FBFBFB",
        borderBottom: "1px solid rgb(218, 220, 224)",
      }}
    >
      <MenuBar onSelect={handleMenuSelect}>
        <Menu label="File" focusKey={"F"}>
          {/* <Menu label="New"> */}
          <Menu
            menuId="NewFile"
            label="New File (Ctrl+N)"
            hotKeys={Keys.ctrl("N")}
          />
          <Menu
            menuId="OpenFile"
            label="Open File (Ctrl+O)"
            //   icon={<FaRegFile />}
            hotKeys={Keys.ctrl("O")}
          />
          <Menu
            menuId="OpenRemoteFile"
            label="Open Remote File (Alt+Ctrl+N)"
            //   icon={<FaRegFile />}
            hotKeys={Keys.ctrlAlt("N")}
          />
          <Separator />
          <Menu
            menuId="Save"
            label="Save"
            //   icon={<AiFillFolderOpen />}
            hotKeys={Keys.ctrlAlt("F")}
            onSelect={handleFileSave}
          />
          <Menu
            menuId="SaveAs"
            label="Save As"
            //   icon={<AiFillFolderOpen />}
            hotKeys={Keys.ctrlAlt("F")}
            onSelect={onFolderSelect}
          />
        </Menu>
        {/* <Menu
          label="Settings"
          // icon={<MdSettings />}
          hotKeys={Keys.altShift("S")}
        /> */}
        {/* </Menu> */}
        <Menu label="Edit" focusKey="E">
          <Menu
            menuId="search"
            label="Search"
            // icon={<GoSearch />}
            hotKeys={Keys.ctrlShift("F")}
          />
          <Menu menuId="undo" label="Undo" hotKeys={Keys.ctrl("Z")} />
          <Menu
            menuId="rename"
            label="Rename"
            // icon={<FaPencilAlt />}
            hotKeys={Keys.shift("F6")}
          />
        </Menu>
        <Menu label="View" focusKey="V">
          <Menu
            menuId="toolbar"
            label="Toolbars"
            checked={showToolbar}
            hotKeys={Keys.ctrlAlt("T")}
          />
          <Menu menuId="statusBar" label="StatusBar" />
          <Menu
            menuId="toolTips"
            label="Tooltips"
            checked={showTooltip}
            hotKeys={Keys.ctrlAltShift("T")}
          />
        </Menu>
      </MenuBar>
    </div>
  );
}
