import { useEffect, useState } from "react";

export function useIsDataChange(duration = 1000) {
  return function <T>(value: T) {
    const [hasChange, setHasChange] = useState(false);
    useEffect(() => {
      setHasChange(true);
      const timeout = setTimeout(() => {
        setHasChange(false);
      }, duration);
      return () => clearTimeout(timeout);
    }, [value]);
    return hasChange;
  };
}
