import { useMemo } from 'react';

/**
 * Polyfill for useWorkletCallback which was removed in Reanimated 4.
 */
export function useWorkletCallback(fn: (...args: any[]) => any, deps: any[]) {
  return useMemo(() => {
    return (...args: any[]) => {
      'worklet';
      return fn(...args);
    };
  }, deps);
}

// Attach to global if needed, or just export it
if (global) {
  (global as any).useWorkletCallback = useWorkletCallback;
}
