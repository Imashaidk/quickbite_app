# QuickBite : Campus Food Ordering App (Cross-Platform MVP)

QuickBite is a mobile application developed with React Native and Expo for university canteens. It allows students and faculty to browse daily Sri Lankan food items, pre-order ahead of time, pay with their university meal balance or cash, and track kitchen status in real time to skip canteen queues between lectures.

## Features

### 1. Authentication and Guest Mode
- Student login with Student ID and university credentials.
- Instant Guest access mode for campus visitors.
- Quick test credentials auto-fill button for fast evaluation.

### 2. Sri Lankan Canteen Menu
- Categorized menu: Meals (Chicken Kottu, Rice and Curry, Egg Fried Rice, Pol Roti, String Hoppers), Beverages (Ceylon Milk Tea, Milo Dinosaur, King Coconut, Rose Faluda, Fresh Lime), Snacks (Crispy Fish Chinese Roll, Spicy Vegetable Roti, Ulundu Vadai, Chicken Puff Pastry), and Desserts (Watalappan, Curd and Kithul Treacle, Chocolate Biscuit Pudding, Caramel Custard Pudding, Sweet Coconut Pancake).
- Clean horizontal food cards with 1:1 square photos arranged in strictly 2 columns with a desktop navigation sidebar.
- Featured Daily Chef's Special (Canteen Lamprais) prominently showcased on the front page.
- Apple website typography (SF Pro Display / Text family stack) with crisp letter-spacing and weight hierarchy.

### 3. Shared Tray and State Management
- Global `CartContext` handling item additions, quantity modifications, special instructions, and tray clearance.
- Dynamic subtotal, packaging fee, and automatic 10% student discount on orders above Rs. 1000.
- State persists smoothly across all screens.

### 4. Checkout and Pickup Counters
- Selectable pickup time slots (ASAP in 8-10 mins, Next Lecture Break, After Class).
- Selectable canteen counters (Counter 1: Main Meals, Counter 2: Short Eats and Tea, Counter 3: Juices and Desserts).
- Payment options: University Student Smart Card, LankaQR, and Cash at Counter.

### 5. Live Kitchen Order Tracker
- Real-time timeline: Placed -> Preparing -> Ready for pickup -> Completed.
- Verification PIN code for kitchen collection counter.
- Interactive kitchen simulation controls for manual testing and automated state advance.

### 6. Student Profile and History
- Displays student details, ID, and campus card balance in LKR.
- Full order history with past orders, date, item breakdown, and status.
- One-tap re-order button.

---

## Tech Stack
- Framework: React Native with Expo (TypeScript)
- Navigation: React Navigation (Native Stack)
- State Management: React Context API (CartContext, OrderContext, AuthContext)
- Icons: Expo Vector Icons (Ionicons)
- Platforms: Android, iOS, and Web

---

## Project Structure
```
quickbite_app/
├── App.tsx                      # App root with context providers
├── src/
│   ├── data/
│   │   └── menuData.ts          # Sri Lankan canteen menu items in LKR
│   ├── theme/
│   │   └── colors.ts            # Design tokens, colors, and shadows
│   ├── context/
│   │   ├── AuthContext.tsx      # Student profile and guest session
│   │   ├── CartContext.tsx      # Persistent cart state and calculations
│   │   └── OrderContext.tsx     # Order placement and tracking lifecycle
│   ├── navigation/
│   │   ├── types.ts             # Route types and params
│   │   └── AppNavigator.tsx     # Native stack navigation flow
│   └── screens/
│       ├── SplashScreen.tsx
│       ├── LoginScreen.tsx
│       ├── HomeScreen.tsx
│       ├── ItemDetailScreen.tsx
│       ├── CartScreen.tsx
│       ├── CheckoutScreen.tsx
│       ├── OrderTrackingScreen.tsx
│       └── ProfileScreen.tsx
└── SUBMISSION_REPORT.md         # Activity sheet test cases and documentation
```

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the App
```bash
# Start Expo development server
npx expo start

# Run on Web browser
npx expo start --web

# Run on Android Emulator or connected device
npx expo start --android
```
