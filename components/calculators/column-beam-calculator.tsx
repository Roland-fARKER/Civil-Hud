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

type ElementType = "column" | "beam"

export function ColumnBeamCalculator() {
  const [elementType, setElementType] = useState<ElementType>("column")
  const [length, setLength] = useState("")
  const [width, setWidth] = useState("")
  const [height, setHeight] = useState("")
  const [quantity, setQuantity] = useState("1")
  const [projectName, setProjectName] = useState("")
  const [results, setResults] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()
  const supabase = getSupabaseBrowserClient()

  const calculate = () => {
    const l = Number.parseFloat(length)
    const w = Number.parseFloat(width)
    const h = Number.parseFloat(height)
    const qty = Number.parseInt(quantity)

    if (!l || !w || !h || !qty) {
      toast({
        title: "Error",
        description: "Please fill in all dimensions",
        variant: "destructive",
      })
      return
    }

    // Volume in cubic meters per element
    const volumePerElement = l * w * h
    const totalVolume = volumePerElement * qty

    // Concrete calculation (1:2:4 mix ratio)
    // 1 cubic meter of concrete requires approximately:
    // - 7 bags of cement (50kg each)
    // - 0.42 cubic meters of sand
    // - 0.84 cubic meters of aggregate
    const cement = Math.ceil(totalVolume * 7)
    const sand = (totalVolume * 0.42).toFixed(2)
    const aggregate = (totalVolume * 0.84).toFixed(2)

    // Steel reinforcement (approximate 1-2% of concrete volume)
    // Using 1.5% as average
    const steelVolume = totalVolume * 0.015
    // Steel density: 7850 kg/m³
    const steelWeight = (steelVolume * 7850).toFixed(0)

    // Formwork area (surface area of element)
    let formworkArea = 0
    if (elementType === "column") {
      // Column: 4 sides
      formworkArea = 2 * (l + w) * h * qty
    } else {
      // Beam: 3 sides (bottom and 2 sides)
      formworkArea = (2 * h + w) * l * qty
    }

    setResults({
      volumePerElement: volumePerElement.toFixed(3),
      totalVolume: totalVolume.toFixed(3),
      cement,
      sand,
      aggregate,
      steelWeight,
      formworkArea: formworkArea.toFixed(2),
    })
  }

  const saveCalculation = async () => {
    if (!results || !projectName) {
      toast({
        title: "Error",
        description: "Please calculate and provide a project name",
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
          description: "Please login to save calculations",
          variant: "destructive",
        })
        return
      }

      const { error } = await supabase.from("calculations").insert({
        user_id: user.id,
        calculation_type: "column_beam",
        project_name: projectName,
        calculation_data: {
          elementType,
          length: Number.parseFloat(length),
          width: Number.parseFloat(width),
          height: Number.parseFloat(height),
          quantity: Number.parseInt(quantity),
        },
        results,
      })

      if (error) throw error

      toast({
        title: "Success",
        description: "Calculation saved successfully!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save calculation",
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
              Project Name
            </Label>
            <Input
              id="projectName"
              placeholder="e.g., Ground Floor Columns"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="rounded-xl border-[#a9b1b2]/40 focus:border-[#82ca57] focus:ring-[#82ca57]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="elementType" className="text-[#234766]">
              Element Type
            </Label>
            <Select value={elementType} onValueChange={(value: any) => setElementType(value)}>
              <SelectTrigger className="rounded-xl border-[#a9b1b2]/40 focus:border-[#82ca57] focus:ring-[#82ca57]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="column">Column</SelectItem>
                <SelectItem value="beam">Beam</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="length" className="text-[#234766]">
                Length (m)
              </Label>
              <Input
                id="length"
                type="number"
                step="0.1"
                placeholder="3"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="rounded-xl border-[#a9b1b2]/40 focus:border-[#82ca57] focus:ring-[#82ca57]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="width" className="text-[#234766]">
                Width (m)
              </Label>
              <Input
                id="width"
                type="number"
                step="0.1"
                placeholder="0.3"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                className="rounded-xl border-[#a9b1b2]/40 focus:border-[#82ca57] focus:ring-[#82ca57]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="height" className="text-[#234766]">
                Height (m)
              </Label>
              <Input
                id="height"
                type="number"
                step="0.1"
                placeholder="0.3"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="rounded-xl border-[#a9b1b2]/40 focus:border-[#82ca57] focus:ring-[#82ca57]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity" className="text-[#234766]">
                Quantity
              </Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                placeholder="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
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
            Calculate Materials
          </Button>
        </div>
      </Card>

      {results && (
        <Card className="p-8 bg-white rounded-2xl border-[#82ca57]">
          <h3 className="text-2xl font-bold text-[#234766] mb-6 font-sans">Calculation Results</h3>
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-[#f8faf9] rounded-xl">
                <div className="text-sm text-[#8d99ae] mb-1">Volume per Element</div>
                <div className="text-2xl font-bold text-[#234766]">
                  {results.volumePerElement} m<sup>3</sup>
                </div>
              </div>
              <div className="p-4 bg-[#f8faf9] rounded-xl">
                <div className="text-sm text-[#8d99ae] mb-1">Total Volume</div>
                <div className="text-2xl font-bold text-[#234766]">
                  {results.totalVolume} m<sup>3</sup>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-[#234766] text-lg">Concrete Materials</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-[#82ca57]/10 rounded-xl border border-[#82ca57]/30">
                  <div className="text-sm text-[#234766] mb-1 font-semibold">Cement (50kg bags)</div>
                  <div className="text-3xl font-bold text-[#82ca57]">{results.cement}</div>
                </div>
                <div className="p-4 bg-[#234766]/10 rounded-xl border border-[#234766]/30">
                  <div className="text-sm text-[#234766] mb-1 font-semibold">
                    Sand (m<sup>3</sup>)
                  </div>
                  <div className="text-3xl font-bold text-[#234766]">{results.sand}</div>
                </div>
                <div className="p-4 bg-[#f8faf9] rounded-xl">
                  <div className="text-sm text-[#8d99ae] mb-1">
                    Aggregate (m<sup>3</sup>)
                  </div>
                  <div className="text-2xl font-bold text-[#234766]">{results.aggregate}</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-[#234766] text-lg">Steel & Formwork</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-[#82ca57]/10 rounded-xl border border-[#82ca57]/30">
                  <div className="text-sm text-[#234766] mb-1 font-semibold">Steel Reinforcement (kg)</div>
                  <div className="text-3xl font-bold text-[#82ca57]">{results.steelWeight}</div>
                </div>
                <div className="p-4 bg-[#234766]/10 rounded-xl border border-[#234766]/30">
                  <div className="text-sm text-[#234766] mb-1 font-semibold">
                    Formwork Area (m<sup>2</sup>)
                  </div>
                  <div className="text-3xl font-bold text-[#234766]">{results.formworkArea}</div>
                </div>
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
            {saving ? "Saving..." : "Save Calculation"}
          </Button>
        </Card>
      )}
    </div>
  )
}
