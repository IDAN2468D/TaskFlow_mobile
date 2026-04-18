import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, InteractionManager, StyleSheet, Platform } from 'react-native';
import { MotiView, MotiText } from 'moti';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { activityService } from '../../services/activityService';
import type { Activity } from '../../services/activityService';
import { Clock, Zap, PlusCircle, RotateCcw, Trash2, Activity as ActivityIcon, User } from 'lucide-react-native';

/**
 * MobileTimelineList Component - Obsidian & Indigo Edition
 * Renders a high-end, glassmorphic activity feed with cinematic animations.
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
    try {
      const data = await activityService.getRecentActivities();
      setActivities(data);
    } catch (error) {
      console.error('Failed to load activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionConfig = (action: string) => {
    const size = 16;
    switch (action) {
      case 'TASK_CREATED': 
        return { icon: <PlusCircle size={size} color="#10b981" />, label: 'משימה חדשה', color: '#10b981' };
      case 'TASK_UPDATED': 
        return { icon: <RotateCcw size={size} color="#f59e0b" />, label: 'עדכון משימה', color: '#f59e0b' };
      case 'TASK_DELETED': 
        return { icon: <Trash2 size={size} color="#f43f5e" />, label: 'מחיקה', color: '#f43f5e' };
      case 'AI_ASSIGNED': 
        return { icon: <Zap size={size} color="#818cf8" />, label: 'בינה מלאכותית', color: '#818cf8' };
      default: 
        return { icon: <Clock size={size} color="#94a3b8" />, label: 'פעילות', color: '#94a3b8' };
    }
  };

  const renderItem = (item: Activity, index: number) => {
    const config = getActionConfig(item.action);
    
    return (
      <MotiView
        key={item._id || index}
        from={{ opacity: 0, scale: 0.9, translateY: 20 }}
        animate={{ opacity: 1, scale: 1, translateY: 0 }}
        transition={{ 
          type: 'timing', 
          duration: 600, 
          delay: index * 100,
          easing: (t) => t * (2 - t) 
        }}
        style={styles.cardContainer}
      >
        <BlurView intensity={20} tint="dark" style={styles.blurWrapper}>
          <View style={styles.itemContent}>
            {/* Action Icon with Gradient Glow */}
            <View style={styles.iconWrapper}>
              <LinearGradient
                colors={['rgba(99, 102, 241, 0.2)', 'transparent']}
                style={styles.iconGlow}
              />
              <View style={[styles.iconInner, { borderColor: `${config.color}33` }]}>
                {config.icon}
              </View>
            </View>

            {/* Content Section */}
            <View style={styles.mainInfo}>
              <View style={styles.topRow}>
                <Text style={styles.userName}>
                  {item.userId?.name || 'צוות&rlm;'}
                </Text>
                <Text style={styles.timeTag}>
                  {new Date(item.timestamp).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
              
              <Text style={styles.detailsText} numberOfLines={2}>
                {item.details || config.label}
              </Text>
              
              {/* Bottom Decoration */}
              <View style={styles.bottomDecoration}>
                <View style={[styles.actionDot, { backgroundColor: config.color }]} />
                <Text style={[styles.actionLabel, { color: config.color }]}>
                  {config.label}
                </Text>
              </View>
            </View>
          </View>
        </BlurView>
      </MotiView>
    );
  };

  if (!isReady || loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator color="#818cf8" size="small" />
        <MotiText 
          from={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          style={styles.loaderText}
        >
          טוען עדכונים...&rlm;
        </MotiText>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      
      <View style={styles.listContent}>
        {activities.length > 0 ? (
          activities.slice(0, 10).map((item, index) => renderItem(item, index))
        ) : (
          <View style={styles.emptyContainer}>
            <User size={40} color="rgba(255,255,255,0.1)" />
            <Text style={styles.emptyText}>אין פעילות כרגע&rlm;</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  headerAccent: {
    width: 4,
    height: 18,
    borderRadius: 2,
    marginLeft: 12,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontFamily: Platform.OS === 'ios' ? 'Inter-Black' : 'sans-serif-black',
    fontWeight: '900',
    textAlign: 'right',
    letterSpacing: -0.5,
  },
  listContent: {
    paddingBottom: 20,
  },
  cardContainer: {
    marginBottom: 16,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  blurWrapper: {
    padding: 16,
  },
  itemContent: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-start',
  },
  iconWrapper: {
    marginLeft: 16,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconGlow: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  iconInner: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(15, 15, 20, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  mainInfo: {
    flex: 1,
    alignItems: 'flex-end',
  },
  topRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 6,
  },
  userName: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'right',
  },
  timeTag: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 11,
    textAlign: 'right',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  detailsText: {
    color: '#94a3b8',
    fontSize: 13,
    textAlign: 'right',
    lineHeight: 18,
    marginBottom: 10,
  },
  bottomDecoration: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  actionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginLeft: 6,
  },
  actionLabel: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  loaderContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    color: '#818cf8',
    marginTop: 12,
    fontSize: 12,
    fontWeight: '500',
  },
  emptyContainer: {
    padding: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: 'rgba(255,255,255,0.2)',
    marginTop: 12,
    fontSize: 14,
    fontWeight: '500',
  },
});
