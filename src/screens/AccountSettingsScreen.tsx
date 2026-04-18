import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Platform, KeyboardAvoidingView, Alert, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, ChevronLeft, Save, User as UserIcon, Mail, Shield, Camera, Cpu } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { router } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import * as Haptics from 'expo-haptics';

export default function AccountSettingsScreen() {
  const { colors: themeColors } = useTheme();
  const [name, setName] = useState('מנהל המערכת');
  const [email, setEmail] = useState('admin@taskflow.ai');

  const handleSave = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('הגדרות עודכנו', 'השינויים שלך נשמרו בהצלחה במערכת\u200F.');
    router.back();
  };

  return (
    <View className="flex-1 bg-obsidian">
      <StatusBar barStyle="light-content" />
      
      <SafeAreaView className="flex-1" edges={['top']}>
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
              <View>
                <View className="flex-row items-center gap-1.5 mb-0.5">
                   <View className="w-1.5 h-1.5 rounded-full bg-primary shadow-sm" />
                   <Text className="text-text-dim text-[10px] font-black uppercase tracking-[2px]">SECURITY_CORE_ACTIVE</Text>
                </View>
                <Text className="text-text-main text-2xl font-black tracking-tighter">הגדרות חשבון</Text>
              </View>
            </View>
            
            <View className="w-10 h-10 rounded-inner bg-surface-mid items-center justify-center border border-white/5">
               <Cpu size={20} color={themeColors.primary} />
            </View>
          </View>
        </MotiView>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          <ScrollView 
            showsVerticalScrollIndicator={false} 
            contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}
            className="flex-1"
          >
            
            {/* Avatar Section */}
            <MotiView
               from={{ opacity: 0, scale: 0.9, translateY: 10 }}
               animate={{ opacity: 1, scale: 1, translateY: 0 }}
               className="items-center mb-10 mt-4"
            >
              <View className="relative">
                <View className="w-32 h-32 rounded-outer overflow-hidden border-2 border-white/10 bg-surface-low items-center justify-center shadow-2xl">
                  <UserIcon size={52} color="#fff" strokeWidth={1.5} opacity={0.2} />
                  <View className="absolute bottom-0 w-full h-8 bg-black/40 items-center justify-center">
                     <Camera size={14} color="#fff" opacity={0.6} />
                  </View>
                </View>
                <View className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary rounded-inner border-2 border-obsidian items-center justify-center shadow-lg">
                   <Shield size={16} color="#fff" />
                </View>
              </View>
              <Text className="text-text-main font-black text-2xl mt-4 tracking-tight">{name}</Text>
              <Text className="text-primary font-black text-[11px] mt-1 tracking-[2px] uppercase opacity-60">ADMIN_ACCESS_LEVEL_01</Text>
            </MotiView>

            {/* Form Section */}
            <View className="gap-y-6">
              
              <MotiView from={{ opacity: 0, translateX: -20 }} animate={{ opacity: 1, translateX: 0 }} transition={{ delay: 100 }}>
                <Text className="text-text-dim text-[10px] font-black uppercase tracking-[3px] mb-2 opacity-60">שם משתמש</Text>
                <View className="bg-surface-low border border-white/5 rounded-inner flex-row items-center px-4 h-16 shadow-inner gap-3">
                  <UserIcon size={20} color={themeColors.primary} />
                  <TextInput
                    value={name}
                    onChangeText={setName}
                    className="flex-1 text-text-main text-[16px] font-bold"
                    placeholderTextColor="rgba(255,255,255,0.1)"
                    selectionColor={themeColors.primary}
                  />
                </View>
              </MotiView>

              <MotiView from={{ opacity: 0, translateX: -20 }} animate={{ opacity: 1, translateX: 0 }} transition={{ delay: 200 }}>
                <Text className="text-text-dim text-[10px] font-black uppercase tracking-[3px] mb-2 opacity-60">כתובת אימייל</Text>
                <View className="bg-surface-low border border-white/5 rounded-inner flex-row items-center px-4 h-16 shadow-inner gap-3">
                  <Mail size={20} color={themeColors.primary} />
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    className="flex-1 text-text-main text-[16px] font-bold"
                    keyboardType="email-address"
                    placeholderTextColor="rgba(255,255,255,0.1)"
                    selectionColor={themeColors.primary}
                  />
                </View>
              </MotiView>

              <MotiView from={{ opacity: 0, translateX: -20 }} animate={{ opacity: 1, translateX: 0 }} transition={{ delay: 300 }}>
                <Text className="text-text-dim text-[10px] font-black uppercase tracking-[3px] mb-2 opacity-60">אבטחה ופרטיות</Text>
                <TouchableOpacity 
                    activeOpacity={0.8} 
                    className="bg-surface-low border border-white/5 rounded-inner flex-row items-center justify-between px-4 h-16"
                >
                  <View className="flex-row items-center gap-3">
                    <Shield size={20} color={themeColors.primary} />
                    <Text className="text-text-main text-[16px] font-black tracking-tight">שינוי סיסמה תקופתי</Text>
                  </View>
                  <ChevronLeft size={18} color="rgba(255,255,255,0.2)" />
                </TouchableOpacity>
              </MotiView>

            </View>

            <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 500 }} className="mt-12">
              <TouchableOpacity 
                activeOpacity={0.9} 
                onPress={handleSave}
                className="h-16 rounded-outer bg-primary flex-row items-center justify-center gap-3 shadow-2xl shadow-primary/20 border border-white/10"
              >
                <Save color="#fff" size={20} />
                <Text className="text-white text-lg font-black tracking-tight">שמור הגדרות מערכת</Text>
              </TouchableOpacity>
            </MotiView>

            {/* Footer Branding */}
            <View className="mt-16 items-center opacity-20 pb-8">
              <Cpu size={20} color="#fff" />
              <Text className="text-[9px] text-white font-black uppercase tracking-[4px] mt-3">SECURE_VAULT v2.4 • ARCHITECT</Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
