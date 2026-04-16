import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, InteractionManager } from 'react-native';
import { MotiView } from 'moti';
import { activityService } from '../../services/activityService';
import type { Activity } from '../../services/activityService';
import { Clock, Zap, PlusCircle, RotateCcw, Trash2, Activity as ActivityIcon } from 'lucide-react-native';

/**
 * MobileTimelineList Component
 * Renders a high-performance, animated activity feed optimized for mobile.
 */
export default function MobileTimelineList() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      setIsReady(true);
      loadActivities();
    });
    return () => task.cancel();
  }, []);

  const loadActivities = async () => {
    const data = await activityService.getRecentActivities();
    setActivities(data);
    setLoading(false);
  };

  const getActionIcon = (action: string) => {
    const size = 16;
    switch (action) {
      case 'TASK_CREATED': return <PlusCircle size={size} color="#10b981" />;
      case 'TASK_UPDATED': return <RotateCcw size={size} color="#f59e0b" />;
      case 'TASK_DELETED': return <Trash2 size={size} color="#f43f5e" />;
      case 'AI_ASSIGNED': return <Zap size={size} color="#6366f1" />;
      default: return <Clock size={size} color="#71717a" />;
    }
  };

  const renderItem = ({ item, index }: { item: Activity; index: number }) => (
    <MotiView
      from={{ opacity: 0, translateX: 50 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ type: 'spring', delay: index * 100 }}
      style={{
        flexDirection: 'row-reverse',
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: 'rgba(24, 24, 27, 0.5)',
        padding: 16,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
      }}
    >
      <View style={{ marginLeft: 16 }}>
        <View style={{ backgroundColor: 'rgba(9, 9, 11, 0.8)', padding: 10, borderRadius: 14 }}>
          {getActionIcon(item.action)}
        </View>
      </View>

      <View style={{ flex: 1, alignItems: 'flex-end' }}>
        <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', width: '100%', marginBottom: 4 }}>
          <Text style={{ color: '#fff', fontSize: 14, fontWeight: '700', textAlign: 'right' }}>
            {item.userId?.name || 'מתחבר אנונימי&rlm;'}
          </Text>
          <Text style={{ color: '#71717a', fontSize: 10, textAlign: 'right' }}>
            {new Date(item.timestamp).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
        <Text style={{ color: '#a1a1aa', fontSize: 12, textAlign: 'right' }}>
          {item.details || item.action}
        </Text>
      </View>
    </MotiView>
  );

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', height: 200 }}>
        <ActivityIndicator color="#6366f1" size="small" />
      </View>
    );
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', height: 200 }}>
        <ActivityIndicator color="#6366f1" size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row-reverse', alignItems: 'center', marginBottom: 20, paddingHorizontal: 4 }}>
        <ActivityIcon size={20} color="#6366f1" style={{ marginLeft: 8 }} />
        <Text style={{ color: '#fff', fontSize: 18, fontWeight: '900', textAlign: 'right' }}>פעילות הצוות&rlm;</Text>
      </View>
      
      <View style={{ paddingBottom: 20 }}>
        {activities.length > 0 ? (
          activities.map((item, index) => renderItem({ item, index }))
        ) : (
          <Text style={{ color: '#71717a', textAlign: 'center', marginTop: 40 }}>אין פעילויות אחרונות&rlm;</Text>
        )}
      </View>
    </View>
  );
}
