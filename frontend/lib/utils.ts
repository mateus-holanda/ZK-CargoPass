import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { headers } from 'next/headers'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getBrowserLanguage(): string {
  // Get the Accept-Language header from the request
  const headersList = headers()
  const acceptLanguage = headersList.get('accept-language')
  
  if (!acceptLanguage) return 'en-US'
  
  // Parse the Accept-Language header
  const languages = acceptLanguage.split(',').map(lang => {
    const [language, quality = '1'] = lang.trim().split(';q=')
    return { language, quality: parseFloat(quality) }
  })
  
  // Sort by quality
  languages.sort((a, b) => b.quality - a.quality)
  
  // Map the browser language to our supported languages
  const supportedLanguages = ['en-US', 'pt-BR']
  
  // Find the first supported language
  for (const { language } of languages) {
    const normalizedLang = language.split('-')[0].toLowerCase()
    if (normalizedLang === 'en') return 'en-US'
    if (normalizedLang === 'pt') return 'pt-BR'
  }
  
  // If no supported language is found, return the default
  return 'en-US'
}
