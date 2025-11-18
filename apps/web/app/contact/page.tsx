'use client';
import React, { useState } from 'react';

import { gqlRequest } from '../../lib/graphql-client';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<null | 'idle' | 'sending' | 'success' | 'error'>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    setError(null);
    const mutation = `mutation SubmitLead($input: SubmitLeadInput!) { submitLead(input: $input) { id email name createdAt } }`;
    try {
      const data = await gqlRequest<{ submitLead: { id: string } }>(mutation, {
        input: { name, email, message },
      });
      if (data?.submitLead?.id) {
        setStatus('success');
        setName('');
        setEmail('');
        setMessage('');
      } else {
        setStatus('error');
        setError('Unexpected response from server');
      }
    } catch (err: unknown) {
      setStatus('error');
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
    }
  }

  return (
    <main className="max-w-xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-semibold mb-4">Contact</h1>
      <p className="mb-6">Send us a message — we will get back to you.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            className="mt-1 block w-full border rounded px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            required
            type="email"
            className="mt-1 block w-full border rounded px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Message</label>
          <textarea
            className="mt-1 block w-full border rounded px-3 py-2"
            rows={6}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="How can we help you?"
          />
        </div>

        <div>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded"
            disabled={status === 'sending'}
          >
            {status === 'sending' ? 'Sending…' : 'Send message'}
          </button>
        </div>

        {status === 'success' && (
          <p className="text-green-600">Thanks — we received your message.</p>
        )}
        {status === 'error' && <p className="text-red-600">Error: {error}</p>}
      </form>
    </main>
  );
}
