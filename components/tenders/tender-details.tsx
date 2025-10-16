"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { MapPin, Calendar, DollarSign, Loader2, MessageSquare } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { BidForm } from "./bid-form"
import { BidsList } from "./bids-list"
import Link from "next/link"

export function TenderDetails({ tenderId }: { tenderId: string }) {
  const [tender, setTender] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showBidForm, setShowBidForm] = useState(false)
  const [isOwner, setIsOwner] = useState(false)
  const [hasBid, setHasBid] = useState(false)
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    fetchTender()
  }, [tenderId])

  const fetchTender = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      const { data, error } = await supabase
        .from("tenders")
        .select(
          `
          *,
          profiles:user_id (full_name, company_name, phone, email),
          calculations (*)
        `,
        )
        .eq("id", tenderId)
        .single()

      if (error) throw error
      setTender(data)
      setIsOwner(user?.id === data.user_id)

      if (user && user.id !== data.user_id) {
        const { data: bidData } = await supabase
          .from("bids")
          .select("id")
          .eq("tender_id", tenderId)
          .eq("contractor_id", user.id)
          .single()

        setHasBid(!!bidData)
      }
    } catch (error) {
      console.error("Error fetching tender:", error)
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

  if (!tender) {
    return (
      <Card className="p-12 text-center bg-white rounded-2xl border-[#a9b1b2]/20">
        <p className="text-[#8d99ae] text-lg">Tender not found.</p>
      </Card>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <Card className="p-8 bg-white rounded-2xl border-[#a9b1b2]/20">
        <div className="flex items-start justify-between mb-6">
          <div>
            <Badge
              className={`${
                tender.status === "open"
                  ? "bg-[#82ca57]/10 text-[#82ca57] border-[#82ca57]/30"
                  : "bg-[#8d99ae]/10 text-[#8d99ae] border-[#8d99ae]/30"
              } rounded-lg mb-4`}
            >
              {tender.status}
            </Badge>
            <h1 className="text-3xl font-bold text-[#234766] mb-2 font-sans">{tender.title}</h1>
            <p className="text-[#8d99ae]">Posted {formatDistanceToNow(new Date(tender.created_at))} ago</p>
          </div>
          <div className="flex gap-3">
            {(isOwner || hasBid) && (
              <Link href={`/messages/${tenderId}`}>
                <Button
                  variant="outline"
                  className="border-[#234766] text-[#234766] hover:bg-[#234766] hover:text-white rounded-xl bg-transparent"
                >
                  <MessageSquare className="mr-2 w-5 h-5" />
                  Chat
                </Button>
              </Link>
            )}
            {!isOwner && tender.status === "open" && (
              <Button
                onClick={() => setShowBidForm(!showBidForm)}
                className="bg-[#82ca57] hover:bg-[#82ca57]/90 text-white rounded-xl"
              >
                {showBidForm ? "Cancel" : "Submit Bid"}
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-[#234766] mb-2 font-sans">Project Description</h3>
            <p className="text-[#8d99ae] leading-relaxed whitespace-pre-wrap">{tender.description}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#82ca57]/10 rounded-xl flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-[#82ca57]" />
                </div>
                <div>
                  <div className="text-sm text-[#8d99ae]">Location</div>
                  <div className="font-semibold text-[#234766]">{tender.location}</div>
                </div>
              </div>

              {tender.budget_range && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#234766]/10 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-[#234766]" />
                  </div>
                  <div>
                    <div className="text-sm text-[#8d99ae]">Budget Range</div>
                    <div className="font-semibold text-[#234766]">{tender.budget_range}</div>
                  </div>
                </div>
              )}

              {tender.deadline && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#82ca57]/10 rounded-xl flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-[#82ca57]" />
                  </div>
                  <div>
                    <div className="text-sm text-[#8d99ae]">Deadline</div>
                    <div className="font-semibold text-[#234766]">{new Date(tender.deadline).toLocaleDateString()}</div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-[#f8faf9] rounded-xl">
                <div className="text-sm text-[#8d99ae] mb-1">Project Type</div>
                <div className="font-semibold text-[#234766]">{tender.project_type}</div>
              </div>

              <div className="p-4 bg-[#f8faf9] rounded-xl">
                <div className="text-sm text-[#8d99ae] mb-1">Posted By</div>
                <div className="font-semibold text-[#234766]">
                  {tender.profiles?.company_name || tender.profiles?.full_name || "Anonymous"}
                </div>
                {tender.profiles?.phone && <div className="text-sm text-[#8d99ae] mt-1">{tender.profiles.phone}</div>}
              </div>
            </div>
          </div>

          {tender.calculations && (
            <div className="p-6 bg-[#82ca57]/5 rounded-xl border border-[#82ca57]/20">
              <h4 className="font-semibold text-[#234766] mb-3">Linked Calculation</h4>
              <div className="text-sm text-[#8d99ae]">
                <div>
                  <span className="font-semibold text-[#234766]">Project:</span> {tender.calculations.project_name}
                </div>
                <div>
                  <span className="font-semibold text-[#234766]">Type:</span> {tender.calculations.calculation_type}
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {showBidForm && !isOwner && <BidForm tenderId={tenderId} onSuccess={() => setShowBidForm(false)} />}

      <BidsList tenderId={tenderId} isOwner={isOwner} />
    </div>
  )
}
