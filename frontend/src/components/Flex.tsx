import { CSSProperties, ComponentProps } from "react";

type Props = ComponentProps<"div"> & {
  display?: "flex" | "inline-flex";
  alignItems?: CSSProperties["alignItems"];
  justifyContent?: CSSProperties["justifyContent"];
  flexDirection?: CSSProperties["flexDirection"];
  gap?: CSSProperties["gap"];
  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
  padding?: CSSProperties["padding"];
};

const Flex = ({
  children,
  display = "flex",
  alignItems = "flex-start",
  justifyContent = "flex-start",
  flexDirection = "row",
  width = "auto",
  height = "auto",
  padding = "0",
  gap = 0,
}: Props) => {
  return (
    <div
      style={{
        display,
        alignItems,
        justifyContent,
        flexDirection,
        gap,
        width,
        height,
        padding,
      }}
    >
      {children}
    </div>
  );
};

export default Flex;
