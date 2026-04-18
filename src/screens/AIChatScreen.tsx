import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
  View, Text, TouchableOpacity, TextInput, ScrollView, 
  KeyboardAvoidingView, Platform, Keyboard, FlatList, 
  Dimensions, ActivityIndicator, InteractionManager 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Send, ChevronRight, Sparkles, Brain, Bot, User, 
  MoreVertical, Zap, Mic, Menu, Cpu, Fingerprint, Waves
} from 'lucide-react-native';
import { router } from 'expo-router';
import { MotiView, AnimatePresence } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../context/ThemeContext';
import { taskService } from '../services/taskService';

const { width, height } = Dimensions.get('window');

interface DisplayMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

const SUGGESTION_CHIPS = [
  { text: 'מה המשימה הבאה?', emoji: '🎯' },
  { text: 'לו״ז להיום', emoji: '📅' },
  { text: 'תובנות AI', emoji: '🧠' },
  { text: 'פרויקטים פתוחים', emoji: '🚀' },
];

const AnimatedOrb = ({ size, color, delay = 0, initialPos }: { size: number, color: string, delay?: number, initialPos: { x: number, y: number } }) => (
  <MotiView
    from={{ opacity: 0.1, scale: 0.8, translateX: initialPos.x, translateY: initialPos.y }}
    animate={{
      opacity: [0.1, 0.3, 0.1],
      scale: [1, 1.3, 1],
      translateX: [initialPos.x, initialPos.x + 50, initialPos.x - 25, initialPos.x],
      translateY: [initialPos.y, initialPos.y - 100, initialPos.y + 60, initialPos.y],
    }}
    transition={{ duration: 20000, loop: true, type: 'timing', delay }}
    style={{
      position: 'absolute',
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: color,
    }}
    className="blur-[100px]"
  />
);

export default function AIChatScreen() {
  const { colors: themeColors } = useTheme();
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<DisplayMessage[]>([
    {
      id: 'initial',
      role: 'model',
      text: 'שלום! אני Oliver, הסייען האישי שלך. איך אני יכול לעזור לך לייעל את יום העבודה שלך היום?',
      timestamp: new Date(),
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => setIsReady(true));
  }, []);

  const scrollToBottom = useCallback(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isTyping) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const userMsg: DisplayMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: text.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);
    scrollToBottom();

    try {
      const response = await taskService.sendChatMessage(text.trim(), []);

      if (response?.text) {
        const botMsg: DisplayMessage = {
          id: (Date.now() + 1).toString(),
          role: 'model',
          text: response.text,
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, botMsg]);
      } else {
        throw new Error('No response');
      }
    } catch (error) {
      const errorMsg: DisplayMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: 'מצטער, חלה שגיאה בחיבור ל-Oliver AI. נסה שוב בעוד רגע 🙏',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
      scrollToBottom();
    }
  };

  const renderMessage = ({ item, index }: { item: DisplayMessage, index: number }) => {
    const isUser = item.role === 'user';

    return (
      <MotiView
        from={{ opacity: 0, translateY: 20, scale: 0.95 }}
        animate={{ opacity: 1, translateY: 0, scale: 1 }}
        transition={{ type: 'spring', damping: 25, delay: 100 }}
        className={`mb-6 px-4 w-full ${isUser ? 'items-start' : 'items-end'}`}
      >
        <View className={`flex-row items-end gap-3 max-w-[85%] ${isUser ? 'self-start' : 'self-end'}`}>
          <View 
            className={`rounded-inner overflow-hidden ${isUser ? 'bg-surface-mid' : 'bg-surface-low border border-white/5'}`}
            style={{ 
              borderBottomRightRadius: isUser ? 4 : 12,
              borderBottomLeftRadius: isUser ? 12 : 4,
            }}
          >
            <LinearGradient
              colors={isUser ? [themeColors.primary + '33', 'transparent'] : ['transparent', 'transparent']}
              className="px-4 py-3"
            >
              <Text 
                className={`text-[15px] leading-[22px] ${isUser ? 'text-white font-bold' : 'text-main'}`}
              >
                {item.text}&rlm;
              </Text>
            </LinearGradient>
          </View>
          
          <View 
             className={`w-9 h-9 rounded-inner items-center justify-center border ${isUser ? 'bg-surface-low border-white/10' : 'bg-surface-low border-white/10'}`}
          >
            {isUser ? (
                <User size={16} color="#fff" />
            ) : (
                <Bot size={16} color={themeColors.primary} />
            )}
          </View>
        </View>
        <Text className={`text-[10px] text-dim mt-1.5 ${isUser ? 'ps-12' : 'pe-12'}`}>
          {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </MotiView>
    );
  };

  if (!isReady) return <View className="flex-1 bg-obsidian" />;

  return (
    <View className="flex-1 bg-obsidian">
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
          style={{ flex: 1 }}
        >
          {/* Superior Header */}
          <View className="px-6 py-4 flex-row items-center justify-between border-b border-white/5">
            <View className="flex-row items-center gap-2">
              <TouchableOpacity 
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.back();
                }}
                className="w-10 h-10 rounded-inner bg-surface-low border border-white/5 items-center justify-center"
              >
                <ChevronRight size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity className="w-10 h-10 rounded-inner bg-surface-low border border-white/5 items-center justify-center">
                <MoreVertical size={18} color="#fff" />
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center gap-3">
              <View className="items-start">
                <View className="flex-row items-center gap-2">
                  <View className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_#6366f1]" />
                  <Text className="text-text-main text-[18px] font-black tracking-tight">Oliver AI</Text>
                </View>
                <Text className="text-text-dim text-[10px] font-black uppercase tracking-[1px] opacity-60">NEURAL HUB</Text>
              </View>

              <View className="w-10 h-10 rounded-outer bg-surface-low border border-white/5 items-center justify-center shadow-2xl">
                <Bot size={20} color={themeColors.primary} />
              </View>
            </View>
          </View>

          {/* Conversation Stream */}
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingTop: 24, paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={scrollToBottom}
            ListEmptyComponent={
              <View className="items-center justify-center py-12 px-8">
                <MotiView
                  from={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', delay: 300 }}
                  className="items-center"
                >
                  <View className="w-20 h-20 rounded-outer bg-surface-low items-center justify-center mb-8 border border-white/10">
                    <Sparkles size={36} color={themeColors.primary} fill={themeColors.primary} />
                  </View>
                  <Text className="text-white text-[28px] font-extrabold text-center mb-3">כיצד אוכל לסייע?</Text>
                  <Text className="text-dim text-[16px] text-center leading-7 px-2">
                     אני כאן כדי לסייע לך לארגן משימות, לעדכן את הלו"ז או פשוט לספק תובנות חכמות.
                  </Text>
                </MotiView>
              </View>
            }
          />

          <AnimatePresence>
            {isTyping && (
                <MotiView 
                  from={{ opacity: 0, translateY: 10 }} 
                  animate={{ opacity: 1, translateY: 0 }} 
                  exit={{ opacity: 0 }}
                  className="flex-row items-center px-6 py-3 gap-3"
                >
                  <View className="bg-surface-low py-3 px-4 rounded-inner border border-white/5 flex-row items-center gap-1.5">
                    {[0, 1, 2].map(i => (
                      <MotiView
                        key={i}
                        animate={{ translateY: [0, -3, 0], opacity: [0.3, 1, 0.3] }}
                        transition={{ loop: true, duration: 800, delay: i * 200 }}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: themeColors.primary }}
                      />
                    ))}
                  </View>
                  <Text className="text-dim text-[10px] font-bold uppercase">מעבד מידע...</Text>
                </MotiView>
            )}
          </AnimatePresence>

          {/* Interactive Input Hub */}
          <View className="px-4 pb-8 pt-2">
            <View className="bg-surface-low rounded-outer border border-white/10 p-2 flex-row items-center shadow-2xl gap-2">
              <TouchableOpacity className="w-10 h-10 bg-surface-mid rounded-inner items-center justify-center border border-white/5">
                <Sparkles size={18} color="#818cf8" />
              </TouchableOpacity>
              
              <TextInput
                value={inputText}
                onChangeText={setInputText}
                placeholder="איך אוכל לעזור?"
                placeholderTextColor="#64748b"
                className="flex-1 text-white px-3 text-[16px] py-2"
                multiline
                style={{ maxHeight: 120 }}
              />

              <TouchableOpacity 
                onPress={() => handleSendMessage(inputText)}
                disabled={!inputText.trim() || isTyping}
                className={`w-10 h-10 rounded-inner items-center justify-center ${
                  inputText.trim() && !isTyping ? 'bg-indigo-600 shadow-lg' : 'bg-white/5'
                }`}
              >
                {isTyping ? <ActivityIndicator size="small" color="#fff" /> : <Send size={18} color={inputText.trim() ? '#fff' : '#475569'} />}
              </TouchableOpacity>
            </View>

            {/* Hint Chips */}
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              className="mt-4"
              contentContainerStyle={{ paddingHorizontal: 4, flexDirection: 'row', gap: 8 }}
            >
              {SUGGESTION_CHIPS.map((chip, i) => (
                <TouchableOpacity 
                  key={i}
                  onPress={() => handleSendMessage(chip.text)}
                  className="bg-surface-low px-3 py-2 rounded-full border border-white/5 flex-row items-center gap-2"
                >
                  <Text className="text-[14px]">{chip.emoji}</Text>
                  <Text className="text-dim text-[12px] font-bold">{chip.text}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
