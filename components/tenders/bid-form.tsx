"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

export function BidForm({ tenderId, onSuccess }: { tenderId: string; onSuccess: () => void }) {
  const [amount, setAmount] = useState("")
  const [proposal, setProposal] = useState("")
  const [timeline, setTimeline] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const supabase = getSupabaseBrowserClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: "Error",
          description: "Please login to submit a bid",
          variant: "destructive",
        })
        return
      }

      const { error } = await supabase.from("bids").insert({
        tender_id: tenderId,
        contractor_id: user.id,
        amount: Number.parseFloat(amount),
        proposal,
        timeline: timeline || null,
        status: "pending",
      })

      if (error) throw error

      toast({
        title: "Success",
        description: "Bid submitted successfully!",
      })

      onSuccess()
      setAmount("")
      setProposal("")
      setTimeline("")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit bid",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-8 bg-white rounded-2xl border-[#82ca57]">
      <h3 className="text-2xl font-bold text-[#234766] mb-6 font-sans">Submit Your Bid</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="amount" className="text-[#234766]">
            Bid Amount (KES) *
          </Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            placeholder="1000000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className="rounded-xl border-[#a9b1b2]/40 focus:border-[#82ca57] focus:ring-[#82ca57]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="proposal" className="text-[#234766]">
            Proposal *
          </Label>
          <Textarea
            id="proposal"
            placeholder="Describe your approach, experience, and why you're the best fit for this project..."
            value={proposal}
            onChange={(e) => setProposal(e.target.value)}
            required
            rows={6}
            className="rounded-xl border-[#a9b1b2]/40 focus:border-[#82ca57] focus:ring-[#82ca57]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="timeline" className="text-[#234766]">
            Estimated Timeline (Optional)
          </Label>
          <Input
            id="timeline"
            placeholder="e.g., 3 months"
            value={timeline}
            onChange={(e) => setTimeline(e.target.value)}
            className="rounded-xl border-[#a9b1b2]/40 focus:border-[#82ca57] focus:ring-[#82ca57]"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-[#82ca57] hover:bg-[#82ca57]/90 text-white rounded-xl"
          size="lg"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Bid"
          )}
        </Button>
      </form>
    </Card>
  )
}
