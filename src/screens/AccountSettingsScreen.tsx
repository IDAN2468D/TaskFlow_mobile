import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Platform, KeyboardAvoidingView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, Save, User as UserIcon, Mail, Shield, Camera } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { router } from 'expo-router';

export default function AccountSettingsScreen() {
  // const router = useRouter();
  const [name, setName] = useState('מנהל המערכת');
  const [email, setEmail] = useState('admin@taskflow.ai');

  return (
    <View className="flex-1 bg-obsidian">
      {/* Background ambient glow */}
      <LinearGradient 
        colors={['rgba(99, 102, 241, 0.12)', 'transparent']} 
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 400 }} 
      />

      <SafeAreaView className="flex-1" edges={['top']}>
        {/* Premium Transparent Header */}
        <View className="flex-row-reverse items-center justify-between px-6 pt-4 pb-4">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="w-12 h-12 bg-white/5 rounded-full items-center justify-center border border-white/10 backdrop-blur-md"
          >
            <ChevronRight color="#fff" size={24} />
          </TouchableOpacity>
          <Text className="text-[22px] font-extrabold text-white tracking-widest text-shadow-sm shadow-indigo-500">הגדרות חשבון</Text>
          <View className="w-12 h-12" />
        </View>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 24, paddingBottom: 60 }}>
            
            {/* Glowing Avatar */}
            <MotiView
               from={{ opacity: 0, scale: 0.9, translateY: 10 }}
               animate={{ opacity: 1, scale: 1, translateY: 0 }}
               transition={{ type: 'spring', damping: 20 }}
               className="items-center mb-10 mt-4 relative"
            >
              <View className="relative">
                <View className="absolute inset-0 bg-indigo-500/30 rounded-full blur-xl scale-110" />
                <LinearGradient 
                  colors={['#1e1b4b', '#312e81']} 
                  className="w-32 h-32 rounded-full border-[3px] border-indigo-400/50 items-center justify-center shadow-2xl shadow-indigo-500/50 overflow-hidden"
                >
                  <UserIcon size={52} color="#a5b4fc" strokeWidth={1.5} />
                  <View className="absolute bottom-0 w-full h-8 bg-black/40 items-center justify-center">
                     <Camera size={14} color="#e0e7ff" />
                  </View>
                </LinearGradient>
              </View>
              <Text className="text-white font-extrabold text-[24px] mt-5 tracking-tight">{name}</Text>
              <Text className="text-indigo-300 font-medium text-[15px] mt-1 tracking-wider uppercase">{"\u202A" + email + "\u202C"}</Text>
            </MotiView>

            {/* Inputs Container */}
            <View className="space-y-6">
              
              <MotiView from={{ opacity: 0, translateX: 30 }} animate={{ opacity: 1, translateX: 0 }} transition={{ delay: 100, type: 'timing', duration: 400 }}>
                <Text className="text-indigo-200 text-[12px] font-extrabold uppercase tracking-[3px] text-right mb-2">שם משתמש</Text>
                <View className="bg-black/40 border border-indigo-500/20 rounded-[24px] flex-row-reverse items-center px-5 h-16 shadow-inner relative overflow-hidden">
                  <LinearGradient colors={['rgba(255,255,255,0.03)', 'transparent']} className="absolute inset-0" />
                  <UserIcon size={22} color="#818cf8" className="ml-4" />
                  <TextInput
                    value={name}
                    onChangeText={setName}
                    className="flex-1 text-white text-[17px] text-right font-bold w-full"
                    placeholderTextColor="#475569"
                    selectionColor="#818cf8"
                  />
                </View>
              </MotiView>

              <MotiView from={{ opacity: 0, translateX: 30 }} animate={{ opacity: 1, translateX: 0 }} transition={{ delay: 200, type: 'timing', duration: 400 }}>
                <Text className="text-indigo-200 text-[12px] font-extrabold uppercase tracking-[3px] text-right mb-2">כתובת אימייל</Text>
                <View className="bg-black/40 border border-indigo-500/20 rounded-[24px] flex-row-reverse items-center px-5 h-16 shadow-inner relative overflow-hidden">
                  <LinearGradient colors={['rgba(255,255,255,0.03)', 'transparent']} className="absolute inset-0" />
                  <Mail size={22} color="#818cf8" className="ml-4" />
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    className="flex-1 text-white text-[17px] text-right font-bold w-full"
                    keyboardType="email-address"
                    placeholderTextColor="#475569"
                    selectionColor="#818cf8"
                  />
                </View>
              </MotiView>

              <MotiView from={{ opacity: 0, translateX: 30 }} animate={{ opacity: 1, translateX: 0 }} transition={{ delay: 300, type: 'timing', duration: 400 }}>
                <Text className="text-indigo-200 text-[12px] font-extrabold uppercase tracking-[3px] text-right mb-2">הגדרות אבטחה</Text>
                <TouchableOpacity activeOpacity={0.7} className="bg-black/40 border border-white/10 rounded-[24px] flex-row-reverse items-center justify-between px-5 h-16 overflow-hidden relative">
                  <LinearGradient colors={['rgba(255,255,255,0.02)', 'transparent']} className="absolute inset-0" />
                  <View className="flex-row-reverse items-center">
                    <Shield size={22} color="#94a3b8" className="ml-4" />
                    <Text className="text-white text-[17px] font-extrabold">שינוי סיסמה</Text>
                  </View>
                  <View className="w-8 h-8 rounded-full bg-white/5 items-center justify-center">
                    <ChevronRight size={18} color="#94a3b8" style={{ transform: [{ scaleX: -1 }] }} />
                  </View>
                </TouchableOpacity>
              </MotiView>

            </View>

            <MotiView from={{ opacity: 0, translateY: 30 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 500, type: 'spring', damping: 15 }}>
              <TouchableOpacity 
                activeOpacity={0.8} 
                className="mt-14 shadow-2xl shadow-indigo-500/50"
                onPress={() => {
                  Alert.alert('הגדרות עודכנו', 'השינויים שלך נשמרו בהצלחה במערכת&rlm;.');
                  router.back();
                }}
              >
                <LinearGradient 
                  colors={['#6366f1', '#4338ca']} 
                  className="rounded-[28px] flex-row-reverse items-center justify-center p-5 gap-3 border border-indigo-400/30"
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                >
                  <Save color="#fff" size={24} />
                  <Text className="text-white text-[18px] font-extrabold uppercase tracking-widest leading-[24px]">שמור שינויים</Text>
                </LinearGradient>
              </TouchableOpacity>
            </MotiView>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
