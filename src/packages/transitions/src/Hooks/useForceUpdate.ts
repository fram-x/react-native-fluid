import { useCallback, useState, useEffect, useRef } from "react";

export const useForceUpdate = () => {
  const [, updateState] = useState();
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  return useCallback(() => {
    if (isMounted.current) {
      updateState({});
    }
  }, []);
};
