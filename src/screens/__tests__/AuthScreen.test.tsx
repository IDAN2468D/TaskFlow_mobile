import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AuthScreen from '../AuthScreen';
import { authService } from '../../services/authService';

// Mock navigation
const mockNavigation = {
  replace: jest.fn(),
};

// Mock authService
jest.mock('../../services/authService', () => ({
  authService: {
    login: jest.fn(),
    register: jest.fn(),
  },
}));

describe('AuthScreen Smoke Test', () => {
  it('renders correctly', () => {
    const { getByPlaceholderText, getByText } = render(
      <AuthScreen navigation={mockNavigation} />
    );
    
    expect(getByPlaceholderText('כתובת אימייל')).toBeTruthy();
    expect(getByPlaceholderText('סיסמה')).toBeTruthy();
    expect(getByText('התחברות')).toBeTruthy();
  });

  it('toggles between login and register', () => {
    const { getByText, queryByPlaceholderText, getByPlaceholderText } = render(
      <AuthScreen navigation={mockNavigation} />
    );
    
    // Default is login, so no "Full Name"
    expect(queryByPlaceholderText('שם מלא')).toBeNull();
    
    // Toggle to register
    fireEvent.press(getByText('הירשם עכשיו'));
    
    expect(getByPlaceholderText('שם מלא')).toBeTruthy();
    expect(getByText('הרשמה')).toBeTruthy();
  });
});
