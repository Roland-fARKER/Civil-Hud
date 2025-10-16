import { getUserSession, logout } from "@/lib/supabase/auth"
import { getUserProfile } from "@/lib/supabase/userProfile"
import { DashboardOverview } from "@/components/dashboard/dashboard-overview"
import { RecentCalculations } from "@/components/dashboard/recent-calculations"
import { ActiveTenders } from "@/components/dashboard/active-tenders"
import { RecentBids } from "@/components/dashboard/recent-bids"
import { QuickActions } from "@/components/dashboard/quick-actions"

export default async function DashboardPage() {
  const user = await getUserSession()

  // Si el usuario no existe (algo raro pasó, ej: cookie caducó)
  if (!user) {
    // Esto rara vez ocurrirá porque el middleware ya redirige
    // pero es útil como respaldo de seguridad.
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-semibold text-red-500">
          Sesión no válida o expirada.
        </h1>
        <p>Por favor, inicia sesión nuevamente.</p>
        <a href="/login" className="text-blue-600 underline mt-4 inline-block">
          Ir al login
        </a>
      </div>
    )
  }

  const profile = await getUserProfile(user.id)

  return (
    <div className="min-h-screen bg-[#f8faf9]">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#234766] mb-2">
            Bienvenido de nuevo, {profile?.full_name || "User"}!
          </h1>
          <p className="text-[#8d99ae]">
            Esto es lo que está pasando con tus proyectos.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3 mb-8">
          <DashboardOverview userId={user.id} userType={profile?.user_type || "client"} />
        </div>

        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          <QuickActions userType={profile?.user_type || "client"} />
        </div>

        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          <RecentCalculations userId={user.id} />
          {profile?.user_type === "client" && <ActiveTenders userId={user.id} />}
          {profile?.user_type === "contractor" && <RecentBids userId={user.id} />}
        </div>
      </div>
    </div>
  )
}

