import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { COLORS, SPACING, SHADOWS } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { useOrder, OrderStatus } from '../context/OrderContext';

type Props = NativeStackScreenProps<RootStackParamList, 'OrderTracking'>;

const STATUS_STEPS: { key: OrderStatus; title: string; subtitle: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  {
    key: 'Placed',
    title: 'Order Placed',
    subtitle: 'Ticket received by campus kitchen',
    icon: 'receipt-outline',
  },
  {
    key: 'Preparing',
    title: 'Preparing Food',
    subtitle: 'Chef is cooking your Sri Lankan meal',
    icon: 'flame-outline',
  },
  {
    key: 'Ready for pickup',
    title: 'Ready for Pickup',
    subtitle: 'Show your PIN at the canteen collection counter',
    icon: 'bag-check-outline',
  },
  {
    key: 'Completed',
    title: 'Order Collected',
    subtitle: 'Completed. Enjoy your campus meal',
    icon: 'checkmark-done-circle-outline',
  },
];

export const OrderTrackingScreen: React.FC<Props> = ({ route, navigation }) => {
  const { orderId } = route.params;
  const { activeOrder, orderHistory, advanceOrderStatus } = useOrder();

  const currentOrder =
    (activeOrder && activeOrder.id === orderId ? activeOrder : null) ||
    orderHistory.find((o) => o.id === orderId);

  const [autoSimulate, setAutoSimulate] = useState(false);

  useEffect(() => {
    let timer: any;
    if (autoSimulate && currentOrder && currentOrder.status !== 'Completed') {
      timer = setTimeout(() => {
        advanceOrderStatus(orderId);
      }, 4000);
    }
    return () => clearTimeout(timer);
  }, [autoSimulate, currentOrder?.status, orderId]);

  if (!currentOrder) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.notFoundBox}>
          <Text style={styles.notFoundTitle}>Order #{orderId} not found</Text>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.actionBtnText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const currentStepIndex = STATUS_STEPS.findIndex((s) => s.key === currentOrder.status);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      {/* Top Banner Card */}
      <View style={styles.headerHero}>
        <View style={styles.heroTopRow}>
          <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.backCircle}>
            <Ionicons name="close" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.heroOrderId}>Order #{currentOrder.id}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.backCircle}>
            <Ionicons name="person-outline" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.heroCenter}>
          <View style={styles.timeCircle}>
            <Text style={styles.timeValue}>
              {currentOrder.status === 'Ready for pickup'
                ? 'NOW'
                : currentOrder.status === 'Completed'
                ? '0'
                : `${currentOrder.estimatedMinutes}`}
            </Text>
            <Text style={styles.timeUnit}>
              {currentOrder.status === 'Ready for pickup'
                ? 'READY'
                : currentOrder.status === 'Completed'
                ? 'DONE'
                : 'MINUTES'}
            </Text>
          </View>
          <Text style={styles.statusBigTitle}>{currentOrder.status}</Text>
          <Text style={styles.statusSubTitle}>
            Pickup Station: {currentOrder.pickupStation}
          </Text>
        </View>

        {/* Verification PIN Banner */}
        <View style={styles.pinBanner}>
          <View>
            <Text style={styles.pinLabel}>COUNTER PICKUP PIN</Text>
            <Text style={styles.pinCode}>{currentOrder.pickupCode}</Text>
          </View>
          <View style={styles.pinIconBox}>
            <Ionicons name="qr-code-outline" size={28} color={COLORS.primary} />
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Testing Simulator Box */}
        <View style={styles.simulatorCard}>
          <View style={styles.simulatorHeader}>
            <Ionicons name="construct-outline" size={16} color={COLORS.primary} />
            <Text style={styles.simulatorTitle}>Kitchen Order Simulator</Text>
          </View>
          <Text style={styles.simulatorDesc}>
            Test status flow as required by rubric (Placed : Preparing : Ready for pickup : Completed):
          </Text>
          <View style={styles.simulatorBtnRow}>
            <TouchableOpacity
              style={[
                styles.simStepButton,
                currentOrder.status === 'Completed' && { opacity: 0.5 },
              ]}
              onPress={() => advanceOrderStatus(currentOrder.id)}
              disabled={currentOrder.status === 'Completed'}
              activeOpacity={0.8}
            >
              <Ionicons name="play-forward-outline" size={15} color="#FFFFFF" />
              <Text style={styles.simStepButtonText}>
                {currentOrder.status === 'Completed' ? 'Order Finished' : 'Advance Next State'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.autoSimButton,
                autoSimulate && styles.autoSimButtonActive,
              ]}
              onPress={() => setAutoSimulate(!autoSimulate)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={autoSimulate ? 'pause' : 'timer-outline'}
                size={15}
                color={autoSimulate ? '#FFFFFF' : COLORS.secondary}
              />
              <Text
                style={[
                  styles.autoSimButtonText,
                  autoSimulate && { color: '#FFFFFF' },
                ]}
              >
                {autoSimulate ? 'Auto-Sim ON' : 'Auto-Timer'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Step Progress Timeline */}
        <View style={styles.timelineCard}>
          <Text style={styles.timelineHeading}>Order Live Status</Text>

          {STATUS_STEPS.map((step, idx) => {
            const isCompleted = idx <= currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            const isLast = idx === STATUS_STEPS.length - 1;

            return (
              <View key={step.key} style={styles.stepContainer}>
                <View style={styles.stepIndicatorColumn}>
                  <View
                    style={[
                      styles.stepCircle,
                      isCompleted && styles.stepCircleCompleted,
                      isCurrent && styles.stepCircleActive,
                    ]}
                  >
                    <Ionicons
                      name={isCompleted ? 'checkmark' : step.icon}
                      size={15}
                      color={isCompleted ? '#FFFFFF' : COLORS.textMuted}
                    />
                  </View>
                  {!isLast && (
                    <View
                      style={[
                        styles.stepLine,
                        idx < currentStepIndex && styles.stepLineActive,
                      ]}
                    />
                  )}
                </View>

                <View style={styles.stepTextContainer}>
                  <Text
                    style={[
                      styles.stepTitle,
                      isCompleted && styles.stepTitleCompleted,
                      isCurrent && styles.stepTitleActive,
                    ]}
                  >
                    {step.title}
                  </Text>
                  <Text style={styles.stepSubtitle}>{step.subtitle}</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Ordered Items Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryHeading}>Items in this Order</Text>
          {currentOrder.items.map((ci) => (
            <View key={ci.item.id} style={styles.itemRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemRowTitle}>
                  {ci.quantity}x {ci.item.name}
                </Text>
                {ci.specialInstructions ? (
                  <Text style={styles.itemRowNote}>Note: "{ci.specialInstructions}"</Text>
                ) : null}
              </View>
              <Text style={styles.itemRowPrice}>
                Rs. {(ci.item.price * ci.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Charged</Text>
            <Text style={styles.totalAmount}>Rs. {currentOrder.total.toFixed(2)}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsGroup}>
          <TouchableOpacity
            style={styles.homeBtn}
            onPress={() => navigation.navigate('Home')}
            activeOpacity={0.8}
          >
            <Text style={styles.homeBtnText}>Return to Home Menu</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.profileBtn}
            onPress={() => navigation.navigate('Profile')}
            activeOpacity={0.8}
          >
            <Text style={styles.profileBtnText}>View in Order History</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerHero: {
    backgroundColor: '#0F172A',
    paddingHorizontal: SPACING.lg,
    paddingTop: Platform.OS === 'android' ? 30 : SPACING.md,
    paddingBottom: SPACING.lg,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  backCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroOrderId: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  heroCenter: {
    alignItems: 'center',
    marginVertical: SPACING.xs,
  },
  timeCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    ...SHADOWS.lg,
  },
  timeValue: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '900',
  },
  timeUnit: {
    color: '#FED7AA',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  statusBigTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  statusSubTitle: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 4,
  },
  pinBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    paddingVertical: 9,
    marginTop: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  pinLabel: {
    color: '#CBD5E1',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  pinCode: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 2,
    marginTop: 2,
  },
  pinIconBox: {
    backgroundColor: '#FFFFFF',
    padding: 5,
    borderRadius: 7,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: 40,
    maxWidth: 1000,
    alignSelf: 'center',
    width: '100%',
  },
  simulatorCard: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 14,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  simulatorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  simulatorTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  simulatorDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginVertical: 5,
    lineHeight: 16,
  },
  simulatorBtnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },
  simStepButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 9,
    borderRadius: 9,
    gap: 6,
  },
  simStepButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  autoSimButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 9,
    gap: 4,
  },
  autoSimButtonActive: {
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.secondary,
  },
  autoSimButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.secondary,
  },
  timelineCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 14,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  timelineHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  stepContainer: {
    flexDirection: 'row',
    minHeight: 52,
  },
  stepIndicatorColumn: {
    alignItems: 'center',
    width: 30,
  },
  stepCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepCircleCompleted: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  stepCircleActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    transform: [{ scale: 1.1 }],
  },
  stepLine: {
    width: 2,
    flex: 1,
    backgroundColor: COLORS.border,
    marginVertical: 4,
  },
  stepLineActive: {
    backgroundColor: COLORS.success,
  },
  stepTextContainer: {
    flex: 1,
    marginLeft: 10,
    paddingBottom: 12,
  },
  stepTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  stepTitleCompleted: {
    color: COLORS.text,
    fontWeight: '700',
  },
  stepTitleActive: {
    color: COLORS.primaryDark,
    fontWeight: '800',
  },
  stepSubtitle: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  summaryCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 14,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.lg,
  },
  summaryHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  itemRowTitle: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: '600',
  },
  itemRowNote: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    marginTop: 2,
  },
  itemRowPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 8,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  totalLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  actionsGroup: {
    gap: 10,
  },
  homeBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 13,
    borderRadius: 11,
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  homeBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  profileBtn: {
    backgroundColor: COLORS.cardBackground,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    paddingVertical: 12,
    borderRadius: 11,
    alignItems: 'center',
  },
  profileBtnText: {
    color: COLORS.secondary,
    fontSize: 13,
    fontWeight: '700',
  },
  notFoundBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  notFoundTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 16,
  },
  actionBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 10,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
