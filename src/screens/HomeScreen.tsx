import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  SafeAreaView,
  Platform,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { MENU_ITEMS, MenuItem, CATEGORIES, CategoryType } from '../data/menuData';
import { COLORS, SPACING, SHADOWS, FONT_FAMILY } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useOrder } from '../context/OrderContext';

const FONT_STACK = FONT_FAMILY || 'System';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

// Featured Daily Canteen Special
const FEATURED_SPECIAL: MenuItem = {
  id: 'feat1',
  name: 'Canteen Special Lamprais with Seeni Sambol',
  category: 'Meals',
  price: 650,
  rating: 4.9,
  reviewsCount: 480,
  preparationTime: '5 mins',
  calories: '680 kcal',
  description: 'Authentic banana leaf baked samba rice infused with ghee and meat broth, accompanied by spicy chicken curry, ash plantain paahi, brinjal moju, sweet seeni sambol, and fried boiled egg.',
  image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80',
  isVegetarian: false,
  isSpicy: true,
  popular: true,
};

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { addToCart, itemCount, total } = useCart();
  const { user } = useAuth();
  const { activeOrder } = useOrder();
  const { width } = useWindowDimensions();

  // Desktop/tablet side bar active when screen is wide
  const isWideScreen = width >= 800;
  // Strictly 2 columns on wide screens, 1 column on phone
  const numColumns = isWideScreen ? 2 : 1;

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
      {/* Mobile Top Bar (only displayed on screens without the sidebar) */}
      {!isWideScreen && (
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
              <Ionicons name="person-outline" size={18} color={COLORS.secondary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.iconCircleButton, styles.cartButton]}
              onPress={() => navigation.navigate('Cart')}
              activeOpacity={0.7}
            >
              <Ionicons name="cart-outline" size={18} color={COLORS.primary} />
              {itemCount > 0 && (
                <View style={styles.badgeCount}>
                  <Text style={styles.badgeCountText}>{itemCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Featured Food Item on the Front Page */}
      <View style={styles.featuredCard}>
        <Image
          source={{ uri: FEATURED_SPECIAL.image }}
          style={styles.featuredImage}
          resizeMode="cover"
        />
        <View style={styles.featuredOverlay}>
          <View style={styles.featuredBadgeRow}>
            <View style={styles.chefBadge}>
              <Ionicons name="star" size={12} color="#FFFFFF" />
              <Text style={styles.chefBadgeText}>CHEF'S DAILY SPECIAL</Text>
            </View>
            <View style={styles.limitedBadge}>
              <Text style={styles.limitedBadgeText}>LIMITED BATCH</Text>
            </View>
          </View>

          <Text style={styles.featuredTitle}>{FEATURED_SPECIAL.name}</Text>
          <Text style={styles.featuredDesc} numberOfLines={2}>
            {FEATURED_SPECIAL.description}
          </Text>

          <View style={styles.featuredBottomRow}>
            <View>
              <Text style={styles.featuredPriceLabel}>Special Price</Text>
              <Text style={styles.featuredPrice}>Rs. {FEATURED_SPECIAL.price.toFixed(2)}</Text>
            </View>

            <View style={styles.featuredActionsRow}>
              <TouchableOpacity
                style={styles.featuredDetailBtn}
                onPress={() => navigation.navigate('ItemDetail', { item: FEATURED_SPECIAL })}
                activeOpacity={0.8}
              >
                <Text style={styles.featuredDetailBtnText}>Details</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.featuredAddBtn}
                onPress={() => handleQuickAdd(FEATURED_SPECIAL)}
                activeOpacity={0.85}
              >
                <Ionicons name="add" size={16} color="#FFFFFF" />
                <Text style={styles.featuredAddBtnText}>Add Special</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* Student Discount Announcement */}
      <View style={styles.promoBanner}>
        <View style={styles.promoLeft}>
          <Text style={styles.promoTag}>CAMPUS EXCLUSIVE</Text>
          <Text style={styles.promoTitle}>10% Student Discount on Orders Above Rs. 1000</Text>
          <Text style={styles.promoSub}>Valid across Meals, Short Eats, Beverages, and Desserts today</Text>
        </View>
        <View style={styles.promoBadge}>
          <Ionicons name="flash-outline" size={22} color="#FFFFFF" />
        </View>
      </View>

      {/* Search Input Bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={18} color={COLORS.textSecondary} style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search kottu, lamprais, rice and curry, watalappan..."
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
          if (cat === 'Desserts') iconName = 'ice-cream-outline';
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
                size={14}
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

  const renderMenuItem = ({ item }: { item: MenuItem }) => (
    <TouchableOpacity
      style={[
        styles.card,
        isWideScreen && styles.cardTwoColumn,
      ]}
      onPress={() => navigation.navigate('ItemDetail', { item })}
      activeOpacity={0.88}
    >
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

      <View style={styles.cardRight}>
        <Image source={{ uri: item.image }} style={styles.cardSquareImage} resizeMode="cover" />
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => handleQuickAdd(item)}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={15} color="#FFFFFF" />
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
          <Ionicons name="checkmark-circle-outline" size={17} color="#FFFFFF" />
          <Text style={styles.toastText}>{addedToast}</Text>
        </View>
      )}

      {/* Main Responsive Shell: Sidebar + Content */}
      <View style={styles.appShell}>
        {/* Navigation Sidebar for Wide / Desktop view */}
        {isWideScreen && (
          <View style={styles.sidebar}>
            {/* Brand Header */}
            <View style={styles.sidebarBrand}>
              <View style={styles.sidebarLogoBox}>
                <Ionicons name="restaurant" size={22} color="#FFFFFF" />
              </View>
              <View>
                <Text style={styles.sidebarBrandTitle}>QuickBite</Text>
                <Text style={styles.sidebarBrandSub}>University Canteen</Text>
              </View>
            </View>

            {/* Student Info Card */}
            <TouchableOpacity
              style={styles.sidebarStudentCard}
              onPress={() => navigation.navigate('Profile')}
              activeOpacity={0.8}
            >
              <Image source={{ uri: user.avatarUrl }} style={styles.sidebarAvatar} />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.sidebarStudentName} numberOfLines={1}>{user.name}</Text>
                <Text style={styles.sidebarStudentId}>ID: {user.studentId}</Text>
                <Text style={styles.sidebarBalance}>Balance: Rs. {user.campusCardBalance.toFixed(2)}</Text>
              </View>
            </TouchableOpacity>

            {/* Navigation Links */}
            <View style={styles.sidebarNav}>
              <TouchableOpacity
                style={[styles.sidebarNavItem, styles.sidebarNavItemActive]}
                activeOpacity={0.8}
              >
                <Ionicons name="restaurant" size={18} color={COLORS.primary} />
                <Text style={[styles.sidebarNavText, styles.sidebarNavTextActive]}>Menu Catalog</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.sidebarNavItem}
                onPress={() => navigation.navigate('Cart')}
                activeOpacity={0.8}
              >
                <Ionicons name="basket-outline" size={18} color={COLORS.textSecondary} />
                <Text style={styles.sidebarNavText}>Your Tray</Text>
                {itemCount > 0 && (
                  <View style={styles.sidebarBadge}>
                    <Text style={styles.sidebarBadgeText}>{itemCount}</Text>
                  </View>
                )}
              </TouchableOpacity>

              {activeOrder && (
                <TouchableOpacity
                  style={[styles.sidebarNavItem, styles.sidebarOrderAlert]}
                  onPress={() => navigation.navigate('OrderTracking', { orderId: activeOrder.id })}
                  activeOpacity={0.8}
                >
                  <View style={styles.pulseDot} />
                  <Text style={[styles.sidebarNavText, { color: COLORS.primaryDark, fontWeight: '700' }]}>
                    Track Order #{activeOrder.id}
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.sidebarNavItem}
                onPress={() => navigation.navigate('Profile')}
                activeOpacity={0.8}
              >
                <Ionicons name="person-outline" size={18} color={COLORS.textSecondary} />
                <Text style={styles.sidebarNavText}>Student Profile</Text>
              </TouchableOpacity>
            </View>

            {/* Canteen Hours info */}
            <View style={styles.sidebarFooter}>
              <View style={styles.hoursRow}>
                <Ionicons name="time-outline" size={14} color={COLORS.textMuted} />
                <Text style={styles.hoursText}>Counter Hours: 7:30 AM : 7:00 PM</Text>
              </View>
              <Text style={styles.sidebarVersion}>QuickBite MVP : Apple Design</Text>
            </View>
          </View>
        )}

        {/* Right Content Area: strictly 2 columns on wide screens, 1 column on phone */}
        <View style={styles.mainContent}>
          <FlatList
            data={filteredItems}
            keyExtractor={(item) => item.id}
            renderItem={renderMenuItem}
            ListHeaderComponent={renderHeader}
            contentContainerStyle={styles.listContent}
            numColumns={numColumns}
            key={`two-col-grid-${numColumns}`}
            columnWrapperStyle={numColumns === 2 ? styles.columnWrapperTwo : undefined}
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
        </View>
      </View>

      {/* Floating Bottom Cart Bar (visible on mobile screens) */}
      {!isWideScreen && itemCount > 0 && (
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
    top: 30,
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
    fontFamily: FONT_STACK,
  },
  appShell: {
    flex: 1,
    flexDirection: 'row',
  },
  // Apple-style sleek navigation sidebar
  sidebar: {
    width: 260,
    backgroundColor: COLORS.cardBackground,
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
    padding: SPACING.md,
    justifyContent: 'space-between',
    ...SHADOWS.sm,
  },
  sidebarBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: SPACING.md,
  },
  sidebarLogoBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sidebarBrandTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    fontFamily: FONT_STACK,
    letterSpacing: -0.3,
  },
  sidebarBrandSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontFamily: FONT_STACK,
  },
  sidebarStudentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 10,
    marginVertical: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sidebarAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  sidebarStudentName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    fontFamily: FONT_STACK,
  },
  sidebarStudentId: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontFamily: FONT_STACK,
  },
  sidebarBalance: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primaryDark,
    fontFamily: FONT_STACK,
    marginTop: 2,
  },
  sidebarNav: {
    flex: 1,
    gap: 6,
  },
  sidebarNavItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderRadius: 10,
    gap: 10,
  },
  sidebarNavItemActive: {
    backgroundColor: COLORS.primaryLight,
  },
  sidebarNavText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
    fontFamily: FONT_STACK,
    flex: 1,
  },
  sidebarNavTextActive: {
    color: COLORS.primaryDark,
    fontWeight: '700',
  },
  sidebarBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  sidebarBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    fontFamily: FONT_STACK,
  },
  sidebarOrderAlert: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  sidebarFooter: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.md,
  },
  hoursRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  hoursText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontFamily: FONT_STACK,
  },
  sidebarVersion: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 6,
    fontFamily: FONT_STACK,
  },
  // Main Content
  mainContent: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: 110,
    width: '100%',
  },
  // Strictly 2 columns on wide screens
  columnWrapperTwo: {
    gap: 14,
  },
  headerContainer: {
    marginBottom: SPACING.sm,
    width: '100%',
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
    fontFamily: FONT_STACK,
  },
  greetingName: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
    fontFamily: FONT_STACK,
    letterSpacing: -0.3,
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
    fontFamily: FONT_STACK,
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
    fontFamily: FONT_STACK,
  },
  // Featured Front-Page Food Item
  featuredCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 18,
    overflow: 'hidden',
    marginTop: SPACING.xs,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.md,
  },
  featuredImage: {
    width: '100%',
    height: 190,
    backgroundColor: '#CBD5E1',
  },
  featuredOverlay: {
    padding: SPACING.md,
  },
  featuredBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  chefBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
  },
  chefBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    fontFamily: FONT_STACK,
  },
  limitedBadge: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  limitedBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    fontFamily: FONT_STACK,
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    fontFamily: FONT_STACK,
    letterSpacing: -0.3,
  },
  featuredDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontFamily: FONT_STACK,
    marginTop: 4,
    lineHeight: 18,
  },
  featuredBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  featuredPriceLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontFamily: FONT_STACK,
  },
  featuredPrice: {
    fontSize: 19,
    fontWeight: '800',
    color: COLORS.primaryDark,
    fontFamily: FONT_STACK,
  },
  featuredActionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  featuredDetailBtn: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  featuredDetailBtnText: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '700',
    fontFamily: FONT_STACK,
  },
  featuredAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 10,
    gap: 4,
    ...SHADOWS.sm,
  },
  featuredAddBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    fontFamily: FONT_STACK,
  },
  promoBanner: {
    backgroundColor: COLORS.secondary,
    borderRadius: 14,
    padding: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    fontFamily: FONT_STACK,
  },
  promoTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 2,
    fontFamily: FONT_STACK,
  },
  promoSub: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 2,
    fontFamily: FONT_STACK,
  },
  promoBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
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
    fontFamily: FONT_STACK,
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
    paddingHorizontal: 13,
    paddingVertical: 8,
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
    fontFamily: FONT_STACK,
  },
  categoryPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontFamily: FONT_STACK,
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
    fontFamily: FONT_STACK,
    letterSpacing: -0.3,
  },
  itemCountLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
    fontFamily: FONT_STACK,
  },
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
  cardTwoColumn: {
    flex: 1,
    minWidth: '47%',
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
    fontFamily: FONT_STACK,
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
    fontFamily: FONT_STACK,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    fontFamily: FONT_STACK,
  },
  cardDescription: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 3,
    lineHeight: 16,
    fontFamily: FONT_STACK,
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
    fontFamily: FONT_STACK,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.text,
    fontFamily: FONT_STACK,
  },
  reviewsCountText: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontFamily: FONT_STACK,
  },
  priceText: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.primaryDark,
    marginTop: 6,
    fontFamily: FONT_STACK,
  },
  cardRight: {
    width: 96,
    alignItems: 'center',
  },
  cardSquareImage: {
    width: 96,
    height: 96,
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
    fontFamily: FONT_STACK,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    width: '100%',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 10,
    fontFamily: FONT_STACK,
  },
  emptySub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
    fontFamily: FONT_STACK,
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
    fontFamily: FONT_STACK,
  },
  floatingCartContainer: {
    position: 'absolute',
    bottom: 20,
    left: SPACING.md,
    right: SPACING.md,
    alignSelf: 'center',
    width: '95%',
    maxWidth: 900,
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
    fontFamily: FONT_STACK,
  },
  floatingCartTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    fontFamily: FONT_STACK,
  },
  floatingCartSub: {
    color: '#94A3B8',
    fontSize: 11,
    fontFamily: FONT_STACK,
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
    fontFamily: FONT_STACK,
  },
});
