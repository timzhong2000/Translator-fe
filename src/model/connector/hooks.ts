import { Context, useContext, useState, useEffect } from "react";
import { debounceTime } from "rxjs";
import { ModelBase } from "../base";
import { eventFilter } from "./utils";

export function useModel<CT extends ModelBase<ET>, ST, ET>(
  modelContext: Context<CT>,
  selector: (model: CT) => ST,
  listenEvents: ET[] | Set<ET>
) {
  const model = useContext(modelContext);
  const result = selector(model);
  const [, rerender] = useState({});
  useEffect(() => {
    const subscription = model.eventBus
      .pipe(eventFilter(listenEvents), debounceTime(100))
      .subscribe(() => rerender({}));
    return () => subscription.unsubscribe();
  });
  return result;
}
