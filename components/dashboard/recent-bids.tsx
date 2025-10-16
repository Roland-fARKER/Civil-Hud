import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"

interface RecentBidsProps {
  userId: string
}

export async function RecentBids({ userId }: RecentBidsProps) {
  const supabase = await createServerClient()

  const { data: bids } = await supabase
    .from("bids")
    .select("*, tenders(title, location)")
    .eq("contractor_id", userId)
    .order("created_at", { ascending: false })
    .limit(5)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "border-green-500 text-green-600"
      case "rejected":
        return "border-red-500 text-red-600"
      default:
        return "border-[#82ca57] text-[#82ca57]"
    }
  }

  return (
    <Card className="border-[#a9b1b2]/20 rounded-xl">
      <CardHeader>
        <CardTitle className="text-[#234766]">Ofertas recientes</CardTitle>
      </CardHeader>
      <CardContent>
        {bids && bids.length > 0 ? (
          <div className="space-y-4">
            {bids.map((bid) => (
              <Link key={bid.id} href={`/tenders/${bid.tender_id}`}>
                <div className="flex items-start justify-between border-b border-[#a9b1b2]/20 pb-3 last:border-0 hover:bg-[#f8faf9] p-2 rounded-lg transition-colors cursor-pointer">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-[#234766]">{bid.tenders?.title}</h4>
                      <Badge variant="outline" className={`text-xs ${getStatusColor(bid.status)}`}>
                        {bid.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-[#8d99ae] mb-1">Monto de la oferta: KES {bid.amount.toLocaleString()}</p>
                    <p className="text-xs text-[#8d99ae]">
                      Enviado {formatDistanceToNow(new Date(bid.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-[#8d99ae] py-8">¡No hay ofertas aún! Explora las licitaciones para enviar tu primera oferta.</p>
        )}
      </CardContent>
    </Card>
  )
}
