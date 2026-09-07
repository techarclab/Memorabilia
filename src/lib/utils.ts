import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Indian-format rupee amount, no decimals — prices are always whole rupees. */
export function money(n: number): string {
  return "₹" + Math.round(n).toLocaleString("en-IN");
}
