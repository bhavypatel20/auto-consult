"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function uploadCarImage(formData: FormData) {
  const carId = formData.get("carId") as string;
  const res = await fetch(`${API_URL}/cars/${carId}/image`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Failed to upload image");
  }

  revalidatePath(`/dashboard/inventory/${carId}`);
}

export async function updateCar(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const carId = formData.get("id") as string;

  const res = await fetch(`${API_URL}/cars/${carId}`, {
    method: 'PUT',
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Failed to update car");
  }

  revalidatePath("/dashboard/inventory");
  redirect(`/dashboard/inventory/${carId}`);
}

export async function addCar(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  
  formData.append('clerkUserId', userId);

  const res = await fetch(`${API_URL}/cars`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Failed to add car");
  }

  revalidatePath("/dashboard/inventory");
  return { success: true };
}

export async function getCars() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const res = await fetch(`${API_URL}/cars`, {
    cache: 'no-store'
  });
  
  if (!res.ok) {
    return [];
  }
  
  return await res.json();
}
