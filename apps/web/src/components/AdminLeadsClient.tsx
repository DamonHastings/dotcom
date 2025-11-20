'use client';
import React, { useState } from 'react';

export default function AdminLeadsClient({ initialLeads }: { initialLeads: any[] }) {
  const [leads, setLeads] = useState(initialLeads || []);
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});

  async function action(action: 'confirm' | 'cancel', bookingId: string) {
    setLoadingMap((s) => ({ ...s, [bookingId]: true }));
    try {
      const res = await fetch('/api/admin/booking-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, id: bookingId }),
      });
      const json = await res.json();
      if (res.ok && json) {
        // Update local state: find booking and update status
        setLeads((prev) =>
          prev.map((lead: any) => ({
            ...lead,
            bookings: lead.bookings.map((b: any) => (b.id === bookingId ? { ...b, status: json.confirmBooking?.status || json.cancelBooking?.status } : b)),
          })),
        );
      } else {
        alert('Action failed: ' + JSON.stringify(json));
      }
    } catch (err) {
      alert('Action error: ' + String(err));
    } finally {
      setLoadingMap((s) => ({ ...s, [bookingId]: false }));
    }
  }

  return (
    <div>
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
                      <li key={b.id} style={{ marginBottom: 6 }}>
                        {new Date(b.startAt).toLocaleString()} — {b.status}{' '}
                        <button disabled={loadingMap[b.id]} onClick={() => action('confirm', b.id)} style={{ marginLeft: 8 }}>
                          Confirm
                        </button>
                        <button disabled={loadingMap[b.id]} onClick={() => action('cancel', b.id)} style={{ marginLeft: 8 }}>
                          Cancel
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <em>—</em>
                )}
              </td>
              <td style={{ padding: '8px 4px', verticalAlign: 'top' }}>{new Date(lead.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
