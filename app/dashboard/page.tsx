'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState<any[]>([]);
  const [docName, setDocName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);
      loadDocs(user.id);
    };
    fetchUserData();
  }, [router]);

  const loadDocs = async (userId: string) => {
    const { data } = await supabase.from('data_locker').select('*').eq('user_id', userId);
    if (data) setDocuments(data);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !docName || !user) return;

    setUploading(true);
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const filePath = `${user.id}/${Date.now()}_${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file);

    if (uploadError) {
      alert('Upload fail ho gaya: ' + uploadError.message);
      setUploading(false);
      return;
    }

    const { error: dbError } = await supabase.from('data_locker').insert({
      user_id: user.id,
      document_name: docName,
      document_type: fileExt,
      file_path: filePath,
    });

    if (dbError) {
      alert('Save error: ' + dbError.message);
    } else {
      alert('Document Lockers me secure save ho gaya![cite: 1]');
      setDocName('');
      setFile(null);
      loadDocs(user.id);
    }
    setUploading(false);
  };

  return (
    <div className="min-h-screen p-4 max-w-md mx-auto text-black">
      {/* Top Quick Actions */}
      <div className="bg-white rounded-xl shadow p-4 mb-4 border border-blue-100 flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500">Welcome Customer</p>
          <p className="font-bold text-sm text-blue-900">{user?.email}</p>
        </div>
        <button 
          onClick={() => router.push('/services')} 
          className="bg-green-600 text-white text-xs px-3 py-2 rounded-lg font-bold shadow hover:bg-green-700"
        >
          + Fill Application
        </button>
      </div>

      {/* Document Upload Card */}
      <div className="bg-white rounded-xl shadow p-4 mb-6 border">
        <h2 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
          🔒 Upload To Private Data Locker[cite: 1]
        </h2>
        <form onSubmit={handleUpload} className="space-y-3">
          <input
            type="text"
            placeholder="Document Name (e.g. Passport Photo, Aadhaar, Marksheet)"
            required
            value={docName}
            onChange={(e) => setDocName(e.target.value)}
            className="w-full p-2.5 text-xs border rounded-lg bg-gray-50 text-black font-medium"
          />
          <input
            type="file"
            accept="image/*,application/pdf"
            required
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full text-xs text-gray-600 border p-2 rounded-lg bg-gray-50"
          />
          <button
            type="submit"
            disabled={uploading}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-xs font-bold hover:bg-blue-700 shadow"
          >
            {uploading ? 'Encrypting & Saving...' : 'Save Document Safely'}
          </button>
        </form>
      </div>

      {/* Saved Locker Documents */}
      <h3 className="text-xs font-bold text-gray-600 uppercase mb-2 tracking-wider">My Saved Documents[cite: 1]</h3>
      <div className="space-y-2">
        {documents.length === 0 ? (
          <p className="text-xs text-gray-400 bg-white p-4 rounded-xl border text-center">Koi document upload nahi hai.</p>
        ) : (
          documents.map((doc) => (
            <div key={doc.id} className="bg-white p-3 rounded-xl border shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs uppercase">
                  {doc.document_type || 'DOC'}
                </div>
                <div>
                  <p className="font-bold text-xs text-gray-800">{doc.document_name}</p>
                  <p className="text-[10px] text-gray-400">Reusable Locker Item[cite: 1]</p>
                </div>
              </div>
              <span className="text-[10px] bg-green-100 text-green-800 px-2 py-0.5 rounded font-bold">
                Protected
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}