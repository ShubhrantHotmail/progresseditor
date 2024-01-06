export const add = (newTabIndex, tablLabel, setItems, setActiveKey) => {
  const newActiveKey = `editor_${newTabIndex.current++}`;
  setItems([
    ...items,
    {
      label: tablLabel,
      children: "New Tab Pane",
      key: newActiveKey,
    },
  ]);
  setActiveKey(newActiveKey);
};
