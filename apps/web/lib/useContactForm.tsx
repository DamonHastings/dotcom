import { useState } from 'react';

import { gqlRequest } from './graphql-client';

type Status = null | 'idle' | 'sending' | 'success' | 'error';

export function useContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Status>(null);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});

  function validate() {
    const newErrors: { name?: string; email?: string; message?: string } = {};
    if (name && name.length < 2) newErrors.name = 'Name must be at least 2 characters';
    if (!email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Invalid email address';
    if (!message || message.trim().length < 10)
      newErrors.message = 'Message must be at least 10 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function submit() {
    setStatus('sending');
    setError(null);
    const ok = validate();
    if (!ok) {
      setStatus('error');
      return null;
    }

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
        setErrors({});
        return data.submitLead;
      }
      setStatus('error');
      setError('Unexpected server response');
      return null;
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : String(err));
      return null;
    }
  }

  return {
    name,
    setName,
    email,
    setEmail,
    message,
    setMessage,
    status,
    error,
    errors,
    submit,
  } as const;
}
