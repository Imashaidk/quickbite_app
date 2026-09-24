import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { COLORS, SPACING, SHADOWS } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useOrder, Order } from '../context/OrderContext';
import { useCart } from '../context/CartContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

export const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const { user, logout } = useAuth();
  const { orderHistory, activeOrder } = useOrder();
  const { addToCart } = useCart();

  const handleReorder = (order: Order) => {
    order.items.forEach((ci) => {
      addToCart(ci.item, ci.quantity);
    });
    navigation.navigate('Cart');
  };

  const handleLogout = () => {
    logout();
    navigation.replace('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Student Profile</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.backButton}>
          <Ionicons name="home-outline" size={18} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* User Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={38} color="#FFFFFF" />
            </View>
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark" size={12} color="#FFFFFF" />
            </View>
          </View>

          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>

          <View style={styles.studentIdBadge}>
            <Ionicons name="school-outline" size={14} color={COLORS.primaryDark} />
            <Text style={styles.studentIdText}>ID: {user.studentId}</Text>
          </View>

          {/* Campus Card Balance Box */}
          <View style={styles.balanceBox}>
            <View>
              <Text style={styles.balanceLabel}>University Smart Card Balance</Text>
              <Text style={styles.balanceAmount}>Rs. {user.campusCardBalance.toFixed(2)}</Text>
            </View>
            <TouchableOpacity style={styles.topUpButton} activeOpacity={0.8}>
              <Ionicons name="add" size={15} color="#FFFFFF" />
              <Text style={styles.topUpButtonText}>Add Funds</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Active Order Alert Card */}
        {activeOrder && activeOrder.status !== 'Completed' && (
          <TouchableOpacity
            style={styles.activeOrderBanner}
            onPress={() => navigation.navigate('OrderTracking', { orderId: activeOrder.id })}
            activeOpacity={0.85}
          >
            <View style={styles.activeOrderLeft}>
              <View style={styles.pulseDot} />
              <View>
                <Text style={styles.activeOrderTitle}>Active Order #{activeOrder.id}</Text>
                <Text style={styles.activeOrderSub}>
                  Status: {activeOrder.status} : {activeOrder.pickupStation}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.primary} />
          </TouchableOpacity>
        )}

        {/* Order History Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Order History ({orderHistory.length})</Text>
          <Text style={styles.sectionSub}>All canteen orders</Text>
        </View>

        {orderHistory.map((order) => {
          const isDone = order.status === 'Completed';

          return (
            <View key={order.id} style={styles.orderHistoryCard}>
              <View style={styles.orderCardHeader}>
                <View>
                  <Text style={styles.orderCardId}>Order #{order.id}</Text>
                  <Text style={styles.orderCardTime}>{order.createdAt}</Text>
                </View>

                <View
                  style={[
                    styles.statusBadge,
                    isDone ? styles.statusBadgeDone : styles.statusBadgeActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusBadgeText,
                      isDone ? styles.statusBadgeTextDone : styles.statusBadgeTextActive,
                    ]}
                  >
                    {order.status}
                  </Text>
                </View>
              </View>

              <View style={styles.orderItemsList}>
                {order.items.map((ci) => (
                  <Text key={ci.item.id} style={styles.orderItemName}>
                    - {ci.quantity}x {ci.item.name}
                  </Text>
                ))}
              </View>

              <View style={styles.orderCardFooter}>
                <View>
                  <Text style={styles.orderTotalLabel}>Total Paid</Text>
                  <Text style={styles.orderTotalAmount}>Rs. {order.total.toFixed(2)}</Text>
                </View>

                <View style={styles.orderActionRow}>
                  {order.status !== 'Completed' ? (
                    <TouchableOpacity
                      style={styles.trackButton}
                      onPress={() => navigation.navigate('OrderTracking', { orderId: order.id })}
                    >
                      <Text style={styles.trackButtonText}>Track Live</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={styles.reorderButton}
                      onPress={() => handleReorder(order)}
                    >
                      <Ionicons name="refresh-outline" size={14} color={COLORS.primary} />
                      <Text style={styles.reorderButtonText}>Reorder</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          );
        })}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
          <Ionicons name="log-out-outline" size={18} color={COLORS.danger} />
          <Text style={styles.logoutButtonText}>Sign Out of Campus Account</Text>
        </TouchableOpacity>
      </ScrollView>
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
    paddingBottom: 40,
    maxWidth: 1000,
    alignSelf: 'center',
    width: '100%',
  },
  profileCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 18,
    padding: SPACING.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: SPACING.md,
  },
  avatarPlaceholder: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.primaryLight,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.success,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userName: {
    fontSize: 19,
    fontWeight: '800',
    color: COLORS.text,
  },
  userEmail: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  studentIdBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 14,
    marginTop: 8,
    gap: 6,
  },
  studentIdText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  balanceBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    width: '100%',
    borderRadius: 12,
    padding: SPACING.md,
    marginTop: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  balanceLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  balanceAmount: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: 2,
  },
  topUpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    gap: 4,
  },
  topUpButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  activeOrderBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    borderRadius: 12,
    padding: 12,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  activeOrderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  activeOrderTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  activeOrderSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  sectionHeader: {
    marginTop: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  sectionSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  orderHistoryCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 14,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 10,
    ...SHADOWS.sm,
  },
  orderCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderCardId: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  orderCardTime: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 10,
  },
  statusBadgeDone: {
    backgroundColor: COLORS.successLight,
  },
  statusBadgeActive: {
    backgroundColor: COLORS.primaryLight,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusBadgeTextDone: {
    color: COLORS.success,
  },
  statusBadgeTextActive: {
    color: COLORS.primaryDark,
  },
  orderItemsList: {
    marginVertical: 8,
    paddingVertical: 5,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },
  orderItemName: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  orderCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 3,
  },
  orderTotalLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  orderTotalAmount: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
  },
  orderActionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  trackButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 7,
  },
  trackButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  reorderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 7,
    gap: 4,
  },
  reorderButtonText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '700',
  },
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.dangerLight,
    paddingVertical: 13,
    borderRadius: 12,
    marginTop: SPACING.md,
    gap: 8,
  },
  logoutButtonText: {
    color: COLORS.danger,
    fontSize: 13,
    fontWeight: '700',
  },
});
