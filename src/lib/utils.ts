import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format currency in Indian Rupees with proper grouping (e.g., ₹1,23,456.00)
export function formatINR(amount: number): string {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount)
  } catch {
    // Fallback if Intl is unavailable
    return `₹${Number(amount || 0).toFixed(2)}`
  }
}
