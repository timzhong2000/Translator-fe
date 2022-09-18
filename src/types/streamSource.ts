export interface StreamSourceConfig extends Partial<MediaStreamConstraints> {
  enabled: boolean;
  fromScreen: boolean;
  video: MediaTrackConstraints;
  videoDeviceId?: string;
  audio: boolean;
  audioDeviceId?: string;
  muted: boolean;
}

export interface Resolution {
  x: number;
  y: number;
}

export enum StreamStatus {
  INIT, // 没有启动录制
  LOADING, // 加载中
  ACTIVE, // 正常状态
  INACTIVE, // 流暂停
  UNKNOWN,
}
