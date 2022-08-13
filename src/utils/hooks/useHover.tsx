import { useState, useCallback, useRef } from "react";

/**
 * 获取hover状态
 * @param delay 延迟毫秒数
 * @returns
 */
export function useDelay<T>(delay = 0, inValue: T) {
  const [value, setValue] = useState<T>(inValue);
  const lastTimeout = useRef<NodeJS.Timeout>();

  const delaySetValue = useCallback((val: T) => {
    if (delay === 0) {
      setValue(val);
    } else {
      if (lastTimeout.current) {
        clearTimeout(lastTimeout.current);
      }
      lastTimeout.current = setTimeout(() => {
        setValue(val);
      }, delay);
    }
  }, []);

  return { value, delaySetValue };
}
