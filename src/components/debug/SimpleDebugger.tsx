import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Button } from '../ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

export const SimpleDebugger = () => {
  const { user } = useUser();
  const [debugInfo, setDebugInfo] = useState<string>('');

  const runDebug = () => {
    const info = [];
    
    info.push('=== CURRENT USER ===');
    info.push(`ID: ${user?.id}`);
    info.push(`Email: ${user?.emailAddresses?.[0]?.emailAddress}`);
    info.push('');
    
    info.push('=== ALL LOCALSTORAGE KEYS ===');
    const allKeys = Object.keys(localStorage);
    allKeys.forEach(key => {
      const value = localStorage.getItem(key);
      info.push(`${key}: ${value ? `${value.length} chars` : 'null'}`);
    });
    info.push('');
    
    info.push('=== ORDER KEYS ===');
    const orderKeys = allKeys.filter(key => key.startsWith('orders_'));
    if (orderKeys.length === 0) {
      info.push('❌ NO ORDER KEYS FOUND');
    } else {
      orderKeys.forEach(key => {
        try {
          const orders = JSON.parse(localStorage.getItem(key) || '[]');
          info.push(`${key}: ${orders.length} orders`);
          orders.forEach((order: { total?: number; status?: string }, index: number) => {
            info.push(`  Order ${index + 1}: ₹${order.total} (${order.status || 'no status'})`);
          });
        } catch (error) {
          info.push(`${key}: ERROR - ${error}`);
        }
      });
    }
    info.push('');
    
    info.push('=== ROLE KEYS ===');
    const roleKeys = allKeys.filter(key => key.startsWith('user_role_'));
    if (roleKeys.length === 0) {
      info.push('❌ NO ROLE KEYS FOUND');
    } else {
      roleKeys.forEach(key => {
        const email = key.replace('user_role_', '');
        const role = localStorage.getItem(key);
        info.push(`${email}: ${role}`);
      });
    }
    
    setDebugInfo(info.join('\n'));
  };

  const addSampleOrder = () => {
    if (!user?.id) {
      alert('No user logged in!');
      return;
    }
    
    const sampleOrder = {
      id: `ORDER-${Date.now()}`,
      total: 299,
      status: 'confirmed',
      date: new Date().toISOString(),
      customerEmail: user.emailAddresses?.[0]?.emailAddress,
      items: [
        { id: '1', title: 'Sample Product', price: 299, qty: 1 }
      ]
    };
    
    const orderKey = `orders_${user.id}`;
    const existingOrders = JSON.parse(localStorage.getItem(orderKey) || '[]');
    existingOrders.push(sampleOrder);
    localStorage.setItem(orderKey, JSON.stringify(existingOrders));
    
    alert('Sample order added!');
    runDebug();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>🔧 Simple Debug Tool</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={runDebug} variant="outline">
              Check Data
            </Button>
            <Button onClick={addSampleOrder} variant="secondary">
              Add Sample Order
            </Button>
          </div>
          
          {debugInfo && (
            <pre className="text-xs bg-gray-100 p-4 rounded max-h-96 overflow-y-auto whitespace-pre-wrap">
              {debugInfo}
            </pre>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
