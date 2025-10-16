import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MasonryCalculator } from "@/components/calculators/masonry-calculator"

export default function MasonryCalculatorPage() {
  return (
    <div className="min-h-screen bg-[#f8faf9]">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-[#234766] mb-4 font-sans text-balance">Calculadora de mampostería</h1>
            <p className="text-lg text-[#8d99ae] text-pretty">
              Calcule ladrillos, bloques, cemento y arena requeridos para su trabajo de mampostería
            </p>
          </div>
          <MasonryCalculator />
        </div>
      </main>
      <Footer />
    </div>
  )
}
