import { ComponentPropsWithRef, forwardRef } from "react";
import "./input.css";

type Props = ComponentPropsWithRef<"input">;

const Input = forwardRef<HTMLInputElement, Props>((props, ref) => {
  return <input {...props} ref={ref} />;
});

export default Input;
