"use client";

import { useEffect, useRef, useState } from "react";

const DEFAULT_SEC = 15;

export function useTimer(options: {
  enabled: boolean;
  resetKey: number;
  seconds?: number;
  onExpire: () => void;
}) {
  const { enabled, resetKey, seconds = DEFAULT_SEC, onExpire } = options;
  const [remaining, setRemaining] = useState(seconds);
  const expiredRef = useRef(false);
  const cbRef = useRef(onExpire);
  cbRef.current = onExpire;

  useEffect(() => {
    expiredRef.current = false;
    setRemaining(seconds);
  }, [resetKey, seconds]);

  useEffect(() => {
    if (!enabled) {
      setRemaining(seconds);
      return;
    }

    setRemaining(seconds);
    expiredRef.current = false;

    const id = window.setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          window.clearInterval(id);
          if (!expiredRef.current) {
            expiredRef.current = true;
            queueMicrotask(() => cbRef.current());
          }
          return 0;
        }
        return r - 1;
      });
    }, 1000);

    return () => window.clearInterval(id);
  }, [enabled, resetKey, seconds]);

  return { remaining, total: seconds };
}
