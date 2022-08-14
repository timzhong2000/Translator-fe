import { CutArea } from "@/types/globalConfig";
import { cutAreaParser } from "@/utils/common/cutAreaParser";
import { logger, LogType } from "@/utils/logger";
import { Observable, Subject } from "rxjs";
import { ModelBase } from "../base";
import { StreamEmptyError, StreamNotReadyError } from "./errors";
import {
  Resolution,
  StreamConfig,
  StreamModelEvent,
  StreamStatus,
} from "./types";

/**
 * 职责：不处理读取流逻辑，只负责把流设置到video上
 */
export class StreamModel extends ModelBase<StreamModelEvent> {
  /// videoRef
  videoRef = document.createElement("video");

  /// stream
  private _stream?: MediaStream;

  /* stream不存在时抛出错误，一般不需要读取stream */
  get stream() {
    if (!this._stream) throw new StreamNotReadyError();
    if (this._stream.getTracks().length === 0) throw new StreamEmptyError();
    return this._stream;
  }

  setStream(newStream: MediaStream) {
    this._stream = newStream;
    this.videoRef.srcObject = newStream;
    this.eventBus.next(StreamModelEvent.ON_STREAM_CHANGED);
    // 如果设备分辨率与设定期望分辨率不符合，浏览器会自动回退分辨率，需要用实际视频元信息进行配置矫正
    setTimeout(() => {
      const actualVideoSetting = newStream.getVideoTracks()[0].getSettings();
      this.setResolution({
        x: actualVideoSetting.width ?? this.resolution.x,
        y: actualVideoSetting.height ?? this.resolution.y,
      });
    }, 500); // 500ms是一个相对比较安全的延迟
    this.startStreamWatchDog();
  }

  // 处理视频流被用户在浏览器外关闭的情况
  startStreamWatchDog() {
    const interval = setInterval(() => {
      const updateStatus = () => {
        clearInterval(interval);
        this.eventBus.next(StreamModelEvent.ON_STREAM_CHANGED);
        this.eventBus.next(StreamModelEvent.ON_STREAM_WATCHDOG_TRIGGER);
      };

      try {
        !this.stream.active && updateStatus();
      } catch (err) {
        updateStatus();
      }
    }, 500);
  }

  isLoading = false;
  async setStreamAsync(newStreamObservable: Observable<MediaStream | Error>) {
    this.isLoading = true;
    this.eventBus.next(StreamModelEvent.ON_LOADING_CHANGED);
    const subscription = newStreamObservable.subscribe((stream) => {
      stream instanceof MediaStream && this.setStream(stream);
      this.isLoading = false;
      subscription.unsubscribe();
      this.eventBus.next(StreamModelEvent.ON_LOADING_CHANGED);
    });
  }

  /// resolution
  private _resolution: Resolution = { x: 1, y: 1 };
  get resolution() {
    return this._resolution;
  }
  setResolution(resolution: Resolution) {
    resolution = this.fitRatio(resolution);
    this._resolution = resolution;
    this.videoRef.style.width = `${resolution.x}px`;
    this.videoRef.style.height = `${resolution.y}px`;
    this.eventBus.next(StreamModelEvent.ON_RESOLUTION_CHANGED);
  }
  fitRatio(resolution: Resolution) {
    return {
      x: resolution.x / window.devicePixelRatio,
      y: resolution.y / window.devicePixelRatio,
    };
  }

  /// root
  private _root?: HTMLDivElement;
  get root() {
    return this._root;
  }
  /* 写入root时会移除root所有child并且添加一个video */
  setRoot(el: HTMLDivElement | undefined) {
    if (el === this._root) return; // 防止重渲染
    if (el) {
      this.unSetRoot();
      el.appendChild(this.videoRef);
      try {
        this.videoRef.srcObject = this.stream;
      } catch (err) {}
      this._root = el;
    }
  }
  unSetRoot() {
    if (this._root) {
      this._root.childNodes.forEach((node) => this._root?.removeChild(node));
    }
  }

  constructor(
    public config: StreamConfig,
    root?: HTMLDivElement,
    initStream?: MediaStream
  ) {
    super();
    initStream && this.setStream(initStream);
    root && this.setRoot(root);
    this.videoRef.autoplay = true;
  }

  setMuted(muted: boolean) {
    this.videoRef.muted = muted;
  }

  offscreenCanvas = document.createElement("canvas"); // 用于截图

  capture(cutArea: CutArea) {
    const endTimer = logger.timing(LogType.CAPTURE_VIDEO_FRAME);
    const areaConfig = cutAreaParser(cutArea);
    this.offscreenCanvas.width = areaConfig.width * window.devicePixelRatio;
    this.offscreenCanvas.height = areaConfig.height * window.devicePixelRatio;
    const ctx = this.offscreenCanvas.getContext(
      "2d"
    ) as CanvasRenderingContext2D;
    ctx.drawImage(
      this.videoRef,
      areaConfig.startX * window.devicePixelRatio,
      areaConfig.startY * window.devicePixelRatio,
      areaConfig.width * window.devicePixelRatio,
      areaConfig.height * window.devicePixelRatio,
      0,
      0,
      areaConfig.width * window.devicePixelRatio,
      areaConfig.height * window.devicePixelRatio
    );
    endTimer();
    return this.offscreenCanvas;
  }

  getStatus() {
    if (this.isLoading) return StreamStatus.LOADING;
    try {
      return this.stream.active ? StreamStatus.ACTIVE : StreamStatus.INACTIVE;
    } catch (err) {
      if (err instanceof StreamEmptyError) {
        return StreamStatus.EMPTY;
      }
      if (err instanceof StreamNotReadyError) {
        return StreamStatus.NOT_READY;
      }
      return StreamStatus.UNKNOWN;
    }
  }

  reset() {
    this.videoRef.srcObject = null;
    this.stream.getTracks().forEach((t) => t.stop());
    this._stream = undefined;
    this.eventBus.next(StreamModelEvent.ON_STREAM_CHANGED);
  }
}
