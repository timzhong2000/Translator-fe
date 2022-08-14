import { ModelBase } from "../base";
import { TranslatorDisabledError } from "./errors";
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
  translate(srcText: string): Promise<TranslateResult> {
    if (!this.enabled) throw new TranslatorDisabledError();
    return this._translate(srcText);
  }
  abstract _translate(srcText: string): Promise<TranslateResult>;
}
