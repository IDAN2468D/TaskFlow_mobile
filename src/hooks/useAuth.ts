import { useState } from 'react';
import { authService } from '../services/authService';
import * as SecureStore from 'expo-secure-store';
import * as Haptics from 'expo-haptics';
import { useAuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const { login } = useAuthContext();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async () => {
    if (!email || !password || (!isLogin && !name)) {
      setError('אנא מלא את כל השדות&rlm;');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setLoading(true);
    setError('');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      const result = isLogin 
        ? await authService.login(email, password)
        : await authService.register(email, password, name);

      if (result.success && result.token) {
        await login(result.token);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        setError(result.error || 'התחברות נכשלה. בדוק את הפרטים&rlm;');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    } catch (e) {
      setError('משהו השתבש, נסה שוב מאוחר יותר&rlm;');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (idToken: string) => {
    setLoading(true);
    setError('');
    
    try {
      const result = await authService.googleLogin(idToken);
      if (result.success && result.token) {
        await login(result.token);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        setError(result.error || 'התחברות עם גוגל נכשלה&rlm;');
      }
    } catch (e) {
      setError('שגיאת תקשורת עם השרת&rlm;');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return {
    isLogin,
    email,
    setEmail,
    password,
    setPassword,
    name,
    setName,
    loading,
    error,
    setError,
    handleAuth,
    handleGoogleLogin,
    toggleMode
  };
};
