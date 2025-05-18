import type { ReactNode } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Inter } from "next/font/google"
import "../styles/globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "zkCargoPass: Faster Customs with Blockchain & ZK Proofs",
  description:
    "Streamline customs clearance with secure, verifiable documentation using zero-knowledge proofs and blockchain technology.",
  icons: {
    icon: "./favicon.ico",
  }
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
