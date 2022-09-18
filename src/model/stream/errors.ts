import { tagWithPrefix, TtransError } from "@/utils/error";

const tag = tagWithPrefix("stream.error.");

@tag("default", "stream默认错误")
export class StreamError extends TtransError {
  constructor() {
    super();
    console.log("[stream error]: " + this.message);
  }
}

@tag("stream_not_ready", "stream未准备好, 不能读取")
export class StreamNotReadyError extends StreamError {}

@tag("stream_empty", "读取了没有流的stream")
export class StreamEmptyError extends StreamError {}

@tag("stream_async_init_error", "初始化设备流错误")
export class StreamInitError extends StreamError {}
