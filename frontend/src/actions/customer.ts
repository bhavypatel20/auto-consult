"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

function formDataToJson(formData: FormData) {
  const obj: any = {};
  formData.forEach((value, key) => {
    obj[key] = value;
  });
  return obj;
}

export async function deleteCustomer(formData: FormData) {
  const id = formData.get("id") as string;
  const res = await fetch(`${API_URL}/customers/${id}`, {
    method: 'DELETE',
  });
  
  if (!res.ok) {
    // Ignore error
  }
  revalidatePath("/dashboard/customers");
  redirect("/dashboard/customers");
}

export async function updateCustomer(formData: FormData) {
  const id = formData.get("id") as string;
  const payload = formDataToJson(formData);
  
  const res = await fetch(`${API_URL}/customers/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) throw new Error("Failed to update customer");

  revalidatePath("/dashboard/customers");
  redirect("/dashboard/customers");
}

export async function saveAdvancedInquiry(data: any) {
  const res = await fetch(`${API_URL}/customers/advanced-inquiry`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (!res.ok) throw new Error("Failed to save advanced inquiry");

  const customer = await res.json();
  revalidatePath("/dashboard/customers");
  redirect(`/dashboard/customers/${customer.id}`);
}

export async function addCustomer(formData: FormData) {
  const payload = formDataToJson(formData);

  const res = await fetch(`${API_URL}/customers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) throw new Error("Failed to add customer");

  revalidatePath("/dashboard/customers");
  return { success: true };
}

export async function getCustomers() {
  const res = await fetch(`${API_URL}/customers`, { cache: 'no-store' });
  if (!res.ok) return [];
  return await res.json();
}
