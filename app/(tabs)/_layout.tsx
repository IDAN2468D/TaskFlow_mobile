import { Tabs } from 'expo-router';
import { Home, Bot, Timer, User, Lightbulb } from 'lucide-react-native';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '../../src/context/ThemeContext';

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const { colors: themeColors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: themeColors.secondary,
          borderTopWidth: 1,
          borderTopColor: 'rgba(255,255,255,0.05)',
          paddingBottom: insets.bottom,
          paddingTop: 0,
          height: Platform.OS === 'ios' ? 48 + insets.bottom : 52 + insets.bottom,
        },
        tabBarActiveTintColor: themeColors.primary,
        tabBarInactiveTintColor: '#71717a',
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: 'bold',
          marginBottom: 4,
        }
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'בית',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="ai"
        options={{
          title: 'עוזר AI',
          tabBarIcon: ({ color, size }) => <Bot size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="ideas"
        options={{
          title: 'רעיונות',
          tabBarIcon: ({ color, size }) => <Lightbulb size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="focus"
        options={{
          title: 'ריכוז',
          tabBarIcon: ({ color, size }) => <Timer size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'פרופיל',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
