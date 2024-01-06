import React from "react";
import { GlobalContext } from "../GlobalContext";
import { Select } from "antd";
import { FormatPainterOutlined } from "@ant-design/icons";
import { themePelette } from "../lib/theme";
import { Format, Palette } from "../lib/Symbols";

export default function ThemeChanger(props) {
  const [state, payload] = React.useContext(GlobalContext);
  const [options, setOptions] = React.useState([]);

  React.useEffect(() => {
    console.log("UseEffect");
    const themes = Object.keys(themePelette);
    const list = [];

    themes?.map((item) => {
      list.push({ value: item, label: themePelette[item]?.name });
    });
    setOptions(list);
  }, [themePelette]);

  const handleChange = (value) => {
    payload({ type: "THEME", value });
    payload({ type: "THEME_TOKENS", value: themePelette[value] });
    localStorage.setItem("theme", value);
    localStorage.setItem("themeTokens", JSON.stringify(themePelette[value]));
  };

  return (
    <>
      <Palette />
      <Select
        value={state?.theme}
        onChange={handleChange}
        options={options}
        size="small"
        {...props}
        suffixIcon={null}
      />
    </>
  );
}
