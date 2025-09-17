import Gridbackground from "./Gridbackground";

type Props = {
  text: string;
};

const EnvironmentComponent = (props: Props) => {
  return (
    <div>
      <Gridbackground text={props.text} />
    </div>
  );
};

export default EnvironmentComponent;
