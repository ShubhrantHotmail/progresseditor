import "../styles/symbols.css";

export default function Button(props) {
  return (
    <button
      className={props.className}
      onclick={props?.onClick}
      title={props?.title}
    >
      {props?.icon}
    </button>
  );
}
