import { gqlRequest } from '../../lib/graphql-client';
import AdminLeadsClient from '../../src/components/AdminLeadsClient';
import React from 'react';

type Booking = {
  id: string;
  startAt: string;
  endAt?: string | null;
  status: string;
  provider?: string | null;
};

type Lead = {
  id: string;
  name: string;
  email: string;
  message?: string | null;
  createdAt: string;
  bookings: Booking[];
};

const ADMIN_LEADS_QUERY = `
  query AdminLeads {
    adminLeads {
      id
      name
      email
      message
      createdAt
      bookings {
        id
        startAt
        endAt
        status
        provider
      }
    }
  }
`;

export default async function AdminPage() {
  const headers: Record<string, string> = {};
  // Pass server-side admin secret from environment when rendering on server
  if (process.env.ADMIN_PASSWORD) headers['x-admin-secret'] = process.env.ADMIN_PASSWORD;
  const data = await gqlRequest<{ adminLeads: Lead[] }>(ADMIN_LEADS_QUERY, undefined, { headers });
  const leads: Lead[] = data?.adminLeads || [];

  return (
    <div style={{ padding: 24 }}>
      <h1>Admin — Leads</h1>
      <AdminLeadsClient initialLeads={leads} />
    </div>
  );
}
