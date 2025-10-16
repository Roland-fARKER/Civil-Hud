import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { TendersList } from "@/components/tenders/tenders-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function TendersPage() {
  return (
    <div className="min-h-screen bg-[#f8faf9]">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold text-[#234766] mb-4 font-sans text-balance">Explorar licitaciones</h1>
            <p className="text-lg text-[#8d99ae] text-pretty">Encuentre proyectos de construcción y presente ofertas competitivas</p>
          </div>
          <Link href="/tenders/create">
            <Button className="bg-[#82ca57] hover:bg-[#82ca57]/90 text-white rounded-xl">
              <Plus className="mr-2 w-5 h-5" />
              Publicar licitación
            </Button>
          </Link>
        </div>
        <TendersList />
      </main>
      <Footer />
    </div>
  )
}
