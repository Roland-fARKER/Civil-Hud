import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"

interface ActiveTendersProps {
  userId: string
}

export async function ActiveTenders({ userId }: ActiveTendersProps) {
  const supabase = await createServerClient()

  const { data: tenders } = await supabase
    .from("tenders")
    .select("*, bids(count)")
    .eq("user_id", userId)
    .eq("status", "open")
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <Card className="border-[#a9b1b2]/20 rounded-xl">
      <CardHeader>
        <CardTitle className="text-[#234766]">Licitaciones activas</CardTitle>
      </CardHeader>
      <CardContent>
        {tenders && tenders.length > 0 ? (
          <div className="space-y-4">
            {tenders.map((tender) => (
              <Link key={tender.id} href={`/tenders/${tender.id}`}>
                <div className="flex items-start justify-between border-b border-[#a9b1b2]/20 pb-3 last:border-0 hover:bg-[#f8faf9] p-2 rounded-lg transition-colors cursor-pointer">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-[#234766]">{tender.title}</h4>
                      <Badge variant="outline" className="text-xs border-[#82ca57] text-[#82ca57]">
                        {tender.bids?.[0]?.count || 0} bids
                      </Badge>
                    </div>
                    <p className="text-sm text-[#8d99ae] mb-1">{tender.location}</p>
                    <p className="text-xs text-[#8d99ae]">
                      Publicado {formatDistanceToNow(new Date(tender.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-[#8d99ae] py-8">No hay licitaciones activas. ¡Crea tu primera licitación!</p>
        )}
      </CardContent>
    </Card>
  )
}
