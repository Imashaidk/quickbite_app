import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { MENU_ITEMS, MenuItem, CATEGORIES, CategoryType } from '../data/menuData';
import { COLORS, SPACING, SHADOWS } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useOrder } from '../context/OrderContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const { width } = Dimensions.get('window');
const isTabletOrWeb = width >= 768;

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { addToCart, itemCount, total } = useCart();
  const { user } = useAuth();
  const { activeOrder } = useOrder();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('All');
  const [addedToast, setAddedToast] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const handleQuickAdd = (item: MenuItem) => {
    addToCart(item, 1);
    setAddedToast(`Added 1x ${item.name}`);
    setTimeout(() => {
      setAddedToast(null);
    }, 2000);
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <View style={styles.greetingBox}>
          <Text style={styles.greetingSmall}>University Main Canteen</Text>
          <Text style={styles.greetingName}>
            Hello, {user.name}
          </Text>
        </View>

        <View style={styles.topRightActions}>
          {activeOrder && (
            <TouchableOpacity
              style={styles.activeOrderPill}
              onPress={() => navigation.navigate('OrderTracking', { orderId: activeOrder.id })}
              activeOpacity={0.8}
            >
              <View style={styles.pulseDot} />
              <Text style={styles.activeOrderPillText}>Order #{activeOrder.id}</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.iconCircleButton}
            onPress={() => navigation.navigate('Profile')}
            activeOpacity={0.7}
          >
            <Ionicons name="person-outline" size={20} color={COLORS.secondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.iconCircleButton, styles.cartButton]}
            onPress={() => navigation.navigate('Cart')}
            activeOpacity={0.7}
          >
            <Ionicons name="cart-outline" size={20} color={COLORS.primary} />
            {itemCount > 0 && (
              <View style={styles.badgeCount}>
                <Text style={styles.badgeCountText}>{itemCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Special Campus Promo Announcement */}
      <View style={styles.promoBanner}>
        <View style={styles.promoLeft}>
          <Text style={styles.promoTag}>STUDENT EXCLUSIVE</Text>
          <Text style={styles.promoTitle}>10% Off Orders Above Rs. 1000</Text>
          <Text style={styles.promoSub}>Valid for all Meals and Short Eats today</Text>
        </View>
        <View style={styles.promoBadge}>
          <Ionicons name="flash-outline" size={24} color="#FFFFFF" />
        </View>
      </View>

      {/* Search Input Bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={18} color={COLORS.textSecondary} style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search kottu, rice and curry, milk tea..."
          placeholderTextColor={COLORS.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Category Filter Pills */}
      <View style={styles.categoryScroll}>
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          let iconName: keyof typeof Ionicons.glyphMap = 'restaurant-outline';
          if (cat === 'Meals') iconName = 'fast-food-outline';
          if (cat === 'Beverages') iconName = 'cafe-outline';
          if (cat === 'Snacks') iconName = 'pizza-outline';
          if (cat === 'All') iconName = 'grid-outline';

          return (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryPill, isActive && styles.categoryPillActive]}
              onPress={() => setSelectedCategory(cat)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={iconName}
                size={15}
                color={isActive ? '#FFFFFF' : COLORS.textSecondary}
              />
              <Text
                style={[
                  styles.categoryPillText,
                  isActive && styles.categoryPillTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Section Title */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {selectedCategory === 'All' ? 'Popular Campus Canteen Menu' : `${selectedCategory}`}
        </Text>
        <Text style={styles.itemCountLabel}>{filteredItems.length} items</Text>
      </View>
    </View>
  );

  // Professional PickMe / Uber Eats style horizontal card with 1:1 square photo
  const renderMenuItem = ({ item }: { item: MenuItem }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ItemDetail', { item })}
      activeOpacity={0.88}
    >
      {/* Left Details column */}
      <View style={styles.cardLeft}>
        <View style={styles.cardHeaderRow}>
          {item.isVegetarian ? (
            <View style={styles.vegIndicator}>
              <View style={styles.vegDot} />
            </View>
          ) : (
            <View style={styles.nonVegIndicator}>
              <View style={styles.nonVegDot} />
            </View>
          )}
          {item.popular && (
            <View style={styles.popularBadge}>
              <Text style={styles.popularText}>POPULAR</Text>
            </View>
          )}
          {item.isSpicy && (
            <View style={styles.spicyBadge}>
              <Text style={styles.spicyText}>SPICY</Text>
            </View>
          )}
        </View>

        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.cardDescription} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.cardMetaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={12} color={COLORS.textSecondary} />
            <Text style={styles.metaText}>{item.preparationTime}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="star" size={12} color="#F59E0B" />
            <Text style={styles.ratingText}>{item.rating}</Text>
            <Text style={styles.reviewsCountText}>({item.reviewsCount})</Text>
          </View>
        </View>

        <Text style={styles.priceText}>Rs. {item.price.toFixed(2)}</Text>
      </View>

      {/* Right 1:1 Square Image with Add button */}
      <View style={styles.cardRight}>
        <Image source={{ uri: item.image }} style={styles.cardSquareImage} resizeMode="cover" />
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => handleQuickAdd(item)}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={16} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {addedToast && (
        <View style={styles.toast}>
          <Ionicons name="checkmark-circle-outline" size={18} color="#FFFFFF" />
          <Text style={styles.toastText}>{addedToast}</Text>
        </View>
      )}

      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        renderItem={renderMenuItem}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        key="sri-lankan-canteen-list"
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="restaurant-outline" size={44} color={COLORS.textMuted} />
            <Text style={styles.emptyTitle}>No menu items found</Text>
            <Text style={styles.emptySub}>Try searching for another Sri Lankan meal or reset category</Text>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
            >
              <Text style={styles.resetButtonText}>View Full Menu</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {itemCount > 0 && (
        <View style={styles.floatingCartContainer}>
          <TouchableOpacity
            style={styles.floatingCart}
            onPress={() => navigation.navigate('Cart')}
            activeOpacity={0.9}
          >
            <View style={styles.floatingCartLeft}>
              <View style={styles.floatingCartBadge}>
                <Text style={styles.floatingCartBadgeText}>{itemCount}</Text>
              </View>
              <View>
                <Text style={styles.floatingCartTitle}>View Tray</Text>
                <Text style={styles.floatingCartSub}>Total: Rs. {total.toFixed(2)}</Text>
              </View>
            </View>

            <View style={styles.floatingCartRight}>
              <Text style={styles.checkoutText}>Checkout</Text>
              <Ionicons name="arrow-forward" size={16} color="#FFFFFF" style={{ marginLeft: 4 }} />
            </View>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  toast: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    zIndex: 9999,
    ...SHADOWS.md,
  },
  toastText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },
  listContent: {
    paddingHorizontal: SPACING.md,
    paddingBottom: 110,
    maxWidth: 720,
    alignSelf: 'center',
    width: '100%',
  },
  headerContainer: {
    marginBottom: SPACING.sm,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  greetingBox: {
    flex: 1,
  },
  greetingSmall: {
    fontSize: 11,
    color: COLORS.primaryDark,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  greetingName: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
  },
  topRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  activeOrderPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.successLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.success,
    marginRight: 6,
  },
  activeOrderPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#065F46',
  },
  iconCircleButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  cartButton: {
    position: 'relative',
  },
  badgeCount: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: COLORS.primary,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeCountText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  promoBanner: {
    backgroundColor: COLORS.secondary,
    borderRadius: 14,
    padding: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.xs,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  promoLeft: {
    flex: 1,
  },
  promoTag: {
    color: COLORS.accent,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  promoTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    marginTop: 2,
  },
  promoSub: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 2,
  },
  promoBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    paddingVertical: 9,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
  },
  categoryScroll: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: SPACING.md,
    flexWrap: 'wrap',
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 6,
  },
  categoryPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  categoryPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  itemCountLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  // Professional horizontal food card layout
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  cardLeft: {
    flex: 1,
    paddingRight: 12,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  vegIndicator: {
    width: 14,
    height: 14,
    borderWidth: 1.5,
    borderColor: '#10B981',
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vegDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  nonVegIndicator: {
    width: 14,
    height: 14,
    borderWidth: 1.5,
    borderColor: '#EF4444',
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nonVegDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
  },
  popularBadge: {
    backgroundColor: COLORS.warningLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  popularText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#B45309',
  },
  spicyBadge: {
    backgroundColor: COLORS.dangerLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  spicyText: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.danger,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  cardDescription: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 3,
    lineHeight: 16,
  },
  cardMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 6,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.text,
  },
  reviewsCountText: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  priceText: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.primaryDark,
    marginTop: 6,
  },
  // Professional 1:1 Square food container on the right
  cardRight: {
    width: 100,
    alignItems: 'center',
  },
  cardSquareImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: '#E2E8F0',
  },
  addButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    marginTop: -14,
    ...SHADOWS.sm,
    gap: 2,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 10,
  },
  emptySub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  resetButton: {
    marginTop: 12,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  resetButtonText: {
    color: COLORS.primaryDark,
    fontWeight: '700',
    fontSize: 12,
  },
  floatingCartContainer: {
    position: 'absolute',
    bottom: 20,
    left: SPACING.md,
    right: SPACING.md,
    maxWidth: 720,
    alignSelf: 'center',
    width: '92%',
  },
  floatingCart: {
    backgroundColor: COLORS.secondary,
    borderRadius: 14,
    paddingHorizontal: SPACING.md,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...SHADOWS.md,
  },
  floatingCartLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  floatingCartBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingCartBadgeText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  floatingCartTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  floatingCartSub: {
    color: '#94A3B8',
    fontSize: 11,
  },
  floatingCartRight: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  checkoutText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
});
