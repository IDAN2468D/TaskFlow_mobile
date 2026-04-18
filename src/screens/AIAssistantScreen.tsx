import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator,
  InteractionManager,
  Dimensions,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MotiView, AnimatePresence } from 'moti';
import { 
  BrainCircuit, 
  Sparkles, 
  Mic, 
  Square, 
  TrendingUp,
  Zap,
  Rocket,
  Lightbulb,
  Waves,
  Activity,
  Target,
  Bot,
  Command,
  Cpu,
  ArrowRight,
  ChevronRight,
  Settings,
  ShieldCheck,
  Signal
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useAIAssistant } from '../hooks/useAIAssistant';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

const SUGGESTIONS = [
  { text: 'תכנן לי פרויקט', icon: Rocket, color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.1)' },
  { text: 'פרק לי משימה', icon: BrainCircuit, color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' },
  { text: 'לו״ז למידה', icon: Lightbulb, color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.1)' },
  { text: 'אופטימיזציה', icon: Zap, color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
];

export default function AIAssistantScreen() {
  const { colors: themeColors } = useTheme();
  const [isReady, setIsReady] = React.useState(false);
  const [recording, setRecording] = React.useState<any>(null);
  const [isVoiceProcessing, setIsVoiceProcessing] = React.useState(false);
  const { prompt, setPrompt, loading, result, setResult, generateTask } = useAIAssistant();

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      setIsReady(true);
    });
    return () => task.cancel();
  }, []);

  async function startRecording() {
    let AudioModule;
    try {
      AudioModule = require('expo-av').Audio;
    } catch (e) {
      setRecording({ isMock: true });
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      return;
    }

    try {
      const permission = await AudioModule.requestPermissionsAsync();
      if (permission.status !== 'granted') return;

      await AudioModule.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await AudioModule.Recording.createAsync(
        AudioModule.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (err) {
      setRecording({ isMock: true });
    }
  }

  async function stopRecording() {
    if (!recording) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    
    if (recording.isMock) {
      setRecording(null);
      setIsVoiceProcessing(true);
      setTimeout(() => {
        setPrompt('תכנן לי משימות לפרויקט החדש שלי');
        setIsVoiceProcessing(false);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }, 1500);
      return;
    }

    try {
      await recording.stopAndUnloadAsync();
      setRecording(null);
      setIsVoiceProcessing(true);
      setTimeout(() => {
        setIsVoiceProcessing(false);
        setPrompt('תכנן לי משימות פיתוח לאפליקציית ניהול משימות');
      }, 2000);
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  }

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    generateTask();
  };

  const renderResult = () => {
    if (!result) return null;
    return (
      <View className="mt-4 gap-y-4">
        <MotiView 
          from={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-outer bg-surface-low p-6 border border-white/5 shadow-2xl"
        >
          <View className="flex-row items-center justify-between mb-6">
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-inner bg-surface-mid justify-center items-center border border-white/5 shadow-xl">
                <Sparkles size={20} color={themeColors.primary} />
              </View>
              <View className="items-start">
                  <Text className="text-text-dim text-[10px] font-black tracking-[2px] uppercase opacity-60">NEURAL SYNTHESIS READY</Text>
                  <Text className="text-text-main text-xl font-black tracking-tight">הצעת המוח המרכזי</Text>
              </View>
            </View>
            <View className="bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              <Text className="text-emerald-400 text-[10px] font-black tracking-[1px] uppercase">OPTIMIZED</Text>
            </View>
          </View>

          <Text className="text-text-main text-2xl font-black mb-3 tracking-tighter">
            {result.title}
          </Text>
          
          <Text className="text-text-dim text-sm font-bold leading-6 mb-6 opacity-80">
            {result.description}
          </Text>

          <View className="bg-surface-mid/50 rounded-inner p-4 border border-white/5 mb-6">
            <View className="flex-row items-center gap-2 mb-4">
              <View className="w-1 h-4 rounded-full bg-primary" />
              <Text className="text-primary text-[10px] font-black uppercase tracking-[1.5px]">ארכיטקטורת פעולה</Text>
            </View>
            
            {result.subTasks.map((st: any, i: number) => (
              <MotiView 
                key={i} 
                from={{ opacity: 0, translateX: 10 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ delay: i * 100 }}
                className={`flex-row items-start justify-between py-3 gap-3 ${i < result.subTasks.length - 1 ? 'border-b border-white/5' : ''}`}
              >
                <View className="flex-row items-start gap-3 flex-1">
                  <View className="w-7 h-7 rounded-inner bg-surface-low border border-white/5 justify-center items-center">
                    <Text className="text-primary font-black text-xs">{i + 1}</Text>
                  </View>
                  <View className="flex-1">
                      <Text className="text-text-main text-[15px] font-black mb-0.5 tracking-tight">{st.title}</Text>
                      <Text className="text-text-dim text-[10px] font-bold italic opacity-40">מיקרו-משימה {i + 1}</Text>
                  </View>
                </View>
                <View className="bg-surface-low px-2 py-1 rounded-inner border border-white/5">
                  <Text className="text-text-dim text-[10px] font-black tracking-tight">{st.estimatedTime}m</Text>
                </View>
              </MotiView>
            ))}
          </View>

          <View className="bg-surface-mid/30 rounded-inner p-4 border border-white/5 mb-6">
            <View className="flex-row items-center gap-2 mb-2">
              <View className="w-6 h-6 rounded-inner bg-primary/10 items-center justify-center border border-primary/20">
                  <BrainCircuit size={14} color={themeColors.primary} />
              </View>
              <Text className="text-primary text-[10px] font-black uppercase tracking-[1.5px]">תובנה מוחית</Text>
            </View>
            <Text className="text-text-dim text-[13px] font-bold leading-5 italic opacity-80">
              "{result.aiInsights}"
            </Text>
          </View>

          <TouchableOpacity 
            className="h-[60px] rounded-outer bg-primary flex-row items-center justify-center gap-3 px-6 shadow-2xl"
            activeOpacity={0.9}
            onPress={() => {
               Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
               setResult(null);
               setPrompt('');
               router.replace('/home');
            }}
          >
            <Text className="text-white text-lg font-black tracking-tight">סנכרן ללוח העבודה</Text>
            <Zap size={20} color="#fff" fill="#fff" />
          </TouchableOpacity>
        </MotiView>
        
        <TouchableOpacity 
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setResult(null);
          }}
          className="mt-4 items-center"
        >
          <View className="flex-row items-center gap-2 bg-surface-low px-5 py-3 rounded-full border border-white/5">
            <ArrowRight size={14} color={themeColors.primary} />
            <Text className="text-text-dim text-xs font-black">צור משהו חדש</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  if (!isReady) {
    return (
      <View className="flex-1 bg-obsidian justify-center items-center">
        <ActivityIndicator color={themeColors.primary} size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-obsidian">
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          <ScrollView 
            showsVerticalScrollIndicator={false} 
            contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 120 }}
            className="flex-1"
          >
            {/* Standardized Obsidian Header */}
            <MotiView
              from={{ opacity: 0, translateY: -10 }}
              animate={{ opacity: 1, translateY: 0 }}
              className="px-6 pt-4 pb-6 border-b border-white/5"
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-4">
                  <TouchableOpacity 
                    onPress={() => {
                       Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                       router.back();
                    }}
                    className="w-12 h-12 rounded-outer bg-surface-low justify-center items-center border border-white/5"
                  >
                    <ChevronRight size={24} color="#fff" />
                  </TouchableOpacity>
                  <View className="items-start">
                    <View className="flex-row items-center gap-1.5 mb-0.5">
                       <View className="w-1.5 h-1.5 rounded-full bg-primary shadow-sm" />
                       <Text className="text-text-dim text-[10px] font-black uppercase tracking-[2px]">NEURAL_PROTOCOL_ACTIVE</Text>
                    </View>
                    <Text className="text-text-main text-2xl font-black tracking-tighter">העוזר המרכזי</Text>
                  </View>
                </View>
                
                <View className="w-10 h-10 rounded-inner bg-surface-mid items-center justify-center border border-white/5">
                   <Bot size={20} color={themeColors.primary} />
                </View>
              </View>
            </MotiView>

            {!result && (
              <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {/* Prompt Suggestions */}
                <View className="mb-6">
                  <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ flexDirection: 'row', gap: 8 }}
                  >
                    {SUGGESTIONS.map((s, i) => (
                       <MotiView
                        key={i}
                        from={{ opacity: 0, scale: 0.9, translateY: 10 }}
                        animate={{ opacity: 1, scale: 1, translateY: 0 }}
                        transition={{ delay: i * 100 }}
                      >
                        <TouchableOpacity
                          onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            setPrompt(s.text);
                          }}
                          className="flex-row items-center px-4 py-2.5 rounded-inner bg-surface-low border border-white/5 gap-3"
                        >
                          <View className="w-6 h-6 rounded bg-surface-mid justify-center items-center">
                            <s.icon color={s.color} size={14} />
                          </View>
                          <Text className="text-text-main text-sm font-black tracking-tight">{s.text}</Text>
                        </TouchableOpacity>
                      </MotiView>
                    ))}
                  </ScrollView>
                </View>

                {/* Input Neural Hub */}
                <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }}>
                  <View className="rounded-outer bg-surface-low p-6 border border-white/5 shadow-2xl">
                     <View className="flex-row items-center justify-between mb-6">
                         <View className="flex-row items-center gap-3">
                             <View className="w-8 h-8 rounded-inner bg-surface-mid items-center justify-center border border-white/5">
                               <Signal size={16} color={themeColors.primary} />
                             </View>
                             <Text className="text-text-dim text-[10px] font-black uppercase tracking-[4px] opacity-60">SIGNAL_CAPTURE</Text>
                         </View>
                         <Activity size={16} color={themeColors.primary} opacity={0.2} />
                     </View>

                    <TextInput
                      multiline
                      placeholder="תאר את הרעיון שלך... נבנה ממנו תוכנית פעולה"
                      placeholderTextColor="rgba(255,255,255,0.1)"
                      value={prompt}
                      onChangeText={setPrompt}
                      className="text-text-main text-lg font-bold leading-7 min-h-[150px]"
                      textAlignVertical="top"
                    />

                    <View className="flex-row items-center mt-6 gap-3">
                      <TouchableOpacity 
                        onPress={recording ? stopRecording : startRecording}
                        className={`w-14 h-14 rounded-inner justify-center items-center border border-white/5 shadow-xl ${recording ? 'bg-rose-500/20' : 'bg-surface-mid'}`}
                      >
                        {recording ? (
                          <MotiView
                            animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
                            transition={{ loop: true, duration: 800 }}
                          >
                            <Square color="#f43f5e" size={20} fill="#f43f5e" />
                          </MotiView>
                        ) : (
                          <Mic color={themeColors.primary} size={20} />
                        )}
                      </TouchableOpacity>

                      <TouchableOpacity 
                        disabled={loading || !prompt.trim()}
                        onPress={handleGenerate}
                        activeOpacity={0.9}
                        className={`flex-1 h-14 rounded-inner bg-primary flex-row items-center justify-center gap-3 px-6 shadow-2xl ${!prompt.trim() ? 'opacity-20' : ''}`}
                      >
                        {loading ? (
                          <ActivityIndicator color="#fff" size="small" />
                        ) : (
                          <>
                            <Text className="text-white text-base font-black tracking-tight">סנתז משימה</Text>
                            <Zap color="#fff" size={18} fill="#fff" />
                          </>
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Optimization Badge */}
                  <MotiView transition={{ delay: 500 }} className="mt-8 items-center">
                    <View className="flex-row items-center px-5 py-3 rounded-outer bg-surface-low border border-white/5 gap-3 shadow-xl">
                      <TrendingUp size={20} color={themeColors.primary} />
                      <View className="items-start">
                          <Text className="text-sm font-black text-text-main tracking-tight">אופטימיזציה קוגניטיבית</Text>
                          <Text className="text-[10px] font-black text-primary uppercase tracking-[2px] mt-0.5 opacity-40">AG_CORE_SYSTEM_ACTIVE</Text>
                      </View>
                    </View>
                  </MotiView>
                </MotiView>
              </MotiView>
            )}

            <AnimatePresence>
              {result && renderResult()}
            </AnimatePresence>

            {/* Branding Footer */}
            <View className="mt-16 items-center opacity-20 pb-12">
               <Cpu size={20} color="#fff" />
               <Text className="text-[10px] text-white font-black text-center mt-3 tracking-[4px] uppercase">TaskFlow AI • NEURAL_SYNTH_CORE v1.2</Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {/* Voice Processing Overlay */}
      <AnimatePresence>
        {isVoiceProcessing && (
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-obsidian/95 z-[1000] justify-center items-center p-8"
          >
             <View className="bg-surface-low p-8 rounded-outer border border-white/5 items-center w-full shadow-2xl">
                <MotiView
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: ['0deg', '90deg', '0deg']
                  }}
                  transition={{ loop: true, duration: 3000 }}
                  className="w-24 h-24 rounded-inner bg-primary/10 justify-center items-center border border-primary/20 mb-8"
                >
                  <Waves color={themeColors.primary} size={48} />
                </MotiView>
                
                <Text className="text-text-main text-2xl font-black text-center mb-3">דוגם סיגנל קולי</Text>
                <Text className="text-text-dim text-sm font-bold text-center leading-5 opacity-70">
                    מנתח את מבנה הקול לצורך סנכרון תודעתי מלא עם הליבה המרכזית
                </Text>

                <View className="flex-row items-center gap-3 mt-10">
                  {[0, 1, 2, 3, 4, 5].map(i => (
                    <MotiView
                      key={i}
                      animate={{ height: [15, 45, 15] }}
                      transition={{ loop: true, duration: 600, delay: i * 100 }}
                      className="w-1.5 rounded-full bg-primary"
                    />
                  ))}
                </View>
             </View>
          </MotiView>
        )}
      </AnimatePresence>
    </View>
  );
}
