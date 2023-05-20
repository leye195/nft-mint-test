import { ComponentProps } from "react";
import Flex from "../Flex";
import Header from "./Header";

export default ({ children }: ComponentProps<"div">) => (
  <Flex flexDirection="column">
    <Header />
    {children}
  </Flex>
);
