"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Send, Loader2, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { formatDistanceToNow } from "date-fns"

export function ChatInterface({ tenderId }: { tenderId: string }) {
  const [messages, setMessages] = useState<any[]>([])
  const [tender, setTender] = useState<any>(null)
  const [otherUser, setOtherUser] = useState<any>(null)
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    initializeChat()
  }, [tenderId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const initializeChat = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      setCurrentUserId(user.id)

      // Fetch tender
      const { data: tenderData, error: tenderError } = await supabase
        .from("tenders")
        .select(
          `*,
           profiles:user_id (id, full_name, company_name)`
        )
        .eq("id", tenderId)
        .single()

      if (tenderError) throw tenderError
      setTender(tenderData)

      // Determine other user
      let otherUserData = null
      if (user.id === tenderData.user_id) {
        const { data: bids } = await supabase
          .from("bids")
          .select("contractor_id, profiles:contractor_id (id, full_name, company_name)")
          .eq("tender_id", tenderId)
          .limit(1)

        if (bids && bids.length > 0) {
          otherUserData = bids[0].profiles
        }
      } else {
        otherUserData = tenderData.profiles
      }

      setOtherUser(otherUserData)

      // Cargar mensajes existentes
      await fetchMessages()

      // Marcar como leídos
      await supabase
        .from("messages")
        .update({ read: true })
        .eq("tender_id", tenderId)
        .eq("receiver_id", user.id)

      // 🔥 Suscribirse a mensajes nuevos solo cuando ya hay contexto
      subscribeToMessages(user.id)
    } catch (error) {
      console.error("Error al inicializar el chat:", error)
      toast({
        title: "Error",
        description: "No se pudo cargar el chat",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from("messages")
      .select(`*, sender:sender_id (full_name, company_name)`)
      .eq("tender_id", tenderId)
      .order("created_at", { ascending: true })

    if (!error && data) setMessages(data)
  }

  const subscribeToMessages = (userId: string) => {
    const channel = supabase
      .channel(`messages:tender:${tenderId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `tender_id=eq.${tenderId}`,
        },
        async (payload) => {
          // 🔥 Añadir mensaje al instante
          const newMsg = payload.new

          // Opcional: cargar datos del remitente
          const { data: sender } = await supabase
            .from("profiles")
            .select("id, full_name, company_name")
            .eq("id", newMsg.sender_id)
            .single()

          const enrichedMsg = { ...newMsg, sender }

          setMessages((prev) => [...prev, enrichedMsg])

          // Marcar como leído si el mensaje es para el usuario actual
          if (newMsg.receiver_id === userId) {
            await supabase.from("messages").update({ read: true }).eq("id", newMsg.id)
          }
        }
      )
      .subscribe()

    // Limpiar suscripción
    return () => {
      supabase.removeChannel(channel)
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !otherUser || !currentUserId) return

    setSending(true)
    try {
      const { error } = await supabase.from("messages").insert({
        tender_id: tenderId,
        sender_id: currentUserId,
        receiver_id: otherUser.id,
        message: newMessage.trim(),
        read: false,
      })

      if (error) throw error
      setNewMessage("")
    } catch {
      toast({
        title: "Error",
        description: "No se pudo enviar el mensaje",
        variant: "destructive",
      })
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <Card className="p-8 bg-white rounded-2xl border-[#a9b1b2]/20">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#82ca57]" />
        </div>
      </Card>
    )
  }

  if (!tender || !otherUser) {
    return (
      <Card className="p-8 bg-white rounded-2xl border-[#a9b1b2]/20">
        <p className="text-[#8d99ae] text-center py-8">No se pudo cargar el chat. Por favor, inténtalo de nuevo.</p>
      </Card>
    )
  }

  return (
    <Card className="bg-white rounded-2xl border-[#a9b1b2]/20 overflow-hidden">
      {/* Chat Header */}
      <div className="p-6 border-b border-[#a9b1b2]/20 bg-[#f8faf9]">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/messages")}
            className="rounded-xl hover:bg-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-[#234766] font-sans">{tender.title}</h2>
            <p className="text-sm text-[#8d99ae]">Chateando con {otherUser.company_name || otherUser.full_name}</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="h-[500px] overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-[#8d99ae]">No hay mensajes aún. ¡Inicia la conversación!</p>
          </div>
        ) : (
          messages.map((message) => {
            const isCurrentUser = message.sender_id === currentUserId
            return (
              <div key={message.id} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[70%] ${isCurrentUser ? "items-end" : "items-start"} flex flex-col gap-1`}>
                  <div
                    className={`px-4 py-3 rounded-2xl ${
                      isCurrentUser
                        ? "bg-[#82ca57] text-white rounded-br-sm"
                        : "bg-[#f8faf9] text-[#234766] rounded-bl-sm"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.message}</p>
                  </div>
                  <span className="text-xs text-[#8d99ae] px-2">
                    {formatDistanceToNow(new Date(message.created_at))} ago
                  </span>
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-6 border-t border-[#a9b1b2]/20 bg-[#f8faf9]">
        <form onSubmit={sendMessage} className="flex gap-3">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escribe tu mensaje..."
            disabled={sending}
            className="flex-1 rounded-xl border-[#a9b1b2]/40 focus:border-[#82ca57] focus:ring-[#82ca57] bg-white"
          />
          <Button
            type="submit"
            disabled={sending || !newMessage.trim()}
            className="bg-[#82ca57] hover:bg-[#82ca57]/90 text-white rounded-xl px-6"
          >
            {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </Button>
        </form>
      </div>
    </Card>
  )
}
