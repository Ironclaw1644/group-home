'use client';

import { useState } from 'react';

export function UnsubscribeClient({ token }: { token: string }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleUnsubscribe() {
    setStatus('loading');
    setMessage('');
    try {
      const res = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Unable to unsubscribe');
      setStatus('success');
      setMessage('You have been unsubscribed from email updates.');
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Unable to unsubscribe');
    }
  }

  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-brand-navy/10 bg-white p-6 shadow-card">
      <h1 className="text-2xl font-semibold text-brand-navy">Unsubscribe</h1>
      <p className="mt-2 text-sm text-brand-slate">Use the button below to stop marketing emails from At Home Family Services, LLC.</p>
      <button
        onClick={handleUnsubscribe}
        disabled={status === 'loading' || !token}
        className="mt-6 rounded-xl bg-brand-navy px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
      >
        {status === 'loading' ? 'Unsubscribing...' : 'Confirm Unsubscribe'}
      </button>
      {message ? <p className={`mt-4 text-sm ${status === 'success' ? 'text-emerald-700' : 'text-rose-700'}`}>{message}</p> : null}
    </div>
  );
}
