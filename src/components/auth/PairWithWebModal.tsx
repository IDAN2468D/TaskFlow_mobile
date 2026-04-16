import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Modal, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable
} from 'react-native';
import { MotiView, AnimatePresence } from 'moti';
import { Smartphone, X, CheckCircle2, ShieldCheck, ArrowLeft } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

interface PairWithWebModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function PairWithWebModal({ isVisible, onClose }: PairWithWebModalProps) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handlePair = async () => {
    if (code.length !== 6) return;
    
    setLoading(true);
    setErrorMessage('');
    
    try {
      const token = await SecureStore.getItemAsync('token');
      const userStr = await SecureStore.getItemAsync('user');
      const user = userStr ? JSON.parse(userStr) : null;

      if (!token || !user) {
        setErrorMessage('אנא התחבר מחדש לאפליקציה');
        setStatus('error');
        return;
      }

      const apiUrl = process.env.EXPO_PUBLIC_API_URL;
      const response = await axios.post(`${apiUrl}/bridge/auth/pair`, {
        code,
        userId: user.id || user._id,
        token
      });

      if (response.data.success) {
        setStatus('success');
        setTimeout(() => {
          onClose();
          setStatus('idle');
          setCode('');
        }, 2000);
      } else {
        setErrorMessage(response.data.error || 'קוד לא תקין');
        setStatus('error');
      }
    } catch (error: any) {
      console.error('Pairing error:', error);
      setErrorMessage(error.response?.data?.error || 'שגיאת תקשורת');
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable 
        className="flex-1 bg-black/60" 
        onPress={onClose}
      >
        <BlurView intensity={20} className="flex-1 justify-end">
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <Pressable className="bg-obsidian border-t border-white/10 rounded-t-[40px] px-6 pt-8 pb-12 shadow-2xl">
              <View className="flex-row-reverse justify-between items-center mb-8">
                <Text className="text-2xl font-black text-white">סנכרון עם ה-Web</Text>
                <TouchableOpacity 
                  onPress={onClose}
                  className="w-10 h-10 bg-white/5 rounded-full items-center justify-center"
                >
                  <X color="#94a3b8" size={20} />
                </TouchableOpacity>
              </View>

              <AnimatePresence>
                {status === 'success' ? (
                  <MotiView
                    from={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="items-center py-10"
                  >
                    <View className="w-20 h-20 bg-emerald-500/20 rounded-full items-center justify-center border border-emerald-500/30 mb-4">
                      <CheckCircle2 color="#10b981" size={40} />
                    </View>
                    <Text className="text-xl font-bold text-white mb-2">הסנכרון בוצע!</Text>
                    <Text className="text-slate-400">הדפדפן שלך מחובר כעת&rlm;</Text>
                  </MotiView>
                ) : (
                  <MotiView
                    from={{ opacity: 0, translateY: 10 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    className="gap-6"
                  >
                    <View className="bg-indigo-500/10 p-4 rounded-2xl border border-indigo-500/20 flex-row-reverse items-center gap-3">
                      <ShieldCheck color="#6366f1" size={20} />
                      <Text className="text-slate-300 text-sm font-medium flex-1 text-right">
                        הכנס את הקוד בן 6 הספרות שמופיע בדף ההתחברות במחשב&rlm;
                      </Text>
                    </View>

                    <View className="relative">
                      <TextInput
                        className="bg-black/40 border border-white/5 rounded-2xl h-20 text-white text-4xl font-black text-center tracking-[0.2em]"
                        placeholder="000000"
                        placeholderTextColor="rgba(255,255,255,0.1)"
                        keyboardType="number-pad"
                        maxLength={6}
                        value={code}
                        onChangeText={setCode}
                        autoFocus
                      />
                    </View>

                    {status === 'error' && (
                      <View className="bg-red-500/10 p-4 rounded-xl border border-red-500/20">
                        <Text className="text-red-400 text-sm font-bold text-center">
                          {errorMessage || 'קוד לא תקין או פג תוקף'}
                        </Text>
                      </View>
                    )}

                    <TouchableOpacity 
                      className={`h-16 rounded-2xl items-center justify-center flex-row-reverse gap-3 overflow-hidden ${code.length === 6 ? 'bg-indigo-600' : 'bg-indigo-600/30'}`}
                      disabled={loading || code.length !== 6}
                      onPress={handlePair}
                    >
                      {loading ? (
                        <ActivityIndicator color="#fff" />
                      ) : (
                        <>
                          <Text className="text-white text-lg font-black italic">אשר סנכרון</Text>
                          <Smartphone color="#fff" size={24} />
                        </>
                      )}
                    </TouchableOpacity>
                  </MotiView>
                )}
              </AnimatePresence>
            </Pressable>
          </KeyboardAvoidingView>
        </BlurView>
      </Pressable>
    </Modal>
  );
}
