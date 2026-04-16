import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Sunrise,
  ArrowRight,
  Target,
  Zap,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Quote,
  Lightbulb,
  ChevronLeft,
  Sparkles,
  Flame,
  BarChart3,
} from 'lucide-react-native';
import { router } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { taskService, DailyBriefing } from '../services/taskService';

const { width } = Dimensions.get('window');

export default function DailyBriefingScreen() {
  const { colors: themeColors } = useTheme();
  const [briefing, setBriefing] = useState<DailyBriefing | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBriefing = useCallback(async () => {
    try {
      const data = await taskService.getDailyBriefing();
      if (data) {
        setBriefing(data);
      }
    } catch (err) {
      console.error('[DailyBriefing] Fetch failed:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchBriefing();
  }, [fetchBriefing]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchBriefing();
  }, [fetchBriefing]);

  const getGreetingEmoji = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '🌅';
    if (hour < 17) return '☀️';
    if (hour < 21) return '🌆';
    return '🌙';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return '#f43f5e';
      case 'Medium': return '#f59e0b';
      default: return '#10b981';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return '#10b981';
    if (score >= 40) return '#f59e0b';
    return '#f43f5e';
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: themeColors.background, justifyContent: 'center', alignItems: 'center' }}>
        <LinearGradient
          colors={[themeColors.primary + '33', themeColors.background]}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        />
        <MotiView
          from={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring' }}
          style={{ alignItems: 'center' }}
        >
          <MotiView
            from={{ rotate: '0deg' }}
            animate={{ rotate: '360deg' }}
            transition={{ loop: true, type: 'timing', duration: 3000 }}
          >
            <Sparkles size={48} color={themeColors.primary} />
          </MotiView>
          <Text style={{ color: '#fff', fontSize: 18, fontWeight: '700', marginTop: 20 }}>
            מכין את התדרוך שלך...
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, marginTop: 8 }}>
            AI מנתח את המשימות שלך
          </Text>
        </MotiView>
      </View>
    );
  }

  const data = briefing;
  const stats = data?.stats;
  const critical = data?.criticalTasks || [];

  return (
    <View style={{ flex: 1, backgroundColor: themeColors.background }}>
      {/* Background Gradients */}
      <LinearGradient
        colors={[themeColors.primary + '22', themeColors.background]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.5 }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 400 }}
      />

      {/* Animated Background Orbs */}
      <MotiView
        from={{ opacity: 0.08, scale: 1 }}
        animate={{ opacity: 0.15, scale: 1.3 }}
        transition={{ loop: true, type: 'timing', duration: 6000, repeatReverse: true }}
        style={{
          position: 'absolute', top: -80, right: -60,
          width: 280, height: 280, borderRadius: 140,
          backgroundColor: themeColors.primary + '44',
        }}
      />
      <MotiView
        from={{ opacity: 0.05, scale: 1.2 }}
        animate={{ opacity: 0.1, scale: 0.8 }}
        transition={{ loop: true, type: 'timing', duration: 8000, repeatReverse: true }}
        style={{
          position: 'absolute', top: 300, left: -100,
          width: 350, height: 350, borderRadius: 175,
          backgroundColor: themeColors.accent + '22',
        }}
      />

      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        {/* Header */}
        <View style={{ flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingTop: 12, paddingBottom: 8 }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              width: 44, height: 44,
              borderRadius: 16,
              backgroundColor: 'rgba(255,255,255,0.08)',
              alignItems: 'center', justifyContent: 'center',
              borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
            }}
          >
            <ChevronLeft size={22} color="#fff" />
          </TouchableOpacity>
          <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: 10 }}>
            <Sunrise size={24} color={themeColors.primary} />
            <Text style={{ color: '#fff', fontSize: 22, fontWeight: '900' }}>תדרוך יומי</Text>
          </View>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 60 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={themeColors.primary} />
          }
        >
          {/* Greeting Card */}
          <MotiView
            from={{ opacity: 0, translateY: 30 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 100, type: 'spring', stiffness: 120 }}
          >
            <View style={{
              marginTop: 16,
              borderRadius: 28,
              overflow: 'hidden',
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.08)',
            }}>
              <LinearGradient
                colors={[themeColors.primary + '1A', themeColors.secondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ padding: 24 }}
              >
                <Text style={{ fontSize: 48, marginBottom: 8 }}>{getGreetingEmoji()}</Text>
                <Text style={{ color: '#fff', fontSize: 22, fontWeight: '900', textAlign: 'right', lineHeight: 32 }}>
                  {data?.briefing?.greeting || 'בוקר טוב!'}
                </Text>
                <Text style={{
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: 14,
                  fontWeight: '500',
                  textAlign: 'right',
                  marginTop: 12,
                  lineHeight: 22,
                }}>
                  {data?.briefing?.focusArea || 'התמקד במשימות הקריטיות שלך היום.'}
                </Text>
              </LinearGradient>
            </View>
          </MotiView>

          {/* Stats Grid */}
          <MotiView
            from={{ opacity: 0, translateY: 30 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 200, type: 'spring', stiffness: 120 }}
            style={{ marginTop: 20 }}
          >
            <View style={{ flexDirection: 'row-reverse', gap: 12 }}>
              {/* Productivity Score */}
              <View style={{
                flex: 1,
                backgroundColor: 'rgba(255,255,255,0.05)',
                borderRadius: 24,
                padding: 20,
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.08)',
                alignItems: 'center',
              }}>
                <View style={{
                  width: 56, height: 56,
                  borderRadius: 20,
                  backgroundColor: getScoreColor(stats?.productivityScore || 0) + '1A',
                  alignItems: 'center', justifyContent: 'center',
                  marginBottom: 12,
                }}>
                  <TrendingUp size={28} color={getScoreColor(stats?.productivityScore || 0)} />
                </View>
                <Text style={{
                  color: getScoreColor(stats?.productivityScore || 0),
                  fontSize: 32, fontWeight: '900'
                }}>
                  {stats?.productivityScore || 0}%
                </Text>
                <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: '700', marginTop: 4, textTransform: 'uppercase', letterSpacing: 1 }}>
                  פרודוקטיביות
                </Text>
              </View>

              {/* Quick Stats Column */}
              <View style={{ flex: 1, gap: 12 }}>
                {/* Active Tasks */}
                <View style={{
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  borderRadius: 20,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.08)',
                  flexDirection: 'row-reverse',
                  alignItems: 'center',
                  gap: 12,
                }}>
                  <View style={{
                    width: 38, height: 38, borderRadius: 12,
                    backgroundColor: themeColors.primary + '1A',
                    alignItems: 'center', justifyContent: 'center'
                  }}>
                    <Target size={18} color={themeColors.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: '#fff', fontSize: 20, fontWeight: '900' }}>{stats?.totalActive || 0}</Text>
                    <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: '600' }}>משימות פעילות</Text>
                  </View>
                </View>

                {/* Weekly Done */}
                <View style={{
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  borderRadius: 20,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.08)',
                  flexDirection: 'row-reverse',
                  alignItems: 'center',
                  gap: 12,
                }}>
                  <View style={{
                    width: 38, height: 38, borderRadius: 12,
                    backgroundColor: '#10b98122',
                    alignItems: 'center', justifyContent: 'center'
                  }}>
                    <CheckCircle2 size={18} color="#10b981" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: '#fff', fontSize: 20, fontWeight: '900' }}>{stats?.completedThisWeek || 0}</Text>
                    <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: '600' }}>הושלמו השבוע</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Overdue + Yesterday Row */}
            <View style={{ flexDirection: 'row-reverse', gap: 12, marginTop: 12 }}>
              {(stats?.overdueCount || 0) > 0 && (
                <View style={{
                  flex: 1,
                  backgroundColor: '#f43f5e11',
                  borderRadius: 20,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: '#f43f5e22',
                  flexDirection: 'row-reverse',
                  alignItems: 'center',
                  gap: 10,
                }}>
                  <AlertTriangle size={18} color="#f43f5e" />
                  <View>
                    <Text style={{ color: '#f43f5e', fontSize: 18, fontWeight: '900' }}>{stats?.overdueCount || 0}</Text>
                    <Text style={{ color: '#f43f5e88', fontSize: 10, fontWeight: '600' }}>באיחור</Text>
                  </View>
                </View>
              )}
              <View style={{
                flex: 1,
                backgroundColor: 'rgba(255,255,255,0.05)',
                borderRadius: 20,
                padding: 16,
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.08)',
                flexDirection: 'row-reverse',
                alignItems: 'center',
                gap: 10,
              }}>
                <Flame size={18} color="#f59e0b" />
                <View>
                  <Text style={{ color: '#fff', fontSize: 18, fontWeight: '900' }}>{stats?.completedYesterday || 0}</Text>
                  <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: '600' }}>אתמול</Text>
                </View>
              </View>
            </View>
          </MotiView>

          {/* Critical Tasks Section */}
          {critical.length > 0 && (
            <MotiView
              from={{ opacity: 0, translateY: 30 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ delay: 350, type: 'spring', stiffness: 120 }}
              style={{ marginTop: 28 }}
            >
              <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <Zap size={20} color="#f43f5e" fill="#f43f5e" />
                <Text style={{ color: '#fff', fontSize: 20, fontWeight: '900' }}>משימות קריטיות להיום</Text>
              </View>

              {critical.map((task, idx) => (
                <MotiView
                  key={task.id}
                  from={{ opacity: 0, translateX: 40 }}
                  animate={{ opacity: 1, translateX: 0 }}
                  transition={{ delay: 400 + idx * 100, type: 'spring', stiffness: 120 }}
                >
                  <View style={{
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    borderRadius: 22,
                    padding: 18,
                    marginBottom: 12,
                    borderWidth: 1,
                    borderColor: 'rgba(255,255,255,0.08)',
                    borderLeftWidth: 4,
                    borderLeftColor: getPriorityColor(task.priority),
                  }}>
                    <View style={{ flexDirection: 'row-reverse', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                      <View style={{ flex: 1, paddingLeft: 12 }}>
                        <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                          <View style={{
                            backgroundColor: getPriorityColor(task.priority) + '22',
                            paddingHorizontal: 10,
                            paddingVertical: 3,
                            borderRadius: 8,
                          }}>
                            <Text style={{ color: getPriorityColor(task.priority), fontSize: 10, fontWeight: '800', textTransform: 'uppercase' }}>
                              {task.priority}
                            </Text>
                          </View>
                          <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 16, fontWeight: '900' }}>#{idx + 1}</Text>
                        </View>
                        <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700', textAlign: 'right', lineHeight: 24 }}>
                          {task.title}
                        </Text>
                      </View>
                    </View>

                    <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: 16, marginTop: 14, paddingTop: 14, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)' }}>
                      {task.dueDate && (
                        <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: 4 }}>
                          <Clock size={13} color="rgba(255,255,255,0.4)" />
                          <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: '600' }}>{task.dueDate}</Text>
                        </View>
                      )}
                      {task.estimatedTime > 0 && (
                        <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: '600' }}>
                          ⏱ {task.estimatedTime} דק׳
                        </Text>
                      )}
                      {task.subTasksTotal > 0 && (
                        <View style={{
                          backgroundColor: themeColors.primary + '1A',
                          paddingHorizontal: 8,
                          paddingVertical: 3,
                          borderRadius: 8,
                        }}>
                          <Text style={{ color: themeColors.primary, fontSize: 11, fontWeight: '700' }}>
                            {task.subTasksDone}/{task.subTasksTotal} תתי-משימות
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </MotiView>
              ))}
            </MotiView>
          )}

          {/* Strategic Tip Card */}
          <MotiView
            from={{ opacity: 0, translateY: 30 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 500, type: 'spring', stiffness: 120 }}
            style={{ marginTop: 24 }}
          >
            <View style={{
              borderRadius: 24,
              overflow: 'hidden',
              borderWidth: 1,
              borderColor: themeColors.primary + '33',
            }}>
              <LinearGradient
                colors={[themeColors.primary + '11', themeColors.secondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ padding: 22 }}
              >
                <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <View style={{
                    width: 40, height: 40, borderRadius: 14,
                    backgroundColor: themeColors.primary + '22',
                    alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Lightbulb size={22} color={themeColors.primary} />
                  </View>
                  <Text style={{ color: themeColors.primary, fontSize: 14, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 }}>
                    טיפ אסטרטגי
                  </Text>
                </View>
                <Text style={{
                  color: '#fff',
                  fontSize: 15,
                  fontWeight: '600',
                  textAlign: 'right',
                  lineHeight: 24,
                }}>
                  {data?.briefing?.strategicTip || 'התחל עם המשימה הקשה ביותר כשהאנרגיה שלך בשיא.'}
                </Text>
              </LinearGradient>
            </View>
          </MotiView>

          {/* Yesterday Summary */}
          <MotiView
            from={{ opacity: 0, translateY: 30 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 600, type: 'spring', stiffness: 120 }}
            style={{ marginTop: 16 }}
          >
            <View style={{
              backgroundColor: 'rgba(255,255,255,0.05)',
              borderRadius: 22,
              padding: 20,
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.08)',
              flexDirection: 'row-reverse',
              alignItems: 'center',
              gap: 14,
            }}>
              <View style={{
                width: 40, height: 40, borderRadius: 14,
                backgroundColor: '#10b98122',
                alignItems: 'center', justifyContent: 'center',
              }}>
                <BarChart3 size={20} color="#10b981" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: '700', textAlign: 'right', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  סיכום אתמול
                </Text>
                <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600', textAlign: 'right', marginTop: 4, lineHeight: 22 }}>
                  {data?.briefing?.yesterdaySummary || 'אין נתונים מאתמול.'}
                </Text>
              </View>
            </View>
          </MotiView>

          {/* Motivational Quote */}
          <MotiView
            from={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 700, type: 'spring', stiffness: 120 }}
            style={{ marginTop: 24 }}
          >
            <View style={{
              borderRadius: 28,
              overflow: 'hidden',
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.06)',
            }}>
              <LinearGradient
                colors={[themeColors.secondary, themeColors.background]}
                style={{ padding: 28, alignItems: 'center' }}
              >
                <Quote size={32} color={themeColors.primary + '66'} style={{ marginBottom: 16 }} />
                <Text style={{
                  color: 'rgba(255,255,255,0.75)',
                  fontSize: 17,
                  fontWeight: '600',
                  textAlign: 'center',
                  lineHeight: 28,
                  fontStyle: 'italic',
                  paddingHorizontal: 8,
                }}>
                  {data?.briefing?.motivationalQuote || '״הצלחה היא סכום של מאמצים קטנים, שחוזרים על עצמם יום אחרי יום.״'}
                </Text>
              </LinearGradient>
            </View>
          </MotiView>

          {/* Go to Dashboard CTA */}
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 800, type: 'spring' }}
            style={{ marginTop: 28 }}
          >
            <TouchableOpacity
              onPress={() => router.replace('/(tabs)/home')}
              activeOpacity={0.85}
              style={{
                borderRadius: 22,
                overflow: 'hidden',
              }}
            >
              <LinearGradient
                colors={[themeColors.accent, themeColors.primary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  paddingVertical: 18,
                  paddingHorizontal: 28,
                  flexDirection: 'row-reverse',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                }}
              >
                <Text style={{ color: '#fff', fontWeight: '900', fontSize: 17 }}>
                  בוא נתחיל את היום
                </Text>
                <ArrowRight size={22} color="#fff" style={{ transform: [{ scaleX: -1 }] }} />
              </LinearGradient>
            </TouchableOpacity>
          </MotiView>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
