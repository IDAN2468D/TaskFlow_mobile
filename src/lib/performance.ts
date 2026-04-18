import { InteractionManager } from 'react-native';

/**
 * Mobile performance utilities for TaskFlow AI.
 */

/**
 * Executes a function after all interactions have completed.
 * This is the React Native equivalent of requestIdleCallback for UI responsiveness.
 * It favors requestIdleCallback if available, falling back to InteractionManager.
 */
export const executeOnIdle = (fn: () => void) => {
  if (typeof requestIdleCallback !== 'undefined') {
    const handle = requestIdleCallback(fn);
    return { cancel: () => cancelIdleCallback(handle) };
  }
  
  return InteractionManager.runAfterInteractions(() => {
    fn();
  });
};

/**
 * Splits work into smaller chunks to keep the JS bridge free.
 */
export function chunkWork<T>(
  items: T[],
  processor: (item: T) => void,
  chunkSize: number = 5
) {
  let index = 0;

  const doChunk = () => {
    const end = Math.min(index + chunkSize, items.length);
    for (; index < end; index++) {
      processor(items[index]);
    }

    if (index < items.length) {
      executeOnIdle(doChunk);
    }
  };

  executeOnIdle(doChunk);
}
