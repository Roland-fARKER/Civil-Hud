import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calculator, FileText, MessageSquare } from "lucide-react"

interface DashboardOverviewProps {
  userId: string
  userType: string
}

export async function DashboardOverview({ userId, userType }: DashboardOverviewProps) {
  const supabase = await createServerClient()

  // Fetch statistics
  const { count: calculationsCount } = await supabase
    .from("calculations")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)

  const { count: tendersCount } = await supabase
    .from("tenders")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)

  const { count: bidsCount } = await supabase
    .from("bids")
    .select("*", { count: "exact", head: true })
    .eq("contractor_id", userId)

  const { count: messagesCount } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .eq("read", false)

  const stats = [
    {
      title: "Cálculos guardados",
      value: calculationsCount || 0,
      icon: Calculator,
      color: "text-[#82ca57]",
    },
    {
      title: userType === "client" ? "Licitaciones activas" : "Ofertas enviadas",
      value: userType === "client" ? tendersCount || 0 : bidsCount || 0,
      icon: FileText,
      color: "text-[#234766]",
    },
    {
      title: "Mensajes no leídos",
      value: messagesCount || 0,
      icon: MessageSquare,
      color: "text-[#82ca57]",
    },
  ]

  return (
    <>
      {stats.map((stat) => (
        <Card key={stat.title} className="border-[#a9b1b2]/20 rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#8d99ae]">{stat.title}</CardTitle>
            <stat.icon className={`h-5 w-5 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#234766]">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </>
  )
}
