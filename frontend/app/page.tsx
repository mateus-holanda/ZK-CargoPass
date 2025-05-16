import Link from "next/link"
import { ArrowRight, CheckCircle, FileText, Lock, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-gray-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="flex justify-center mb-4">
                <img src="/images/logo.png" alt="zkCargoPass Logo" className="h-32 w-auto" />
              </div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                zkCargoPass
              </h1>
              <h2 className="text-2xl font-bold tracking-tighter">Faster Customs with Blockchain & ZK Proofs</h2>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                Streamline customs clearance with secure, verifiable documentation using zero-knowledge proofs and
                blockchain technology.
              </p>
            </div>
            <div className="space-x-4">
              <Button asChild className="bg-green-600 hover:bg-green-700">
                <Link href="/dashboard?role=customs">I&apos;m Customs</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/dashboard?role=importer">I&apos;m an Importer</Link>
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
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Benefits</h2>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                Our solution provides significant advantages for both customs officials and importers.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-12 mt-8">
              <div className="flex flex-col items-center space-y-2 border p-6 rounded-lg">
                <div className="p-2 bg-green-100 rounded-full">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold">Cost Savings</h3>
                <p className="text-gray-500 text-center">
                  Save up to R$2,800 per container with faster processing and reduced administrative overhead.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border p-6 rounded-lg">
                <div className="p-2 bg-green-100 rounded-full">
                  <RefreshCw className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold">Faster Clearance</h3>
                <p className="text-gray-500 text-center">
                  Reduce customs clearance time by up to 70% with instant verification of documentation.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border p-6 rounded-lg">
                <div className="p-2 bg-green-100 rounded-full">
                  <Lock className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold">Enhanced Security</h3>
                <p className="text-gray-500 text-center">
                  Zero-knowledge proofs ensure data privacy while maintaining verifiability and compliance.
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
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                A simple three-step process to revolutionize customs clearance.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-12 mt-8">
              <div className="flex flex-col items-center space-y-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <FileText className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">1. Upload</h3>
                <p className="text-gray-500 text-center">
                  Securely upload your customs documentation in various formats (.xml, .pdf, .json).
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <Lock className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">2. Generate ZKP</h3>
                <p className="text-gray-500 text-center">
                  Our system generates a zero-knowledge proof that verifies your documentation without revealing
                  sensitive data.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">3. Verify</h3>
                <p className="text-gray-500 text-center">
                  Customs officials instantly verify the proof on the blockchain, accelerating the clearance process.
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
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Tech Stack</h2>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                Built with cutting-edge technology for security, speed, and reliability.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12 mt-8">
              <div className="flex flex-col items-center space-y-2 border p-6 rounded-lg">
                <h3 className="text-xl font-bold">Ethereum</h3>
                <p className="text-gray-500 text-center">
                  Leveraging the security and immutability of the Ethereum blockchain for verification and
                  record-keeping.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border p-6 rounded-lg">
                <h3 className="text-xl font-bold">zkVerify</h3>
                <p className="text-gray-500 text-center">
                  Our proprietary zero-knowledge proof system ensures data privacy while maintaining verifiability.
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
                Ready to Transform Customs Clearance?
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                Join the revolution in customs processing with zkCargoPass.
              </p>
            </div>
            <div className="space-x-4">
              <Button asChild className="bg-green-600 hover:bg-green-700">
                <Link href="/dashboard">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
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
              <p className="text-sm">© 2025 zkCargoPass. All rights reserved.</p>
            </div>
            <div className="flex space-x-4">
              <Link href="#" className="text-sm hover:underline">
                Privacy Policy
              </Link>
              <Link href="#" className="text-sm hover:underline">
                Terms of Service
              </Link>
              <Link href="#" className="text-sm hover:underline">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
