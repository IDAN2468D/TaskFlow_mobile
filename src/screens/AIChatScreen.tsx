import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  KeyboardAvoidingView, Platform, ActivityIndicator, InteractionManager,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Send, Bot, User as UserIcon, Sparkles, ArrowRight,
  MessageCircle, Zap, ListTodo, BarChart3
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../context/ThemeContext';
import { taskService, ChatMessage } from '../services/taskService';

interface DisplayMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

const SUGGESTION_CHIPS = [
  { text: 'מה לעשות עכשיו?', emoji: '🎯' },
  { text: 'תנתח לי את ההתקדמות', emoji: '📊' },
  { text: 'יש משימות באיחור?', emoji: '⚠️' },
  { text: 'תעדף לי את המשימות', emoji: '⚡' },
  { text: 'איך אני יכול להיות יותר פרודוקטיבי?', emoji: '🚀' },
  { text: 'תסכם לי את השבוע', emoji: '📈' },
];

export default function AIChatScreen() {
  const { colors: themeColors } = useTheme();
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => setIsReady(true));
  }, []);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

  const sendMessage = useCallback(async (text: string) => {
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

    // Build history for Gemini
    const newHistory: ChatMessage[] = [
      ...chatHistory,
      { role: 'user', parts: [{ text: text.trim() }] },
    ];

    try {
      const response = await taskService.sendChatMessage(text.trim(), chatHistory);

      if (response?.text) {
        const botMsg: DisplayMessage = {
          id: (Date.now() + 1).toString(),
          role: 'model',
          text: response.text,
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, botMsg]);
        setChatHistory([
          ...newHistory,
          { role: 'model', parts: [{ text: response.text }] },
        ]);
      } else {
        const errorMsg: DisplayMessage = {
          id: (Date.now() + 1).toString(),
          role: 'model',
          text: 'מצטער, לא הצלחתי לעבד את הבקשה. נסה שוב בעוד רגע 🙏',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorMsg]);
      }
    } catch (error) {
      const errorMsg: DisplayMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: 'שגיאת חיבור. בדוק את החיבור לאינטרנט ונסה שוב ⚡',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
      scrollToBottom();
    }
  }, [isTyping, chatHistory, scrollToBottom]);

  const renderMessage = useCallback(({ item, index }: { item: DisplayMessage; index: number }) => {
    const isUser = item.role === 'user';

    return (
      <MotiView
        from={{ opacity: 0, translateY: 10, scale: 0.95 }}
        animate={{ opacity: 1, translateY: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className={`px-4 mb-3 ${isUser ? 'items-flex-start' : 'items-flex-end'}`}
        style={{ alignItems: isUser ? 'flex-end' : 'flex-start' }}
      >
        <View className="flex-row-reverse items-end gap-2" style={{ maxWidth: '85%' }}>
          {/* Avatar */}
          {!isUser && (
            <View
              style={{ backgroundColor: themeColors.primary + '22' }}
              className="w-8 h-8 rounded-full items-center justify-center"
            >
              <Bot size={16} color={themeColors.primary} />
            </View>
          )}

          {/* Bubble */}
          <View
            style={{
              backgroundColor: isUser ? themeColors.primary : themeColors.secondary,
              borderColor: isUser ? themeColors.primary : 'rgba(255,255,255,0.08)',
              borderWidth: isUser ? 0 : 1,
            }}
            className={`rounded-[20px] px-4 py-3 ${isUser ? 'rounded-br-lg' : 'rounded-bl-lg'}`}
          >
            <Text
              className="text-right text-[14px] leading-6"
              style={{ color: isUser ? '#fff' : 'rgba(255,255,255,0.85)' }}
              selectable
            >
              {item.text}
            </Text>
          </View>
        </View>
      </MotiView>
    );
  }, [themeColors]);

  if (!isReady) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.background }} edges={['top']}>
        <View className="flex-1 items-center justify-center">
          <MotiView
            from={{ opacity: 0.4, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1.1 }}
            transition={{ loop: true, type: 'timing', duration: 800 }}
          >
            <MessageCircle size={48} color={themeColors.primary} />
          </MotiView>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.background }} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* ─── Header ─── */}
        <View
          className="px-5 py-4 border-b"
          style={{ borderBottomColor: 'rgba(255,255,255,0.06)' }}
        >
          <View className="flex-row-reverse items-center gap-3">
            <LinearGradient
              colors={[themeColors.primary + '33', themeColors.primary + '11']}
              className="w-11 h-11 rounded-2xl items-center justify-center"
            >
              <Bot size={22} color={themeColors.primary} />
            </LinearGradient>
            <View className="flex-1">
              <Text className="text-white font-black text-[17px] text-right">TaskFlow AI</Text>
              <View className="flex-row-reverse items-center gap-1.5">
                <View className="w-2 h-2 rounded-full bg-emerald-400" />
                <Text className="text-white/40 text-[11px] text-right font-medium">מחובר ומוכן לעזור&rlm;</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ─── Messages ─── */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 16 }}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={scrollToBottom}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center px-8 pt-12">
              {/* Welcome State */}
              <MotiView
                from={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 120 }}
                className="items-center mb-8"
              >
                <LinearGradient
                  colors={[themeColors.primary + '22', 'transparent']}
                  className="w-20 h-20 rounded-full items-center justify-center mb-4"
                >
                  <Sparkles size={36} color={themeColors.primary} />
                </LinearGradient>
                <Text className="text-white font-black text-[20px] text-center mb-2">
                  היי! אני הסוכן שלך 👋
                </Text>
                <Text className="text-white/40 text-[13px] text-center font-medium leading-5">
                  אני מכיר את כל המשימות שלך ויכול לעזור{'\n'}לתעדף, לנתח ולתכנן את היום&rlm;
                </Text>
              </MotiView>

              {/* Suggestion Chips */}
              <View className="w-full">
                <Text className="text-white/30 text-[11px] text-right font-bold mb-3 px-1">
                  נסה לשאול&rlm;:
                </Text>
                <View className="flex-row-reverse flex-wrap gap-2">
                  {SUGGESTION_CHIPS.map((chip, index) => (
                    <MotiView
                      key={chip.text}
                      from={{ opacity: 0, translateY: 10 }}
                      animate={{ opacity: 1, translateY: 0 }}
                      transition={{ delay: 200 + index * 70, type: 'spring', stiffness: 150 }}
                    >
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => sendMessage(chip.text)}
                        style={{
                          backgroundColor: themeColors.secondary,
                          borderColor: 'rgba(255,255,255,0.08)',
                        }}
                        className="px-4 py-3 rounded-2xl border flex-row-reverse items-center gap-2"
                      >
                        <Text className="text-[16px]">{chip.emoji}</Text>
                        <Text className="text-white/70 text-[13px] font-medium">{chip.text}</Text>
                      </TouchableOpacity>
                    </MotiView>
                  ))}
                </View>
              </View>
            </View>
          }
        />

        {/* ─── Typing Indicator ─── */}
        {isTyping && (
          <MotiView
            from={{ opacity: 0, translateY: 5 }}
            animate={{ opacity: 1, translateY: 0 }}
            className="px-5 pb-2"
          >
            <View className="flex-row-reverse items-center gap-2">
              <View
                style={{ backgroundColor: themeColors.primary + '22' }}
                className="w-7 h-7 rounded-full items-center justify-center"
              >
                <Bot size={14} color={themeColors.primary} />
              </View>
              <View
                style={{ backgroundColor: themeColors.secondary }}
                className="px-4 py-3 rounded-2xl flex-row items-center gap-1.5"
              >
                {[0, 1, 2].map(i => (
                  <MotiView
                    key={i}
                    from={{ opacity: 0.3, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1.2 }}
                    transition={{
                      loop: true,
                      type: 'timing',
                      duration: 500,
                      delay: i * 150,
                    }}
                  >
                    <View
                      style={{ backgroundColor: themeColors.primary }}
                      className="w-2 h-2 rounded-full"
                    />
                  </MotiView>
                ))}
              </View>
              <Text className="text-white/30 text-[11px] font-medium">חושב&rlm;...</Text>
            </View>
          </MotiView>
        )}

        {/* ─── Input Bar ─── */}
        <View
          className="px-4 py-3 border-t"
          style={{
            borderTopColor: 'rgba(255,255,255,0.06)',
            backgroundColor: themeColors.background,
          }}
        >
          <View
            className="flex-row-reverse items-end gap-2 rounded-[20px] px-4 py-2"
            style={{
              backgroundColor: themeColors.secondary,
              borderColor: 'rgba(255,255,255,0.08)',
              borderWidth: 1,
            }}
          >
            <TextInput
              className="flex-1 text-white text-[14px] text-right min-h-[36px] max-h-[100px]"
              placeholder="שאל את הסוכן..."
              placeholderTextColor="rgba(255,255,255,0.25)"
              value={inputText}
              onChangeText={setInputText}
              multiline
              onSubmitEditing={() => sendMessage(inputText)}
              returnKeyType="send"
              editable={!isTyping}
              style={{ fontFamily: Platform.OS === 'ios' ? undefined : 'sans-serif' }}
            />
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => sendMessage(inputText)}
              disabled={!inputText.trim() || isTyping}
              className="mb-1"
            >
              <LinearGradient
                colors={
                  inputText.trim() && !isTyping
                    ? [themeColors.primary, themeColors.primary + 'CC']
                    : ['rgba(255,255,255,0.06)', 'rgba(255,255,255,0.03)']
                }
                className="w-9 h-9 rounded-full items-center justify-center"
              >
                {isTyping ? (
                  <ActivityIndicator size="small" color={themeColors.primary} />
                ) : (
                  <ArrowRight
                    size={18}
                    color={inputText.trim() ? '#fff' : 'rgba(255,255,255,0.2)'}
                    style={{ transform: [{ rotate: '180deg' }] }}
                  />
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
