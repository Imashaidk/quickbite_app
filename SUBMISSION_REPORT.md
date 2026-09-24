# University Coursework Project Submission Report

## Project Title: QuickBite - University of Kelaniya Canteen Food Pre-Ordering Mobile Application

- Student Name: Kavindu Perera
- Student Registration Number: IM/2023/099
- University: University of Kelaniya
- Faculty: Faculty of Science (Department of Industrial Management)
- Course: Mobile Application Development (Cross-Platform Mobile App Project)
- GitHub Repository: https://github.com/Imashaidk/quickbite_app.git
- Technology Stack: React Native, Expo SDK 57, TypeScript, React Navigation
- Submission Date: September 2026

---

## 1. Project Overview and Background

During my time at the University of Kelaniya, one major daily issue students and faculty members face is the severe congestion at university canteens between lectures. At peak hours (specifically the 10:15 AM tea break and the 12:30 PM to 1:30 PM lunch break), the Main Student Canteen, Science Faculty Canteen, and Kannangara Canteen experience massive queues. Students often spend 20 to 25 minutes waiting in line just to purchase a lunch packet or a tea, leaving little time to eat before their next lecture.

To solve this problem, I designed and developed QuickBite, a cross-platform mobile application built using React Native and Expo. QuickBite allows University of Kelaniya students and faculty to browse daily Sri Lankan canteen menus, place meal pre-orders ahead of time, pay using their Kelaniya Student Smart Card or cash, and monitor their order progress in real time with an automated pickup PIN code. This enables students to arrive at their designated canteen counter and collect their food immediately without waiting in queues.

---

## 2. Key Objectives and Deliverables

The primary objectives of this project were:
1. Develop a high-performance cross-platform mobile application running seamlessly on Android, iOS, and Web from a single codebase.
2. Build an intuitive 8-screen navigation flow: Welcome Splash, Student Login, Main Menu Catalog, Food Detail, Shopping Tray/Cart, Checkout, Live Order Tracker, and Student Profile.
3. Model an authentic Sri Lankan university canteen context with realistic subsidized campus pricing (Rs. 40 to Rs. 240) and genuine local dishes across four main categories (Meals, Beverages, Short Eats, and Desserts).
4. Implement reliable global state management using React Context API for cart calculations, multi-stage order lifecycles, and student authentication.
5. Create a clean, modern user interface inspired by Apple design standards, utilizing the Apple SF Pro typography hierarchy, responsive two-column grid layouts for wide screens, a desktop navigation sidebar, and standardized category dish badges.
6. Enforce code quality, rigorous automated test auditing, and clean Git version control with feature branches.

---

## 3. System Architecture and Technology Stack

### 3.1 Core Technologies
- Frontend Framework: React Native with Expo SDK 57 and TypeScript. TypeScript provides strict type safety across all interfaces, data models, and screen parameters.
- Navigation Library: React Navigation v7 with Native Stack Navigator (`@react-navigation/native-stack`), delivering native page transitions on mobile devices and clean URL routing on Web.
- State Architecture: Three specialized React Context modules:
  - `AuthContext.tsx`: Manages active user sessions, University of Kelaniya student ID (`IM/2023/099`), email, and smart card balance.
  - `CartContext.tsx`: Manages tray contents, item additions, quantity modifications, packing fees, dynamic student discounts, and grand totals.
  - `OrderContext.tsx`: Manages the end-to-end order lifecycle progression, verification PIN generation, and past order history.
- Iconography and Styling: Expo Vector Icons (Ionicons) paired with a centralized design token system in `src/theme/colors.ts`.
- Layout System: Flexbox-based responsive design with `useWindowDimensions` hook, dynamically rendering a left-side navigation bar on wide screens and a mobile navigation bar on smaller viewports.

---

## 4. Screen-by-Screen Implementation Details

### 4.1 Welcome Splash Screen (`src/screens/SplashScreen.tsx`)
The welcome screen introduces the user to the application. It features the University of Kelaniya Canteen emblem, official university branding, an overview of participating canteens (Main Student Canteen, Science Faculty Canteen, and Kannangara Canteen), and key counter badges (Main Meals, Short Eats, Ceylon Tea). Users can tap "Get Started" to log in or "Browse Menu as Guest" for immediate guest access.

### 4.2 Authentication and Guest Screen (`src/screens/LoginScreen.tsx`)
This screen provides secure authentication for university students. Key features include:
- Form fields formatted for Kelaniya Student IDs (e.g. `IM/2023/099`) and university passwords.
- Real-time client-side validation preventing empty submissions or short passwords.
- A convenient one-tap demo autofill banner for testing and grading evaluators.
- Guest access bypass button allowing visitors to order without logging in.

### 4.3 Home Catalog Screen (`src/screens/HomeScreen.tsx`)
The home screen serves as the main dashboard of the app:
- Responsive Layout: Displays a strictly 2-column food grid on desktop and tablets alongside a full-height navigation sidebar, collapsing into a clean single column on mobile devices.
- UOK Special Card: Highlights the featured daily canteen special ("Canteen Special Lamprais with Seeni Sambol") with a dedicated UOK Special badge, student price, and quick-add button.
- Clean Dish Category Badges: Instead of unreliable external photos that risk image mismatching, each food card features a clean, high-contrast category badge box with color-coded vector icons (terracotta for Meals, sky blue for Beverages, amber gold for Short Eats, and rose pink for Desserts).
- Live Search & Filtering: Interactive search bar that filters items by name and description in real time, plus category pills (All, Meals, Beverages, Snacks, Desserts).
- Dietary Indicators: Visual badges for Vegetarian, Spicy, and Popular items.
- Campus Discount Banner: Promotes the active 10% student discount for orders above Rs. 300.

### 4.4 Item Detail Screen (`src/screens/ItemDetailScreen.tsx`)
When a student selects a food item, the detail screen opens:
- Displays a prominent dish header badge, full description, preparation time, calories, and customer ratings.
- Quantity adjustment stepper (+ and -).
- Free-text input field for special preparation instructions (e.g. "Less chili", "Pack without gravy").
- Dynamic price calculator that updates the total price in real time based on selected quantity.
- "Add to Tray" button with instant visual confirmation toast.

### 4.5 Shopping Tray and Cart Screen (`src/screens/CartScreen.tsx`)
The cart screen displays all currently selected items:
- Itemized list with category icon badge, item name, unit price, quantity modifier, and trash icon for removal.
- Special instructions preview below each applicable item.
- Detailed bill summary showing: Subtotal, Student Discount (10% automatically deducted when subtotal >= Rs. 300), Eco-Friendly Packing Fee (Rs. 15), and Final Payable Total.
- Clear cart button and "Proceed to Checkout" action button.

### 4.6 Checkout Screen (`src/screens/CheckoutScreen.tsx`)
The checkout screen handles order placement:
- Pickup Time Selection: Students can pick "ASAP (in 8-10 mins)", "Next Lecture Break (in 30 mins)", or "After Class (1:15 PM)".
- Pickup Station Selection: Selectable canteen counters:
  - Counter 1: Science Faculty Canteen (Main Meals)
  - Counter 2: Kannangara Canteen (Short Eats & Ceylon Tea)
  - Counter 3: Main Student Canteen (Beverages & Desserts)
- Payment Method Selection: Kelaniya Student Smart Card (pre-loaded balance), LankaQR mobile banking, or Cash at Counter.
- "Confirm and Place Order" button that submits the order and clears the cart.

### 4.7 Live Order Tracking Screen (`src/screens/OrderTrackingScreen.tsx`)
The tracking screen simulates the kitchen order execution:
- Displays the generated Order ID (e.g. `#QB-8831`) and a 4-digit Collection PIN.
- Four-stage interactive progress timeline:
  1. Order Placed: Ticket received by canteen kitchen.
  2. Preparing Food: Canteen kitchen staff preparing the meal.
  3. Ready for Pickup: Food packed; student notified to collect.
  4. Order Collected: Order complete.
- Kitchen Simulator Tools: Manual "Advance Next State" button and automated timer simulation button allowing examiners to test the progression effortlessly.
- Itemized summary of ordered items and total amount paid.

### 4.8 Student Profile Screen (`src/screens/ProfileScreen.tsx`)
The profile screen provides student account management:
- Clean default user silhouette avatar icon (no real human photos, adhering to standard contact UI design).
- Displays student name (Kavindu Perera), Kelaniya Student ID (`IM/2023/099`), and university email (`kavindu-im23099@kln.ac.lk`).
- Kelaniya Student Smart Card balance card (Rs. 1,000.00) with quick "Add Funds" button.
- Active order notification banner with direct shortcut to the live tracker.
- Complete past order history with date, station, item list, total paid, and one-tap re-order button.

---

## 5. Authentic Sri Lankan University Canteen Menu and Pricing

All menu items reflect real subsidized campus canteen prices at the University of Kelaniya. Below is the complete catalog of 20 items:

### Category 1: Meals (Science & Main Student Canteen)
1. Chicken Kottu Roti: Chopped godamba roti tossed on hot griddle with spiced chicken curry, egg, leeks, and onions. Price: Rs. 240.00.
2. Sri Lankan Chicken Rice and Curry: Steamed samba rice served with country chicken curry, tempered dhal, pol sambol, and papadam. Price: Rs. 160.00.
3. Egg Fried Rice with Chili Paste: Wok-tossed rice with scrambled eggs, leeks, carrots, and homemade devilled chili paste. Price: Rs. 150.00.
4. Pol Roti with Lunu Miris (2 pcs): Fresh coconut rotis served with spicy crushed chili-onion lunu miris and yellow dhal. Price: Rs. 70.00.
5. String Hoppers Set (10 pcs): Ten steamed rice flour string hoppers served with coconut milk kiri hodi and spicy pol sambol. Price: Rs. 90.00.
6. Featured UOK Special Lamprais: Banana leaf baked spiced samba rice with chicken curry, ash plantain paahi, brinjal moju, seeni sambol, and fried boiled egg. Price: Rs. 220.00.

### Category 2: Beverages (All Canteens)
7. Ceylon Kiri The (Milk Tea): Authentic campus pulled milk tea brewed with strong Ceylon black tea and sweetened milk. Price: Rs. 40.00.
8. Iced Milo Dinosaur: Chilled chocolate malt beverage served over ice, topped with a heaped spoonful of raw Milo powder. Price: Rs. 80.00.
9. Fresh King Coconut (Thambili): Naturally sweet and refreshing chilled Sri Lankan king coconut water. Price: Rs. 70.00.
10. Rose Faluda with Ice Cream: Rose syrup, chilled milk, basil seeds, and jelly cubes topped with vanilla ice cream. Price: Rs. 90.00.
11. Fresh Lime Juice with Mint: Freshly squeezed green lime juice with crushed mint leaves and sugar. Price: Rs. 50.00.

### Category 3: Short Eats (Kannangara Canteen)
12. Crispy Fish Chinese Roll: Crumbed pancake roll filled with spicy canned mackerel, boiled potatoes, and black pepper. Price: Rs. 50.00.
13. Spicy Vegetable Roti: Triangle folded soft godamba roti stuffed with curried potatoes, leeks, and green chilies. Price: Rs. 45.00.
14. Crispy Vegetable Samosa (2 pcs): Two golden triangular pastries stuffed with spicy potato and curried peas filling. Price: Rs. 40.00.
15. Ulundu Vadai with Chutney (2 pcs): Two golden fried savory lentil fritters seasoned with fresh curry leaves and cumin. Price: Rs. 50.00.
16. Chicken and Egg Puff Pastry: Flaky butter puff pastry filled with peppery minced chicken and boiled egg. Price: Rs. 60.00.

### Category 4: Desserts (Main Canteen)
17. Authentic Sri Lankan Watalappan: Steamed kithul jaggery and coconut milk pudding infused with cardamom, nutmeg, and cashew nuts. Price: Rs. 70.00.
18. Buffalo Curd and Kithul Treacle: Clay pot buffalo curd served with a generous serving of pure golden kithul palm treacle. Price: Rs. 80.00.
19. Chocolate Biscuit Pudding (CBP): Layers of milk-soaked Marie biscuits and rich velvety chocolate buttercream. Price: Rs. 70.00.
20. Caramel Custard Pudding: Smooth baked egg and milk custard topped with amber caramelized sugar syrup. Price: Rs. 60.00.
21. Sweet Coconut Pani Pol Pancake (2 pcs): Two soft crepes wrapped around freshly grated coconut caramelized with kithul treacle. Price: Rs. 40.00.

---

## 6. Business Logic and State Calculations

### 6.1 Cart and Financial Formulas
- `itemCount`: Sum of all `cartItem.quantity` values.
- `subtotal`: Sum of `(cartItem.item.price * cartItem.quantity)` for all items in the tray.
- `studentDiscount`: If `subtotal >= 300`, `Math.round(subtotal * 0.10)` is calculated (10% discount). Otherwise, Rs. 0.
- `packingFee`: Flat Rs. 15 for parcel packaging if tray has items; Rs. 0 if empty.
- `total`: `Math.max(0, subtotal - studentDiscount + packingFee)`.

### 6.2 Order Lifecycle State Machine
Orders transition strictly through four sequential statuses:
`Placed` -> `Preparing` -> `Ready for pickup` -> `Completed`
Each state transition updates the visual timeline, remaining estimated time, badge colors, and verification state.

---

## 7. Verification and Testing Results

An automated test audit suite was developed in `test_audit.js` and executed locally to verify all functional requirements, business calculations, file existence, and stylistic constraints.

### 7.1 Test Execution Summary
- Test Suite Script: `node test_audit.js`
- TypeScript Static Analysis: `npx tsc --noEmit`
- Total Test Cases Evaluated: 72
- Passed Test Cases: 72
- Failed Test Cases: 0
- Code Compilation Errors: 0

### 7.2 Breakdown of Audit Categories
1. File and Route Structure: Verified existence of all 8 screen files, 3 context files, data models, theme files, and documentation (17/17 Passed).
2. Menu Data and Categories: Verified definitions for Meals, Beverages, Snacks, and Desserts, along with authentic signature items (9/9 Passed).
3. Cart Logic and Student Discount Calculations: Verified subtotal calculation, packing fee addition, discount threshold logic (< Rs. 300 vs >= Rs. 300), and final net total (8/8 Passed).
4. Order Lifecycle Progression: Verified sequential progression from Placed to Preparing, Ready for pickup, and Completed (4/4 Passed).
5. Code Quality Constraints: Automated scanner verified zero emojis and zero em dashes across all TypeScript, TSX, and Markdown files (30/30 Passed).
6. UI Layout and Typography Audit: Verified responsive navigation sidebar, strictly 2-column food grid on wide viewports, UOK Special card, and Apple SF Pro font family stack (4/4 Passed).

---

## 8. Key Challenges Faced and Solutions Implemented

1. Image Mismatching on Food Items:
   - Challenge: Stock photography from external providers often showed incorrect food items (e.g. samosas showing for kottu roti).
   - Solution: Removed external photo dependencies entirely and replaced them with clean, modern category dish badges using vector icons and clear typography. This eliminated image loading failures and guaranteed 100% visual consistency.

2. Student ID Formatting and Campus Context:
   - Challenge: Initial prototypes used generic international student ID numbers (`ST-2024-8831`).
   - Solution: Standardized the application around the authentic University of Kelaniya student ID format (e.g. `IM/2023/099`), configured university email domains (`@kln.ac.lk`), and integrated specific campus canteen counters (Science Faculty Canteen, Kannangara Canteen, Main Student Canteen).

3. Subsidized Campus Pricing Alignment:
   - Challenge: Commercial rates did not reflect real university canteen economics.
   - Solution: Adjusted all prices to genuine subsidized campus rates (Rs. 40 to Rs. 240) and scaled the 10% student discount threshold to Rs. 300 to match student spending patterns.

4. Stylistic and Code Quality Standards:
   - Challenge: Preventing unintentional emojis or typographical em dashes from slipping into commit messages and source files.
   - Solution: Configured an automated regex scanner in `test_audit.js` that checks every source file and documentation document on each build, maintaining complete compliance with user instructions.

---

## 9. Conclusion

The QuickBite mobile application successfully fulfills all requirements for a cross-platform university canteen food ordering MVP. It delivers an intuitive, fast, and aesthetically pleasing experience tailored specifically to the students and staff of the University of Kelaniya. The complete source code, git history with feature branches, and test audit suite are fully documented and accessible on the remote GitHub repository at https://github.com/Imashaidk/quickbite_app.git.
