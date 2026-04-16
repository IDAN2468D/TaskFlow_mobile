import 'react-native-gesture-handler/jestSetup';

// Polyfills for Expo SDK 54/55 + React 19 test environment
if (typeof structuredClone === 'undefined') {
  global.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
}

// Polyfill for Expo SDK Node environment
global.__ExpoImportMetaRegistry = new Map();

// Mock Reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock Moti
jest.mock('moti', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    MotiView: (props) => React.createElement(View, props),
    AnimatePresence: ({ children }) => children,
  };
});

// Mock SecureStore
jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn(),
  getItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

// Mock Haptics
jest.mock('expo-haptics', () => ({
  notificationAsync: jest.fn(),
  impactAsync: jest.fn(),
  NotificationFeedbackType: { Success: 0, Error: 1 },
  ImpactFeedbackStyle: { Light: 0, Medium: 1, Heavy: 2 },
}));

// Mock Lucide Icons
jest.mock('lucide-react-native', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    Mail: (props) => React.createElement(View, props),
    Lock: (props) => React.createElement(View, props),
    User: (props) => React.createElement(View, props),
    ArrowRight: (props) => React.createElement(View, props),
    Zap: (props) => React.createElement(View, props),
    Ghost: (props) => React.createElement(View, props),
  };
});
