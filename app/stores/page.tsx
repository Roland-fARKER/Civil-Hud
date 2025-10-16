import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Phone, Star } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default async function StoresPage() {
  const supabase = await createServerClient()

  const { data: stores } = await supabase.from("hardware_stores").select("*").order("rating", { ascending: false })

  return (
    <div className="min-h-screen bg-[#f8faf9]">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#234766] mb-2">Ferreterías</h1>
          <p className="text-[#8d99ae]">Encuentre proveedores de confianza cerca de usted</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {stores?.map((store) => (
            <Card key={store.id} className="border-[#a9b1b2]/20 rounded-xl hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-[#234766] flex items-start justify-between">
                  <span>{store.name}</span>
                  <Badge variant="outline" className="border-[#82ca57] text-[#82ca57]">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    {store.rating}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2 text-sm text-[#8d99ae]">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{store.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#8d99ae]">
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <span>{store.contact}</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {store.specialties?.map((specialty: string) => (
                    <Badge key={specialty} variant="secondary" className="text-xs bg-[#f8faf9] text-[#234766]">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  )
}
