import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { TenderDetails } from "@/components/tenders/tender-details"

export default function TenderDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-[#f8faf9]">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <TenderDetails tenderId={params.id} />
      </main>
      <Footer />
    </div>
  )
}
