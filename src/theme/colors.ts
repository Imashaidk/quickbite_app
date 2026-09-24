import { Platform } from 'react-native';

export const COLORS = {
  primary: '#FF5E1E',       // Energetic warm orange
  primaryDark: '#E0470B',
  primaryLight: '#FFF0EA',
  secondary: '#1E293B',     // Slate navy
  secondaryLight: '#334155',
  accent: '#F59E0B',        // Amber gold
  
  background: '#F8FAFC',
  cardBackground: '#FFFFFF',
  surface: '#F1F5F9',
  border: '#E2E8F0',
  
  text: '#0F172A',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  textLight: '#FFFFFF',
  
  success: '#10B981',
  successLight: '#ECFDF5',
  warning: '#F59E0B',
  warningLight: '#FFFBEB',
  danger: '#EF4444',
  dangerLight: '#FEF2F2',
  info: '#3B82F6',
  infoLight: '#EFF6FF',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const FONT_FAMILY = Platform.OS === 'web'
  ? "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif"
  : 'System';

export const FONTS = {
  family: FONT_FAMILY,
};

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#FF5E1E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
};
