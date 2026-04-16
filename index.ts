import "expo-router/entry";
import { LogBox } from 'react-native';

// Suppress noisy warnings
LogBox.ignoreLogs([
  '[Reanimated] Reading from `value` during component render',
  '[Reanimated] Writing to `value` during component render',
  'Setting a timer'
]);
