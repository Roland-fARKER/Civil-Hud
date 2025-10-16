import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { ProfileForm } from "@/components/profile/profile-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function ProfilePage() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return (
    <div className="min-h-screen bg-[#f8faf9]">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#234766] mb-2">Ajustes de perfil</h1>
            <p className="text-[#8d99ae]">Administra la información de tu cuenta</p>
          </div>

          <Card className="border-[#a9b1b2]/20 rounded-xl">
            <CardHeader>
              <CardTitle className="text-[#234766]">Información personal</CardTitle>
            </CardHeader>
            <CardContent>
              <ProfileForm profile={profile} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
