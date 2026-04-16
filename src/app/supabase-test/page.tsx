"use client";

import { useEffect, useState } from 'react';

interface SupabaseStatus {
  status: string;
  message: string;
  details: {
    supabaseUrl: string;
    supabaseKey: string;
    connection: string;
    database: string;
    tables: string | null;
  };
}

export default function SupabaseTestPage() {
  const [status, setStatus] = useState<SupabaseStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/test-supabase')
      .then(res => res.json())
      .then(data => {
        setStatus(data);
        setLoading(false);
      })
      .catch(error => {
        setStatus({
          status: 'error',
          message: 'Failed to test connection',
          details: {
            supabaseUrl: '❌ Error',
            supabaseKey: '❌ Error',
            connection: '❌ Error',
            database: '❌ Error',
            tables: null
          }
        });
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-on-background text-surface-container-lowest font-body antialiased flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-xl">Testing Supabase Connection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-on-background text-surface-container-lowest font-body antialiased p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-headline font-bold text-white mb-8">Supabase Setup Status</h1>

        <div className="bg-slate-900 rounded-2xl p-6 border border-white/5 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="material-symbols-outlined text-2xl">
              {status?.status === 'success' ? 'check_circle' : 'error'}
            </span>
            <h2 className="text-2xl font-headline font-bold text-white">
              {status?.status === 'success' ? '✅ Connected!' : '❌ Connection Issue'}
            </h2>
          </div>
          <p className="text-slate-300 text-lg">{status?.message}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 rounded-2xl p-6 border border-white/5">
            <h3 className="text-xl font-headline font-bold text-white mb-4">Configuration</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Supabase URL:</span>
                <span className="text-white font-mono text-sm">{status?.details.supabaseUrl}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">API Key:</span>
                <span className="text-white font-mono text-sm">{status?.details.supabaseKey}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Connection:</span>
                <span className="text-white">{status?.details.connection}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 border border-white/5">
            <h3 className="text-xl font-headline font-bold text-white mb-4">Database</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Tables Status:</span>
                <span className="text-white">{status?.details.database}</span>
              </div>
              {status?.details.tables && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Access:</span>
                  <span className="text-white">{status?.details.tables}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {status?.details.database?.includes('not created') && (
          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-2xl p-6 mt-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-yellow-400">warning</span>
              <h3 className="text-xl font-headline font-bold text-yellow-400">Database Setup Required</h3>
            </div>
            <p className="text-yellow-200 mb-4">
              Your Supabase connection is working, but the database tables haven't been created yet.
            </p>
            <div className="bg-slate-800 rounded-lg p-4 font-mono text-sm text-slate-300 mb-4">
              <p className="text-yellow-400 mb-2"># Run this in your Supabase SQL Editor:</p>
              <p>1. Go to https://supabase.com/dashboard</p>
              <p>2. Select your project</p>
              <p>3. Go to SQL Editor</p>
              <p>4. Copy and paste the contents of supabase-schema.sql</p>
              <p>5. Click "Run"</p>
            </div>
            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-yellow-600 hover:bg-yellow-500 text-white px-6 py-3 rounded-full font-bold transition-all"
            >
              <span className="material-symbols-outlined">open_in_new</span>
              Open Supabase Dashboard
            </a>
          </div>
        )}

        {status?.status === 'success' && !status?.details.database?.includes('not created') && (
          <div className="bg-green-900/20 border border-green-500/30 rounded-2xl p-6 mt-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-green-400">celebration</span>
              <h3 className="text-xl font-headline font-bold text-green-400">🎉 Setup Complete!</h3>
            </div>
            <p className="text-green-200 mb-4">
              Your Supabase database is fully configured and ready to use!
            </p>
            <div className="flex gap-4">
              <a
                href="/portal"
                className="bg-primary hover:bg-primary-container text-white px-6 py-3 rounded-full font-bold transition-all"
              >
                View Info Portal
              </a>
              <a
                href="/admin"
                className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full font-bold transition-all"
              >
                Admin Dashboard
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}