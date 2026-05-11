import { addExpense } from "@/actions/finance";
import prisma from "@/lib/prisma";

const inputStyle = {
  width: '100%',
  padding: '12px 16px',
  borderRadius: '12px',
  background: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid var(--border-light)',
  color: 'var(--text-main)',
  marginTop: '8px',
  outline: 'none'
};

export default async function AddExpensePage() {
  const cars = await prisma.car.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div>
      <h2 style={{ marginBottom: '32px' }}>Log Vehicle Expense</h2>
      
      <form action={addExpense} className="glass-card" style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        <label>Select Car
          <select name="carId" required defaultValue="" style={{...inputStyle, WebkitAppearance: 'none'}}>
            <option value="" disabled>Select a vehicle...</option>
            {cars.map((car) => (
              <option key={car.id} value={car.id}>
                {car.brand} {car.model} - {car.registrationNum} ({car.status})
              </option>
            ))}
          </select>
        </label>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <label>Expense Type
            <select name="expenseType" required style={{...inputStyle, WebkitAppearance: 'none'}}>
              <option value="Repair">Repair / Maintenance</option>
              <option value="Service">Service</option>
              <option value="Transport">Transport / Logistics</option>
              <option value="RTO">RTO / Paperwork</option>
            </select>
          </label>
          <label>Amount (₹) <input type="number" name="amount" required style={inputStyle} placeholder="e.g. 4500" /></label>
        </div>

        <label>Paid By (Partner Tracked)
            <select name="paidBy" required style={{...inputStyle, WebkitAppearance: 'none', background: 'rgba(245, 158, 11, 0.05)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.3)'}}>
              <option value="Company">Company Account (Default)</option>
              <option value="Divy">Divy</option>
              <option value="Bakabhai">Bakabhai</option>
              <option value="Samirbhai">Samirbhai</option>
              <option value="Mayurbhai">Mayurbhai</option>
            </select>
        </label>

        <label>Description <br/><textarea name="description" rows={3} style={{...inputStyle, resize: 'vertical'}} placeholder="What was the expense for?" /></label>

        <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start', marginTop: '16px' }}>
          Save Expense
        </button>
      </form>
    </div>
  );
}
