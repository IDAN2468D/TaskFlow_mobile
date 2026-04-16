import React from 'react';
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
  Dimensions
} from 'react-native';
import { Easing } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MotiView, AnimatePresence } from 'moti';
import { 
  Brain, 
  ArrowUp, 
  Clock, 
  Sparkles, 
  LayoutList, 
  Mic, 
  Square, 
  Info, 
  HelpCircle,
  TrendingUp,
  Zap,
  Bell,
  Rocket,
  Lightbulb
} from 'lucide-react-native';
import { AIPulseCard } from '../components/ai/AIPulseCard';
import { TaskRiskBadge } from '../components/ai/TaskRiskBadge';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useAIAssistant } from '../hooks/useAIAssistant';
import VoiceToTaskMobile from '../components/ai/VoiceToTaskMobile';

import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

const SUGGESTIONS = [
  { text: 'תכנן לי פרויקט', icon: Rocket, color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.1)' },
  { text: 'פרק לי משימה', icon: Brain, color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' },
  { text: 'לו״ז למידה', icon: Lightbulb, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
  { text: 'אופטימיזציה', icon: Zap, color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
];

export default function AIAssistantScreen() {
  const { colors: themeColors } = useTheme();
  const [isReady, setIsReady] = React.useState(false);
  const [recording, setRecording] = React.useState<any>(null);
  const [isVoiceProcessing, setIsVoiceProcessing] = React.useState(false);
  const [showTooltip, setShowTooltip] = React.useState<string | null>(null);
  const { prompt, setPrompt, loading, result, setResult, generateTask } = useAIAssistant();

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 500);

    const task = InteractionManager.runAfterInteractions(() => {
      setIsReady(true);
      clearTimeout(timer);
    });
    
    return () => {
      clearTimeout(timer);
      task.cancel();
    };
  }, []);

  async function startRecording() {
    let AudioModule;
    let isMock = false;
    try {
      AudioModule = require('expo-av').Audio;
      if (!AudioModule) throw new Error('Native module missing');
    } catch (e) {
      isMock = true;
    }

    if (isMock) {
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
        setPrompt('תכנן לי משימות למיזם החדש שלי');
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
        setPrompt('תכנן לי משימוט פיתוח לאפליקציית ניהול משימות');
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
      <MotiView
        from={{ opacity: 0, scale: 0.95, translateY: 30 }}
        animate={{ opacity: 1, scale: 1, translateY: 0 }}
        transition={{ type: 'spring', damping: 15 }}
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', borderColor: 'rgba(255, 255, 255, 0.08)' }}
        className="rounded-[40px] p-8 border shadow-2xl relative overflow-hidden"
      >
        <LinearGradient colors={['rgba(99, 102, 241, 0.1)', 'transparent']} className="absolute inset-0" />
        
        <View className="flex-row-reverse items-center justify-between mb-8">
          <View className="flex-row-reverse items-center gap-3">
            <View className="w-10 h-10 rounded-xl bg-indigo-500/20 items-center justify-center border border-indigo-500/30">
              <Sparkles size={20} color="#818cf8" />
            </View>
            <Text className="text-white font-black text-[22px] tracking-tight text-right">הצעת אוליבר</Text>
          </View>
          <TaskRiskBadge level="Low" />
        </View>

        <Text className="text-white font-black text-[28px] text-right leading-tight mb-4 tracking-tighter">
          {result.title}
        </Text>
        
        <Text className="text-slate-400 text-[16px] text-right font-bold leading-[24px] mb-8">
          {result.description}
        </Text>

        <View className="bg-black/20 rounded-[32px] p-6 border border-white/5 mb-8">
          <View className="flex-row-reverse items-center gap-3 mb-6">
            <Clock size={18} color={themeColors.primary} />
            <Text className="text-white font-black text-[14px] uppercase tracking-widest leading-none text-right">תתי-משימות שנוצרו</Text>
          </View>
          
          {result.subTasks.map((st: any, i: number) => (
            <MotiView 
              key={i} 
              from={{ opacity: 0, translateX: 20 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{ delay: 300 + (i * 100) }}
              className="flex-row-reverse items-center justify-between py-4 border-b border-white/5 last:border-0"
            >
              <View className="flex-row-reverse items-center gap-4 flex-1">
                <View className="w-8 h-8 rounded-lg bg-white/5 items-center justify-center border border-white/10">
                  <Text style={{ color: themeColors.primary }} className="font-black text-[12px]">{i + 1}</Text>
                </View>
                <Text className="text-slate-200 font-bold text-[15px] flex-1 text-right">{st.title}</Text>
              </View>
              <View className="bg-white/5 px-3 py-1 rounded-full border border-white/10 mr-4">
                <Text className="text-slate-500 text-[10px] font-black">{st.estimatedTime} דק׳</Text>
              </View>
            </MotiView>
          ))}
        </View>

        <View className="bg-indigo-500/5 rounded-[24px] p-6 border border-indigo-500/10">
          <View className="flex-row-reverse items-center gap-3 mb-3">
            <Brain size={18} color="#818cf8" />
            <Text className="text-indigo-300 font-black text-[12px] uppercase tracking-widest text-right">תובנות אוליבר (AI Insight)</Text>
          </View>
          <Text className="text-slate-300 text-[14px] leading-[22px] text-right font-medium italic">
            {result.aiInsights}
          </Text>
        </View>

        <TouchableOpacity 
          style={{ backgroundColor: themeColors.primary }}
          className="mt-10 h-16 rounded-[24px] items-center justify-center shadow-xl shadow-indigo-500/40"
          onPress={() => {
             Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
             setResult(null);
             setPrompt('');
             router.push('/home');
          }}
        >
          <Text className="text-white font-black text-[18px]">אשר והוסף ללו״ז שלי</Text>
        </TouchableOpacity>
      </MotiView>
    );
  };

  if (!isReady) {
    return (
      <View className="flex-1 bg-obsidian items-center justify-center">
        <ActivityIndicator color={themeColors.primary} size="small" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-obsidian">
      <LinearGradient 
        colors={['rgba(99, 102, 241, 0.12)', 'transparent']} 
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 400 }} 
      />
      
      <SafeAreaView className="flex-1" edges={['top']}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 24, paddingBottom: 160 }}>
            
            {/* Dynamic Header Section */}
            <View className="flex-row-reverse items-center justify-between px-6 pt-4 mb-2">
              <View>
                <Text className="text-white/60 font-bold text-[14px] text-right">בוקר טוב,</Text>
                <Text className="text-white font-black text-[26px] text-right leading-none">משתמש</Text>
              </View>
              <TouchableOpacity 
                onPress={() => router.push('/notifications')}
                className="w-12 h-12 bg-white/5 rounded-2xl items-center justify-center border border-white/10"
              >
                <View className="relative">
                  <Bell size={24} color="#fff" />
                  <View style={{ backgroundColor: themeColors.primary, borderColor: themeColors.background }} className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full border-2" />
                </View>
              </TouchableOpacity>
            </View>

            {/* Quick Suggestions */}
            <View className="mt-8 px-6">
               <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ flexDirection: 'row-reverse', alignItems: 'center', paddingLeft: 4 }}
                >
                  {SUGGESTIONS.map((s, i) => (
                    <MotiView
                      key={i}
                      from={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 100, type: 'spring' }}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                          setPrompt(s.text);
                        }}
                        activeOpacity={0.7}
                        style={{ marginLeft: 12, backgroundColor: themeColors.secondary, borderColor: 'rgba(255,255,255,0.05)' }}
                        className="flex-row-reverse items-center gap-2.5 px-5 py-3 rounded-2xl border shadow-lg"
                      >
                        <View style={{ backgroundColor: s.bg }} className="w-6 h-6 rounded-lg items-center justify-center">
                          <s.icon color={s.color} size={13} strokeWidth={2.5} />
                        </View>
                        <Text className="text-white/90 font-black text-[13.5px] tracking-tight">{s.text}</Text>
                      </TouchableOpacity>
                    </MotiView>
                  ))}
                </ScrollView>
            </View>

            <MotiView
              from={{ opacity: 0, translateY: -20 }}
              animate={{ opacity: 1, translateY: 0 }}
              className="flex-row-reverse items-center justify-between mb-10 bg-white/5 p-6 rounded-[40px] border border-white/10 backdrop-blur-3xl mt-12"
            >
              <View className="flex-row-reverse items-center gap-4">
                <View className="relative">
                  <MotiView 
                    animate={{ rotate: '360deg' }}
                    transition={{ loop: true, duration: 10000, type: 'timing', easing: Easing.bezier(0, 0, 1, 1) }}
                    className="p-[1px] rounded-2xl"
                  >
                    <LinearGradient colors={['#6366f1', '#a855f7']} className="w-14 h-14 rounded-2xl items-center justify-center shadow-lg shadow-indigo-500/40">
                      <Brain color="#fff" size={28} strokeWidth={2.5} />
                    </LinearGradient>
                  </MotiView>
                </View>
                <View>
                  <Text className="text-white font-black text-[24px] text-right tracking-tighter leading-none">עוזר AI</Text>
                  <Text className="text-indigo-400 font-bold text-[11px] text-right mt-1 tracking-widest uppercase">Agent Oliver v2.4</Text>
                </View>
              </View>
              
              <View className="flex-row-reverse gap-3">
                <TouchableOpacity className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 items-center justify-center">
                   <HelpCircle size={20} color="#64748b" />
                </TouchableOpacity>
              </View>
            </MotiView>

            <AnimatePresence>
              {!result && (
                <MotiView
                  from={{ opacity: 0, translateY: 20 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-[#18181b]/80 rounded-[40px] border border-white/10 p-4 shadow-2xl relative overflow-hidden"
                >
                  <LinearGradient colors={['rgba(255,255,255,0.02)', 'transparent']} className="absolute inset-0" />
                  
                  <View className="p-4">
                    <TextInput
                      multiline
                      placeholder="תאר את הפרויקט או המשימה שאתה רוצה לפרק..."
                      placeholderTextColor="#4b5563"
                      value={prompt}
                      onChangeText={setPrompt}
                      className="text-white text-[19px] min-h-[160px] font-bold text-right leading-[28px]"
                      textAlignVertical="top"
                      textAlign="right"
                    />
                  </View>

                  <View className="flex-row-reverse justify-between items-center p-2 mt-4 gap-4">
                    <TouchableOpacity 
                      onPress={recording ? stopRecording : startRecording}
                      className={`w-14 h-14 rounded-[22px] items-center justify-center border transition-all ${recording ? 'bg-red-500 border-red-400 shadow-lg shadow-red-500/40' : 'bg-white/5 border-white/10'}`}
                    >
                      {recording ? <Square color="#fff" size={24} fill="#fff" /> : <Mic color={themeColors.accent} size={24} />}
                    </TouchableOpacity>

                    <TouchableOpacity 
                      disabled={loading || !prompt.trim()}
                      onPress={handleGenerate}
                      className={`flex-1 h-14 rounded-[22px] overflow-hidden shadow-2xl ${!prompt.trim() ? 'opacity-30' : 'shadow-indigo-500/40'}`}
                    >
                      <LinearGradient colors={['#6366f1', '#4f46e5']} className="flex-1 flex-row-reverse items-center justify-center gap-4 px-6">
                        {loading ? (
                          <ActivityIndicator color="#fff" />
                        ) : (
                          <>
                            <Text className="text-white font-black text-[16px] uppercase tracking-tighter">ייצר משימות</Text>
                            <ArrowUp color="#fff" size={20} strokeWidth={3} />
                          </>
                        )}
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </MotiView>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {result && renderResult()}
            </AnimatePresence>

            {/* Bottom Insight Peek */}
            {!result && !loading && (
              <MotiView
                from={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 800 }}
                className="mt-12 items-center"
              >
                <View className="flex-row-reverse items-center gap-2 bg-indigo-500/10 px-4 py-2 rounded-full border border-indigo-500/20">
                  <TrendingUp size={14} color="#818cf8" />
                  <Text className="text-indigo-300 font-bold text-[12px]">אוליבר חסך לך 45 דקות עבודה היום</Text>
                </View>
              </MotiView>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      <AnimatePresence>
        {isVoiceProcessing && (
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 z-[100] items-center justify-center p-10"
          >
             <MotiView
               from={{ scale: 0.8, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               className="bg-[#18181b] p-10 rounded-[48px] border border-indigo-500/30 items-center w-full"
             >
               <MotiView
                 animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                 transition={{ loop: true, duration: 1500 }}
                 className="w-24 h-24 bg-indigo-500/20 rounded-full items-center justify-center mb-8 border border-indigo-500/30"
               >
                 <Brain color="#818cf8" size={48} />
               </MotiView>
               <Text className="text-white font-black text-[24px] text-center mb-2">אוליבר מעבד את הקול שלך...</Text>
               <Text className="text-slate-500 text-center font-bold">הופך קול למשימות חכמות בתוך שניות&rlm;.</Text>
             </MotiView>
          </MotiView>
        )}
      </AnimatePresence>
    </View>
  );
}
