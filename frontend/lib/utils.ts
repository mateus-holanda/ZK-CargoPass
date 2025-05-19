import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getBrowserLanguage(): string {
  if (typeof window === 'undefined') return 'en-US';
  
  const browserLang = navigator.language || (navigator as any).userLanguage;
  // Map the browser language to our supported languages
  const supportedLanguages = ['en-US', 'pt-BR'];
  
  // Check if the browser language is supported
  if (supportedLanguages.includes(browserLang)) {
    return browserLang;
  }
  
  // If the language is not supported, return the default language
  return 'en-US';
}
