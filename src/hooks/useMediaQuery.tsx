"use client";
import { useState, useCallback, useEffect } from "react";

export const useMediaQuery = (width: number) => {
  const [targetReached, setTargetReached] = useState<boolean>(false);

  const updateTarget = useCallback((e: any) => {
    if (e.matches) {
      setTargetReached(true);
    } else {
      setTargetReached(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const media = window.matchMedia(`(max-width: ${width}px)`);
    media.addEventListener("change", updateTarget);

    // Check on mount (callback is not called until a change occurs)
    if (media.matches) {
      setTargetReached(true);
      return () => media.removeListener(updateTarget);
    }

    setTargetReached(false);

    return () => media.removeListener(updateTarget);
  }, [updateTarget, width]);

  return targetReached;
};
