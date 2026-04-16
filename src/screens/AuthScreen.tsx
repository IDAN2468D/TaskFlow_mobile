import React from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  ActivityIndicator,
  StatusBar
} from 'react-native';
import { MotiView } from 'moti';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import { makeRedirectUri } from 'expo-auth-session';
import { Mail, Lock, User, ArrowLeft, Zap, Globe } from 'lucide-react-native';
import { useAuth } from '../hooks/useAuth';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

WebBrowser.maybeCompleteAuthSession();

import { useTheme } from '../context/ThemeContext';

export default function AuthScreen() {
  const { colors: themeColors } = useTheme();
  const { 
    isLogin, 
    email, 
    setEmail, 
    password, 
    setPassword, 
    name, 
    setName, 
    loading, 
    error, 
    handleAuth, 
    handleGoogleLogin,
    toggleMode 
  } = useAuth();

  const handleGoogleLoginPress = async () => {
    try {
      // 1. The local return URL for Expo Go
      const returnUrl = makeRedirectUri();

      // 2. The proxy redirect URL that Google is allowed to redirect to
      const proxyRedirectUri = 'https://auth.expo.io/@idankzm/mobile';

      // 3. The actual Google Auth URL
      const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` + 
        `client_id=${process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB}&` +
        `redirect_uri=${encodeURIComponent(proxyRedirectUri)}&` +
        `response_type=id_token&` +
        `scope=${encodeURIComponent('profile email openid')}&` +
        `nonce=${Math.random().toString(36).substring(7)}`;

      // 4. Wrap everything in the Expo Proxy Start URL
      const proxyStartUrl = `https://auth.expo.io/@idankzm/mobile/start?` + 
        `authUrl=${encodeURIComponent(googleAuthUrl)}&` + 
        `returnUrl=${encodeURIComponent(returnUrl)}`;

      console.log('Sending via Proxy...');

      // 5. Open the session
      const result = await WebBrowser.openAuthSessionAsync(proxyStartUrl, returnUrl);

      if (result.type === 'success') {
        const url = result.url;
        const idToken = url.match(/id_token=([^&]+)/)?.[1];
        if (idToken) {
          handleGoogleLogin(idToken);
        }
      }
    } catch (e) {
      console.error('Google Login Error:', e);
    }
  };

  return (
    <View style={{ backgroundColor: themeColors.background }} className="flex-1">
      <StatusBar barStyle="light-content" />
      <LinearGradient 
        colors={[themeColors.primary + '26', 'transparent']} 
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 600 }} 
      />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-center px-6"
      >
        <MotiView
          from={{ opacity: 0, scale: 0.95, translateY: 15 }}
          animate={{ opacity: 1, scale: 1, translateY: 0 }}
          transition={{ type: 'spring', damping: 18 }}
          style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}
          className="rounded-[40px] p-8 border overflow-hidden relative"
        >
          <LinearGradient
            colors={[themeColors.primary + '1A', 'transparent']}
            className="absolute inset-0"
          />
          
          {/* Header */}
          <View className="items-end mb-10 mt-2">
            <View style={{ backgroundColor: themeColors.primary + '1A', borderColor: themeColors.primary + '33' }} className="w-16 h-16 border rounded-[20px] justify-center items-center mb-6 relative overflow-hidden">
               <LinearGradient colors={[themeColors.primary + '33', 'transparent']} className="absolute inset-0" />
               <Zap color={themeColors.primary} size={32} />
            </View>
            <Text className="text-[34px] font-black text-white tracking-tighter">TaskFlow AI</Text>
            <Text className="text-[14px] text-slate-300 mt-2 text-right font-medium tracking-wide">
              {isLogin ? 'ברוך שובך, אסטרטג' : 'הצטרף לתנועת הדיוק'}
            </Text>
          </View>

          {/* Form */}
          <View className="gap-5">
            {!isLogin && (
              <MotiView
                from={{ height: 0, opacity: 0 }}
                animate={{ height: 60, opacity: 1 }}
                style={{ backgroundColor: 'rgba(0,0,0,0.4)', borderColor: 'rgba(255,255,255,0.05)' }}
                className="flex-row-reverse items-center rounded-[20px] px-5 border"
              >
                <User color={themeColors.primary} size={20} className="ml-4" />
                <TextInput
                  placeholder="שם מלא"
                  placeholderTextColor="#64748b"
                  value={name}
                  onChangeText={setName}
                  textAlign="right"
                  className="flex-1 h-full text-white text-[16px] font-medium"
                />
              </MotiView>
            )}

            <View style={{ backgroundColor: 'rgba(0,0,0,0.4)', borderColor: 'rgba(255,255,255,0.05)' }} className="flex-row-reverse items-center rounded-[20px] px-5 border">
              <Mail color={themeColors.primary} size={20} className="ml-4" />
              <TextInput
                placeholder="כתובת אימייל"
                placeholderTextColor="#64748b"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                textAlign="right"
                className="flex-1 h-[60px] text-white text-[16px] font-medium"
              />
            </View>

            <View style={{ backgroundColor: 'rgba(0,0,0,0.4)', borderColor: 'rgba(255,255,255,0.05)' }} className="flex-row-reverse items-center rounded-[20px] px-5 border">
              <Lock color={themeColors.primary} size={20} className="ml-4" />
              <TextInput
                placeholder="סיסמה"
                placeholderTextColor="#64748b"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                textAlign="right"
                className="flex-1 h-[60px] text-white text-[16px] font-medium"
              />
            </View>

            {error ? (
              <MotiView
                from={{ opacity: 0, translateY: -10 }}
                animate={{ opacity: 1, translateY: 0 }}
                className="bg-red-500/10 p-4 rounded-[16px] border border-red-500/20"
              >
                <Text className="color-red-400 text-[13px] font-bold text-center">{error}</Text>
              </MotiView>
            ) : null}

            <TouchableOpacity 
              className={`flex-row-reverse h-[60px] rounded-[20px] justify-center items-center mt-3 gap-3 overflow-hidden border ${loading ? 'opacity-70' : ''}`}
              style={{ borderColor: themeColors.primary + '4D' }}
              onPress={handleAuth}
              disabled={loading}
            >
              <LinearGradient colors={[themeColors.primary, themeColors.secondary]} start={{x: 0, y: 0}} end={{x: 1, y: 1}} className="absolute inset-0" />
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text className="text-white text-[17px] font-black tracking-wide">{isLogin ? 'התחברות באמצעות AI' : 'הרשמה למערכת'}</Text>
                  <ArrowLeft color="#fff" size={20} strokeWidth={2.5} />
                </>
              )}
            </TouchableOpacity>

            <View className="flex-row items-center gap-4 my-2 opacity-60">
              <View className="flex-1 h-[1px] bg-slate-400/20" />
              <Text className="text-slate-400 text-[11px] font-black uppercase tracking-[3px]">או</Text>
              <View className="flex-1 h-[1px] bg-slate-400/20" />
            </View>

            <TouchableOpacity 
              className="flex-row-reverse bg-white/5 border border-white/10 h-[60px] rounded-[20px] justify-center items-center gap-3 relative overflow-hidden"
              onPress={handleGoogleLoginPress}
              disabled={loading}
            >
              <LinearGradient colors={['rgba(255,255,255,0.03)', 'transparent']} className="absolute inset-0" />
              <Globe color="#e2e8f0" size={20} />
              <Text className="text-slate-200 text-[16px] font-bold">התחברות עם גוגל</Text>
            </TouchableOpacity>
          </View>

          {/* Footer toggle */}
          <TouchableOpacity 
            onPress={toggleMode}
            className="mt-8 flex-row-reverse justify-center items-center gap-1.5"
          >
            <Text className="text-slate-400 text-[15px] font-medium">
              {isLogin ? "חדש במערכת?" : "כבר מומחה?"}
            </Text>
            <Text style={{ color: themeColors.primary }} className="text-[15px] font-bold">
              {isLogin ? 'הירשם עכשיו' : 'התחבר'}
            </Text>
          </TouchableOpacity>
        </MotiView>
      </KeyboardAvoidingView>
    </View>
  );
}
