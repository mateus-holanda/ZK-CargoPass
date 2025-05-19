import type { ReactNode } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Inter } from "next/font/google"
import "../styles/globals.css"
import { getBrowserLanguage } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "zkCargoPass: Faster Customs with Blockchain & ZK Proofs",
  description:
    "Streamline customs clearance with secure, verifiable documentation using zero-knowledge proofs and blockchain technology.",
  icons: {
    icon: "./favicon.ico",
  }
}

export default async function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  const lang = getBrowserLanguage();
  
  return (
    <html lang={lang} suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
