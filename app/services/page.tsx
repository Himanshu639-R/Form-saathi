'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/navigation';

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      // Fetch Services
      const { data: serv } = await supabase.from('services').select('*');
      if (serv) setServices(serv);

      // Fetch User Locker Docs
      const { data: docs } = await supabase.from('data_locker').select('*').eq('user_id', user.id);
      if (docs) setDocuments(docs);
    };
    loadData();
  }, [router]);

  const toggleDoc = (docId: string) => {
    setSelectedDocs(prev => 
      prev.includes(docId) ? prev.filter(id => id !== docId) : [...prev, docId]
    );
  };

  const handleCreateOrder = async () => {
    if (!selectedService) return alert('Koyi Service select karo!');
    if (selectedDocs.length === 0) return alert('Kam se kam 1 document share karne ke liye select karo!');

    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    // 1. Order banao
    const { data: order, error } = await supabase.from('orders').insert({
      customer_id: user?.id,
      service_id: selectedService.id,
      status: 'pending'
    }).select().single();

    if (error) {
      alert('Order error: ' + error.message);
      setLoading(false);
      return;
    }

    // 2. Share selected docs temporarily with order snapshot
    const orderDocs = selectedDocs.map(docId => ({
      order_id: order.id,
      document_id: docId
    }));

    await supabase.from('order_documents').insert(orderDocs);

    alert('Order successfully submit ho gaya! Vendor jald hi process karega.');
    router.push('/dashboard');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 text-black max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-blue-600">Apply for Service</h1>
        <button onClick={() => router.push('/dashboard')} className="text-sm text-gray-500">Back</button>
      </div>

      {/* 1. Select Service */}
      <h2 className="text-md font-bold mb-2">1. Select Service</h2>
      <div className="space-y-2 mb-6">
        {services.map(s => (
          <div 
            key={s.id} 
            onClick={() => setSelectedService(s)}
            className={`p-3 border rounded-xl cursor-pointer ${selectedService?.id === s.id ? 'border-blue-600 bg-blue-50' : 'bg-white'}`}
          >
            <div className="flex justify-between font-bold">
              <span>{s.title}</span>
              <span className="text-blue-600">₹{s.price}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">{s.description}</p>
          </div>
        ))}
      </div>

      {/* 2. Select Docs from Data Locker */}
      <h2 className="text-md font-bold mb-2">2. Share Required Docs (Locker Se)</h2>
      <div className="space-y-2 mb-6">
        {documents.length === 0 ? (
          <p className="text-xs text-red-500">Pehle Dashboard par jaakar Locker me Document upload karo!</p>
        ) : (
          documents.map(d => (
            <label key={d.id} className="flex items-center justify-between p-3 border rounded-xl bg-white cursor-pointer">
              <span className="text-sm font-medium">{d.document_name}</span>
              <input 
                type="checkbox" 
                checked={selectedDocs.includes(d.id)}
                onChange={() => toggleDoc(d.id)}
                className="w-4 h-4 accent-blue-600"
              />
            </label>
          ))
        )}
      </div>

      <button
        onClick={handleCreateOrder}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700"
      >
        {loading ? 'Submitting Order...' : 'Confirm & Send to Vendor'}
      </button>
    </div>
  );
}