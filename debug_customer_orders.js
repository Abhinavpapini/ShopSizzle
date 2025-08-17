// Quick localStorage debug - Run this in browser console

console.log("=== DEBUGGING CUSTOMER ORDERS ===");

// Check all localStorage keys
const allKeys = Object.keys(localStorage);
console.log("All localStorage keys:", allKeys);

// Find order keys
const orderKeys = allKeys.filter(key => key.startsWith('orders_'));
console.log("Order keys found:", orderKeys);

// Check each order key
orderKeys.forEach(key => {
  console.log(`\n--- ${key} ---`);
  try {
    const orders = JSON.parse(localStorage.getItem(key) || '[]');
    console.log(`Number of orders: ${orders.length}`);
    orders.forEach((order, index) => {
      console.log(`Order ${index + 1}:`, {
        id: order.id,
        total: order.total,
        status: order.status,
        date: order.date,
        customerEmail: order.customerEmail,
        itemCount: order.items?.length || 0,
        paymentId: order.paymentId
      });
    });
  } catch (error) {
    console.error(`Error parsing ${key}:`, error);
  }
});

// Check if admin stats would pick these up
const mockAdminStats = () => {
  const orders = [];
  let totalRevenue = 0;
  
  orderKeys.forEach(key => {
    try {
      const userOrders = JSON.parse(localStorage.getItem(key) || '[]');
      const customerId = key.replace('orders_', '');
      
      userOrders.forEach(order => {
        orders.push({
          id: order.id,
          customerId,
          total: order.total || 0,
          status: order.status || 'confirmed'
        });
        totalRevenue += order.total || 0;
      });
    } catch (error) {
      console.error('Error in mock admin stats:', error);
    }
  });
  
  console.log('\n--- MOCK ADMIN STATS ---');
  console.log('Total orders:', orders.length);
  console.log('Total revenue:', totalRevenue);
  console.log('Orders:', orders);
};

mockAdminStats();
