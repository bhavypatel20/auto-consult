"use client";

import Link from "next/link";
import { deleteCustomer } from "@/actions/customer";
import { Pencil, Trash2 } from "lucide-react";

export default function CustomerActions({ id }: { id: string }) {
  const handleDelete = (e: React.FormEvent) => {
    if (!confirm("Are you sure you want to permanently delete this customer?")) {
      e.preventDefault();
    }
  };

  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <Link href={`/dashboard/customers/${id}/edit`} className="btn-primary" style={{ padding: '6px 12px', background: 'rgba(6, 182, 212, 0.1)', color: 'var(--primary)', boxShadow: 'none' }}>
        <Pencil size={16} />
      </Link>
      
      <form action={deleteCustomer} onSubmit={handleDelete}>
        <input type="hidden" name="id" value={id} />
        <button type="submit" className="btn-primary" style={{ padding: '6px 12px', background: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e', boxShadow: 'none' }}>
          <Trash2 size={16} />
        </button>
      </form>
    </div>
  );
}
