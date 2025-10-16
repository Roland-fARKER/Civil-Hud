"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Calculator, Save } from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

export function FloorCalculator() {
  const [length, setLength] = useState("")
  const [width, setWidth] = useState("")
  const [slabThickness, setSlabThickness] = useState("")
  const [screedThickness, setScreedThickness] = useState("")
  const [projectName, setProjectName] = useState("")
  const [results, setResults] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()
  const supabase = getSupabaseBrowserClient()

  const calculate = () => {
    const l = Number.parseFloat(length)
    const w = Number.parseFloat(width)
    const st = Number.parseFloat(slabThickness)
    const scr = Number.parseFloat(screedThickness)

    if (!l || !w || !st) {
      toast({
        title: "Error",
        description: "Please fill in required dimensions",
        variant: "destructive",
      })
      return
    }

    // Floor area in square meters
    const area = l * w

    // Slab volume in cubic meters
    const slabVolume = l * w * st

    // Concrete for slab (1:2:4 mix)
    const slabCement = Math.ceil(slabVolume * 7)
    const slabSand = (slabVolume * 0.42).toFixed(2)
    const slabAggregate = (slabVolume * 0.84).toFixed(2)

    // Steel reinforcement (1.5% of concrete volume)
    const steelVolume = slabVolume * 0.015
    const steelWeight = (steelVolume * 7850).toFixed(0)

    // Screed calculation (if provided)
    let screedCement = 0
    let screedSand = 0
    if (scr) {
      const screedVolume = l * w * scr
      // Screed mix ratio 1:4 (cement:sand)
      screedCement = Math.ceil(screedVolume * 5)
      screedSand = (screedVolume * 0.8).toFixed(2)
    }

    setResults({
      area: area.toFixed(2),
      slabVolume: slabVolume.toFixed(3),
      slabCement,
      slabSand,
      slabAggregate,
      steelWeight,
      screedCement,
      screedSand,
      hasScreed: !!scr,
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
        calculation_type: "floor",
        project_name: projectName,
        calculation_data: {
          length: Number.parseFloat(length),
          width: Number.parseFloat(width),
          slabThickness: Number.parseFloat(slabThickness),
          screedThickness: screedThickness ? Number.parseFloat(screedThickness) : null,
        },
        results,
      })

      if (error) throw error

      toast({
        title: "Success",
        description: "Cálculo guardado con éxito!",
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
              placeholder="e.g., Ground Floor Slab"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="rounded-xl border-[#a9b1b2]/40 focus:border-[#82ca57] focus:ring-[#82ca57]"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
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
              <Label htmlFor="width" className="text-[#234766]">
                Ancho (m)
              </Label>
              <Input
                id="width"
                type="number"
                step="0.1"
                placeholder="8"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                className="rounded-xl border-[#a9b1b2]/40 focus:border-[#82ca57] focus:ring-[#82ca57]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slabThickness" className="text-[#234766]">
                Espesor de losa (m)
              </Label>
              <Input
                id="slabThickness"
                type="number"
                step="0.01"
                placeholder="0.15"
                value={slabThickness}
                onChange={(e) => setSlabThickness(e.target.value)}
                className="rounded-xl border-[#a9b1b2]/40 focus:border-[#82ca57] focus:ring-[#82ca57]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="screedThickness" className="text-[#234766]">
                Espesor de nivelación (m) - Opcional
              </Label>
              <Input
                id="screedThickness"
                type="number"
                step="0.01"
                placeholder="0.05"
                value={screedThickness}
                onChange={(e) => setScreedThickness(e.target.value)}
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
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-[#f8faf9] rounded-xl">
                <div className="text-sm text-[#8d99ae] mb-1">Área del piso</div>
                <div className="text-2xl font-bold text-[#234766]">
                  {results.area} m<sup>2</sup>
                </div>
              </div>
              <div className="p-4 bg-[#f8faf9] rounded-xl">
                <div className="text-sm text-[#8d99ae] mb-1">Volumen de losa</div>
                <div className="text-2xl font-bold text-[#234766]">
                  {results.slabVolume} m<sup>3</sup>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-[#234766] text-lg">Materiales de losa</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-[#82ca57]/10 rounded-xl border border-[#82ca57]/30">
                  <div className="text-sm text-[#234766] mb-1 font-semibold">Cemento (sacos de 50kg)</div>
                  <div className="text-3xl font-bold text-[#82ca57]">{results.slabCement}</div>
                </div>
                <div className="p-4 bg-[#234766]/10 rounded-xl border border-[#234766]/30">
                  <div className="text-sm text-[#234766] mb-1 font-semibold">
                    Arena (m<sup>3</sup>)
                  </div>
                  <div className="text-3xl font-bold text-[#234766]">{results.slabSand}</div>
                </div>
                <div className="p-4 bg-[#f8faf9] rounded-xl">
                  <div className="text-sm text-[#8d99ae] mb-1">
                    Agregado (m<sup>3</sup>)
                  </div>
                  <div className="text-2xl font-bold text-[#234766]">{results.slabAggregate}</div>
                </div>
              </div>
              <div className="p-4 bg-[#82ca57]/10 rounded-xl border border-[#82ca57]/30">
                <div className="text-sm text-[#234766] mb-1 font-semibold">Refuerzo de acero (kg)</div>
                <div className="text-3xl font-bold text-[#82ca57]">{results.steelWeight}</div>
              </div>
            </div>

            {results.hasScreed && (
              <div className="space-y-4">
                <h4 className="font-semibold text-[#234766] text-lg">Materiales de nivelación</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-[#234766]/10 rounded-xl border border-[#234766]/30">
                    <div className="text-sm text-[#234766] mb-1 font-semibold">Cemento (sacos de 50kg)</div>
                    <div className="text-3xl font-bold text-[#234766]">{results.screedCement}</div>
                  </div>
                  <div className="p-4 bg-[#f8faf9] rounded-xl">
                    <div className="text-sm text-[#8d99ae] mb-1">
                      Arena (m<sup>3</sup>)
                    </div>
                    <div className="text-2xl font-bold text-[#234766]">{results.screedSand}</div>
                  </div>
                </div>
              </div>
            )}
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
