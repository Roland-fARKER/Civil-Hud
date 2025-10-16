import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Calculator, Building2, Layers } from "lucide-react"
import Link from "next/link"

const calculators = [
  {
    title: "Calculadora de mampostería",
    description: "Calcule ladrillos, bloques, cemento y arena para paredes y particiones",
    icon: Building2,
    href: "/calculators/masonry",
    color: "#82ca57",
  },
  {
    title: "Calculadora de columnas y vigas",
    description: "Estime concreto, refuerzo de acero y encofrado para elementos estructurales",
    icon: Calculator,
    href: "/calculators/column-beam",
    color: "#234766",
  },
  {
    title: "Calculadora de losas",
    description: "Calcule materiales para losas de piso, nivelación y acabados",
    icon: Layers,
    href: "/calculators/floor",
    color: "#82ca57",
  },
]

export default function CalculatorsPage() {
  return (
    <div className="min-h-screen bg-[#f8faf9]">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#234766] mb-4 font-sans text-balance">Calculadoras de construcción</h1>
          <p className="text-lg text-[#8d99ae] max-w-2xl mx-auto text-pretty">
            Elija una calculadora para obtener estimaciones precisas de materiales para su proyecto de construcción
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {calculators.map((calc) => (
            <Link key={calc.title} href={calc.href}>
              <div className="bg-white rounded-2xl p-8 h-full border border-[#a9b1b2]/20 hover:border-[#82ca57] transition-all duration-300 hover:shadow-lg group cursor-pointer">
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: calc.color }}
                >
                  <calc.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-[#234766] mb-3 font-sans">{calc.title}</h3>
                <p className="text-[#8d99ae] leading-relaxed">{calc.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
