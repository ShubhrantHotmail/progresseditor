import { Tabs } from "antd";
import { useRef } from "react";
import { useState } from "react";
import EditorPanel from "./panel";

export default function TabContainer(props) {
  const [activeKey, setActiveKey] = useState("editor_0");
  const [items, setItems] = useState([
    { label: "Untitled", key: "editor_0", children: <EditorPanel /> },
  ]);

  const newTabIndex = useRef(0);

  const onChange = (key) => {
    setActiveKey(key);
  };

  const add = () => {
    const newActiveKey = `editor_${newTabIndex.current++}`;
    setItems([
      ...items,
      {
        label: "New Tab",
        children: "New Tab Pane",
        key: newActiveKey,
      },
    ]);
    setActiveKey(newActiveKey);
  };

  const remove = (targetKey) => {
    const targetIndex = items.findIndex((pane) => pane.key === targetKey);
    const newPanes = items.filter((pane) => pane.key !== targetKey);
    if (newPanes.length && targetKey === activeKey) {
      const { key } =
        newPanes[
          targetIndex === newPanes.length ? targetIndex - 1 : targetIndex
        ];
      setActiveKey(key);
    }
    setItems(newPanes);
  };

  const onEdit = (targetKey, action) => {
    if (action === "add") {
      add();
    } else {
      remove(targetKey);
    }
  };

  return (
    <Tabs
      hideAdd
      onChange={onChange}
      activeKey={activeKey}
      type="editable-card"
      onEdit={onEdit}
      items={items}
      tabPosition="right"
      tabBarStyle={{ width: 200 }}
    />
  );
}
