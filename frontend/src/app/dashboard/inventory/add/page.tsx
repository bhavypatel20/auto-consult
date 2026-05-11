"use client";

import { addCar } from "@/actions/car";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AddCarPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    await addCar(formData);
    setLoading(false);
    router.push("/dashboard/inventory");
  };

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

  return (
    <div>
      <h2 style={{ marginBottom: '32px' }}>Add New Vehicle</h2>
      
      <form onSubmit={handleSubmit} className="glass-card" style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <label>Brand <input name="brand" required style={inputStyle} placeholder="e.g. Hyundai" /></label>
          <label>Model <input name="model" required style={inputStyle} placeholder="e.g. Creta" /></label>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
          <label>Year <input type="number" name="year" required style={inputStyle} /></label>
          <label>Fuel Type 
            <select name="fuelType" required style={{...inputStyle, WebkitAppearance: 'none'}}>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="CNG">CNG</option>
              <option value="Electric">Electric</option>
            </select>
          </label>
          <label>KM Driven <input type="number" name="kmDriven" required style={inputStyle} /></label>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <label>Registration Number <input name="registrationNum" required style={inputStyle} placeholder="MH 02 XX 1234" /></label>
          <label>Status
            <select name="status" required style={{...inputStyle, WebkitAppearance: 'none'}}>
              <option value="Available">Available</option>
              <option value="Booked">Booked</option>
              <option value="Sold">Sold</option>
            </select>
          </label>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border-light)' }} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <label>Seller Name <input name="sellerName" style={inputStyle} placeholder="e.g. John Doe" /></label>
          <label>Seller Address <input name="sellerAddress" style={inputStyle} placeholder="e.g. 123 Main St, Mumbai" /></label>
        </div>

        <label style={{ display: 'block' }}>Primary Vehicle Photo
           <input type="file" name="image" accept="image/*" style={inputStyle} />
           <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Optional primary image for the dashboard</div>
        </label>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border-light)' }} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <label>Purchase Price (₹) <input type="number" name="purchasePrice" required style={inputStyle} /></label>
          <label>Expected Sell Price (₹) <input type="number" name="expectedSellPrice" required style={inputStyle} /></label>
        </div>

        <button type="submit" disabled={loading} className="btn-primary" style={{ alignSelf: 'flex-start', marginTop: '16px' }}>
          {loading ? "Saving..." : "Save Vehicle"}
        </button>
      </form>
    </div>
  );
}
