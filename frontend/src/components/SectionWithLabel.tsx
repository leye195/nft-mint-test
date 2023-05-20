import { ComponentProps } from "react";
import Flex from "./Flex";

interface Props extends ComponentProps<"div"> {
  label: string | JSX.Element | JSX.Element[];
}

const SectionWithLabel = ({ children, label }: Props) => {
  return (
    <section
      style={{
        width: "inherit",
      }}
    >
      <Flex flexDirection="column" gap={8}>
        <h2>{label}</h2>
        {children}
      </Flex>
    </section>
  );
};

export default SectionWithLabel;
