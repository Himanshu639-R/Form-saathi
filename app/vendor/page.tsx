'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function VendorPanel() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const { data } = await supabase
      .from('orders')
      .select('*, services(title, price), profiles(full_name, phone)')
      .order('created_at', { ascending: false });
    if (data) setOrders(data);
  };

  const markCompleted = async (orderId: string) => {
    await supabase.from('orders').update({ status: 'completed' }).eq('id', orderId);
    alert('Order Completed Mark Ho Gaya!');
    fetchOrders();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 text-black max-w-2xl mx-auto">
      {/* Header with Safety Icon */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow mb-4 border-l-4 border-purple-600">
        <div>
          <h1 className="text-xl font-bold text-purple-700 flex items-center gap-2">
            🛡️ FormSaathi Vendor Dashboard
          </h1>
          <p className="text-xs text-gray-500">Verified Service Partner Access</p>
        </div>
        <span className="text-xs bg-purple-100 text-purple-800 font-bold px-2.5 py-1 rounded-full">
          Live Orders
        </span>
      </div>
      
      <h2 className="text-md font-bold mb-3 text-gray-700">Incoming Applications</h2>
      <div className="space-y-3">
        {orders.length === 0 ? (
          <div className="bg-white p-6 rounded-xl text-center shadow border">
            <p className="text-sm text-gray-500">Koi naya order nahi aaya hai abhi.</p>
          </div>
        ) : (
          orders.map(order => (
            <div key={order.id} className="bg-white p-4 rounded-xl shadow border">
              <div className="flex justify-between items-start border-b pb-2 mb-2">
                <div>
                  <p className="font-bold text-md text-gray-900">{order.services?.title}</p>
                  <p className="text-xs text-gray-500">Customer: {order.profiles?.full_name || 'Customer'}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded font-bold uppercase ${order.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {order.status}
                </span>
              </div>

              <div className="flex justify-between items-center mt-3">
                <p className="text-sm font-bold text-purple-700">Fee: ₹{order.services?.price}</p>
                {order.status !== 'completed' && (
                  <button 
                    onClick={() => markCompleted(order.id)}
                    className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-2 rounded-lg font-bold transition"
                  >
                    ✓ Mark Completed
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}