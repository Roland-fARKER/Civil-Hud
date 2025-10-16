import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"

interface RecentCalculationsProps {
  userId: string
}

export async function RecentCalculations({ userId }: RecentCalculationsProps) {
  const supabase = await createServerClient()

  const { data: calculations } = await supabase
    .from("calculations")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <Card className="border-[#a9b1b2]/20 rounded-xl">
      <CardHeader>
        <CardTitle className="text-[#234766]">Cálculos recientes</CardTitle>
      </CardHeader>
      <CardContent>
        {calculations && calculations.length > 0 ? (
          <div className="space-y-4">
            {calculations.map((calc) => (
              <div
                key={calc.id}
                className="flex items-start justify-between border-b border-[#a9b1b2]/20 pb-3 last:border-0"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-[#234766]">{calc.project_name || "Proyecto sin título"}</h4>
                    <Badge variant="outline" className="text-xs border-[#82ca57] text-[#82ca57]">
                      {calc.calculation_type}
                    </Badge>
                  </div>
                  <p className="text-sm text-[#8d99ae]">
                    {formatDistanceToNow(new Date(calc.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-[#8d99ae] py-8">¡No hay cálculos aún! Comienza a usar nuestras calculadoras.</p>
        )}
      </CardContent>
    </Card>
  )
}
