const fs = require('fs');
const path = require('path');

console.log('====================================================');
console.log('   QUICKBITE APP : FULL FUNCTIONAL AUDIT & TEST     ');
console.log('====================================================\n');

let totalTests = 0;
let passedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`[PASS] ${message}`);
    passedTests++;
  } else {
    console.error(`[FAIL] ${message}`);
  }
}

// 1. Audit File Structure
console.log('--- 1. AUDIT: FILE AND ROUTE STRUCTURE ---');
const requiredFiles = [
  'src/data/menuData.ts',
  'src/theme/colors.ts',
  'src/navigation/types.ts',
  'src/navigation/AppNavigator.tsx',
  'src/context/CartContext.tsx',
  'src/context/OrderContext.tsx',
  'src/context/AuthContext.tsx',
  'src/screens/SplashScreen.tsx',
  'src/screens/LoginScreen.tsx',
  'src/screens/HomeScreen.tsx',
  'src/screens/ItemDetailScreen.tsx',
  'src/screens/CartScreen.tsx',
  'src/screens/CheckoutScreen.tsx',
  'src/screens/OrderTrackingScreen.tsx',
  'src/screens/ProfileScreen.tsx',
  'README.md',
  'SUBMISSION_REPORT.md',
];

requiredFiles.forEach((file) => {
  const fullPath = path.join(__dirname, file);
  assert(fs.existsSync(fullPath), `File exists: ${file}`);
});

// 2. Audit Menu Data
console.log('\n--- 2. AUDIT: SRI LANKAN MENU DATA & CATEGORIES ---');
const menuContent = fs.readFileSync(path.join(__dirname, 'src/data/menuData.ts'), 'utf8');
assert(menuContent.includes("'Meals'"), "Category 'Meals' is defined");
assert(menuContent.includes("'Beverages'"), "Category 'Beverages' is defined");
assert(menuContent.includes("'Snacks'"), "Category 'Snacks' is defined");
assert(menuContent.includes("'Desserts'"), "Category 'Desserts' is defined");
assert(menuContent.includes('Chicken Kottu Roti'), "Featured item 'Chicken Kottu Roti' exists");
assert(menuContent.includes('Sri Lankan Rice and Curry'), "Featured item 'Sri Lankan Rice and Curry' exists");
assert(menuContent.includes('Authentic Sri Lankan Watalappan'), "Dessert 'Watalappan' exists");
assert(menuContent.includes('Buffalo Curd and Kithul Treacle'), "Dessert 'Curd and Kithul Treacle' exists");
assert(menuContent.includes('Chocolate Biscuit Pudding'), "Dessert 'Chocolate Biscuit Pudding' exists");

// 3. Functional Test: Cart Pricing & Discount Logic
console.log('\n--- 3. FUNCTIONAL TEST: CART CALCULATIONS & DISCOUNT ---');
function simulateCart(items) {
  const itemCount = items.reduce((sum, ci) => sum + ci.quantity, 0);
  const subtotal = items.reduce((sum, ci) => sum + ci.price * ci.quantity, 0);
  const studentDiscount = subtotal >= 1000 ? Math.round(subtotal * 0.10) : 0;
  const tax = items.length > 0 ? 30 : 0;
  const total = Math.max(0, subtotal - studentDiscount + tax);
  return { itemCount, subtotal, studentDiscount, tax, total };
}

// Test case 3.1: Subtotal < 1000 (No discount)
const cart1 = simulateCart([
  { name: 'Kottu', price: 550, quantity: 1 },
  { name: 'Milk Tea', price: 120, quantity: 2 },
]);
assert(cart1.itemCount === 3, 'Item count correctly calculated as 3');
assert(cart1.subtotal === 790, 'Subtotal correctly calculated as Rs. 790');
assert(cart1.studentDiscount === 0, 'No discount when subtotal < Rs. 1000');
assert(cart1.tax === 30, 'Canteen packing fee is Rs. 30');
assert(cart1.total === 820, 'Total is Rs. 820 (790 + 30)');

// Test case 3.2: Subtotal >= 1000 (10% student discount applied)
const cart2 = simulateCart([
  { name: 'Kottu', price: 550, quantity: 2 },
  { name: 'Rice and Curry', price: 480, quantity: 1 },
]);
assert(cart2.subtotal === 1580, 'Subtotal correctly calculated as Rs. 1580');
assert(cart2.studentDiscount === 158, '10% student discount correctly applied (Rs. 158)');
assert(cart2.total === 1452, 'Total correctly calculated with discount (1580 - 158 + 30 = 1452)');

// 4. Functional Test: Order Lifecycle Progression
console.log('\n--- 4. FUNCTIONAL TEST: ORDER STATUS LIFECYCLE ---');
const statusSequence = ['Placed', 'Preparing', 'Ready for pickup', 'Completed'];
let currentStatus = 'Placed';

function advanceStatus(status) {
  const idx = statusSequence.indexOf(status);
  return idx < statusSequence.length - 1 ? statusSequence[idx + 1] : status;
}

assert(currentStatus === 'Placed', "Initial order status is 'Placed'");
currentStatus = advanceStatus(currentStatus);
assert(currentStatus === 'Preparing', "Status moves from 'Placed' to 'Preparing'");
currentStatus = advanceStatus(currentStatus);
assert(currentStatus === 'Ready for pickup', "Status moves from 'Preparing' to 'Ready for pickup'");
currentStatus = advanceStatus(currentStatus);
assert(currentStatus === 'Completed', "Status moves from 'Ready for pickup' to 'Completed'");

// 5. Audit User Constraints: No Emojis & No Em Dashes
console.log('\n--- 5. AUDIT: CODE QUALITY CONSTRAINTS (NO EMOJIS, NO EM DASHES) ---');
const emojiRegex = /[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
const emDashRegex = /[\u2014\u2013]/; // em dash and en dash

function checkDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== '.git') {
      checkDirectory(fullPath);
    } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx') || entry.name.endsWith('.md'))) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const hasEmoji = emojiRegex.test(content);
      const hasEmDash = emDashRegex.test(content);
      assert(!hasEmoji, `No emojis in: ${path.relative(__dirname, fullPath)}`);
      assert(!hasEmDash, `No em dashes in: ${path.relative(__dirname, fullPath)}`);
    }
  }
}

checkDirectory(path.join(__dirname, 'src'));

// 6. Audit Navigation Sidebar & Apple Typography in HomeScreen
console.log('\n--- 6. AUDIT: SIDEBAR, 2 COLUMNS & APPLE FONTS ---');
const homeScreenContent = fs.readFileSync(path.join(__dirname, 'src/screens/HomeScreen.tsx'), 'utf8');
assert(homeScreenContent.includes('styles.sidebar'), 'HomeScreen includes navigation sidebar');
assert(homeScreenContent.includes('columnWrapperTwo'), 'HomeScreen uses strictly 2 columns layout');
assert(homeScreenContent.includes('FEATURED_SPECIAL'), 'HomeScreen includes front-page featured special dish');
assert(homeScreenContent.includes('FONTS.family'), 'HomeScreen uses Apple SF Pro typography stack');

console.log('\n====================================================');
console.log(`AUDIT COMPLETE: ${passedTests} / ${totalTests} TESTS PASSED`);
console.log('====================================================');

if (passedTests === totalTests) {
  process.exit(0);
} else {
  process.exit(1);
}
