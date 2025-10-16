"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calculator, Save } from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

type MasonryType = "brick" | "block"

export function MasonryCalculator() {
  const [masonryType, setMasonryType] = useState<MasonryType>("brick")
  const [length, setLength] = useState("")
  const [height, setHeight] = useState("")
  const [thickness, setThickness] = useState("")
  const [projectName, setProjectName] = useState("")
  const [results, setResults] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()
  const supabase = getSupabaseBrowserClient()

  const calculate = () => {
    const l = Number.parseFloat(length)
    const h = Number.parseFloat(height)
    const t = Number.parseFloat(thickness)

    if (!l || !h || !t) {
      toast({
        title: "Error",
        description: "Por favor complete todas las dimensiones",
        variant: "destructive",
      })
      return
    }

    // Wall area in square meters
    const area = l * h

    // Volume in cubic meters
    const volume = l * h * t

    let units = 0
    let cement = 0
    let sand = 0

    if (masonryType === "brick") {
      // Standard brick: 9" x 4.5" x 3" (0.23m x 0.11m x 0.076m)
      // Approximately 50 bricks per square meter for single brick wall
      units = Math.ceil(area * 50)
      // Cement: 0.3 bags per square meter
      cement = Math.ceil(area * 0.3)
      // Sand: 0.03 cubic meters per square meter
      sand = (area * 0.03).toFixed(2)
    } else {
      // Standard block: 16" x 8" x 6" (0.4m x 0.2m x 0.15m)
      // Approximately 12.5 blocks per square meter
      units = Math.ceil(area * 12.5)
      // Cement: 0.2 bags per square meter
      cement = Math.ceil(area * 0.2)
      // Sand: 0.02 cubic meters per square meter
      sand = (area * 0.02).toFixed(2)
    }

    setResults({
      area: area.toFixed(2),
      volume: volume.toFixed(2),
      units,
      cement,
      sand,
      unitType: masonryType === "brick" ? "bricks" : "blocks",
    })
  }

  const saveCalculation = async () => {
    if (!results || !projectName) {
      toast({
        title: "Error",
        description: "Calcule y proporcione un nombre de proyecto.",
        variant: "destructive",
      })
      return
    }

    setSaving(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: "Error",
          description: "Por favor inicie sesión para guardar cálculos",
          variant: "destructive",
        })
        return
      }

      const { error } = await supabase.from("calculations").insert({
        user_id: user.id,
        calculation_type: "masonry",
        project_name: projectName,
        calculation_data: {
          masonryType,
          length: Number.parseFloat(length),
          height: Number.parseFloat(height),
          thickness: Number.parseFloat(thickness),
        },
        results,
      })

      if (error) throw error

      toast({
        title: "Success",
        description: "¡Cálculo guardado con éxito!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al guardar el cálculo",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      <Card className="p-8 bg-white rounded-2xl border-[#a9b1b2]/20">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="projectName" className="text-[#234766]">
              Nombre del proyecto
            </Label>
            <Input
              id="projectName"
              placeholder="e.g., Main House Wall"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="rounded-xl border-[#a9b1b2]/40 focus:border-[#82ca57] focus:ring-[#82ca57]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="masonryType" className="text-[#234766]">
              Tipo de mampostería
            </Label>
            <Select value={masonryType} onValueChange={(value: any) => setMasonryType(value)}>
              <SelectTrigger className="rounded-xl border-[#a9b1b2]/40 focus:border-[#82ca57] focus:ring-[#82ca57]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="brick">Ladrillos (9" x 4.5" x 3")</SelectItem>
                <SelectItem value="block">Bloques (16" x 8" x 6")</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="length" className="text-[#234766]">
                Longitud (m)
              </Label>
              <Input
                id="length"
                type="number"
                step="0.1"
                placeholder="10"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="rounded-xl border-[#a9b1b2]/40 focus:border-[#82ca57] focus:ring-[#82ca57]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="height" className="text-[#234766]">
                Altura (m)
              </Label>
              <Input
                id="height"
                type="number"
                step="0.1"
                placeholder="3"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="rounded-xl border-[#a9b1b2]/40 focus:border-[#82ca57] focus:ring-[#82ca57]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="thickness" className="text-[#234766]">
                Espesor (m)
              </Label>
              <Input
                id="thickness"
                type="number"
                step="0.01"
                placeholder="0.23"
                value={thickness}
                onChange={(e) => setThickness(e.target.value)}
                className="rounded-xl border-[#a9b1b2]/40 focus:border-[#82ca57] focus:ring-[#82ca57]"
              />
            </div>
          </div>

          <Button
            onClick={calculate}
            className="w-full bg-[#82ca57] hover:bg-[#82ca57]/90 text-white rounded-xl"
            size="lg"
          >
            <Calculator className="mr-2 w-5 h-5" />
            Calcular materiales
          </Button>
        </div>
      </Card>

      {results && (
        <Card className="p-8 bg-white rounded-2xl border-[#82ca57]">
          <h3 className="text-2xl font-bold text-[#234766] mb-6 font-sans">Resultados del cálculo</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 bg-[#f8faf9] rounded-xl">
                <div className="text-sm text-[#8d99ae] mb-1">Área de la pared</div>
                <div className="text-2xl font-bold text-[#234766]">
                  {results.area} m<sup>2</sup>
                </div>
              </div>
              <div className="p-4 bg-[#f8faf9] rounded-xl">
                <div className="text-sm text-[#8d99ae] mb-1">Volumen</div>
                <div className="text-2xl font-bold text-[#234766]">
                  {results.volume} m<sup>3</sup>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-[#82ca57]/10 rounded-xl border border-[#82ca57]/30">
                <div className="text-sm text-[#234766] mb-1 font-semibold">
                  {masonryType === "brick" ? "Bricks" : "Blocks"} Required
                </div>
                <div className="text-3xl font-bold text-[#82ca57]">{results.units}</div>
              </div>
              <div className="p-4 bg-[#234766]/10 rounded-xl border border-[#234766]/30">
                <div className="text-sm text-[#234766] mb-1 font-semibold">Cemento (sacos de 50kg)</div>
                <div className="text-3xl font-bold text-[#234766]">{results.cement}</div>
              </div>
              <div className="p-4 bg-[#f8faf9] rounded-xl">
                <div className="text-sm text-[#8d99ae] mb-1">Arena (metros cúbicos)</div>
                <div className="text-2xl font-bold text-[#234766]">{results.sand}</div>
              </div>
            </div>
          </div>

          <Button
            onClick={saveCalculation}
            disabled={saving}
            className="w-full mt-6 bg-[#234766] hover:bg-[#234766]/90 text-white rounded-xl"
            size="lg"
          >
            <Save className="mr-2 w-5 h-5" />
            {saving ? "Guardando..." : "Guardar cálculo"}
          </Button>
        </Card>
      )}
    </div>
  )
}
