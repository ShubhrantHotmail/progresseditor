import { Tooltip, Button } from "antd";

export default function ControlButton(props) {
  const { icon, text, tooltip, callback } = props;
  return (
    <Tooltip
      title={tooltip ?? null}
      color="#f4f4f4"
      overlayInnerStyle={{ color: "black", border: "1px solid #bbb" }}
    >
      <Button type="text" icon={icon ?? null} onClick={callback ?? null}>
        {text ?? null}
      </Button>
    </Tooltip>
  );
}
