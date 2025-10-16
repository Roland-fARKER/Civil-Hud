import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ColumnBeamCalculator } from "@/components/calculators/column-beam-calculator"

export default function ColumnBeamCalculatorPage() {
  return (
    <div className="min-h-screen bg-[#f8faf9]">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-[#234766] mb-4 font-sans text-balance">Column & Beam Calculator</h1>
            <p className="text-lg text-[#8d99ae] text-pretty">
              Estimate concrete, steel reinforcement, and formwork for structural elements
            </p>
          </div>
          <ColumnBeamCalculator />
        </div>
      </main>
      <Footer />
    </div>
  )
}
