import { updateCar } from "@/actions/car";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

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

export default async function EditCarPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const car = await prisma.car.findUnique({
    where: { id }
  });

  if (!car) return notFound();

  return (
    <div>
      <h2 style={{ marginBottom: '32px' }}>Edit Vehicle Details</h2>
      
      <form action={updateCar} className="glass-card" style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        <input type="hidden" name="id" value={car.id} />
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <label>Brand <input name="brand" required defaultValue={car.brand} style={inputStyle} /></label>
          <label>Model <input name="model" required defaultValue={car.model} style={inputStyle} /></label>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
          <label>Year <input type="number" name="year" required defaultValue={car.year} style={inputStyle} /></label>
          <label>Fuel Type
            <select name="fuelType" required defaultValue={car.fuelType} style={{...inputStyle, WebkitAppearance: 'none'}}>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="CNG">CNG</option>
              <option value="Electric">Electric</option>
            </select>
          </label>
          <label>Status
            <select name="status" required defaultValue={car.status} style={{...inputStyle, WebkitAppearance: 'none'}}>
              <option value="Available">Available</option>
              <option value="Sold">Sold</option>
              <option value="In Service">In Service</option>
            </select>
          </label>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <label>KM Driven <input type="number" name="kmDriven" required defaultValue={car.kmDriven} style={inputStyle} /></label>
          <label>Registration Number <input name="registrationNum" required defaultValue={car.registrationNum} style={inputStyle} /></label>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border-light)', margin: '12px 0' }} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <label>Seller Name <input name="sellerName" defaultValue={car.sellerName || ""} style={inputStyle} placeholder="e.g. John Doe" /></label>
          <label>Seller Address <input name="sellerAddress" defaultValue={car.sellerAddress || ""} style={inputStyle} placeholder="e.g. 123 Main St, Mumbai" /></label>
        </div>
        
        <label style={{ display: 'block' }}>Replace Vehicle Photo (Optional)
           <input type="file" name="image" accept="image/*" style={inputStyle} />
           <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Leave blank to keep the existing photo</div>
        </label>

        <div style={{ padding: '24px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
          <h4 style={{ marginBottom: '16px' }}>Financials</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <label>Original Purchase Price (₹) <input type="number" name="purchasePrice" required defaultValue={car.purchasePrice} style={inputStyle} /></label>
            <label>Expected Selling Price (₹) <input type="number" name="expectedSellPrice" required defaultValue={car.expectedSellPrice} style={inputStyle} /></label>
          </div>
        </div>

        <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start', marginTop: '16px' }}>
          Save Changes
        </button>
      </form>
    </div>
  );
}
