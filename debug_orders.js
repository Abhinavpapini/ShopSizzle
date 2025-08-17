// 🔧 Debug Orders - Run this in browser console

console.log("=== DEBUGGING ORDERS ===");

// 1. Check all localStorage keys
console.log("All localStorage keys:");
Object.keys(localStorage).forEach(key => {
    console.log(`- ${key}:`, localStorage.getItem(key)?.length || 0, 'characters');
});

// 2. Find order keys
const orderKeys = Object.keys(localStorage).filter(key => key.startsWith('orders_'));
console.log("\nFound order keys:", orderKeys);

// 3. Display all orders
orderKeys.forEach(key => {
    try {
        const orders = JSON.parse(localStorage.getItem(key) || '[]');
        console.log(`\n${key}:`, orders.length, 'orders');
        orders.forEach((order, index) => {
            console.log(`  Order ${index + 1}:`, {
                id: order.id,
                total: order.total,
                status: order.status,
                date: order.date,
                itemCount: order.items?.length || 0
            });
        });
    } catch (error) {
        console.error(`Error parsing ${key}:`, error);
    }
});

// 4. Check current user info
const clerkUser = localStorage.getItem('clerk-user');
if (clerkUser) {
    try {
        const user = JSON.parse(clerkUser);
        console.log('\nCurrent user ID:', user.id);
        console.log('Expected order key:', `orders_${user.id}`);
    } catch (error) {
        console.log('\nNo valid clerk user found');
    }
}

// 5. Check role assignments
const roleKeys = Object.keys(localStorage).filter(key => key.startsWith('user_role_'));
console.log("\nRole assignments:", roleKeys.map(key => ({
    email: key.replace('user_role_', ''),
    role: localStorage.getItem(key)
})));

console.log("\n=== END DEBUG ===");
