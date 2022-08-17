import { FloatLayerGroupContainer } from "@/view/common/floatLayer";
import { FloatLayerMeta } from "@/view/common/floatLayer/types";
import MediaDevicesSetting from "../config/MediaDevicesSetting";

export const Test = () => {
  const layers: FloatLayerMeta[] = [
    {
      id: "foo",
      alwaysBottom: false,
      alwaysTop: false,
      resizable: false,
      dragable: true,
      Element: Foo,
    },
    {
      id: "bar",
      alwaysBottom: false,
      alwaysTop: false,
      resizable: false,
      dragable: true,
      Element: Bar,
    },
    {
      id: "setting1",
      alwaysBottom: false,
      alwaysTop: false,
      resizable: true,
      dragable: true,

      Element: MediaDevicesSetting,
    }
  ];

  return <FloatLayerGroupContainer layerMetas={layers} />;
};

const Foo = () => {
  return (
    <div style={{ background: "red", width: "20px", height: "50px" }}>
      i am Foo
    </div>
  );
};

const Bar = () => {
  return (
    <div style={{ background: "green", width: "100px", height: "100px" }}>
      i am Bar
    </div>
  );
};
