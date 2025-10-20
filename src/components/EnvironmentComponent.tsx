import { cn } from "../lib/utils";
import Gridbackground from "./Gridbackground";

type Props = {
  text: string;
  className?: string;
};

const EnvironmentComponent = (props: Props) => {
  return (
    <div
      className={cn(
        props.className,
        "relative flex items-center justify-center",
      )}
    >
      <Gridbackground text={props.text} />
    </div>
  );
};

export default EnvironmentComponent;
