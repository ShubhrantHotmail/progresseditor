import { Tooltip, Button, theme } from "antd";
import styled from "styled-components";

// const { useToken } = theme;
// const { token } = useToken();

// const StyledButton = styled(Button)`
//   &:hover {
//     color: ${token?.colorLink} !important;
//   }
// `;

export default function ControlButton(props) {
  const { icon, text, tooltip, callback, style, size } = props;

  // console.log(StyledButton);
  return (
    <Tooltip
      title={tooltip ?? null}
      color="#f4f4f4"
      overlayInnerStyle={{ color: "black", border: "1px solid #bbb" }}
    >
      <Button
        type="text"
        icon={icon ?? null}
        onClick={callback ?? null}
        style={{ ...style }}
        size={size}
      >
        {text ?? null}
      </Button>
    </Tooltip>
  );
}
