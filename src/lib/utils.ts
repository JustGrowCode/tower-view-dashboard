
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number, minimumFractionDigits = 0): string {
  return value.toLocaleString('pt-BR', { 
    minimumFractionDigits, 
    maximumFractionDigits: 2 
  });
}
