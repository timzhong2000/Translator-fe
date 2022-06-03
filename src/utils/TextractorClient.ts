import { SubscriberBase } from "./Subscriber";

export class TextractorSubscriber extends SubscriberBase<string> {
  private ws: WebSocket | null = null;

  constructor(
    private url: string,
    private onConnect: () => any,
    private onError: (err: any) => any
  ) {
    super();
    this.connect();
  }

  static create(url: string) {
    if (url.startsWith("ws://") || url.startsWith("wss://")) {
      return new Promise<TextractorSubscriber>((resolve, reject) => {
        const client: TextractorSubscriber = new TextractorSubscriber(
          url,
          () => resolve(client),
          () => {
            client.destroy();
            reject();
          }
        );
      });
    } else {
      return Promise.reject("the url should start with ws or wss");
    }
  }

  destroy() {
    this.disconnect();
    super.destroy();
  }

  private connect() {
    this.disconnect();
    this.ws = new WebSocket(this.url);
    this.ws.onmessage = (ev) => {
      if (typeof ev.data === "string") {
        this.broadcast(ev.data);
      }
    };
    this.ws.onerror = this.onError;
    this.ws.onopen = this.onConnect;
  }

  private disconnect() {
    if (this.ws) {
      this.ws.close();
    }
  }
}
