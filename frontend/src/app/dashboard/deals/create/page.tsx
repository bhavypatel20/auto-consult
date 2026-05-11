import { addDeal } from "@/actions/finance";
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

export default async function CreateDealPage() {
  const cars = await prisma.car.findMany({ 
    where: { status: { not: "Sold" } } 
  });
  
  const customers = await prisma.customer.findMany({ 
    where: { stage: { not: "Deal Closed" } } 
  });

  return (
    <div>
      <h2 style={{ marginBottom: '32px' }}>Close a Deal</h2>
      
      <form action={addDeal} className="glass-card" style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        <label>Select Car 
           <select name="carId" required defaultValue="" style={{...inputStyle, WebkitAppearance: 'none'}}>
             <option value="" disabled>Select a vehicle...</option>
             {cars.map((car) => (
                <option key={car.id} value={car.id}>{car.brand} {car.model} - {car.registrationNum}</option>
             ))}
           </select>
        </label>
        
        <label>Select Customer
           <select name="customerId" required defaultValue="" style={{...inputStyle, WebkitAppearance: 'none'}}>
             <option value="" disabled>Select a customer...</option>
             {customers.map((cust) => (
                <option key={cust.id} value={cust.id}>{cust.name} - {cust.phone}</option>
             ))}
           </select>
        </label>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <label>Final Sold Price (₹) <input type="number" name="finalPrice" required style={inputStyle} /></label>
          <label>Payment Status
            <select name="paymentStatus" required style={{...inputStyle, WebkitAppearance: 'none'}}>
              <option value="Paid">Paid Fully</option>
              <option value="Partial">Partial</option>
              <option value="Pending">Pending</option>
            </select>
          </label>
        </div>

        <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start', marginTop: '16px' }}>
          Finalize Deal
        </button>
      </form>
    </div>
  );
}
