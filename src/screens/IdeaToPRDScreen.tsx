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
  Dimensions,
  StatusBar
} from 'react-native';
import { executeOnIdle } from '../lib/performance';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MotiView, AnimatePresence } from 'moti';
import { 
  FileText, 
  Sparkles, 
  ChevronRight, 
  Copy, 
  Download, 
  Rocket,
  Lightbulb,
  Zap,
  Target,
  Cpu,
  ShieldCheck,
  Layers,
  Code2,
  Workflow
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { usePRD } from '../hooks/usePRD';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

export default function IdeaToPRDScreen() {
  const { colors: themeColors } = useTheme();
  const [isReady, setIsReady] = useState(false);
  const { idea, setIdea, loading, result, generatePRD } = usePRD();

  useEffect(() => {
    const task = executeOnIdle(() => {
      setIsReady(true);
    });
    return () => task.cancel();
  }, []);

  const handleGenerate = () => {
    if (!idea.trim()) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    generatePRD();
  };

  const renderPRDContent = () => {
    if (!result) return null;
    return (
      <View className="mt-6 gap-y-4 pb-12">
        <MotiView
          from={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-outer bg-surface-low p-6 border border-white/5 shadow-2xl"
        >
          <View className="flex-row items-center justify-between mb-6">
            <View className="flex-row items-center gap-4">
              <View className="w-12 h-12 rounded-inner bg-surface-mid items-center justify-center border border-white/5">
                <ShieldCheck size={24} color={themeColors.primary} />
              </View>
              <View className="items-start">
                  <Text className="text-text-dim text-[10px] font-black tracking-[3px] uppercase opacity-60">SYSTEM_PROTO_V1</Text>
                  <Text className="text-text-main text-2xl font-black tracking-tighter">מסמך אפיון (PRD)</Text>
              </View>
            </View>
            <TouchableOpacity 
                onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                className="w-10 h-10 rounded-inner bg-surface-mid items-center justify-center border border-white/5"
            >
              <Copy size={18} color="#fff" />
            </TouchableOpacity>
          </View>

          <View className="bg-surface-mid/50 rounded-inner p-5 border border-white/5 mb-6">
             <Text className="text-primary text-[10px] font-black uppercase tracking-[2px] mb-2">אופטימיזציה אסטרטגית</Text>
             <Text className="text-text-main text-xl font-black tracking-tight">{result.title}</Text>
             <Text className="text-text-dim text-sm font-bold mt-2 leading-5 italic opacity-70">"{result.summary}"</Text>
          </View>

          <View className="gap-y-8">
             <View>
                <View className="flex-row items-center gap-3 mb-4">
                   <Target size={20} color={themeColors.primary} />
                   <Text className="text-text-main text-lg font-black tracking-tight">מטרות מרכזיות</Text>
                </View>
                 {result.goals.map((goal: string, i: number) => (
                  <View key={i} className="flex-row items-start gap-3 mb-3">
                    <View className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shadow-2xl" />
                    <Text className="text-text-dim text-sm font-bold flex-1 leading-5">{goal}</Text>
                  </View>
                ))}
             </View>

             <View>
                <View className="flex-row items-center gap-3 mb-4">
                   <Layers size={20} color={themeColors.primary} />
                   <Text className="text-text-main text-lg font-black tracking-tight">פונקציונליות ליבה</Text>
                </View>
                 {result.features.map((feature: any, i: number) => (
                  <View key={i} className="bg-surface-mid/30 rounded-inner p-4 border border-white/5 mb-3">
                    <Text className="text-primary text-sm font-black mb-1 tracking-tight">{feature.name}</Text>
                    <Text className="text-text-dim text-xs font-bold leading-5 opacity-70">{feature.description}</Text>
                  </View>
                ))}
             </View>
          </View>
        </MotiView>

        {/* Technical Stack */}
        <View className="rounded-outer bg-surface-low p-6 border border-white/5 shadow-xl">
           <View className="flex-row items-center gap-4 mb-6">
              <View className="w-11 h-11 rounded-inner bg-surface-mid items-center justify-center border border-white/5">
                <Code2 size={22} color="#10b981" />
              </View>
              <Text className="text-text-main text-lg font-black tracking-tight">מעטפת טכנולוגית</Text>
           </View>
           <View className="flex-row flex-wrap gap-2">
              {['React Native', 'Node.js', 'MongoDB', 'Redis', 'AWS', 'Tailwind'].map((tech, i) => (
                <View key={i} className="px-4 py-2 rounded-inner bg-surface-mid border border-white/5">
                   <Text className="text-text-main text-[11px] font-black tracking-tight opacity-80">{tech}</Text>
                </View>
              ))}
           </View>
        </View>
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
            contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 150 }}
            className="flex-1"
          >
            <View className="flex-row items-center justify-between px-0 py-4 mb-8 mt-4">
              <TouchableOpacity 
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.back();
                }}
                className="w-10 h-10 rounded-inner bg-surface-low items-center justify-center border border-white/5"
              >
                <ChevronRight size={24} color="#fff" />
              </TouchableOpacity>

              <View className="flex-row items-center gap-4">
                <View className="items-start">
                  <Text className="text-text-main text-3xl font-black tracking-tighter">מרעיון לפעולה</Text>
                  <View className="flex-row items-center gap-1.5 mt-1">
                    <View className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-2xl" />
                    <Text className="text-text-dim text-[10px] font-black uppercase tracking-widest opacity-60">IDEA_NUCLEUS_ACTIVE</Text>
                  </View>
                </View>
                <View className="w-12 h-12 rounded-outer bg-surface-low items-center justify-center border border-white/5 shadow-2xl">
                  <Lightbulb size={24} color={themeColors.primary} />
                </View>
              </View>
            </View>

            {/* Input Phase */}
            {!result && (
              <View className="gap-y-8">
                <MotiView
                  from={{ opacity: 0, translateY: 20 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  className="rounded-outer bg-surface-low p-6 border border-white/5 shadow-2xl"
                >
                   <View className="flex-row items-center justify-between mb-6">
                       <View className="flex-row items-center gap-3">
                             <View className="w-8 h-8 rounded-inner bg-surface-mid items-center justify-center border border-white/5">
                               <Sparkles size={16} color={themeColors.primary} />
                             </View>
                             <Text className="text-text-dim text-[10px] font-black uppercase tracking-[4px] opacity-60">VISION_SYNTHESIS</Text>
                       </View>
                   </View>
                   
                   <TextInput
                      multiline
                      numberOfLines={6}
                      placeholder="תאר את החזון הגולמי שלך... המנוע המרכזי יסנתז אפיון מערכת מלא בזמן אמת"
                      placeholderTextColor="rgba(255,255,255,0.1)"
                      value={idea}
                      onChangeText={setIdea}
                      textAlignVertical="top"
                      className="text-text-main text-lg font-bold leading-7 min-h-[180px]"
                   />

                   <TouchableOpacity 
                      disabled={loading || !idea.trim()}
                      onPress={handleGenerate}
                      activeOpacity={0.9}
                      className={`mt-8 h-[64px] rounded-outer bg-primary flex-row items-center justify-center gap-3 px-6 shadow-2xl ${!idea.trim() ? 'opacity-20' : ''}`}
                    >
                      {loading ? (
                        <ActivityIndicator color="#fff" size="small" />
                      ) : (
                        <>
                          <Text className="text-white text-lg font-black tracking-tight">סנתז אפיון מלא</Text>
                          <Zap color="#fff" size={24} fill="#fff" />
                        </>
                      )}
                    </TouchableOpacity>
                </MotiView>

                 {/* Templates Grid */}
                <View>
                   <View className="flex-row items-center gap-3 mb-6">
                      <Text className="text-text-dim text-xs font-black uppercase tracking-[3px]">היסטוריית סנכרון</Text>
                      <View className="h-[1px] flex-1 bg-white/10" />
                   </View>
                   
                   <View className="flex-row gap-3">
                      <TouchableOpacity className="flex-1 bg-surface-low border border-white/5 rounded-outer p-5 h-32 justify-between items-start shadow-sm">
                         <View className="w-10 h-10 rounded-inner bg-surface-mid justify-center items-center border border-white/5">
                            <Workflow color={themeColors.primary} size={18} />
                         </View>
                         <View className="items-start">
                            <Text className="text-text-main text-sm font-black">מערכת SaaS</Text>
                            <Text className="text-text-dim text-[8px] font-black mt-1 uppercase tracking-widest opacity-40">ALREADY_COMPILED</Text>
                         </View>
                      </TouchableOpacity>

                      <TouchableOpacity className="flex-1 bg-surface-low border border-white/5 rounded-outer p-5 h-32 justify-between items-start shadow-sm">
                         <View className="w-10 h-10 rounded-inner bg-rose-500/10 justify-center items-center border border-rose-500/20">
                            <Rocket color="#f43f5e" size={18} />
                         </View>
                         <View className="items-start">
                            <Text className="text-text-main text-sm font-black">MVP מובייל</Text>
                            <Text className="text-text-dim text-[8px] font-black mt-1 uppercase tracking-widest opacity-40">SYSTEM_NEW</Text>
                         </View>
                      </TouchableOpacity>
                   </View>
                </View>
              </View>
            )}

             {/* Results Phase */}
            {result && renderPRDContent()}

            {/* Branding Footer */}
            <View className="mt-12 items-center opacity-20 pb-16">
               <Cpu size={20} color="#fff" />
               <Text className="text-[10px] text-white font-black text-center mt-3 tracking-[4px] uppercase">TaskFlow AI • NEURAL_SYNTH_CORE v1.2</Text>
            </View>

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
