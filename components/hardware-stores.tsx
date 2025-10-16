"use client"

import { Store, MapPin, Phone, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import Link from "next/link"

const stores = [
  {
    name: "Ferretería Kenya",
    location: "Masaya, Calle Real",
    phone: "+505 7020 1212",
    rating: 4.5,
    specialties: ["Cemento", "Acero", "Madera", "Tejas"],
    },
    {
      name: "Cemtech Supplies",
      location: "Managuia, Altamira",
      phone: "+505 7040 2343",
      rating: 4.3,
      specialties: ["Cemento", "Bloques", "Arena", "Agregados"],
    },
    {
      name: "Ferretería el Progreso",
      location: "Masaya, Calle Real",
      phone: "+505 7020 1212",
      rating: 4.7,
      specialties: ["Acero", "Hierro", "Refuerzos"],
    },
]

export function HardwareStores() {
  return (
    <section id="stores" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#234766] mb-4 font-sans text-balance">
            Ferreterías Confiables
          </h2>
          <p className="text-lg text-[#8d99ae] max-w-2xl mx-auto text-pretty">
            Conéctese con ferreterías verificadas en toda Kenia. Encuentre materiales de calidad y precios competitivos cerca de usted.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {stores.map((store, index) => (
            <motion.div
              key={store.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="bg-[#f8faf9] rounded-2xl p-6 h-full border border-[#a9b1b2]/20 hover:border-[#82ca57] transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-[#82ca57] rounded-xl flex items-center justify-center">
                    <Store className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center gap-1 bg-white px-3 py-1 rounded-lg">
                    <Star className="w-4 h-4 fill-[#82ca57] text-[#82ca57]" />
                    <span className="text-sm font-semibold text-[#234766]">{store.rating}</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-[#234766] mb-3 font-sans">{store.name}</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-[#8d99ae]">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{store.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#8d99ae]">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">{store.phone}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {store.specialties.map((specialty) => (
                    <span
                      key={specialty}
                      className="px-3 py-1 bg-white text-[#234766] text-xs rounded-lg border border-[#a9b1b2]/20"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/stores">
            <Button
              size="lg"
              variant="outline"
              className="border-[#82ca57] text-[#82ca57] hover:bg-[#82ca57] hover:text-white rounded-xl bg-transparent"
                >
              Ver todas las ferreterías
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
