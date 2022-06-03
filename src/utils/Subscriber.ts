// 订阅基础类

export type SubscriberFn<T> = (data: T) => void;
declare class Subscriber<T> {
  broadcast(data: T): void 
  subscribe(fn: SubscriberFn<T>): void;
  unSubscribe(fn: SubscriberFn<T>): boolean;
  destroy(): void;
}

export class SubscriberBase<T> implements Subscriber<T> {
  private subscriberList: SubscriberFn<T>[] = [];
  protected cache: T | null = null;

  subscribe(fn: SubscriberFn<T>): void {
    this.subscriberList.push(fn);
    if(this.cache) fn(this.cache);
  }

  unSubscribe(fn: SubscriberFn<T>): boolean {
    const index = this.subscriberList.findIndex((val) => val == fn);
    if (index === -1) return false;
    delete this.subscriberList[index];
    return true;
  }

  destroy() {
    this.subscriberList = [];
  }

  broadcast(data: T): void {
    this.subscriberList.forEach((fn) => fn(data));
    this.cache = data;
  }
}
