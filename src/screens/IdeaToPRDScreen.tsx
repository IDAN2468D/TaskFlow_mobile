import React from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  Dimensions,
  InteractionManager,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MotiView, AnimatePresence } from 'moti';
import { Skeleton } from 'moti/skeleton';
import { Rocket, Send, Target, Zap, Layout, Clock, Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { usePRD } from '../hooks/usePRD';

const { width } = Dimensions.get('window');

export default function IdeaToPRDScreen() {
  const [isReady, setIsReady] = React.useState(false);
  const { idea, setIdea, loading, result, generatePRD, reset } = usePRD();

  React.useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      setIsReady(true);
    });
    return () => task.cancel();
  }, []);

  if (!isReady) {
    return (
      <View className="flex-1 bg-obsidian items-center justify-center">
        <ActivityIndicator color="#6366f1" size="small" />
      </View>
    );
  }

  const renderPRD = () => (
    <MotiView
      from={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', damping: 18 }}
      className="bg-[#121214]/90 rounded-[40px] p-1 border border-indigo-500/30 overflow-hidden shadow-2xl"
    >
      <LinearGradient colors={['rgba(99, 102, 241, 0.15)', 'transparent']} className="absolute inset-0" />
      
      <View className="p-8">
        <View className="items-center mb-10 pt-4">
          <View className="relative">
            <MotiView 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ loop: true, duration: 4000, type: 'timing' }}
              className="absolute inset-0 bg-indigo-500/20 rounded-full blur-2xl"
            />
            <View className="w-20 h-20 bg-indigo-500/30 rounded-[28px] items-center justify-center mb-6 border border-indigo-400/40 shadow-2xl">
              <Rocket color="#a5b4fc" size={40} />
            </View>
          </View>
          <Text className="text-[36px] font-black text-white mt-1 text-center tracking-tighter leading-[42px]">{result.productName}</Text>
          <View className="bg-indigo-500/20 px-4 py-1.5 rounded-full border border-indigo-500/30 mt-4">
            <Text className="text-[12px] font-black text-indigo-300 uppercase tracking-widest text-center">מסמך אפיון מוצר מיוצר ע"י AI</Text>
          </View>
          <Text className="text-[17px] text-slate-300 text-center mt-6 font-bold px-4 leading-[26px] italic opacity-90">"{result.elevatorPitch}"</Text>
        </View>

        <View className="mb-8 bg-white/5 p-6 rounded-[32px] border border-white/10 shadow-inner">
          <View className="flex-row-reverse items-center mb-4 gap-3">
            <View className="w-10 h-10 rounded-[14px] bg-slate-800/80 items-center justify-center border border-slate-700">
              <Target size={20} color="#a5b4fc" />
            </View>
            <Text className="text-[14px] font-black text-indigo-200 uppercase tracking-widest">קהל היעד האידיאלי</Text>
          </View>
          <Text className="text-[16px] text-white text-right leading-[26px] font-bold">{result.targetAudience}</Text>
        </View>

        <View className="mb-8 bg-white/5 p-6 rounded-[32px] border border-white/10 shadow-inner">
          <View className="flex-row-reverse items-center mb-5 gap-3">
            <View className="w-10 h-10 rounded-[14px] bg-indigo-500/20 items-center justify-center border border-indigo-500/30">
              <Zap size={20} color="#818cf8" />
            </View>
            <Text className="text-[14px] font-black text-indigo-200 uppercase tracking-widest">יכולות ופיצ'רים מרכזיים</Text>
          </View>
          <View className="gap-4">
            {result.coreFeatures.map((f: string, i: number) => (
              <View key={i} className="flex-row-reverse items-start gap-4 bg-black/20 p-4 rounded-[20px] border border-white/5">
                <LinearGradient colors={['#4f46e5', '#3730a3']} className="w-7 h-7 rounded-lg items-center justify-center mt-0.5 border border-white/20 shadow-md">
                  <Text className="text-[12px] text-white font-black">{i + 1}</Text>
                </LinearGradient>
                <Text className="text-[16px] text-slate-100 text-right flex-1 leading-[24px] font-bold">{f}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className="mb-8 bg-white/5 p-6 rounded-[32px] border border-white/10 shadow-inner">
          <View className="flex-row-reverse items-center mb-4 gap-3">
            <View className="w-10 h-10 rounded-[14px] bg-slate-800/80 items-center justify-center border border-slate-700">
              <Layout size={20} color="#a5b4fc" />
            </View>
            <Text className="text-[14px] font-black text-indigo-200 uppercase tracking-widest">חזון עיצובי (UI/UX)</Text>
          </View>
          <Text className="text-[16px] text-white text-right leading-[26px] font-bold italic">"{result.designBrief}"</Text>
        </View>

        <View className="rounded-[32px] overflow-hidden shadow-2xl shadow-amber-500/20">
          <LinearGradient colors={['#451a03', '#92400e']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="p-8 flex-row-reverse items-center justify-between border border-amber-500/50">
            <View className="w-16 h-16 bg-white/10 rounded-[20px] items-center justify-center border border-white/20 shadow-inner">
              <Clock size={32} color="#fcd34d" />
            </View>
            <View className="flex-1 mr-6">
              <Text className="text-[13px] text-amber-200/70 font-black uppercase tracking-widest text-right mb-1">זמן משוער לפיתוח MVP</Text>
              <Text className="text-[32px] font-black text-amber-300 text-right tracking-tighter">{result.estimatedDevTime}</Text>
            </View>
          </LinearGradient>
        </View>
      </View>
    </MotiView>
  );

  return (
    <View className="flex-1 bg-obsidian">
      <LinearGradient 
        colors={['rgba(99, 102, 241, 0.08)', 'transparent']} 
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 500 }} 
      />

      <SafeAreaView className="flex-1" edges={['top']}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 24, paddingBottom: 40 }}>
            <View className="flex-row-reverse items-center mb-10 gap-4">
              <View className="w-14 h-14 bg-indigo-500/20 rounded-[22px] items-center justify-center border border-indigo-400/30 shadow-lg">
                <Sparkles color="#a5b4fc" size={28} />
              </View>
              <View>
                <Text className="text-[30px] tracking-tighter font-black text-white text-right">מחולל PRD</Text>
                <View className="flex-row-reverse items-center gap-1.5 self-end mt-0.5">
                  <View className="w-2 h-2 rounded-full bg-indigo-500" />
                  <Text className="text-[12px] text-indigo-300 font-black tracking-widest uppercase">Idea to execution agent</Text>
                </View>
              </View>
            </View>

            <AnimatePresence>
              {!result && !loading && (
                <MotiView 
                  key="input-form"
                  from={{ opacity: 0, translateY: 20 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full"
                >
                  <Text className="text-[18px] text-slate-300 mb-4 text-right font-bold pl-2">מה הרעיון הגדול הבא שלך&rlm;?</Text>
                  <View className="bg-[#121214]/80 rounded-[40px] border border-indigo-500/30 p-3 shadow-2xl relative overflow-hidden">
                    <LinearGradient colors={['rgba(99,102,241,0.1)', 'transparent']} className="absolute inset-0" />
                    <TextInput
                      placeholder="תאר את הסטארט-אפ או הפיצ'ר שלך בכמה מילים..."
                      placeholderTextColor="rgba(255,255,255,0.4)"
                      multiline
                      value={idea}
                      onChangeText={setIdea}
                      className="p-6 text-white text-[18px] h-[220px] font-bold"
                      textAlignVertical="top"
                      textAlign="right"
                      style={{ textAlign: 'right' }}
                    />
                    <TouchableOpacity 
                      onPress={generatePRD}
                      disabled={!idea.trim()}
                      className={`mt-2 h-[64px] rounded-[28px] overflow-hidden shadow-2xl ${!idea.trim() ? 'opacity-30' : 'shadow-indigo-500/40'}`}
                    >
                      <LinearGradient 
                        colors={['#6366f1', '#4f46e5']} 
                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                        className="flex-1 flex-row-reverse justify-center items-center gap-3"
                      >
                        <Send color="#fff" size={20} />
                        <Text className="text-white text-[18px] font-black">יצור PRD חכם</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </MotiView>
              )}
            </AnimatePresence>

            {loading && (
              <View className="mt-8 gap-5">
                <Skeleton colorMode="dark" width={width - 48} height={260} radius={40} />
                <Skeleton colorMode="dark" width={width - 48} height={140} radius={32} />
                <Skeleton colorMode="dark" width={width - 48} height={180} radius={32} />
              </View>
            )}

            <AnimatePresence>
              {result && renderPRD()}
            </AnimatePresence>

            {result && !loading && (
              <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 500 }}>
                <TouchableOpacity 
                  className="mt-10 items-center bg-white/5 mx-16 py-4 rounded-full border border-white/10"
                  onPress={reset}
                >
                  <Text className="text-slate-300 text-[14px] font-extrabold uppercase tracking-wider">התחל רעיון חדש</Text>
                </TouchableOpacity>
              </MotiView>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
