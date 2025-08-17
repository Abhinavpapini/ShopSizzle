import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Button } from '../ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

interface DebugInfo {
  currentUser: {
    id: string | undefined;
    email: string | undefined;
    isSignedIn: boolean;
  };
  allKeys: string[];
  orderKeys: string[];
  roleKeys: string[];
  ordersData: Record<string, unknown>;
  roleAssignments: Record<string, string | null>;
  expectedOrderKey?: string;
  hasOrdersForCurrentUser?: boolean;
}

export const OrderDebugger = () => {
  const { user } = useUser();
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);

  const runDebug = React.useCallback(() => {
    const debug: DebugInfo = {
      currentUser: {
        id: user?.id,
        email: user?.emailAddresses?.[0]?.emailAddress,
        isSignedIn: !!user
      },
      allKeys: [],
      orderKeys: [],
      roleKeys: [],
      ordersData: {},
      roleAssignments: {}
    };
    
    
    // 1. Current user info - already set above
    
    // 2. All localStorage keys
    debug.allKeys = Object.keys(localStorage);
    
    // 3. Order keys specifically
    debug.orderKeys = debug.allKeys.filter((key: string) => key.startsWith('orders_'));
    
    // 4. Role keys
    debug.roleKeys = debug.allKeys.filter((key: string) => key.startsWith('user_role_'));
    
    // 5. All orders data
    debug.orderKeys.forEach((key: string) => {
      try {
        const orders = JSON.parse(localStorage.getItem(key) || '[]');
        debug.ordersData[key] = {
          count: orders.length,
          orders: orders.map((order: { id?: string; total?: number; status?: string; date?: string; items?: unknown[] }) => ({
            id: order.id,
            total: order.total,
            status: order.status,
            date: order.date,
            itemCount: order.items?.length || 0
          }))
        };
      } catch (error) {
        debug.ordersData[key] = { error: (error as Error).message };
      }
    });

    // 6. Role assignments
    debug.roleKeys.forEach((key: string) => {
      debug.roleAssignments[key.replace('user_role_', '')] = localStorage.getItem(key);
    });

    // 7. Expected order key for current user
    if (user?.id) {
      debug.expectedOrderKey = `orders_${user.id}`;
      debug.hasOrdersForCurrentUser = debug.orderKeys.includes(debug.expectedOrderKey);
    }

    setDebugInfo(debug);
  }, [user]);

  const clearAllOrders = () => {
    const orderKeys = Object.keys(localStorage).filter(key => key.startsWith('orders_'));
    orderKeys.forEach(key => localStorage.removeItem(key));
    console.log('Cleared all orders');
    runDebug();
  };

  const clearAllRoles = () => {
    const roleKeys = Object.keys(localStorage).filter(key => key.startsWith('user_role_'));
    roleKeys.forEach(key => localStorage.removeItem(key));
    console.log('Cleared all roles');
    runDebug();
  };

  useEffect(() => {
    runDebug();
  }, [runDebug]);

  if (!debugInfo) {
    return <div>Loading debug info...</div>;
  }

  return (
    <div className="p-6 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>🔧 Order Debug Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button onClick={runDebug} variant="outline">
              Refresh Debug Info
            </Button>
            
            <div className="grid gap-4">
              {/* Current User */}
              <div>
                <h3 className="font-semibold">Current User:</h3>
                <pre className="text-xs bg-gray-100 p-2 rounded">
                  {JSON.stringify(debugInfo.currentUser, null, 2)}
                </pre>
              </div>

              {/* Order Keys */}
              <div>
                <h3 className="font-semibold">Order Keys ({debugInfo.orderKeys.length}):</h3>
                <pre className="text-xs bg-gray-100 p-2 rounded">
                  {JSON.stringify(debugInfo.orderKeys, null, 2)}
                </pre>
              </div>

              {/* Orders Data */}
              <div>
                <h3 className="font-semibold">Orders Data:</h3>
                <pre className="text-xs bg-gray-100 p-2 rounded max-h-64 overflow-y-auto">
                  {JSON.stringify(debugInfo.ordersData, null, 2)}
                </pre>
              </div>

              {/* Role Assignments */}
              <div>
                <h3 className="font-semibold">Role Assignments:</h3>
                <pre className="text-xs bg-gray-100 p-2 rounded">
                  {JSON.stringify(debugInfo.roleAssignments, null, 2)}
                </pre>
              </div>

              {/* Expected Order Key */}
              {debugInfo.expectedOrderKey && (
                <div>
                  <h3 className="font-semibold">Expected Order Key:</h3>
                  <p className="text-sm">
                    <code>{debugInfo.expectedOrderKey}</code>
                    <span className={debugInfo.hasOrdersForCurrentUser ? "text-green-600" : "text-red-600"}>
                      {debugInfo.hasOrdersForCurrentUser ? " ✅ Found" : " ❌ Not Found"}
                    </span>
                  </p>
                </div>
              )}

              {/* Debug Actions */}
              <div className="flex gap-2 pt-4 border-t">
                <Button onClick={clearAllOrders} variant="destructive" size="sm">
                  Clear All Orders
                </Button>
                <Button onClick={clearAllRoles} variant="destructive" size="sm">
                  Clear All Roles
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
