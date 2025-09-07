import { apiRequest } from "./queryClient";
import type { Creation, InsertCreation } from "@shared/schema";

export async function generateDrawing(data: {
  prompt: string;
  style: string;
  type: "text-to-image" | "style-transfer";
}): Promise<Creation> {
  const response = await apiRequest("POST", "/api/generate/drawing", data);
  return response.json();
}

export async function generateLego(data: {
  prompt: string;
  colors: string[];
  size: string;
  complexity: string;
  theme: string;
  features: string[];
}): Promise<Creation> {
  const response = await apiRequest("POST", "/api/generate/lego", data);
  return response.json();
}

export async function generatePlayground(data: {
  emojis: string[];
  background: string;
  style: string;
}): Promise<Creation> {
  const response = await apiRequest("POST", "/api/generate/playground", data);
  return response.json();
}

export async function deleteCreation(id: string): Promise<void> {
  await apiRequest("DELETE", `/api/creations/${id}`);
}

export async function downloadImage(imageUrl: string, filename: string): Promise<void> {
  const response = await fetch(imageUrl);
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}
