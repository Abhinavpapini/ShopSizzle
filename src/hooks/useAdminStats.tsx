import { useState, useEffect, useCallback } from "react";

interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  deliveredOrders: number;
  confirmedOrders: number;
  processingOrders: number;
  shippedOrders: number;
  cancelledOrders: number;
  totalCustomers: number;
}

interface OrderItem {
  id: string;
  title: string;
  price: number;
  qty: number;
}

interface AdminOrder {
  id: string;
  customerId: string;
  customerEmail: string;
  total: number;
  status: string;
  date: string;
  items: OrderItem[];
  paymentId?: string;
}

interface StoredOrder {
  id?: string;
  customerEmail?: string;
  total?: number;
  status?: string;
  date?: string;
  items?: OrderItem[];
  paymentId?: string;
}

export const useAdminStats = () => {
  const [stats, setStats] = useState<OrderStats>({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    confirmedOrders: 0,
    processingOrders: 0,
    shippedOrders: 0,
    cancelledOrders: 0,
    totalCustomers: 0,
  });
  
  const [allOrders, setAllOrders] = useState<AdminOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadAllOrders = useCallback(() => {
    setIsLoading(true);
    try {
      const orders: AdminOrder[] = [];
      const customerIds = new Set<string>();
      
      // Get all order keys from localStorage
      const allKeys = Object.keys(localStorage);
      const orderKeys = allKeys.filter(key => key.startsWith('orders_'));

      let totalRevenue = 0;
      const statusCounts = {
        confirmed: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0,
      };

      orderKeys.forEach(key => {
        try {
          const userOrders: StoredOrder[] = JSON.parse(localStorage.getItem(key) || '[]');
          const customerId = key.replace('orders_', '');
          customerIds.add(customerId);

          userOrders.forEach((order: StoredOrder) => {
            const orderData: AdminOrder = {
              id: order.id || `ORDER-${Date.now()}`,
              customerId,
              customerEmail: order.customerEmail || `user-${customerId.substring(0, 8)}@example.com`,
              total: order.total || 0,
              status: order.status || 'confirmed',
              date: order.date || new Date().toISOString(),
              items: order.items || [],
              paymentId: order.paymentId,
            };

            orders.push(orderData);
            totalRevenue += orderData.total;

            // Count status
            const status = orderData.status.toLowerCase();
            if (status in statusCounts) {
              statusCounts[status as keyof typeof statusCounts]++;
            }
          });
        } catch (error) {
          console.error('Error parsing orders for key:', key, error);
        }
      });

      // Sort orders by date (most recent first)
      orders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      const newStats: OrderStats = {
        totalOrders: orders.length,
        totalRevenue,
        pendingOrders: statusCounts.confirmed + statusCounts.processing,
        deliveredOrders: statusCounts.delivered,
        confirmedOrders: statusCounts.confirmed,
        processingOrders: statusCounts.processing,
        shippedOrders: statusCounts.shipped,
        cancelledOrders: statusCounts.cancelled,
        totalCustomers: customerIds.size,
      };

      setStats(newStats);
      setAllOrders(orders);
    } catch (error) {
      console.error('Error loading admin stats:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllOrders();

    // Reload when the page becomes visible
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadAllOrders();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [loadAllOrders]);

  return {
    stats,
    allOrders,
    isLoading,
    refreshStats: loadAllOrders,
  };
};
