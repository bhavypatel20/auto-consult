import prisma from "@/lib/prisma";
import DocumentClient from "./DocumentClient";

export default async function DocumentsHub() {
  const cars = await prisma.car.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <DocumentClient cars={cars} />
  );
}
