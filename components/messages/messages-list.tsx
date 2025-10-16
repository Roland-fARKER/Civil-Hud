"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { MessageSquare, Loader2 } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

export function MessagesList() {
  const [conversations, setConversations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    fetchConversations()
  }, [])

  const fetchConversations = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      // 1️⃣ Tenders creados por el usuario (cliente)
      const { data: ownTenders, error: ownError } = await supabase
        .from("tenders") 
        .select(`
          id,
          title,
          status,
          user_id,
          profiles:user_id (full_name, company_name)
        `)
        .eq("user_id", user.id)

      if (ownError) throw ownError

      // 2️⃣ Tenders donde el usuario ha hecho una oferta (contratista)
      const { data: bidTenders, error: bidError } = await supabase
        .from("tenders")
        .select(`
          id,
          title,
          status,
          user_id,
          profiles:user_id (full_name, company_name),
          bids!inner (contractor_id)
        `)
        .eq("bids.contractor_id", user.id)

      if (bidError) throw bidError

      // 3️⃣ Combinar ambos sin duplicados
      const tenderMap = new Map()
      for (const t of [...(ownTenders || []), ...(bidTenders || [])]) {
        tenderMap.set(t.id, t)
      }
      const tenders = Array.from(tenderMap.values())

      // 4️⃣ Obtener el último mensaje y cantidad no leída por tender
      const conversationsWithMessages = await Promise.all(
        tenders.map(async (tender) => {
          const { data: messages, error: messagesError } = await supabase
            .from("messages")
            .select(
              `
              *,
              sender:sender_id (full_name, company_name)
            `
            )
            .eq("tender_id", tender.id)
            .order("created_at", { ascending: false })
            .limit(1)

          if (messagesError) throw messagesError

          const { count: unreadCount } = await supabase
            .from("messages")
            .select("*", { count: "exact", head: true })
            .eq("tender_id", tender.id)
            .eq("receiver_id", user.id)
            .eq("read", false)

          return {
            tender,
            lastMessage: messages?.[0],
            unreadCount: unreadCount || 0,
          }
        })
      )

      // 5️⃣ Filtrar y ordenar por fecha del último mensaje
      const filtered = conversationsWithMessages
        .filter((conv) => conv.lastMessage)
        .sort((a, b) => {
          const timeA = new Date(a.lastMessage.created_at).getTime()
          const timeB = new Date(b.lastMessage.created_at).getTime()
          return timeB - timeA
        })

      setConversations(filtered)
    } catch (error) {
      console.error("Error al recuperar conversaciones:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#82ca57]" />
      </div>
    )
  }

  if (conversations.length === 0) {
    return (
      <Card className="p-12 text-center bg-white rounded-2xl border-[#a9b1b2]/20">
        <MessageSquare className="w-16 h-16 text-[#8d99ae] mx-auto mb-4" />
        <p className="text-[#8d99ae] text-lg">No hay conversaciones aún.</p>
        <p className="text-[#8d99ae] text-sm mt-2">
          Comienza a pujar por ofertas para iniciar conversaciones.
        </p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {conversations.map((conv) => (
        <Link key={conv.tender.id} href={`/messages/${conv.tender.id}`}>
          <Card className="p-6 bg-white rounded-2xl border-[#a9b1b2]/20 hover:border-[#82ca57] transition-all duration-300 hover:shadow-lg cursor-pointer">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-[#234766] font-sans">
                    {conv.tender.title}
                  </h3>
                  {conv.unreadCount > 0 && (
                    <Badge className="bg-[#82ca57] text-white rounded-full px-2 py-0.5 text-xs">
                      {conv.unreadCount}
                    </Badge>
                  )}
                </div>
                <p className="text-[#8d99ae] text-sm line-clamp-2 mb-2">
                  <span className="font-semibold">
                    {conv.lastMessage.sender?.company_name ||
                      conv.lastMessage.sender?.full_name}
                    :
                  </span>{" "}
                  {conv.lastMessage.message}
                </p>
                <div className="flex items-center gap-4 text-xs text-[#8d99ae]">
                  <span>
                    {formatDistanceToNow(
                      new Date(conv.lastMessage.created_at)
                    )}{" "}
                    ago
                  </span>
                  <Badge
                    className={`${
                      conv.tender.status === "open"
                        ? "bg-[#82ca57]/10 text-[#82ca57] border-[#82ca57]/30"
                        : "bg-[#8d99ae]/10 text-[#8d99ae] border-[#8d99ae]/30"
                    } rounded-lg`}
                  >
                    {conv.tender.status}
                  </Badge>
                </div>
              </div>
              <MessageSquare className="w-6 h-6 text-[#82ca57]" />
            </div>
          </Card>
        </Link>
      ))}
    </div>
  )
}
