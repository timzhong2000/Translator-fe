import { CutArea } from "@/types/globalConfig";
import { Resolution, StreamStatus } from "@/types/streamSource";
import { cutAreaParser } from "@/utils/common/cutAreaParser";
import { logger, LogType } from "@/utils/logger";
import { ImageHelper } from "@timzhong2000/browser-image-helper";
import { makeAutoObservable } from "mobx";
import { StreamInitError } from "./errors";

/**
 * 管理流的获取以及流到video element的绑定
 */
export class StreamModel {
  private sharedImageHelper = new ImageHelper(undefined, true);
  videoRef = document.createElement("video");
  resolution: Resolution = { x: 1, y: 1 };
  private _stream?: MediaStream;
  private _isLoading = false;
  private _root?: HTMLDivElement;
  private _streamActive = false;

  constructor() {
    makeAutoObservable(this);
    this._initVideoElement();
  }

  get status(): StreamStatus {
    const isLoading = this._isLoading;
    const isStreamExist = this._stream instanceof MediaStream;
    const isStreamActive = this._streamActive;
    if (isLoading) return StreamStatus.LOADING; // 正在等待系统返回流
    if (!isStreamExist) return StreamStatus.INIT; // 还没有设置流
    else return isStreamActive ? StreamStatus.ACTIVE : StreamStatus.INACTIVE;
  }

  private _initVideoElement() {
    this.videoRef.autoplay = true;
  }

  /**
   * 设置视频流并且绑定到video element
   * @param newStream
   */
  setStream(newStream: MediaStream) {
    this._stream = newStream;
    this.videoRef.srcObject = newStream;
    // 如果设备分辨率与设定期望分辨率不符合，浏览器会自动回退分辨率，需要用实际视频元信息进行配置矫正
    this._fixResolution(newStream);
    // 管理流生命周期
    this._startStreamWatchDog(newStream);
  }

  /**
   * 同步流信息到mobx管理的观测变量上，监控流状态更新，处理无法捕获事件的情况
   * 比如点击了浏览器的停止录制按钮，或者视频设备被拔出
   */
  private _startStreamWatchDog(newStream: MediaStream) {
    this._setStreamActive(true);
    const onInactive = () => {
      this._setStreamActive(false);
      newStream.removeEventListener("inactive", onInactive);
    };
    newStream.addEventListener("inactive", onInactive);
  }

  private _setIsLoading(isLoading: boolean) {
    this._isLoading = isLoading;
  }

  private _setStreamActive(active: boolean) {
    this._streamActive = active;
  }

  /**
   * 异步初始化流，
   * @param mediaStreamPromise
   */
  async setStreamAsync(mediaStreamPromise: Promise<MediaStream>) {
    try {
      this._setIsLoading(true);
      const stream = await mediaStreamPromise;
      this.setStream(stream);
    } catch (err) {
      throw err instanceof Error ? err : new StreamInitError();
    } finally {
      this._setIsLoading(false);
    }
  }

  /* 写入root时会移除root所有child并且添加一个video */
  mount(root: HTMLDivElement | undefined) {
    if (root === this.videoRef.parentElement) return; // 防止重渲染
    if (root) {
      this.unmount();
      root.appendChild(this.videoRef);
      if (!this._stream) {
        console.error("set stream to video element error: stream not exist");
      }
      this._root = root;
    }
  }

  unmount() {
    if (!this._root) return;
    const actualRoot = this.videoRef.parentElement;
    if (actualRoot !== this._root) {
      console.warn("卸载video时检测到video的父节点与mount时的父节点不相同");
    }
    actualRoot?.removeChild(this.videoRef);
    this._root = undefined;
  }

  private _fixResolution(stream: MediaStream) {
    setTimeout(() => {
      const videoTracks = stream.getVideoTracks();
      // 可能用户手速比较快，500ms内关闭了流，需要处理没有流的情况
      if (videoTracks.length < 1) return;
      const actualVideoSetting = videoTracks[0].getSettings();
      this._setResolution({
        x: actualVideoSetting.width ?? this.resolution.x,
        y: actualVideoSetting.height ?? this.resolution.y,
      });
    }, 500); // 500ms是一个相对比较安全的延迟
  }

  private _setResolution(resolution: Resolution) {
    resolution = this._fitRatio(resolution);
    this.resolution = resolution;
    this.videoRef.style.width = `${resolution.x}px`;
    this.videoRef.style.height = `${resolution.y}px`;
  }

  resetStream() {
    this.videoRef.srcObject = null;
    this._stream?.getTracks().forEach((t) => t.stop());
    this._stream = undefined;
  }

  private _fitRatio(resolution: Resolution) {
    return {
      x: resolution.x / window.devicePixelRatio,
      y: resolution.y / window.devicePixelRatio,
    };
  }

  setMuted(muted: boolean) {
    this.videoRef.muted = muted;
  }

  async capture(cutArea: CutArea): Promise<HTMLCanvasElement> {
    const endTimer = logger.timing(LogType.CAPTURE_VIDEO_FRAME);
    const { startX, startY, width, height } = cutAreaParser(cutArea);
    const { canvas } = this.sharedImageHelper
      .setImage(this.videoRef)
      .toOnscreenCanvas({
        startX: startX * window.devicePixelRatio,
        startY: startY * window.devicePixelRatio,
        width: width * window.devicePixelRatio,
        height: height * window.devicePixelRatio,
      });

    endTimer();
    return canvas;
  }
}

export const streamModel = new StreamModel();
