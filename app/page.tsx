import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { HowItWorks } from "@/components/how-it-works"
import { HardwareStores } from "@/components/hardware-stores"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f8faf9]">
      <Header />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <HardwareStores />
      </main>
      <Footer />
    </div>
  )
}
