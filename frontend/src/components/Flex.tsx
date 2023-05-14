import { CSSProperties, ComponentProps } from "react";

type Props = ComponentProps<"div"> & {
  display?: "flex" | "inline-flex";
  alignItems?: CSSProperties["alignItems"];
  justifyContent?: CSSProperties["justifyContent"];
  flexDirection?: CSSProperties["flexDirection"];
  gap?: CSSProperties["gap"];
};

const Flex = ({
  children,
  display = "flex",
  alignItems = "flex-start",
  justifyContent = "flex-start",
  flexDirection = "row",
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
      }}
    >
      {children}
    </div>
  );
};

export default Flex;
