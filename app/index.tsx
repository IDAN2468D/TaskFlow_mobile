import { Redirect } from 'expo-router';
import { useAuthContext } from '../src/context/AuthContext';
import { View, ActivityIndicator } from 'react-native';

export default function EntryPoint() {
  const { isAuthenticated, isLoading } = useAuthContext();

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#09090b', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color="#6366f1" size="large" />
      </View>
    );
  }

  if (isAuthenticated) {
    return <Redirect href="/home" />;
  }

  return <Redirect href="/auth" />;
}
