import { forwardRef } from "react";

type ViewProps<T extends React.ElementType> = {
  as?: T;
} & React.ComponentPropsWithoutRef<T>;

type ViewComponent = <C extends React.ElementType = "div">(
  props: ViewProps<C> & { ref?: React.ComponentPropsWithRef<C>["ref"] }
) => React.ReactElement | null;

const View: ViewComponent = forwardRef(
  <T extends React.ElementType = "div">(
    { as, ...props }: ViewProps<T>,
    ref: React.ComponentPropsWithRef<T>["ref"]
  ) => {
    const Element = as || "div";
    return <Element ref={ref} {...props} />;
  }
);

export default View;
