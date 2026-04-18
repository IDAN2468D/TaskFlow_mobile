import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MotiView } from 'moti';
import { Sparkles, ArrowLeft, TrendingUp, AlertTriangle, Zap } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import * as Haptics from 'expo-haptics';

interface AIPulseCardProps {
  userName: string;
  topTask: string;
  urgentCount: number;
  onPress?: () => void;
}

export const AIPulseCard: React.FC<AIPulseCardProps> = ({ userName, topTask, urgentCount, onPress }) => {
  const { colors: themeColors } = useTheme();
  
  return (
    <MotiView
      from={{ opacity: 0, scale: 0.98, translateY: 10 }}
      animate={{ opacity: 1, scale: 1, translateY: 0 }}
      className="w-full"
    >
      <TouchableOpacity 
        activeOpacity={0.9} 
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPress?.();
        }}
        className="rounded-outer overflow-hidden bg-surface-low border border-primary/20 shadow-2xl"
      >
        <View className="p-5">
          <View className="flex-row items-center justify-between mb-5">
            <View className="items-start">
              <View className="flex-row items-center gap-1.5 mb-1">
                <View className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <Text className="text-text-dim text-[10px] font-bold tracking-widest uppercase">SYSTEM_PULSE_ACTIVE</Text>
              </View>
              <Text className="text-text-main text-2xl font-bold tracking-tight">שלום, {userName}</Text>
            </View>
            <View className="w-12 h-12 rounded-outer bg-surface-mid items-center justify-center border border-white/5">
              <Sparkles color={themeColors.primary} size={24} />
            </View>
          </View>

          <View className="bg-surface-mid rounded-inner p-4 border border-white/5 mb-5">
            <View className="flex-row items-center gap-2 mb-2">
              <TrendingUp color={themeColors.primary} size={14} />
              <Text className="text-text-dim text-[11px] font-bold uppercase tracking-widest">המשימה הקריטית להיום</Text>
            </View>
            <Text className="text-text-main text-lg font-bold leading-tight">{topTask}</Text>
          </View>

          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <View className="bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20 flex-row items-center gap-1.5">
                 <AlertTriangle color="#f43f5e" size={12} />
                 <Text className="text-rose-400 text-[10px] font-bold uppercase tracking-widest">{urgentCount} דחופות</Text>
              </View>
              <View className="bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                 <Text className="text-primary text-[10px] font-bold uppercase tracking-widest">AI_OPTIMIZED</Text>
              </View>
            </View>
            
            <View className="w-8 h-8 rounded-full bg-surface-mid items-center justify-center border border-white/5">
              <ArrowLeft color="#fff" size={16} />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </MotiView>
  );
};
