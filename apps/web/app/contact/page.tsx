'use client';
import { Button, Input, Textarea } from 'packages/ui';

import React from 'react';
import { useContactForm } from '../../lib/useContactForm';

export default function ContactPage() {
  const { name, setName, email, setEmail, message, setMessage, status, error, errors, submit } =
    useContactForm();

  return (
    <main className="max-w-xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-semibold mb-4">Contact</h1>
      <p className="mb-6">Send us a message — we will get back to you.</p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void submit();
        }}
        className="space-y-4"
      >
        <div>
          <label className="block text-sm font-medium">Name</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
          {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
          {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium">Message</label>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="How can we help?"
          />
          {errors.message && <p className="text-red-600 text-sm mt-1">{errors.message}</p>}
        </div>

        <div>
          <Button onClick={submit} disabled={status === 'sending'}>
            Send
          </Button>
        </div>

        {status === 'success' && (
          <p className="text-green-600">Thanks — we received your message.</p>
        )}
        {status === 'error' && <p className="text-red-600">Error: {error}</p>}
      </form>
    </main>
  );
}
