import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { COLORS, SPACING, SHADOWS, FONT_FAMILY } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

const FONT_STACK = FONT_FAMILY || 'System';

export const SplashScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.circleTop} />
      <View style={styles.circleBottom} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          {/* Kelaniya University Canteen Emblem */}
          <View style={styles.emblemCard}>
            <View style={styles.iconCircle}>
              <Ionicons name="restaurant" size={44} color="#FFFFFF" />
            </View>
            <View style={styles.emblemUniversityBadge}>
              <Ionicons name="school" size={13} color="#FFFFFF" />
              <Text style={styles.emblemUniversityText}>UNIVERSITY OF KELANIYA</Text>
            </View>
          </View>

          <Text style={styles.appName}>QuickBite</Text>
          <Text style={styles.tagline}>University Canteen Food Ordering</Text>

          <View style={styles.badge}>
            <Ionicons name="school-outline" size={15} color={COLORS.primary} />
            <Text style={styles.badgeText}>Main, Science & Kannangara Canteens</Text>
          </View>

          <Text style={styles.description}>
            Skip the long queue between lectures. Pre-order your hot chicken kottu, rice and curry, short eats, and Ceylon tea directly from University of Kelaniya canteens.
          </Text>

          {/* Canteen Stations Showcase */}
          <View style={styles.stationsRow}>
            <View style={styles.stationPill}>
              <Ionicons name="restaurant-outline" size={14} color={COLORS.primary} />
              <Text style={styles.stationText}>Main Meals</Text>
            </View>
            <View style={styles.stationPill}>
              <Ionicons name="fast-food-outline" size={14} color={COLORS.secondary} />
              <Text style={styles.stationText}>Short Eats</Text>
            </View>
            <View style={styles.stationPill}>
              <Ionicons name="cafe-outline" size={14} color="#F59E0B" />
              <Text style={styles.stationText}>Ceylon Tea</Text>
            </View>
          </View>

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

          <Text style={styles.footerText}>University of Kelaniya Canteen System : v1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    position: 'relative',
    overflow: 'hidden',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
    paddingVertical: SPACING.xl,
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
    maxWidth: 460,
  },
  emblemCard: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.lg,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  emblemUniversityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  emblemUniversityText: {
    color: '#F8FAFC',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    fontFamily: FONT_STACK,
  },
  appName: {
    fontSize: 38,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    fontFamily: FONT_STACK,
  },
  tagline: {
    fontSize: 16,
    color: '#CBD5E1',
    marginTop: 4,
    fontWeight: '500',
    textAlign: 'center',
    fontFamily: FONT_STACK,
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
    fontFamily: FONT_STACK,
  },
  description: {
    color: '#94A3B8',
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 21,
    marginTop: SPACING.md,
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.sm,
    fontFamily: FONT_STACK,
  },
  stationsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: SPACING.xl,
  },
  stationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  stationText: {
    color: '#E2E8F0',
    fontSize: 11,
    fontWeight: '600',
    fontFamily: FONT_STACK,
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
    paddingVertical: 14,
    borderRadius: 14,
    ...SHADOWS.md,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    fontFamily: FONT_STACK,
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  secondaryButtonText: {
    color: '#E2E8F0',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: FONT_STACK,
  },
  footerText: {
    color: '#64748B',
    fontSize: 11,
    marginTop: SPACING.xl,
    fontFamily: FONT_STACK,
  },
});
