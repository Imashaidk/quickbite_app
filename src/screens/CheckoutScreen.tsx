import React, { useState } from 'react';
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
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useOrder } from '../context/OrderContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Checkout'>;

const PICKUP_TIMES = [
  { id: 'asap', label: 'ASAP (in 8-10 mins)', tag: 'Recommended' },
  { id: 'break', label: 'Next Lecture Break (in 30 mins)', tag: 'Popular' },
  { id: 'lunch', label: 'After Class (1:15 PM)', tag: 'Scheduled' },
];

const PICKUP_STATIONS = [
  { id: 'st1', name: 'Counter 1: Main Meals', desc: 'Rice and curry, kottu, fried rice' },
  { id: 'st2', name: 'Counter 2: Short Eats and Tea', desc: 'Rolls, roti, milk tea, pastries' },
  { id: 'st3', name: 'Counter 3: Juices and Desserts', desc: 'King coconut, faluda, fresh juices' },
];

const PAYMENT_METHODS = [
  { id: 'card', name: 'University Student Smart Card', icon: 'card-outline', detail: 'Balance: Rs. 2,500.00' },
  { id: 'lankaqr', name: 'LankaQR / Mobile Banking', icon: 'qr-code-outline', detail: 'Scan and pay at collection' },
  { id: 'counter', name: 'Cash Payment at Counter', icon: 'cash-outline', detail: 'Pay cash when collecting meal' },
];

export const CheckoutScreen: React.FC<Props> = ({ navigation }) => {
  const { items, subtotal, total, clearCart } = useCart();
  const { user } = useAuth();
  const { placeOrder } = useOrder();

  const [selectedTime, setSelectedTime] = useState(PICKUP_TIMES[0].label);
  const [selectedStation, setSelectedStation] = useState(PICKUP_STATIONS[0].name);
  const [selectedPayment, setSelectedPayment] = useState(PAYMENT_METHODS[0].name);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePlaceOrder = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const order = placeOrder(
        items,
        subtotal,
        total,
        selectedTime,
        selectedStation,
        selectedPayment
      );
      clearCart();
      setIsSubmitting(false);
      navigation.replace('OrderTracking', { orderId: order.id });
    }, 600);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Checkout</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Step 1: Pickup Time */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="time-outline" size={18} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>1. Choose Pickup Time</Text>
          </View>
          <View style={styles.optionList}>
            {PICKUP_TIMES.map((time) => {
              const isSelected = selectedTime === time.label;
              return (
                <TouchableOpacity
                  key={time.id}
                  style={[styles.radioCard, isSelected && styles.radioCardSelected]}
                  onPress={() => setSelectedTime(time.label)}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                    size={18}
                    color={isSelected ? COLORS.primary : COLORS.textMuted}
                  />
                  <Text style={[styles.radioLabel, isSelected && styles.radioLabelSelected]}>
                    {time.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Step 2: Pickup Station */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="location-outline" size={18} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>2. Canteen Collection Counter</Text>
          </View>
          <View style={styles.optionList}>
            {PICKUP_STATIONS.map((station) => {
              const isSelected = selectedStation === station.name;
              return (
                <TouchableOpacity
                  key={station.id}
                  style={[styles.radioCard, isSelected && styles.radioCardSelected]}
                  onPress={() => setSelectedStation(station.name)}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                    size={18}
                    color={isSelected ? COLORS.primary : COLORS.textMuted}
                  />
                  <View style={{ flex: 1, marginLeft: 8 }}>
                    <Text style={[styles.radioLabel, isSelected && styles.radioLabelSelected]}>
                      {station.name}
                    </Text>
                    <Text style={styles.radioSubLabel}>{station.desc}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Step 3: Payment Method */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="card-outline" size={18} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>3. Payment Method</Text>
          </View>
          <View style={styles.optionList}>
            {PAYMENT_METHODS.map((method) => {
              const isSelected = selectedPayment === method.name;
              return (
                <TouchableOpacity
                  key={method.id}
                  style={[styles.radioCard, isSelected && styles.radioCardSelected]}
                  onPress={() => setSelectedPayment(method.name)}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                    size={18}
                    color={isSelected ? COLORS.primary : COLORS.textMuted}
                  />
                  <View style={{ flex: 1, marginLeft: 8 }}>
                    <Text style={[styles.radioLabel, isSelected && styles.radioLabelSelected]}>
                      {method.name}
                    </Text>
                    <Text style={styles.radioSubLabel}>{method.detail}</Text>
                  </View>
                  <Ionicons
                    name={method.icon as any}
                    size={18}
                    color={isSelected ? COLORS.primary : COLORS.textSecondary}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Order Summary Confirmation */}
        <View style={styles.orderSummaryCard}>
          <Text style={styles.summaryTitle}>Tray Summary ({items.length} items)</Text>
          {items.map((ci) => (
            <View key={ci.item.id} style={styles.summaryItemRow}>
              <Text style={styles.summaryItemText}>
                {ci.quantity}x {ci.item.name}
              </Text>
              <Text style={styles.summaryItemPrice}>
                Rs. {(ci.item.price * ci.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
          <View style={styles.divider} />
          <View style={styles.summaryTotalRow}>
            <Text style={styles.summaryTotalText}>Total to Pay</Text>
            <Text style={styles.summaryTotalAmount}>Rs. {total.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footerBar}>
        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && { opacity: 0.6 }]}
          onPress={handlePlaceOrder}
          disabled={isSubmitting}
          activeOpacity={0.85}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'Confirming Canteen Ticket...' : `Confirm and Place Order : Rs. ${total.toFixed(2)}`}
          </Text>
          <Ionicons name="checkmark-done" size={18} color="#FFFFFF" style={{ marginLeft: 8 }} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.cardBackground,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.text,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: 110,
    maxWidth: 680,
    alignSelf: 'center',
    width: '100%',
  },
  sectionCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 14,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  optionList: {
    gap: 8,
  },
  radioCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 11,
  },
  radioCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  radioLabel: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: '600',
    marginLeft: 8,
  },
  radioLabelSelected: {
    color: COLORS.primaryDark,
    fontWeight: '700',
  },
  radioSubLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  orderSummaryCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 14,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.lg,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  summaryItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  summaryItemText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    flex: 1,
  },
  summaryItemPrice: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 8,
  },
  summaryTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryTotalText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.text,
  },
  summaryTotalAmount: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  footerBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.cardBackground,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    maxWidth: 680,
    alignSelf: 'center',
    width: '100%',
    ...SHADOWS.md,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    ...SHADOWS.sm,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
