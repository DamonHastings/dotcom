import React from 'react';
import { gqlRequest } from '../../lib/graphql-client';

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
  const data = await gqlRequest<{ adminLeads: any[] }>(ADMIN_LEADS_QUERY, undefined, { headers });
  const leads = data?.adminLeads || [];

  return (
    <div style={{ padding: 24 }}>
      <h1>Admin — Leads</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Name</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Email</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Message</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Bookings</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Created</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead: any) => (
            <tr key={lead.id}>
              <td style={{ padding: '8px 4px', verticalAlign: 'top' }}>{lead.name}</td>
              <td style={{ padding: '8px 4px', verticalAlign: 'top' }}>{lead.email}</td>
              <td style={{ padding: '8px 4px', verticalAlign: 'top' }}>{lead.message}</td>
              <td style={{ padding: '8px 4px', verticalAlign: 'top' }}>
                {lead.bookings && lead.bookings.length > 0 ? (
                  <ul>
                    {lead.bookings.map((b: any) => (
                      <li key={b.id}>
                        {new Date(b.startAt).toLocaleString()} — {b.status}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <em>—</em>
                )}
              </td>
              <td style={{ padding: '8px 4px', verticalAlign: 'top' }}>
                {new Date(lead.createdAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
