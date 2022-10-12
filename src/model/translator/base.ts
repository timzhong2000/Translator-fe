import { action, makeObservable, observable } from "mobx";
import { TranslatorDisabledError } from "./errors";
import { TranslateResult } from "@/types";

export abstract class TranslatorBase {
  /* observables start */
  enabled = true;
  /* observables end */

  constructor() {
    makeObservable(this, {
      enabled: observable,
      setEnabled: action,
    });
  }

  /* actions start */
  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }
  /* actions end */

  translate(srcText: string): Promise<TranslateResult> {
    if (!this.enabled) throw new TranslatorDisabledError();
    return this._translate(srcText);
  }
  protected abstract _translate(srcText: string): Promise<TranslateResult>;
}
