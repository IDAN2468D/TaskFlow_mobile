import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, Palette, Check, Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';

// define a type for exactly 2 or more colors 
type ThemeOption = {
  id: string;
  name: string;
  subtitle: string;
  activeColors: readonly [string, string, ...string[]];
  badge?: string;
};

const THEMES: ThemeOption[] = [
  { id: 'obsidian', name: 'Nordic Indigo', subtitle: 'איזון שקט של כחול עמוק ואופל', activeColors: ['#0c0c0e', '#818cf8'], badge: 'נבחר' },
  { id: 'emerald', name: 'Spring Sage', subtitle: 'ירוק טבעי ומרגיע לעבודה ממושכת', activeColors: ['#061a14', '#4ade80'] },
  { id: 'midnight', name: 'Lavender Mist', subtitle: 'סגול רך וחלבי למחשבה יצירתית', activeColors: ['#0f0c1d', '#c084fc'] },
  { id: 'amber', name: 'Golden Dusk', subtitle: 'אווירה חמימה ושקטה לסוף היום', activeColors: ['#1a1106', '#fbbf24'] },
];

import { useTheme, ThemeId } from '../context/ThemeContext';

export default function ThemeSettingsScreen() {
  const { themeId, setTheme, colors: themeColors } = useTheme();

  const handleThemeChange = async (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await setTheme(id as ThemeId);
  };

  return (
    <View style={{ flex: 1, backgroundColor: themeColors.background }}>
      <SafeAreaView className="flex-1" edges={['top']}>
        <View className="flex-row items-center justify-between px-6 py-4">
          <View className="flex-row items-center gap-4">
            <View className="w-12 h-12 rounded-outer bg-surface-low items-center justify-center border border-white/5 shadow-2xl">
              <Palette size={24} color={themeColors.primary} />
            </View>
            <View>
              <Text className="text-text-main text-3xl font-black tracking-tighter">התאמה אישית</Text>
              <View className="flex-row items-center gap-1.5 mt-1">
                <View className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-2xl" />
                <Text className="text-text-dim text-[10px] font-black uppercase tracking-widest opacity-60">VISUAL_ENGINE_ACTIVE</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity 
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.back();
            }}
            className="w-10 h-10 rounded-inner bg-surface-low items-center justify-center border border-white/5"
          >
            <ChevronRight size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 60 }}>
          
          <MotiView
             from={{ opacity: 0, translateY: -20 }}
             animate={{ opacity: 1, translateY: 0 }}
             transition={{ type: 'spring', damping: 20 }}
             className="mb-8 relative"
          >
            <View style={{ backgroundColor: themeColors.primary + '33' }} className="absolute end-0 -top-10 w-32 h-32 rounded-full blur-[40px]" />
            <View className="flex-row items-center gap-4 mb-3">
              <View className="w-14 h-14 rounded-inner bg-surface-low items-center justify-center border border-white/5 shadow-2xl">
                <Palette color={themeColors.primary} size={28} />
              </View>
              <Text className="text-text-main text-3xl font-black tracking-tighter">צבעי מערכת</Text>
            </View>
            <Text className="text-text-dim text-sm font-bold leading-5 opacity-70">
              בחר את הסגנון הויזואלי שיעניק לך את חווית העבודה המושלמת. המערכת תתאים את עצמה באופן מיידי לבחירתך.
            </Text>
          </MotiView>

          <View>
            {THEMES.map((theme, i) => (
              <MotiView 
                key={theme.id}
                from={{ opacity: 0, translateX: 50, scale: 0.95 }}
                animate={{ opacity: 1, translateX: 0, scale: 1 }}
                transition={{ delay: i * 150 + 100, type: 'spring', damping: 20 }}
                className="mb-4"
              >
                <TouchableOpacity 
                  activeOpacity={0.8}
                  onPress={() => handleThemeChange(theme.id)}
                  style={{ borderColor: themeId === theme.id ? themeColors.primary : 'rgba(255,255,255,0.05)' }}
                  className="bg-surface-low rounded-outer border overflow-hidden p-4 shadow-2xl relative"
                >
                  <LinearGradient colors={['rgba(255,255,255,0.02)', 'transparent']} className="absolute inset-0" />
                  
                  {themeId === theme.id && (
                     <View style={{ backgroundColor: themeColors.primary + '1A' }} className="absolute inset-0" />
                  )}

                  <View className="flex-row items-center justify-between">
                    {/* Theme Gradient preview */}
                    <View className="w-14 h-14 rounded-inner overflow-hidden border-2 border-white/10 shadow-lg shadow-black/50 relative">
                      <LinearGradient 
                        colors={theme.activeColors as [string, string, ...string[]]} 
                        className="flex-1"
                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                      />
                      {themeId === theme.id && (
                        <View className="absolute inset-0 items-center justify-center bg-black/20">
                           <Sparkles size={18} color="#fff" />
                        </View>
                      )}
                    </View>
                    
                    <View className="flex-1 px-4">
                      <View className="flex-row items-center gap-2 mb-1">
                        <Text className="text-white text-[18px] font-extrabold tracking-tight">{theme.name}</Text>
                        {themeId === theme.id && (
                          <View style={{ backgroundColor: themeColors.primary + '33', borderColor: themeColors.primary + '4D' }} className="px-2 py-0.5 rounded-full border">
                            <Text style={{ color: themeColors.primary }} className="text-[10px] font-extrabold uppercase">נבחר</Text>
                          </View>
                        )}
                      </View>
                      <Text className="text-slate-400 text-[12px] font-medium leading-[18px]">{theme.subtitle}</Text>
                    </View>

                    <View 
                      style={{ 
                        backgroundColor: themeId === theme.id ? themeColors.primary : 'transparent', 
                        borderColor: themeId === theme.id ? themeColors.primary : 'rgba(255,255,255,0.1)' 
                      }} 
                      className={`w-6 h-6 rounded-full items-center justify-center border-2`}
                    >
                      {themeId === theme.id && <Check size={12} color="#fff" strokeWidth={3} />}
                    </View>
                  </View>
                </TouchableOpacity>
              </MotiView>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
