import "../styles/symbols.css";

export const OpenFolder = (props) => {
  return <span className="material-symbols-outlined">folder_open</span>;
};
export const AddNew = (props) => {
  return <span className="material-symbols-outlined">add</span>;
};
export const Save = (props) => {
  return <span className="material-symbols-outlined">save</span>;
};
export const SaveAs = (props) => {
  return <span className="material-symbols-outlined">save_as</span>;
};
export const FontSize = (props) => {
  return <span className="material-symbols-outlined">format_size</span>;
};

export const CodeLanguage = (props) => {
  return <span className="material-symbols-outlined">code_blocks</span>;
};

export const FontFamily = (props) => {
  return <span className="material-symbols-outlined">text_format</span>;
};

export const CheckSyntax = (props) => {
  return <span className="material-symbols-outlined">adb</span>;
};

export const FileDiff = (props) => {
  return <span className="material-symbols-outlined">difference</span>;
};
export const Fix = (props) => {
  return <span className="material-symbols-outlined">auto_fix_high</span>;
};
export const DotVertical = (props) => {
  return (
    <span
      className="material-symbols-outlined"
      style={{ ...props, fontVariationSettings: '"GRAD" 100' }}
    >
      more_vert
    </span>
  );
};

export const Rcode = (props) => {
  return (
    <span
      className="material-symbols-outlined"
      style={{
        ...props,
        fontVariationSettings: '"GRAD" 300, "wght" 500',
        fontSize: 10,
        textTransform: "lowercase",
      }}
    >
      r
    </span>
  );
};
export const Category = (props) => {
  return (
    <span className="material-symbols-outlined" {...props}>
      category
    </span>
  );
};
export const Server = (props) => {
  return (
    <span className="material-symbols-outlined" {...props}>
      dns
    </span>
  );
};
export const Computer = (props) => {
  return (
    <span className="material-symbols-outlined" {...props}>
      computer
    </span>
  );
};
export const RTB = (props) => {
  return (
    <span className="material-symbols-outlined" {...props}>
      account_tree
    </span>
  );
};
