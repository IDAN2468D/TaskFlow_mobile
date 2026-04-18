import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform } from 'react-native';
import BottomSheet, { 
  BottomSheetTextInput, 
  BottomSheetView,
  BottomSheetBackdrop
} from '@gorhom/bottom-sheet';
import { Send, Mic, Sparkles, Zap, Brain, Rocket, Lightbulb, X } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { MotiView, AnimatePresence } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { Easing } from 'react-native-reanimated';
import { useTheme } from '../context/ThemeContext';

interface SmartInputModalProps {
  bottomSheetRef: React.RefObject<BottomSheet | null>;
  onSubmit: (prompt: string) => void;
}

const SUGGESTIONS = [
  { text: 'תכנן לי פרויקט חדש', icon: Rocket, color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.1)' },
  { text: 'פרק לי משימה גדולה', icon: Brain, color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' },
  { text: 'צור לו״ז למידה', icon: Lightbulb, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
  { text: 'אופטימיזציה ליום שלי', icon: Zap, color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
];

export default function SmartInputModal({ bottomSheetRef, onSubmit }: SmartInputModalProps) {
  const { colors: themeColors } = useTheme();
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  
  // Snap points
  const snapPoints = useMemo(() => ['70%'], []);

  const handleSubmit = () => {
    if (!text.trim()) return;
    
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onSubmit(text);
    setText('');
    bottomSheetRef.current?.close();
  };

  const handleSuggestion = (suggestionText: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setText(suggestionText);
  };

  const handleMicPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsRecording(!isRecording);
    
    if (!isRecording) {
      setTimeout(() => {
        if (text === '') {
          setText('תכנן לי משימות למיזם החדש שלי');
          setIsRecording(false);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      }, 2000);
    }
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      backgroundStyle={{ backgroundColor: themeColors.background }}
      handleIndicatorStyle={{ backgroundColor: 'rgba(255,255,255,0.2)', width: 60 }}
      backdropComponent={(props) => (
        <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.8} />
      )}
    >
      <BottomSheetView className="p-6 flex-1">
        {/* Background Decorative Orb */}
        <View 
          style={{ backgroundColor: themeColors.primary + '1A', position: 'absolute', top: -50, left: -50, width: 200, height: 200, borderRadius: 100 }} 
          className="opacity-40"
        />

        {/* Header Section */}
        <View className="flex-row items-center justify-between mb-6 z-10">
          <View className="flex-row items-center gap-4">
            <MotiView
              animate={{ rotate: '360deg' }}
              transition={{ loop: true, duration: 8000, type: 'timing', easing: Easing.bezier(0, 0, 1, 1) }}
              className="p-[1.5px] rounded-[14px] overflow-hidden"
            >
              <LinearGradient colors={[themeColors.primary, themeColors.accent, themeColors.primary]} className="w-12 h-12 items-center justify-center">
                <View style={{ backgroundColor: themeColors.background }} className="w-[44px] h-[44px] rounded-[13px] items-center justify-center">
                  <Sparkles color={themeColors.primary} size={22} />
                </View>
              </LinearGradient>
            </MotiView>
            <View className="items-start">
              <Text className="text-white font-black text-[22px] tracking-tight leading-none">תכנון AI חכם</Text>
              <Text className="text-slate-500 text-[11px] font-black mt-1 tracking-widest uppercase opacity-70">Oliver Multi-Chain AI</Text>
            </View>
          </View>
          
          <TouchableOpacity 
            onPress={() => bottomSheetRef.current?.close()}
            className="w-10 h-10 bg-white/5 rounded-full items-center justify-center border border-white/10"
          >
            <X size={20} color="#94a3b8" />
          </TouchableOpacity>
        </View>

        {/* Suggestion Scroll */}
        <View className="mb-6" style={{ height: 48 }}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ 
              paddingHorizontal: 4, 
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10
            }}
          >
            {SUGGESTIONS.map((s, i) => (
              <MotiView
                key={i}
                from={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 100, type: 'spring' }}
              >
                <TouchableOpacity
                  onPress={() => handleSuggestion(s.text)}
                  activeOpacity={0.7}
                  style={{ backgroundColor: themeColors.secondary, borderColor: 'rgba(255,255,255,0.05)' }}
                  className="flex-row items-center gap-2 px-4 py-2.5 rounded-[12px] border"
                >
                  <View style={{ backgroundColor: s.bg }} className="w-5 h-5 rounded-[6px] items-center justify-center">
                    <s.icon color={s.color} size={11} strokeWidth={2.5} />
                  </View>
                  <Text className="text-white/90 font-bold text-[13px] tracking-tight">{s.text}</Text>
                </TouchableOpacity>
              </MotiView>
            ))}
          </ScrollView>
        </View>

        {/* Glass Input Container */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}
          className="flex-1 rounded-[14px] border p-5 shadow-2xl relative overflow-hidden mb-4"
        >
          <LinearGradient colors={['rgba(99, 102, 241, 0.05)', 'transparent']} className="absolute inset-0" />
          
          <BottomSheetTextInput
            multiline
            placeholder="מה אתה רוצה להשיג היום? אוליבר יבנה לך תוכנית עבודה מלאה..."
            placeholderTextColor="#64748b"
            value={text}
            onChangeText={setText}
            style={[styles.input, { color: '#fff' }]}
          />
          
          <View className="flex-row justify-between items-center mt-6 pt-4 border-t border-white/5">
            {/* Mic Button */}
            <TouchableOpacity 
              onPress={handleMicPress}
              className={`w-14 h-14 rounded-[14px] justify-center items-center border ${isRecording ? 'bg-red-500/10 border-red-500/30' : 'bg-white/5 border-white/10'}`}
            >
              {isRecording && (
                <MotiView
                  from={{ scale: 1, opacity: 0.6 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{ loop: true, duration: 1500, type: 'timing', easing: Easing.bezier(0.25, 0.1, 0.25, 1) }}
                  className="absolute inset-0 bg-red-500 rounded-[14px]"
                />
              )}
              <Mic color={isRecording ? "#ef4444" : themeColors.accent} size={26} strokeWidth={2} />
            </TouchableOpacity>
 
            {/* Submit Button */}
            <TouchableOpacity 
              onPress={handleSubmit}
              disabled={!text.trim()}
              activeOpacity={0.9}
              className={`overflow-hidden rounded-[14px] shadow-2xl ${!text.trim() ? 'opacity-30' : 'shadow-indigo-500/50'}`}
            >
              <LinearGradient 
                colors={[themeColors.accent, themeColors.primary, themeColors.primary]} 
                start={{ x: 0, y: 0 }} 
                end={{ x: 1, y: 1 }} 
                className="flex-row items-center px-10 py-4 gap-4"
              >
                <Text className="text-white font-black text-[16px] uppercase tracking-tighter">צור משימות</Text>
                <Send color="#fff" size={20} strokeWidth={3} />
              </LinearGradient>
              
              {/* Shine Effect */}
              {text.trim().length > 0 && (
                <MotiView
                  from={{ translateX: -150 }}
                  animate={{ translateX: 250 }}
                  transition={{ loop: true, duration: 3000, type: 'timing', easing: Easing.bezier(0.25, 0.1, 0.25, 1), delay: 1000 }}
                  className="absolute h-full w-12 bg-white/20 -skew-x-12"
                />
              )}
            </TouchableOpacity>
          </View>
        </MotiView>
      </BottomSheetView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  input: {
    flex: 1,
    fontSize: 18,
    fontFamily: Platform.OS === 'ios' ? 'Inter' : 'Roboto',
    fontWeight: '800',
    paddingHorizontal: 0,
    paddingTop: 8,
    textAlignVertical: 'top',
    lineHeight: 28,
  }
});
