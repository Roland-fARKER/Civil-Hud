"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

export function CreateTenderForm() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [projectType, setProjectType] = useState("")
  const [location, setLocation] = useState("")
  const [budgetRange, setBudgetRange] = useState("")
  const [deadline, setDeadline] = useState("")
  const [calculationId, setCalculationId] = useState("")
  const [calculations, setCalculations] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    fetchCalculations()
  }, [])

  const fetchCalculations = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from("calculations")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) throw error
      setCalculations(data || [])
    } catch (error) {
      console.error("Error al obtener cálculos:", error)
    }
  }

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
          description: "Por favor inicie sesión para publicar una licitación",
          variant: "destructive",
        })
        return
      }

      const { data, error } = await supabase
        .from("tenders")
        .insert({
          user_id: user.id,
          title,
          description,
          project_type: projectType,
          location,
          budget_range: budgetRange || null,
          deadline: deadline || null,
          calculation_id: calculationId || null,
          status: "open",
        })
        .select()
        .single()

      if (error) throw error

      toast({
        title: "Success",
        description: "Licitación publicada con éxito!",
      })

      router.push(`/tenders/${data.id}`)
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al publicar la licitación",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-8 bg-white rounded-2xl border-[#a9b1b2]/20">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-[#234766]">
            Título del proyecto *
          </Label>
          <Input
            id="title"
            placeholder="e.g., Residential Building Construction"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="rounded-xl border-[#a9b1b2]/40 focus:border-[#82ca57] focus:ring-[#82ca57]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-[#234766]">
            Descripción del proyecto *
          </Label>
          <Textarea
            id="description"
            placeholder="Proporcione información detallada sobre los requisitos de su proyecto..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={6}
            className="rounded-xl border-[#a9b1b2]/40 focus:border-[#82ca57] focus:ring-[#82ca57]"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="projectType" className="text-[#234766]">
              Tipo de proyecto *
            </Label>
            <Input
              id="projectType"
              placeholder="e.g., Residential, Commercial"
              value={projectType}
              onChange={(e) => setProjectType(e.target.value)}
              required
              className="rounded-xl border-[#a9b1b2]/40 focus:border-[#82ca57] focus:ring-[#82ca57]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-[#234766]">
              Ubicación *
            </Label>
            <Input
              id="location"
              placeholder="e.g., Nairobi, Kenya"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="rounded-xl border-[#a9b1b2]/40 focus:border-[#82ca57] focus:ring-[#82ca57]"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="budgetRange" className="text-[#234766]">
              Rango de presupuesto (Opcional)
            </Label>
            <Input
              id="budgetRange"
              placeholder="e.g., KES 1M - 2M"
              value={budgetRange}
              onChange={(e) => setBudgetRange(e.target.value)}
              className="rounded-xl border-[#a9b1b2]/40 focus:border-[#82ca57] focus:ring-[#82ca57]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline" className="text-[#234766]">
              Fecha límite (Opcional)
            </Label>
            <Input
              id="deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="rounded-xl border-[#a9b1b2]/40 focus:border-[#82ca57] focus:ring-[#82ca57]"
            />
          </div>
        </div>

        {calculations.length > 0 && (
          <div className="space-y-2">
            <Label htmlFor="calculation" className="text-[#234766]">
              Enlace a cálculo (Opcional)
            </Label>
            <Select value={calculationId} onValueChange={setCalculationId}>
              <SelectTrigger className="rounded-xl border-[#a9b1b2]/40 focus:border-[#82ca57] focus:ring-[#82ca57]">
                <SelectValue placeholder="Seleccionar un cálculo" />
              </SelectTrigger>
              <SelectContent>
                {calculations.map((calc) => (
                  <SelectItem key={calc.id} value={calc.id}>
                    {calc.project_name} ({calc.calculation_type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-[#82ca57] hover:bg-[#82ca57]/90 text-white rounded-xl"
          size="lg"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Posting...
            </>
          ) : (
            "Publicar licitación"
          )}
        </Button>
      </form>
    </Card>
  )
}
