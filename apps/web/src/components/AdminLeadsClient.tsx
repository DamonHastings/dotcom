'use client';
import React, { useState } from 'react';

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

export default function AdminLeadsClient({ initialLeads }: { initialLeads: Lead[] }) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads || []);
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});

  async function action(actionType: 'confirm' | 'cancel', bookingId: string) {
    setLoadingMap((s) => ({ ...s, [bookingId]: true }));
    try {
      const res = await fetch('/api/admin/booking-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: actionType, id: bookingId }),
      });
      const json = await res.json();
      if (res.ok && json) {
        const updatedStatus = json.confirmBooking?.status || json.cancelBooking?.status;
        if (updatedStatus) {
          setLeads((prev) =>
            prev.map((lead) => ({
              ...lead,
              bookings: lead.bookings.map((b) => (b.id === bookingId ? { ...b, status: updatedStatus } : b)),
            })),
          );
        }
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
          {leads.map((lead) => (
            <tr key={lead.id}>
              <td style={{ padding: '8px 4px', verticalAlign: 'top' }}>{lead.name}</td>
              <td style={{ padding: '8px 4px', verticalAlign: 'top' }}>{lead.email}</td>
              <td style={{ padding: '8px 4px', verticalAlign: 'top' }}>{lead.message}</td>
              <td style={{ padding: '8px 4px', verticalAlign: 'top' }}>
                {lead.bookings && lead.bookings.length > 0 ? (
                  <ul>
                    {lead.bookings.map((b) => (
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
