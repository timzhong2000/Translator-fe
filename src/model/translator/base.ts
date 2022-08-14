import { ModelBase } from "../base";
import { TranslateResult, TranslatorEvent } from "./types";

export abstract class TranslatorBase extends ModelBase<TranslatorEvent> {
  private _enabled = true;
  get enabled() {
    return this._enabled;
  }
  setEnabled(enabled: boolean) {
    this._enabled = enabled;
    this.eventBus.next(
      enabled ? TranslatorEvent.ON_ENABLED : TranslatorEvent.ON_DISABLED
    );
  }
  abstract translate(srcText: string): Promise<TranslateResult>;
}
