"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Loader2, CheckCircle, XCircle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useToast } from "@/hooks/use-toast"

export function BidsList({ tenderId, isOwner }: { tenderId: string; isOwner: boolean }) {
  const [bids, setBids] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    fetchBids()
  }, [tenderId])

  const fetchBids = async () => {
    try {
      const { data, error } = await supabase
        .from("bids")
        .select(
          `
          *,
          profiles:contractor_id (full_name, company_name, phone, email)
        `,
        )
        .eq("tender_id", tenderId)
        .order("created_at", { ascending: false })

      if (error) throw error
      setBids(data || [])
    } catch (error) {
      console.error("Error fetching bids:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateBidStatus = async (bidId: string, status: "accepted" | "rejected") => {
    try {
      const { error } = await supabase.from("bids").update({ status }).eq("id", bidId)

      if (error) throw error

      toast({
        title: "Success",
        description: `Bid ${status} successfully!`,
      })

      fetchBids()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update bid status",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <Card className="p-8 bg-white rounded-2xl border-[#a9b1b2]/20">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-[#82ca57]" />
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-8 bg-white rounded-2xl border-[#a9b1b2]/20">
      <h3 className="text-2xl font-bold text-[#234766] mb-6 font-sans">Bids Received ({bids.length})</h3>

      {bids.length === 0 ? (
        <p className="text-[#8d99ae] text-center py-8">No bids submitted yet.</p>
      ) : (
        <div className="space-y-4">
          {bids.map((bid) => (
            <div key={bid.id} className="p-6 bg-[#f8faf9] rounded-xl border border-[#a9b1b2]/20">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="font-semibold text-[#234766] text-lg">
                    {bid.profiles?.company_name || bid.profiles?.full_name || "Anonymous"}
                  </div>
                  <div className="text-sm text-[#8d99ae]">
                    Submitted {formatDistanceToNow(new Date(bid.created_at))} ago
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-[#82ca57]">KES {Number(bid.amount).toLocaleString()}</div>
                  <Badge
                    className={`${
                      bid.status === "accepted"
                        ? "bg-[#82ca57]/10 text-[#82ca57] border-[#82ca57]/30"
                        : bid.status === "rejected"
                          ? "bg-red-500/10 text-red-500 border-red-500/30"
                          : "bg-[#8d99ae]/10 text-[#8d99ae] border-[#8d99ae]/30"
                    } rounded-lg mt-2`}
                  >
                    {bid.status}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="text-sm font-semibold text-[#234766] mb-1">Proposal</div>
                  <p className="text-[#8d99ae] text-sm leading-relaxed whitespace-pre-wrap">{bid.proposal}</p>
                </div>

                {bid.timeline && (
                  <div>
                    <div className="text-sm font-semibold text-[#234766] mb-1">Timeline</div>
                    <p className="text-[#8d99ae] text-sm">{bid.timeline}</p>
                  </div>
                )}

                {bid.profiles?.phone && (
                  <div>
                    <div className="text-sm font-semibold text-[#234766] mb-1">Contact</div>
                    <p className="text-[#8d99ae] text-sm">
                      {bid.profiles.phone}
                      {bid.profiles.email && ` • ${bid.profiles.email}`}
                    </p>
                  </div>
                )}
              </div>

              {isOwner && bid.status === "pending" && (
                <div className="flex gap-3 mt-4 pt-4 border-t border-[#a9b1b2]/20">
                  <Button
                    onClick={() => updateBidStatus(bid.id, "accepted")}
                    className="flex-1 bg-[#82ca57] hover:bg-[#82ca57]/90 text-white rounded-xl"
                  >
                    <CheckCircle className="mr-2 w-4 h-4" />
                    Accept Bid
                  </Button>
                  <Button
                    onClick={() => updateBidStatus(bid.id, "rejected")}
                    variant="outline"
                    className="flex-1 border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-xl bg-transparent"
                  >
                    <XCircle className="mr-2 w-4 h-4" />
                    Reject Bid
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
