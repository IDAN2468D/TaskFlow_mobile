import api from './api';

export interface Activity {
  _id: string;
  userId: {
    _id: string;
    name: string;
    avatar?: string;
  };
  action: string;
  details?: string;
  timestamp: string;
}

/**
 * Activity Service
 * Handles fetching activity logs from the bridge.
 */
export const activityService = {
  getRecentActivities: async (limit = 20): Promise<Activity[]> => {
    try {
      const response = await api.get(`/bridge/timeline?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch activity logs:', error);
      return [];
    }
  }
};
