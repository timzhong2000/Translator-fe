export const resolution2text = (resolution: MediaTrackConstraints) => {
  return `${resolution.height}P`;
};

export const text2resolution = (text: string) => {
  switch (text) {
    case "1080P":
      return { width: 1920, height: 1080, frameRate: 30 };
    case "720P":
      return { width: 1280, height: 720, frameRate: 30 };
  }
  throw new Error("不支持的分辨率");
};