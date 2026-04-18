import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import DashboardScreen from '../DashboardScreen';

// Mock Screen-specific hooks and services
const mockTasks: any[] = [];
jest.mock('../../hooks/useTasks', () => ({
  useTasks: () => ({
    tasks: mockTasks,
    loading: false,
    refreshing: false,
    fetchTasks: jest.fn(),
    onRefresh: jest.fn(),
    toggleTaskStatus: jest.fn(),
    deleteTask: jest.fn(),
    toggleSubtask: jest.fn(),
    generateTaskInsights: jest.fn(),
  }),
}));

jest.mock('../../services/authService', () => ({
  authService: {
    getCurrentUser: jest.fn().mockResolvedValue({ name: 'Test User' }),
    getProfile: jest.fn().mockResolvedValue({ success: true, user: { name: 'Test User' } }),
  },
}));

jest.mock('../../services/taskService', () => ({
  taskService: {
    getTasks: jest.fn().mockResolvedValue([]),
    getStats: jest.fn().mockResolvedValue({ total: 0, completed: 0 }),
    createTaskWithAI: jest.fn(),
  },
}));

describe('DashboardScreen Smoke Test', () => {
  it('renders correctly without crashing', async () => {
    const { getByText, queryByText } = render(<DashboardScreen />);
    
    // It starts with a loading indicator because of InteractionManager
    // We wait for the "ready" state
    await waitFor(() => {
      // Check for CORTEX_ACTIVE which is in the header
      expect(getByText(/CORTEX_SYNC_ACTIVE/i)).toBeTruthy();
    });
    
    // Check for user name greeting
    expect(getByText(/Test User/i)).toBeTruthy();

    // Verify "פעילות אחרונה" is present as requested
    expect(getByText(/פעילות אחרונה/i)).toBeTruthy();
  });
});
