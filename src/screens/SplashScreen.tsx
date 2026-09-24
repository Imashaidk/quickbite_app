import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { COLORS, SPACING, SHADOWS } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export const SplashScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.circleTop} />
      <View style={styles.circleBottom} />

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="restaurant" size={60} color="#FFFFFF" />
        </View>

        <Text style={styles.appName}>QuickBite</Text>
        <Text style={styles.tagline}>University Canteen Food Ordering</Text>

        <View style={styles.badge}>
          <Ionicons name="school-outline" size={16} color={COLORS.primary} />
          <Text style={styles.badgeText}>Faculty and Student Canteen Service</Text>
        </View>

        <Text style={styles.description}>
          Pre-order your hot meals, short eats, and Ceylon tea between lectures to skip the canteen queue.
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.replace('Login')}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryButtonText}>Get Started</Text>
            <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={{ marginLeft: 8 }} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.replace('Home')}
            activeOpacity={0.7}
          >
            <Text style={styles.secondaryButtonText}>Browse Menu as Guest</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.footerText}>Cross-Platform MVP : v1.0.0</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
    position: 'relative',
    overflow: 'hidden',
  },
  circleTop: {
    position: 'absolute',
    top: -100,
    right: -80,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(255, 94, 30, 0.15)',
  },
  circleBottom: {
    position: 'absolute',
    bottom: -120,
    left: -80,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(245, 158, 11, 0.10)',
  },
  content: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 420,
  },
  iconContainer: {
    width: 104,
    height: 104,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    ...SHADOWS.lg,
  },
  appName: {
    fontSize: 38,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 16,
    color: '#CBD5E1',
    marginTop: 6,
    fontWeight: '500',
    textAlign: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 94, 30, 0.15)',
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 94, 30, 0.3)',
  },
  badgeText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 12,
    marginLeft: 6,
  },
  description: {
    color: '#94A3B8',
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 22,
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
    paddingHorizontal: SPACING.md,
  },
  buttonContainer: {
    width: '100%',
    gap: SPACING.md,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 14,
    ...SHADOWS.md,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  secondaryButtonText: {
    color: '#E2E8F0',
    fontSize: 14,
    fontWeight: '600',
  },
  footerText: {
    position: 'absolute',
    bottom: SPACING.lg,
    color: '#64748B',
    fontSize: 12,
  },
});
