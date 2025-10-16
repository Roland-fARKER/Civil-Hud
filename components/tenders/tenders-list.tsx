"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { MapPin, Calendar, DollarSign, Loader2 } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

export function TendersList() {
  const [tenders, setTenders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    fetchTenders()
  }, [])

  const fetchTenders = async () => {
    try {
      const { data, error } = await supabase
        .from("tenders")
        .select(
          `
          *,
          profiles:user_id (full_name, company_name),
          bids (id)
        `,
        )
        .eq("status", "open")
        .order("created_at", { ascending: false })

      if (error) throw error
      setTenders(data || [])
    } catch (error) {
      console.error("Error al recuperar las ofertas:", error)
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

  if (tenders.length === 0) {
    return (
      <Card className="p-12 text-center bg-white rounded-2xl border-[#a9b1b2]/20">
        <p className="text-[#8d99ae] text-lg">No hay licitaciones abiertas disponibles en este momento.</p>
      </Card>
    )
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tenders.map((tender) => (
        <Link key={tender.id} href={`/tenders/${tender.id}`}>
          <Card className="p-6 bg-white rounded-2xl border-[#a9b1b2]/20 hover:border-[#82ca57] transition-all duration-300 hover:shadow-lg cursor-pointer h-full">
            <div className="flex items-start justify-between mb-4">
              <Badge
                className={`${
                  tender.status === "open"
                    ? "bg-[#82ca57]/10 text-[#82ca57] border-[#82ca57]/30"
                    : "bg-[#8d99ae]/10 text-[#8d99ae] border-[#8d99ae]/30"
                } rounded-lg`}
              >
                {tender.status}
              </Badge>
              <span className="text-xs text-[#8d99ae]">{formatDistanceToNow(new Date(tender.created_at))} ago</span>
            </div>

            <h3 className="text-xl font-semibold text-[#234766] mb-2 font-sans line-clamp-2">{tender.title}</h3>
            <p className="text-[#8d99ae] text-sm mb-4 line-clamp-3">{tender.description}</p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-[#8d99ae]">
                <MapPin className="w-4 h-4" />
                <span>{tender.location}</span>
              </div>
              {tender.budget_range && (
                <div className="flex items-center gap-2 text-sm text-[#8d99ae]">
                  <DollarSign className="w-4 h-4" />
                  <span>{tender.budget_range}</span>
                </div>
              )}
              {tender.deadline && (
                <div className="flex items-center gap-2 text-sm text-[#8d99ae]">
                  <Calendar className="w-4 h-4" />
                  <span>Deadline: {new Date(tender.deadline).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#a9b1b2]/20">
              <span className="text-sm text-[#8d99ae]">
                Publicado por {tender.profiles?.company_name || tender.profiles?.full_name || "Anónimo"}
              </span>
              <span className="text-sm font-semibold text-[#82ca57]">{tender.bids?.length || 0} ofertas</span>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  )
}
