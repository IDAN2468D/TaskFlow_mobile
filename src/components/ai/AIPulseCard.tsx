import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MotiView } from 'moti';
import { Sparkles, ArrowLeft, TrendingUp, AlertTriangle, Zap } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';

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
      from={{ opacity: 0, scale: 0.9, translateY: 20 }}
      animate={{ opacity: 1, scale: 1, translateY: 0 }}
      transition={{ type: 'spring', damping: 15 }}
      style={{ width: '100%' }}
    >
      <TouchableOpacity 
        activeOpacity={0.9} 
        onPress={onPress}
        className="rounded-[44px] p-[1.5px] overflow-hidden shadow-2xl"
      >
        {/* Animated Glow Border */}
        <MotiView
          animate={{
            rotate: '360deg',
          }}
          transition={{
            loop: true,
            duration: 5000,
            type: 'timing',
          }}
          style={{ position: 'absolute', top: -150, left: -150, width: 600, height: 600 }}
        >
          <LinearGradient
            colors={[themeColors.primary, themeColors.accent, themeColors.secondary, themeColors.primary]}
            style={{ width: '100%', height: '100%' }}
          />
        </MotiView>

        <View className="bg-[#0f172a] rounded-[43px] overflow-hidden">
          <LinearGradient 
            colors={[themeColors.primary + '66', 'rgba(30, 27, 75, 0.9)']} 
            start={{ x: 0.5, y: 0 }} 
            end={{ x: 0.5, y: 1 }} 
            className="p-8"
          >
            <View className="flex-row-reverse items-center justify-between mb-8">
              <View>
                <View className="flex-row-reverse items-center gap-1.5 mb-1">
                  <Zap size={14} color={themeColors.accent} fill={themeColors.accent} />
                  <Text style={{ color: themeColors.accent }} className="text-[12px] font-black tracking-[1.5px] uppercase text-right">דופק יומי • אוליבר AI</Text>
                </View>
                <Text className="text-white text-[28px] font-black text-right leading-none">שלום, {userName}&rlm;!</Text>
              </View>
              <MotiView 
                animate={{ scale: [1, 1.1, 1] }} 
                transition={{ loop: true, duration: 2000 }}
                style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)' }}
                className="w-16 h-16 rounded-[24px] items-center justify-center border shadow-2xl backdrop-blur-3xl"
              >
                <Sparkles color="#fff" size={32} />
              </MotiView>
            </View>

            <View style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.1)' }} className="rounded-[32px] p-6 border mb-8 backdrop-blur-md">
              <View className="flex-row-reverse items-center gap-3 mb-3">
                <TrendingUp color={themeColors.primary} size={20} />
                <Text className="text-white/80 text-[15px] font-black text-right">המשימה הקריטית להיום:</Text>
              </View>
              <Text className="text-white text-[20px] font-black text-right leading-[28px]">{topTask}</Text>
            </View>

            <View className="flex-row-reverse items-center justify-between">
              <View className="flex-row-reverse items-center gap-3">
                <View className="bg-rose-500 px-4 py-2 rounded-full shadow-lg shadow-rose-500/40 flex-row-reverse items-center gap-2">
                  <AlertTriangle color="#fff" size={14} />
                  <Text className="text-white text-[12px] font-black uppercase tracking-widest">{urgentCount} דחופות</Text>
                </View>
                <View style={{ backgroundColor: themeColors.primary + '33', borderColor: themeColors.primary + '4D' }} className="px-4 py-2 rounded-full border">
                  <Text style={{ color: themeColors.primary }} className="text-[12px] font-extrabold uppercase tracking-tight">AI Active</Text>
                </View>
              </View>
              
              <View className="w-12 h-12 bg-white/10 rounded-2xl items-center justify-center border border-white/20 overflow-hidden">
                <LinearGradient colors={['rgba(255,255,255,0.1)', 'transparent']} className="absolute inset-0" />
                <ArrowLeft color="#fff" size={24} />
              </View>
            </View>
          </LinearGradient>
        </View>
      </TouchableOpacity>
    </MotiView>
  );
};
