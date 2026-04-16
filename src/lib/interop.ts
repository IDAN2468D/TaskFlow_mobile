import { NativeModules, Platform } from "react-native";
import { cssInterop } from "nativewind";
import { MotiView } from "moti";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

// Shim ExponentAV for legacy SDKs only if absolutely missing
// We use global instead of NativeModules proxy to avoid "Tried to insert a NativeModule" error
if (Platform.OS !== 'web' && !NativeModules.ExponentAV) {
  (global as any).ExponentAV = (global as any).ExponentAV || {
    getStatusForVideo: () => Promise.resolve({}),
    loadForVideo: () => Promise.resolve({}),
    unloadForVideo: () => Promise.resolve({}),
    playVideo: () => Promise.resolve({}),
    pauseVideo: () => Promise.resolve({}),
  };
}

// Register components that use className in NativeWind v4
cssInterop(MotiView, {
  className: "style",
});

cssInterop(LinearGradient, {
  className: "style",
});

cssInterop(SafeAreaView, {
  className: "style",
});
