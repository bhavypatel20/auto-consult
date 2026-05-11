"use server";

import { revalidatePath } from "next/cache";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function uploadCarDocument(formData: FormData) {
  const res = await fetch(`${API_URL}/documents`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Failed to upload document");
  }

  revalidatePath("/dashboard/documents");
}
