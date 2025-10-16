import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MessagesList } from "@/components/messages/messages-list"

export default function MessagesPage() {
  return (
    <div className="min-h-screen bg-[#f8faf9]">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-[#234766] mb-4 font-sans text-balance">Mensajes</h1>
            <p className="text-lg text-[#8d99ae] text-pretty">
              Comunícate con contratistas y clientes sobre tus proyectos
            </p>
          </div>
          <MessagesList />
        </div>
      </main>
      <Footer />
    </div>
  )
}
