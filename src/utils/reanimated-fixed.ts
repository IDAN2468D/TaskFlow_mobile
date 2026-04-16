export * from 'react-native-reanimated';
import { useMemo } from 'react';

/**
 * Polyfill for useWorkletCallback which was removed in Reanimated 4.
 * This is injected via Metro alias to support @gorhom/bottom-sheet.
 */
export function useWorkletCallback(fn: (...args: any[]) => any, deps: any[]) {
  return useMemo(() => {
    return (...args: any[]) => {
      'worklet';
      return fn(...args);
    };
  }, deps);
}
