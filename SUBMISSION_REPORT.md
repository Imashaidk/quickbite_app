# QuickBite Campus Food Ordering App : Activity Submission Report

- Project Name: quickbite_app
- Student / Team: University Canteen Mobile Development Team
- Framework: React Native (Expo SDK 57 + TypeScript)
- GitHub Repository: https://github.com/Imashaidk/quickbite_app.git
- Target Platforms: Android, iOS, and Web (Single shared codebase)

---

## Part A : Environment Setup
1. Framework: React Native with Expo SDK 57 and TypeScript.
2. CLI verification: Verified with Node.js v25.9.0 and npm 11.12.1.
3. Project Initialization: Created project structure under `quickbite_app` with Git version control initialized.

---

## Part B : UI Screen Architecture

The application implements all 8 required screens arranged in a seamless linear and cross-linked route hierarchy:
1. Splash Screen (`src/screens/SplashScreen.tsx`):
   Branded landing interface highlighting the university canteen service with options to "Get Started" or "Browse Menu as Guest".
2. Login / Guest-Access Screen (`src/screens/LoginScreen.tsx`):
   Allows student authentication with Student ID or email, form input validation, demo credential autofill, and guest access mode.
3. Home Screen (`src/screens/HomeScreen.tsx`):
   Displays categories (All, Meals, Beverages, Snacks, Desserts), real-time search bar, front-page featured Chef's daily dish (Canteen Lamprais), Apple SF Pro typography, and horizontal food cards featuring 1:1 proportional food photos arranged in strictly 2 columns alongside a dedicated desktop navigation sidebar.
4. Item Detail Screen (`src/screens/ItemDetailScreen.tsx`):
   Contains proportional hero food photo, dietary indicators (Vegetarian, Spicy, Campus Favorite), preparation time, calories, quantity selector, special preparation instructions, and dynamic subtotal.
5. Cart Screen (`src/screens/CartScreen.tsx`):
   Displays selected canteen meals, quantity adjustment steppers, item removal, bill breakdown with automatic 10% student discount for orders above Rs. 1000, and checkout trigger.
6. Checkout Screen (`src/screens/CheckoutScreen.tsx`):
   Allows selecting pickup time slots (ASAP, Lecture Break, After Class), collection counters (Counter 1: Main Meals, Counter 2: Short Eats and Tea, Counter 3: Juices), and payment methods (Student Smart Card, LankaQR, Cash).
7. Order Tracking Screen (`src/screens/OrderTrackingScreen.tsx`):
   Displays generated order ID, verification PIN, live status progression (Placed -> Preparing -> Ready for pickup -> Completed), and interactive kitchen simulator controls for manual and automated status transitions.
8. Profile Screen (`src/screens/ProfileScreen.tsx`):
   Displays student profile details, campus smart card balance (Rs. 2,500.00), active order shortcuts, and past order history with one-tap re-order.

---

## Part C : State, Logic and Data Management

1. Shared Cart State (`src/context/CartContext.tsx`):
   Global state management via React Context API. The cart state persists when navigating between all screens.
   - `itemCount`: dynamically calculated as total quantity across items.
   - `subtotal`: dynamically calculated as sum of unit price multiplied by quantity.
   - `studentDiscount`: 10% discount automatically applied when subtotal reaches or exceeds Rs. 1000.
   - `tax`: flat canteen packing fee of Rs. 30.

2. Order Lifecycle Simulation (`src/context/OrderContext.tsx`):
   Simulates full canteen order execution:
   - Unique order ID generation (e.g., `#QB-4819`).
   - Secure counter pickup PIN generation.
   - Four-stage lifecycle progression: `Placed` -> `Preparing` -> `Ready for pickup` -> `Completed`.
   - Dedicated "Advance Next State" trigger and automated timer simulation.

3. User Session Management (`src/context/AuthContext.tsx`):
   Maintains user profile attributes, campus card balance, and guest vs student session modes.

---

## Part D : Test Log and Results

The following 6 test cases were designed and executed to validate functional and non-functional requirements:

### Test Case 1: Screen Navigation and Route Transition
- Objective: Verify seamless transition through Splash -> Login -> Home -> Item Detail -> Cart -> Checkout -> Order Tracking -> Profile.
- Preconditions: App running on Metro bundler / emulator.
- Execution Steps:
  1. Open app, observe Splash screen.
  2. Tap "Get Started" to navigate to Login.
  3. Tap "Sign In as Student" to navigate to Home.
  4. Tap on "Chicken Kottu Roti" card to open Item Detail.
  5. Tap Cart icon to open Cart screen.
  6. Tap "Proceed to Checkout" to open Checkout screen.
  7. Tap "Confirm and Place Order" to open Order Tracking screen.
- Expected Result: All screen transitions occur within 1-2 seconds with zero navigation crashes.
- Actual Result: Screen transitions operated smoothly with active header state updates.
- Status: PASS

### Test Case 2: Cart Logic and Dynamic Price Calculations
- Objective: Verify that adding items, modifying quantities, and removing items dynamically recalculates subtotal, discount, and total.
- Preconditions: User on Home or Item Detail screen.
- Execution Steps:
  1. Add 1x Chicken Kottu Roti (Rs. 550.00).
  2. Add 2x Ceylon Kiri The (Rs. 120.00 each = Rs. 240.00). Subtotal is Rs. 790.00.
  3. Increase Kottu quantity to 2 in Cart. Subtotal updates to Rs. 1340.00.
  4. Verify that 10% student discount (Rs. 134.00) is triggered since subtotal >= Rs. 1000.
  5. Verify total equals: Rs. 1340 - Rs. 134 + Rs. 30 = Rs. 1236.00.
- Expected Result: Subtotal, student discount, and total update in real time.
- Actual Result: State updated instantly and persisted across screen navigation.
- Status: PASS

### Test Case 3: Form and Input Validation on Login Screen
- Objective: Verify that the Login screen restricts invalid submissions and provides informative error messaging.
- Preconditions: User on Login screen.
- Execution Steps:
  1. Clear Student ID field and tap "Sign In as Student".
  2. Verify error message: "Please enter your Student ID or University Email."
  3. Enter Student ID, clear password, and tap "Sign In as Student".
  4. Verify error message: "Password must be at least 4 characters."
  5. Tap "Tap here to auto-fill sample Student credentials" and tap "Sign In as Student".
- Expected Result: Invalid entries show red validation alert; valid credentials route to Home.
- Actual Result: Validation alerts displayed correctly and demo fill permitted successful login.
- Status: PASS

### Test Case 4: Category Filtering and Menu Search
- Objective: Verify that category pills and text search filter the menu items correctly.
- Preconditions: User on Home screen with 14 Sri Lankan menu items.
- Execution Steps:
  1. Tap "Beverages" category pill. Verify only beverage items are listed (Ceylon Milk Tea, Milo, King Coconut, Faluda, Lime Juice).
  2. Tap "Snacks" category pill. Verify short eats are displayed (Fish Roll, Vegetable Roti, Ulundu Vadai, Puff Pastry).
  3. Tap "All" category pill to restore complete menu.
  4. Type "kottu" into the search bar.
- Expected Result: Menu list immediately narrows to matching items; clearing search restores list.
- Actual Result: Real-time filtering executed instantaneously with zero lag.
- Status: PASS

### Test Case 5: Order Placement and Kitchen Status Progression
- Objective: Verify simulated order creation and step progression through at least two status states.
- Preconditions: Cart has at least one item.
- Execution Steps:
  1. Complete Checkout screen by choosing pickup time, canteen counter, and payment method.
  2. Tap "Confirm and Place Order".
  3. Verify Order Tracking screen generates unique Order ID (e.g. `#QB-7842`), estimated prep time, and pickup PIN.
  4. Tap "Advance Next State" button once. Status changes from "Placed" to "Preparing".
  5. Tap "Advance Next State" button a second time. Status advances to "Ready for pickup".
- Expected Result: Order status advances through Placed -> Preparing -> Ready for pickup -> Completed with timeline indicators updating color and checkmarks.
- Actual Result: State transition executed properly and synchronized with the OrderContext.
- Status: PASS

### Test Case 6: Layout Responsiveness and Image Aspect Ratios
- Objective: Verify that the UI adapts to mobile phone and tablet/web widths, and food photos remain undistorted in 1:1 proportion.
- Preconditions: App previewed on mobile screen width (375-430px) and tablet/desktop width (768px+).
- Execution Steps:
  1. Inspect menu item cards in list view.
  2. Observe image dimensions (100x100px square, 1:1 ratio, border radius 12, cover mode).
  3. Inspect Item Detail hero image banner (250px height, cover mode, no horizontal stretching).
  4. Verify that touch targets for stepper buttons (+ and -) and "+ Add" pills remain accessible.
- Expected Result: Food photos render with crisp proportions; content remains centered with maximum reading width on tablet and desktop.
- Actual Result: Responsive layout displayed cleanly without image distortion or horizontal overflow.
- Status: PASS

---

## Key Code Snippets with Explanation

### 1. Dynamic Cart Calculations (`src/context/CartContext.tsx`)
```typescript
const subtotal = useMemo(() => {
  return items.reduce((sum, ci) => sum + ci.item.price * ci.quantity, 0);
}, [items]);

// University student discount: 10% on orders above Rs. 1000
const studentDiscount = useMemo(() => {
  return subtotal >= 1000 ? Math.round(subtotal * 0.10) : 0;
}, [subtotal]);

// Canteen packing fee: flat Rs. 30 when tray has items
const tax = useMemo(() => {
  return items.length > 0 ? 30 : 0;
}, [items]);

const total = useMemo(() => {
  return Math.max(0, subtotal - studentDiscount + tax);
}, [subtotal, studentDiscount, tax]);
```
*Explanation*: Implements reactive state calculation using React's `useMemo` hook. Whenever item quantities change in the shared tray, the subtotal, student discount eligibility, packing fee, and final bill amount are recalculated instantly.

### 2. Status Progression Lifecycle (`src/context/OrderContext.tsx`)
```typescript
const advanceOrderStatus = (orderId: string) => {
  const statusSequence: OrderStatus[] = ['Placed', 'Preparing', 'Ready for pickup', 'Completed'];

  const updateStatus = (current: Order): Order => {
    const idx = statusSequence.indexOf(current.status);
    if (idx >= 0 && idx < statusSequence.length - 1) {
      const nextStatus = statusSequence[idx + 1];
      const nextMinutes = nextStatus === 'Preparing' ? 5 : nextStatus === 'Ready for pickup' ? 1 : 0;
      return {
        ...current,
        status: nextStatus,
        estimatedMinutes: nextMinutes,
      };
    }
    return current;
  };

  if (activeOrder && activeOrder.id === orderId) {
    setActiveOrder((prev) => (prev ? updateStatus(prev) : null));
  }
};
```
*Explanation*: Simulates the canteen kitchen order lifecycle. As canteen staff acknowledge and prepare the order, the status moves sequentially through `Placed` -> `Preparing` -> `Ready for pickup` -> `Completed`, while dynamically updating the remaining estimated pickup time.
