import { ComponentPropsWithRef } from "react";
import "./input.css";

const Input = (props: ComponentPropsWithRef<"input">) => {
  return <input {...props} />;
};

export default Input;
