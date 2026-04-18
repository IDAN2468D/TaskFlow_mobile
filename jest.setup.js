import 'react-native-gesture-handler/jestSetup';

// Polyfills for Expo SDK 54/55 + React 19 test environment
if (typeof structuredClone === 'undefined') {
  global.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
}

// Polyfill for Expo SDK Node environment
global.__ExpoImportMetaRegistry = new Map();

// Mock Reanimated
jest.mock('react-native-reanimated', () => {
  return {
    __esModule: true,
    default: {
      call: () => {},
      createAnimatedComponent: (c) => c,
    },
    useSharedValue: (v) => ({ value: v }),
    useAnimatedStyle: () => ({}),
    useAnimatedProps: () => ({}),
    withTiming: (v) => v,
    withSpring: (v) => v,
    runOnJS: (fn) => fn,
    makeMutable: (v) => ({ value: v }),
    createAnimatedComponent: (c) => c,
    View: 'View',
    Text: 'Text',
    ScrollView: 'ScrollView',
    Extrapolation: { CLAMP: 'clamp', IDENTITY: 'identity', EXTEND: 'extend' },
    interpolate: (v) => v,
    Easing: {
      bezier: () => ({ factory: () => {} }),
      linear: () => ({ factory: () => {} }),
      in: () => ({ factory: () => {} }),
      out: () => ({ factory: () => {} }),
      inOut: () => ({ factory: () => {} }),
      quad: () => ({ factory: () => {} }),
      cubic: () => ({ factory: () => {} }),
    },
  };
});

// Mock Moti
jest.mock('moti', () => ({
  MotiView: 'View',
  MotiText: 'Text',
  AnimatePresence: ({ children }) => children,
}));

// Mock SecureStore
jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn(),
  getItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

// Mock LinearGradient and BlurView
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: 'View',
}));

jest.mock('expo-blur', () => ({
  BlurView: 'View',
}));

// Mock expo-router
jest.mock('expo-router', () => ({
  router: { push: jest.fn(), replace: jest.fn(), back: jest.fn() },
}));

// Mock ThemeContext
jest.mock('./src/context/ThemeContext', () => ({
  useTheme: () => ({
    colors: {
      primary: '#6366f1',
      secondary: '#10b981',
      background: '#0f172a',
      surface: '#1e293b',
      text: '#f8fafc',
      textDim: '#94a3b8',
      accent: '#818cf8',
      danger: '#ef4444',
      border: '#334155',
    },
    isDark: true,
    toggleTheme: jest.fn(),
  }),
  ThemeProvider: ({ children }) => children,
}));

// Mock AuthContext
jest.mock('./src/context/AuthContext', () => ({
  useAuthContext: () => ({
    user: { id: '1', name: 'Test User', email: 'test@example.com' },
    loading: false,
    login: jest.fn(),
    logout: jest.fn(),
    register: jest.fn(),
  }),
  AuthProvider: ({ children }) => children,
}));

// Mock Haptics
jest.mock('expo-haptics', () => ({
  notificationAsync: jest.fn(),
  impactAsync: jest.fn(),
  NotificationFeedbackType: { Success: 0, Error: 1 },
  ImpactFeedbackStyle: { Light: 0, Medium: 1, Heavy: 2 },
}));

// Mock Lucide Icons using a Proxy to handle any icon name
jest.mock('lucide-react-native', () => {
  return new Proxy({}, {
    get: (target, name) => {
      if (name === '__esModule') return true;
      const Icon = (props) => name;
      Icon.displayName = name;
      return Icon;
    }
  });
});

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }) => children,
  SafeAreaView: ({ children }) => children,
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
  useSafeAreaFrame: () => ({ x: 0, y: 0, width: 390, height: 844 }),
}));

// Mock react-native-screens
jest.mock('react-native-screens', () => ({
  enableScreens: jest.fn(),
  ScreenContainer: 'View',
  Screen: 'View',
}));

// Mock gorhom/bottom-sheet
jest.mock('@gorhom/bottom-sheet', () => ({
  __esModule: true,
  default: 'View',
  BottomSheetView: 'View',
  BottomSheetTextInput: 'TextInput',
  BottomSheetBackdrop: () => null,
  BottomSheetScrollView: 'ScrollView',
  BottomSheetFlatList: 'FlatList',
  BottomSheetSectionList: 'SectionList',
}));

// Mock InteractionManager globally
jest.mock('react-native/Libraries/Interaction/InteractionManager', () => ({
  __esModule: true,
  default: {
    runAfterInteractions: (callback) => {
      if (typeof callback === 'function') callback();
      return { cancel: () => {} };
    },
    createInteractionHandle: () => 1,
    clearInteractionHandle: () => {},
    addListener: () => ({ remove: () => {} }),
  },
  runAfterInteractions: (callback) => {
    if (typeof callback === 'function') callback();
    return { cancel: () => {} };
  },
}));

// Mock Axios
jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: {} })),
  post: jest.fn(() => Promise.resolve({ data: {} })),
  put: jest.fn(() => Promise.resolve({ data: {} })),
  delete: jest.fn(() => Promise.resolve({ data: {} })),
  patch: jest.fn(() => Promise.resolve({ data: {} })),
  create: jest.fn(function() { return this; }),
  interceptors: {
    request: { use: jest.fn(), eject: jest.fn() },
    response: { use: jest.fn(), eject: jest.fn() },
  },
  defaults: {
    headers: {
      common: {},
    },
  },
}));
