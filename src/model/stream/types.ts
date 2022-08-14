export enum StreamModelEvent {
  ON_STREAM_CHANGED,
  ON_RESOLUTION_CHANGED,
  ON_LOADING_CHANGED,
  ON_STREAM_WATCHDOG_TRIGGER, // 视图无需监听, 这个事件触发前会发送一个ON_RESOLUTION_CHANGED
}

export interface StreamConfig extends Partial<MediaStreamConstraints> {
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
  NOT_READY, // 没有启动录制
  LOADING, // 加载中
  EMPTY, // 流的轨道为空
  ACTIVE, // 正常状态
  INACTIVE, // 流暂停
  TIMEOUT,
  UNKNOWN,
}
