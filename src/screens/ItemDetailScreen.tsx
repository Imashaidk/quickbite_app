import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { COLORS, SPACING, SHADOWS } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';

type Props = NativeStackScreenProps<RootStackParamList, 'ItemDetail'>;

export const ItemDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { item } = route.params;
  const { addToCart, itemCount } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const incrementQty = () => setQuantity((q) => q + 1);
  const decrementQty = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const calculatedPrice = (item.price * quantity).toFixed(2);

  const handleAddToCart = () => {
    addToCart(item, quantity, specialInstructions.trim());
    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
    }, 2200);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {showSuccessToast && (
        <View style={styles.toast}>
          <Ionicons name="checkmark-circle-outline" size={18} color="#10B981" />
          <Text style={styles.toastText}>
            Added {quantity}x to your meal tray
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Cart')}
            style={styles.toastButton}
          >
            <Text style={styles.toastButtonText}>View Tray</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Professional Dish Header Card */}
        <View style={styles.dishHeroHeader}>
          <TouchableOpacity
            style={styles.navCircleButtonLeft}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={20} color="#0F172A" />
          </TouchableOpacity>

          <View style={styles.dishHeroIconBadge}>
            <Ionicons
              name={(item.iconName as any) || 'restaurant'}
              size={56}
              color={COLORS.primary}
            />
            <Text style={styles.dishHeroCategoryTag}>{item.category.toUpperCase()}</Text>
          </View>

          <View style={styles.navRightRow}>
            <TouchableOpacity
              style={styles.navCircleButton}
              onPress={() => setIsFavorite(!isFavorite)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={20}
                color={isFavorite ? COLORS.danger : '#0F172A'}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.navCircleButton, { position: 'relative' }]}
              onPress={() => navigation.navigate('Cart')}
              activeOpacity={0.8}
            >
              <Ionicons name="cart-outline" size={20} color="#0F172A" />
              {itemCount > 0 && (
                <View style={styles.cartBadgeSmall}>
                  <Text style={styles.cartBadgeSmallText}>{itemCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Content Details */}
        <View style={styles.bodyContainer}>
          <View style={styles.tagRow}>
            <View style={styles.categoryChip}>
              <Text style={styles.categoryChipText}>{item.category.toUpperCase()}</Text>
            </View>
            {item.isVegetarian && (
              <View style={styles.dietaryChip}>
                <Ionicons name="leaf-outline" size={12} color="#10B981" />
                <Text style={styles.dietaryChipText}>Vegetarian</Text>
              </View>
            )}
            {item.isSpicy && (
              <View style={[styles.dietaryChip, { backgroundColor: COLORS.dangerLight }]}>
                <Ionicons name="flame-outline" size={12} color={COLORS.danger} />
                <Text style={[styles.dietaryChipText, { color: COLORS.danger }]}>Spicy</Text>
              </View>
            )}
            {item.popular && (
              <View style={[styles.dietaryChip, { backgroundColor: COLORS.warningLight }]}>
                <Ionicons name="star" size={12} color={COLORS.warning} />
                <Text style={[styles.dietaryChipText, { color: COLORS.warning }]}>Campus Favorite</Text>
              </View>
            )}
          </View>

          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.unitPrice}>Rs. {item.price.toFixed(2)} per portion</Text>

          <View style={styles.metricsBox}>
            <View style={styles.metricColumn}>
              <Ionicons name="star" size={16} color="#F59E0B" />
              <Text style={styles.metricVal}>{item.rating}</Text>
              <Text style={styles.metricLabel}>{item.reviewsCount} reviews</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricColumn}>
              <Ionicons name="time-outline" size={16} color={COLORS.primary} />
              <Text style={styles.metricVal}>{item.preparationTime}</Text>
              <Text style={styles.metricLabel}>Prep speed</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricColumn}>
              <Ionicons name="flame-outline" size={16} color={COLORS.accent} />
              <Text style={styles.metricVal}>{item.calories}</Text>
              <Text style={styles.metricLabel}>Nutrition</Text>
            </View>
          </View>

          <Text style={styles.sectionHeading}>Description</Text>
          <Text style={styles.descriptionText}>{item.description}</Text>

          <View style={styles.canteenNotice}>
            <Ionicons name="restaurant-outline" size={18} color={COLORS.primaryDark} />
            <View style={{ flex: 1 }}>
              <Text style={styles.canteenNoticeTitle}>Freshly Prepared at University Canteen</Text>
              <Text style={styles.canteenNoticeSub}>
                Orders are queued in real time. Collect hot directly from the food warmer window using your pickup PIN.
              </Text>
            </View>
          </View>

          <Text style={styles.sectionHeading}>Special Instructions (Optional)</Text>
          <TextInput
            style={styles.instructionInput}
            placeholder="e.g. Less spicy, extra chili paste, separate gravy, no sugar..."
            placeholderTextColor={COLORS.textMuted}
            value={specialInstructions}
            onChangeText={setSpecialInstructions}
            multiline
            numberOfLines={3}
          />
        </View>
      </ScrollView>

      {/* Sticky Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.stepperContainer}>
          <TouchableOpacity style={styles.stepperBtn} onPress={decrementQty} activeOpacity={0.7}>
            <Ionicons name="remove" size={16} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.stepperQty}>{quantity}</Text>
          <TouchableOpacity style={styles.stepperBtn} onPress={incrementQty} activeOpacity={0.7}>
            <Ionicons name="add" size={16} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.addToCartBtn} onPress={handleAddToCart} activeOpacity={0.85}>
          <View style={styles.addToCartTextGroup}>
            <Text style={styles.addToCartLabel}>Add to Tray</Text>
            <Text style={styles.addToCartSub}>: Rs. {calculatedPrice}</Text>
          </View>
          <Ionicons name="basket-outline" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 110,
    maxWidth: 1000,
    alignSelf: 'center',
    width: '100%',
  },
  toast: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 20,
    right: 20,
    backgroundColor: '#0F172A',
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 9999,
    ...SHADOWS.lg,
  },
  toastText: {
    color: '#FFFFFF',
    fontWeight: '600',
    flex: 1,
    marginLeft: 8,
    fontSize: 13,
  },
  toastButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  toastButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  dishHeroHeader: {
    height: 180,
    width: '100%',
    position: 'relative',
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  dishHeroIconBadge: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  dishHeroCategoryTag: {
    color: '#CBD5E1',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginTop: 6,
  },
  navCircleButtonLeft: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 12 : 20,
    left: 16,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  navRightRow: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 12 : 20,
    right: 16,
    flexDirection: 'row',
    gap: 8,
  },
  navCircleButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  cartBadgeSmall: {
    position: 'absolute',
    top: -3,
    right: -3,
    backgroundColor: COLORS.primary,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  cartBadgeSmallText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  bodyContainer: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    marginTop: -20,
    padding: SPACING.lg,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: SPACING.xs,
  },
  categoryChip: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryChipText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  dietaryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.successLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
  },
  dietaryChipText: {
    color: COLORS.success,
    fontSize: 11,
    fontWeight: '700',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: 6,
  },
  unitPrice: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.primaryDark,
    marginTop: 4,
  },
  metricsBox: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardBackground,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginTop: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'space-around',
    ...SHADOWS.sm,
  },
  metricColumn: {
    alignItems: 'center',
    flex: 1,
  },
  metricVal: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: 2,
  },
  metricLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  metricDivider: {
    width: 1,
    height: 26,
    backgroundColor: COLORS.border,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: SPACING.md,
    marginBottom: 6,
  },
  descriptionText: {
    fontSize: 13,
    lineHeight: 20,
    color: COLORS.textSecondary,
  },
  canteenNotice: {
    flexDirection: 'row',
    backgroundColor: COLORS.primaryLight,
    borderRadius: 12,
    padding: 12,
    marginTop: SPACING.md,
    alignItems: 'flex-start',
    gap: 10,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  canteenNoticeTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  canteenNoticeSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  instructionInput: {
    backgroundColor: COLORS.cardBackground,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 12,
    fontSize: 13,
    color: COLORS.text,
    minHeight: 65,
    textAlignVertical: 'top',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.cardBackground,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    maxWidth: 1000,
    alignSelf: 'center',
    width: '100%',
    ...SHADOWS.md,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  stepperBtn: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    ...SHADOWS.sm,
  },
  stepperQty: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
    paddingHorizontal: 12,
  },
  addToCartBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 13,
    paddingHorizontal: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  addToCartTextGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  addToCartLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  addToCartSub: {
    color: '#FED7AA',
    fontSize: 14,
    fontWeight: '700',
  },
});
