"use client"

import Link from "next/link"
import { ArrowRight, CheckCircle, FileText, Lock, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from 'react';
import enUS from './i18n/locales/en-US.json';
import ptBR from './i18n/locales/pt-BR.json';

export default function LandingPage() {
  const [language, setLanguage] = useState(localStorage.getItem("zk-cargo-pass-language") || "en-US");
  const translations = language === 'en-US' ? enUS : ptBR;

  useEffect(() => {
    localStorage.setItem("zk-cargo-pass-language", language)
  }, [language])

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex justify-end p-4">
        <button onClick={() => setLanguage('en-US')} className={`px-4 py-2 ${language === 'en-US' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>EN</button>
        <button onClick={() => setLanguage('pt-BR')} className={`px-4 py-2 ${language === 'pt-BR' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>PT</button>
      </div>
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-gray-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="flex justify-center mb-4">
                <img src="/images/logo.png" alt="zkCargoPass Logo" className="h-32 w-auto" />
              </div>
              <h1 className="text-3xl text-[#3C3FB4] hover:text-[#1A2A5E] tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                <b>zkCargo</b>Pass
              </h1>
              <h2 className="text-2xl font-bold tracking-tighter">{translations.subtitle}</h2>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                {translations.subtext}
              </p>
            </div>
            <div className="space-x-4">
              <Button asChild className="bg-[#3C3FB4] hover:bg-[#292B7B]">
                <Link href="/dashboard?role=customs">{translations.button1}</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/dashboard?role=importer">{translations.button2}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{translations.secondBlock}</h2>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                {translations.secondBlockSubtitle}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-12 mt-8">
              <div className="flex flex-col items-center space-y-2 border p-6 rounded-lg">
                <div className="p-2 bg-green-100 rounded-full">
                  <CheckCircle className="h-6 w-6 text-[#3C3FB4]" />
                </div>
                <h3 className="text-xl font-bold">{translations.secondBlockItem1}</h3>
                <p className="text-gray-500 text-center">
                  {translations.secondBlockItem1Subtitle}
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border p-6 rounded-lg">
                <div className="p-2 bg-green-100 rounded-full">
                  <RefreshCw className="h-6 w-6 text-[#3C3FB4]" />
                </div>
                <h3 className="text-xl font-bold">{translations.secondBlockItem2}</h3>
                <p className="text-gray-500 text-center">
                  {translations.secondBlockItem2Subtitle}
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border p-6 rounded-lg">
                <div className="p-2 bg-green-100 rounded-full">
                  <Lock className="h-6 w-6 text-[#3C3FB4]" />
                </div>
                <h3 className="text-xl font-bold">{translations.secondBlockItem3}</h3>
                <p className="text-gray-500 text-center">
                  {translations.secondBlockItem3Subtitle}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{translations.howItWorks}</h2>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                {translations.howItWorksDescription}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-12 mt-8">
              <div className="flex flex-col items-center space-y-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-[#3C3FB4]">
                  <FileText className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">{translations.step1Title}</h3>
                <p className="text-gray-500 text-center">
                  {translations.step1Description}
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-[#3C3FB4]">
                  <Lock className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">{translations.step2Title}</h3>
                <p className="text-gray-500 text-center">
                  {translations.step2Description}
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-[#3C3FB4]">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">{translations.step3Title}</h3>
                <p className="text-gray-500 text-center">
                  {translations.step3Description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{translations.techStack}</h2>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                {translations.techStackDescription}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12 mt-8">
              <div className="flex flex-col items-center space-y-2 border p-6 rounded-lg">
                <h3 className="text-xl font-bold">{translations.ethereum}</h3>
                <p className="text-gray-500 text-center">
                  {translations.ethereumDescription}
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border p-6 rounded-lg">
                <h3 className="text-xl font-bold">{translations.zkVerify}</h3>
                <p className="text-gray-500 text-center">
                  {translations.zkVerifyDescription}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-green-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                {translations.ctaTitle}
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                {translations.ctaDescription}
              </p>
            </div>
            <div className="space-x-4">
              <Button asChild className="bg-[#3C3FB4] hover:bg-[#292B7B]">
                <Link href="/dashboard">
                  {translations.getStarted} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-6 bg-gray-800 text-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm">© 2025 zkCargoPass. {translations.allRightsReserved}</p>
            </div>
            <div className="flex space-x-4">
              <Link href="#" className="text-sm hover:underline">
                {translations.privacyPolicy}
              </Link>
              <Link href="#" className="text-sm hover:underline">
                {translations.termsOfService}
              </Link>
              <Link href="#" className="text-sm hover:underline">
                {translations.contact}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
