import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ChatInterface } from "@/components/messages/chat-interface"

export default async function ChatPage({ params }: { params: Promise<{ tenderId: string }> }) {
  const { tenderId } = await params

  return (
    <div className="min-h-screen bg-[#f8faf9]">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <ChatInterface tenderId={tenderId} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
