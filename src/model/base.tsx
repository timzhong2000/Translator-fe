import { Subject } from "rxjs";

/* 提供eventBus */
export class ModelBase<T> {
  eventBus: Subject<T> = new Subject<T>();
}

