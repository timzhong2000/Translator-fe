import { filter } from "rxjs";

export const eventFilter = <ET>(listenEvent: ET[] | Set<ET>) => {
  const isEventSet = listenEvent instanceof Set;
  return filter<ET>((ev) =>
    isEventSet
      ? listenEvent.has(ev)
      : listenEvent.some((listenEv) => listenEv === ev)
  );
};
