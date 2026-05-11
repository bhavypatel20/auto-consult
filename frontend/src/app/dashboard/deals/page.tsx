import Link from "next/link";
import { getFinancialSummary } from "@/actions/finance";
import { Plus, IndianRupee, PieChart } from "lucide-react";

export default async function DealsPage() {
  const { deals, expenses } = await getFinancialSummary();

  // Calculate metrics
  let totalRevenue = 0;
  let totalInvestment = 0;

  deals.forEach(deal => {
    totalRevenue += deal.finalPrice;
    totalInvestment += deal.car.purchasePrice;
    deal.car.expenses.forEach(exp => {
      totalInvestment += exp.amount;
    });
  });

  const totalProfit = totalRevenue - totalInvestment;
  const partnerShare = totalProfit / 4; // User specifically asked for 4 partners case

  const partnerInvestments: Record<string, number> = {};
  expenses.forEach(exp => {
    if (exp.paidBy && exp.paidBy !== "Company") {
       partnerInvestments[exp.paidBy] = (partnerInvestments[exp.paidBy] || 0) + exp.amount;
    }
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h2>Deals & Profit Center</h2>
          <p style={{ color: 'var(--text-muted)' }}>Track transactions, expenses, and partner payouts.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link href="/dashboard/deals/add-expense" className="btn-primary" style={{ background: 'rgba(255,255,255,0.1)', boxShadow: 'none' }}>
            <Plus size={18} style={{ marginRight: 8 }} /> Add Expense
          </Link>
          <Link href="/dashboard/deals/create" className="btn-primary">
            <Plus size={18} style={{ marginRight: 8 }} /> Close Deal
          </Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '32px' }}>
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px' }}>Total Profit</div>
          <div style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--secondary)' }}>₹ {totalProfit.toLocaleString()}</div>
        </div>
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px' }}>Total Cars Investment</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 600 }}>₹ {totalInvestment.toLocaleString()}</div>
        </div>
        <div className="glass-card" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(16, 185, 129, 0.1))' }}>
          <div style={{ color: 'var(--primary)', fontSize: '0.9rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: 6 }}><PieChart size={16}/> Partner Share (4 ways)</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 600, color: 'var(--text-main)' }}>₹ {partnerShare.toLocaleString()} <span style={{fontSize:'1rem', color:'var(--text-muted)'}}>/each</span></div>
        </div>
      </div>

      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ marginBottom: '16px', fontSize: '1.2rem' }}>Partner Cash-Flow (Out-of-Pocket Tracked)</h3>
        {Object.keys(partnerInvestments).length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No individual partner expenses logged yet. All expenses marked as Company.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {Object.entries(partnerInvestments).map(([partner, total]) => (
              <div key={partner} className="glass-card" style={{ padding: '20px', border: '1px solid rgba(245, 158, 11, 0.2)', borderLeft: '4px solid #f59e0b' }}>
                 <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '8px' }}>{partner} Spent</div>
                 <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>₹ {total.toLocaleString()}</div>
                 <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '4px' }}>To be reimbursed</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <h3 style={{ marginBottom: '16px' }}>Recent Closed Deals</h3>
      {deals.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '42px', color: 'var(--text-muted)', marginBottom: '32px' }}>
          No deals closed yet.
        </div>
      ) : (
        <div className="glass-card" style={{ padding: 0, overflow: 'hidden', marginBottom: '32px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-light)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                <th style={{ padding: '16px 24px', fontWeight: 600 }}>Closed Date</th>
                <th style={{ padding: '16px 24px', fontWeight: 600 }}>Car & Customer</th>
                <th style={{ padding: '16px 24px', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '16px 24px', fontWeight: 600 }}>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {deals.map(deal => (
                <tr key={deal.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '16px 24px' }}>{new Date(deal.dealDate).toLocaleDateString()}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <strong>{deal.car.brand} {deal.car.model}</strong>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Sold to: {deal.customer.name}</div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                     <span style={{ padding: '4px 10px', borderRadius: 99, fontSize: '0.8rem', background: deal.paymentStatus === 'Paid' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)', color: deal.paymentStatus === 'Paid' ? '#10b981' : '#f59e0b' }}>
                      {deal.paymentStatus}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', fontWeight: 'bold' }}>₹ {deal.finalPrice.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h3 style={{ marginBottom: '16px', marginTop: '16px' }}>Recent Logged Expenses</h3>
      {expenses.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '42px', color: 'var(--text-muted)' }}>
          No expenses recorded yet.
        </div>
      ) : (
        <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-light)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                <th style={{ padding: '16px 24px', fontWeight: 600 }}>Date</th>
                <th style={{ padding: '16px 24px', fontWeight: 600 }}>Attached To Car</th>
                <th style={{ padding: '16px 24px', fontWeight: 600 }}>Funded By</th>
                <th style={{ padding: '16px 24px', fontWeight: 600 }}>Type & Description</th>
                <th style={{ padding: '16px 24px', fontWeight: 600 }}>Cost</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map(exp => (
                <tr key={exp.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '16px 24px' }}>{new Date(exp.date).toLocaleDateString()}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <strong>{exp.car.brand} {exp.car.model}</strong>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{exp.car.registrationNum}</div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: exp.paidBy && exp.paidBy !== "Company" ? '#f59e0b' : 'var(--text-main)' }}>{exp.paidBy || "Company"}</div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                     <span style={{ padding: '4px 10px', borderRadius: 99, fontSize: '0.8rem', background: 'rgba(244, 63, 94, 0.15)', color: '#f43f5e', marginRight: '8px' }}>
                      {exp.expenseType}
                    </span>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{exp.description}</span>
                  </td>
                  <td style={{ padding: '16px 24px', fontWeight: 'bold', color: '#f43f5e' }}>- ₹ {exp.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
