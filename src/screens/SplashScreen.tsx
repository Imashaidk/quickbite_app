import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { COLORS, SPACING, SHADOWS, FONT_FAMILY } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

const FONT_STACK = FONT_FAMILY || 'System';

// Featured Sri Lankan Canteen Foods preview for the Welcome Screen
const WELCOME_FOOD_PREVIEWS = [
  {
    name: 'Hot Kottu Roti',
    price: 'Rs. 240',
    image: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Rice and Curry',
    price: 'Rs. 160',
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Crispy Short Eats',
    price: 'Rs. 50',
    image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Ceylon Milk Tea',
    price: 'Rs. 40',
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&auto=format&fit=crop&q=80',
  },
];

export const SplashScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.circleTop} />
      <View style={styles.circleBottom} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          {/* Main Hero Food Banner */}
          <View style={styles.heroCard}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=900&auto=format&fit=crop&q=80' }}
              style={styles.heroImage}
              resizeMode="cover"
            />
            <View style={styles.heroGradientOverlay}>
              <View style={styles.heroBadge}>
                <Ionicons name="restaurant" size={14} color="#FFFFFF" />
                <Text style={styles.heroBadgeText}>FRESH CAMPUS MEALS</Text>
              </View>
              <Text style={styles.heroTitle}>University Canteen Service</Text>
            </View>
          </View>

          {/* Sri Lankan Food Highlights Grid on Welcome Screen */}
          <View style={styles.foodPreviewRow}>
            {WELCOME_FOOD_PREVIEWS.map((item, idx) => (
              <View key={idx} style={styles.foodThumbCard}>
                <Image source={{ uri: item.image }} style={styles.foodThumbImage} resizeMode="cover" />
                <View style={styles.foodThumbMeta}>
                  <Text style={styles.foodThumbName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.foodThumbPrice}>{item.price}</Text>
                </View>
              </View>
            ))}
          </View>

          <Text style={styles.appName}>QuickBite</Text>
          <Text style={styles.tagline}>University Canteen Food Ordering</Text>

          <View style={styles.badge}>
            <Ionicons name="school-outline" size={15} color={COLORS.primary} />
            <Text style={styles.badgeText}>Faculty and Student Canteen Service</Text>
          </View>

          <Text style={styles.description}>
            Pre-order your hot chicken kottu, rice and curry, short eats, and Ceylon tea between lectures to skip the canteen queue.
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

          <Text style={styles.footerText}>Cross-Platform MVP : v1.0.0</Text>
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
    maxWidth: 480,
  },
  // Main Hero Image Banner
  heroCard: {
    width: '100%',
    height: 180,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    ...SHADOWS.lg,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.md,
    backgroundColor: 'rgba(15, 23, 42, 0.72)',
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginBottom: 4,
    gap: 4,
  },
  heroBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    fontFamily: FONT_STACK,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: FONT_STACK,
  },
  // Food Preview Row on Welcome Screen
  foodPreviewRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: SPACING.lg,
  },
  foodThumbCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.10)',
  },
  foodThumbImage: {
    width: '100%',
    height: 56,
  },
  foodThumbMeta: {
    padding: 4,
    alignItems: 'center',
  },
  foodThumbName: {
    color: '#F8FAFC',
    fontSize: 9,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: FONT_STACK,
  },
  foodThumbPrice: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: '700',
    fontFamily: FONT_STACK,
  },
  appName: {
    fontSize: 36,
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
    paddingVertical: 5,
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
    lineHeight: 20,
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.sm,
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
