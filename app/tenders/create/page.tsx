import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CreateTenderForm } from "@/components/tenders/create-tender-form"

export default function CreateTenderPage() {
  return (
    <div className="min-h-screen bg-[#f8faf9]">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-[#234766] mb-4 font-sans text-balance">Publicar una licitación</h1>
            <p className="text-lg text-[#8d99ae] text-pretty">
              Comparte los detalles de tu proyecto y recibe ofertas competitivas de contratistas
            </p>
          </div>
          <CreateTenderForm />
        </div>
      </main>
      <Footer />
    </div>
  )
}
