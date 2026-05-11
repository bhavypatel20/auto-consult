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

export async function addExpense(formData: FormData) {
  const payload = formDataToJson(formData);

  const res = await fetch(`${API_URL}/finance/expense`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) throw new Error("Failed to add expense");

  revalidatePath("/dashboard/deals");
  redirect("/dashboard/deals");
}

export async function addDeal(formData: FormData) {
  const payload = formDataToJson(formData);

  const res = await fetch(`${API_URL}/finance/deal`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) throw new Error("Failed to add deal");

  revalidatePath("/dashboard/deals");
  redirect("/dashboard/deals");
}

export async function getFinancialSummary() {
  const res = await fetch(`${API_URL}/finance/summary`, { cache: 'no-store' });
  if (!res.ok) return { deals: [], expenses: [] };
  return await res.json();
}
