import { isString } from "lodash-es";
import { makeAutoObservable } from "mobx";

export class TextractorClient {
  private _ws: WebSocket | null = null;
  currText = "";

  private onError: (ev: Event) => void = console.error;
  private onConnect: () => void = () => {
    console.log(`connect to ${this.url} successfully`);
  };

  constructor(
    private url: string,
    onConnect?: () => any,
    onError?: (err: Event) => any
  ) {
    makeAutoObservable(this);
    onConnect && (this.onConnect = onConnect);
    onError && (this.onError = onError);
  }

  static create(url: string) {
    if (url.startsWith("ws://") || url.startsWith("wss://")) {
      return new Promise<TextractorClient>((resolve, reject) => {
        const client: TextractorClient = new TextractorClient(
          url,
          () => resolve(client),
          () => {
            client.destroy();
            reject();
          }
        );
        client.connect();
      });
    } else {
      return Promise.reject("the url should start with ws or wss");
    }
  }

  destroy() {
    this.disconnect();
  }

  onMessage = (ev: MessageEvent<any>) =>
    isString(ev.data) && (this.currText = ev.data);

  connect() {
    this.disconnect();
    this._ws = new WebSocket(this.url);
    this._ws.addEventListener("message", this.onMessage);
    this._ws.addEventListener("open", this.onConnect);
    this._ws.addEventListener("error", this.onError);
  }

  disconnect() {
    if (this._ws) {
      this._ws.readyState === WebSocket.OPEN && this._ws.close();
      this._ws.removeEventListener("message", this.onMessage);
      this._ws.removeEventListener("open", this.onConnect);
      this._ws.removeEventListener("error", this.onError);
    }
  }
}
