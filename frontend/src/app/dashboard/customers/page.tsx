import Link from "next/link";
import { getCustomers } from "@/actions/customer";
import { Plus, Users } from "lucide-react";
import CustomerActions from "./CustomerActions";

export default async function CustomersPage() {
  const customers = await getCustomers();

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h2>Customer Pipeline</h2>
        <Link href="/dashboard/customers/add-inquiry" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={20} /> Add Inquiry
        </Link>
      </div>

      {customers.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '64px', color: 'var(--text-muted)' }}>
          <p>Your pipeline is empty. Add your first customer inquiry.</p>
        </div>
      ) : (
        <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-light)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                <th style={{ padding: '16px 24px', fontWeight: 600 }}>Name & Contact</th>
                <th style={{ padding: '16px 24px', fontWeight: 600 }}>Type</th>
                <th style={{ padding: '16px 24px', fontWeight: 600 }}>Deal Stage</th>
                <th style={{ padding: '16px 24px', fontWeight: 600 }}>Follow-Up & Notes</th>
                <th style={{ padding: '16px 24px', fontWeight: 600 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((cust) => (
                <tr key={cust.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '16px 24px' }}>
                    <Link href={`/dashboard/customers/${cust.id}`} style={{ color: 'var(--primary)', textDecoration: 'none' }}>
                      <strong>{cust.name}</strong>
                    </Link>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 4 }}>
                      {cust.phone}
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    {cust.type}
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ 
                      padding: '4px 10px', 
                      borderRadius: 99, 
                      fontSize: '0.8rem', 
                      background: 'rgba(6, 182, 212, 0.15)',
                      color: 'var(--primary)'
                    }}>
                      {cust.stage}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{cust.nextFollowUp ? new Date(cust.nextFollowUp).toLocaleDateString() : 'None setup'}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{cust.notes || '-'}</div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <CustomerActions id={cust.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
