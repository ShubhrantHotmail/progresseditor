import "../styles/symbols.css";
import { theme } from "antd";

export const OpenFolder = (props) => {
  const { useToken } = theme;
  const { token } = useToken();
  return (
    <span
      className="material-symbols-outlined"
      {...props}
      style={{ ...props, color: token?.colorText }}
    >
      folder_open
    </span>
  );
};
export const AddNew = (props) => {
  const { useToken } = theme;
  const { token } = useToken();
  return (
    <span
      className="material-symbols-outlined"
      {...props}
      style={{ ...props, color: token?.colorText }}
    >
      add
    </span>
  );
};
export const Save = (props) => {
  const { useToken } = theme;
  const { token } = useToken();
  return (
    <span
      className="material-symbols-outlined"
      {...props}
      style={{ ...props, color: token?.colorText }}
    >
      save
    </span>
  );
};
export const SaveAs = (props) => {
  const { useToken } = theme;
  const { token } = useToken();
  return (
    <span
      className="material-symbols-outlined"
      {...props}
      style={{ ...props, color: token?.colorText }}
    >
      save_as
    </span>
  );
};
export const FontSize = (props) => {
  const { useToken } = theme;
  const { token } = useToken();
  return (
    <span
      className="material-symbols-outlined"
      {...props}
      style={{ ...props, color: token?.colorText }}
    >
      format_size
    </span>
  );
};

export const CodeLanguage = (props) => {
  const { useToken } = theme;
  const { token } = useToken();
  return (
    <span
      className="material-symbols-outlined"
      {...props}
      style={{ ...props, color: token?.colorText }}
    >
      code_blocks
    </span>
  );
};

export const FontFamily = (props) => {
  const { useToken } = theme;
  const { token } = useToken();
  return (
    <span
      className="material-symbols-outlined"
      {...props}
      style={{ ...props, color: token?.colorText }}
    >
      text_format
    </span>
  );
};

export const CheckSyntax = (props) => {
  const { useToken } = theme;
  const { token } = useToken();
  return (
    <span
      className="material-symbols-outlined"
      {...props}
      style={{ ...props, color: token?.colorText }}
    >
      adb
    </span>
  );
};

export const FileDiff = (props) => {
  const { useToken } = theme;
  const { token } = useToken();
  return (
    <span
      className="material-symbols-outlined"
      {...props}
      style={{ ...props, color: token?.colorText }}
    >
      difference
    </span>
  );
};
export const Fix = (props) => {
  const { useToken } = theme;
  const { token } = useToken();
  return (
    <span
      className="material-symbols-outlined"
      {...props}
      style={{ ...props, color: token?.colorText }}
    >
      auto_fix_high
    </span>
  );
};
export const DotVertical = (props) => {
  const { useToken } = theme;
  const { token } = useToken();
  return (
    <span
      className="material-symbols-outlined"
      style={{
        ...props,
        fontVariationSettings: '"GRAD" 100',
        color: token?.colorText,
      }}
    >
      more_vert
    </span>
  );
};

export const Rcode = (props) => {
  const { useToken } = theme;
  const { token } = useToken();
  return (
    <span
      className="material-symbols-outlined"
      style={{
        ...props,
        fontVariationSettings: '"GRAD" 300, "wght" 500',
        fontSize: 10,
        textTransform: "lowercase",
        color: token?.colorText,
      }}
    >
      r
    </span>
  );
};
export const Category = (props) => {
  const { useToken } = theme;
  const { token } = useToken();
  return (
    <span
      className="material-symbols-outlined"
      {...props}
      style={{ ...props, color: token?.colorText }}
    >
      category
    </span>
  );
};
export const Server = (props) => {
  const { useToken } = theme;
  const { token } = useToken();
  return (
    <span
      className="material-symbols-outlined"
      {...props}
      style={{ ...props, color: token?.colorText }}
    >
      dns
    </span>
  );
};
export const Computer = (props) => {
  const { useToken } = theme;
  const { token } = useToken();
  return (
    <span
      className="material-symbols-outlined"
      {...props}
      style={{ ...props, color: token?.colorText }}
    >
      computer
    </span>
  );
};
export const RTB = (props) => {
  const { useToken } = theme;
  const { token } = useToken();
  return (
    <span
      className="material-symbols-outlined"
      {...props}
      style={{ ...props, color: token?.colorText }}
    >
      account_tree
    </span>
  );
};
export const Setting = (props) => {
  const { useToken } = theme;
  const { token } = useToken();
  return (
    <span
      className="material-symbols-outlined"
      {...props}
      style={{ ...props, color: token?.colorText }}
    >
      settings
    </span>
  );
};
export const ReturnSign = (props) => {
  const { useToken } = theme;
  const { token } = useToken();
  return (
    <span
      className="material-symbols-outlined"
      {...props}
      style={{ ...props, color: token?.colorText }}
    >
      keyboard_return
    </span>
  );
};
export const Format = (props) => {
  const { useToken } = theme;
  const { token } = useToken();
  return (
    <span
      className="material-symbols-outlined"
      {...props}
      style={{ ...props, color: token?.colorText }}
    >
      format_paint
    </span>
  );
};
export const Palette = (props) => {
  const { useToken } = theme;
  const { token } = useToken();
  return (
    <span
      className="material-symbols-outlined"
      {...props}
      style={{ ...props, color: token?.colorText }}
    >
      palette
    </span>
  );
};
export const Close = (props) => {
  const { useToken } = theme;
  const { token } = useToken();
  return (
    <span
      className="material-symbols-outlined"
      {...props}
      style={{ ...props, color: token?.colorText }}
    >
      close
    </span>
  );
};
export const Refresh = (props) => {
  const { useToken } = theme;
  const { token } = useToken();
  return (
    <span
      className="material-symbols-outlined"
      {...props}
      style={{ ...props, color: token?.colorText }}
    >
      refresh
    </span>
  );
};
export const FullFile = (props) => {
  const { useToken } = theme;
  const { token } = useToken();
  return (
    <span
      className="material-symbols-outlined"
      {...props}
      style={{ ...props, color: token?.colorText }}
    >
      source_notes
    </span>
  );
};
