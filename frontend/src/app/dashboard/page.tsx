import Link from "next/link";
import prisma from "@/lib/prisma";
import { CarFront, Users, Receipt, Plus } from "lucide-react";

export default async function DashboardMainPage() {
  // Aggregate High Level Data
  const availableCars = await prisma.car.count({ where: { status: "Available" } });
  const activeLeads = await prisma.customer.count({ where: { stage: { in: ["Inquiry", "Negotiation"] } } });
  
  const deals = await prisma.deal.findMany({ include: { car: { include: { expenses: true } } } });
  
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

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h2>AutoConsult Command Center</h2>
        <p style={{ color: 'var(--text-muted)' }}>Welcome back. Here is your dealership snapshot.</p>
      </div>

      {/* Snapshot Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '48px' }}>
        <Link href="/dashboard/inventory" style={{ textDecoration: 'none' }}>
           <div className="glass-card flex" style={{ padding: '24px', transition: 'all 0.2s', cursor: 'pointer' }}>
             <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '16px', borderRadius: '12px', marginRight: '16px' }}>
                <CarFront size={28} />
             </div>
             <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '4px' }}>Available Cars</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-main)' }}>{availableCars}</div>
             </div>
           </div>
        </Link>

        <Link href="/dashboard/customers" style={{ textDecoration: 'none' }}>
           <div className="glass-card flex" style={{ padding: '24px', transition: 'all 0.2s', cursor: 'pointer' }}>
             <div style={{ background: 'rgba(6, 182, 212, 0.1)', color: 'var(--primary)', padding: '16px', borderRadius: '12px', marginRight: '16px' }}>
                <Users size={28} />
             </div>
             <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '4px' }}>Active Inquiries</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-main)' }}>{activeLeads}</div>
             </div>
           </div>
        </Link>

        <Link href="/dashboard/deals" style={{ textDecoration: 'none' }}>
           <div className="glass-card flex" style={{ padding: '24px', transition: 'all 0.2s', cursor: 'pointer' }}>
             <div style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', padding: '16px', borderRadius: '12px', marginRight: '16px' }}>
                <Receipt size={28} />
             </div>
             <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '4px' }}>Total Profit (All Time)</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>₹ {totalProfit.toLocaleString()}</div>
             </div>
           </div>
        </Link>
      </div>

      <h3 style={{ marginBottom: '24px' }}>Quick Actions</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        <Link href="/dashboard/inventory/add" className="btn-primary" style={{ textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '16px' }}>
           <Plus size={18}/> New Vehicle
        </Link>
        <Link href="/dashboard/customers/add" className="btn-primary" style={{ background: 'rgba(255,255,255,0.05)', boxShadow: 'none', color: 'var(--text-main)', textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '16px' }}>
           <Plus size={18}/> New Customer
        </Link>
        <Link href="/dashboard/deals/create" className="btn-primary" style={{ background: 'rgba(255,255,255,0.05)', boxShadow: 'none', color: 'var(--text-main)', textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '16px' }}>
           <Receipt size={18}/> Close Deal
        </Link>
      </div>

    </div>
  );
}
