"use client"

import { Calculator, FileText, MessageSquare, Store, TrendingUp, Shield } from "lucide-react"
import { motion } from "framer-motion"

const features = [
  {
    icon: Calculator,
    title: "Calculadora de Materiales",
    description:
      "Calcula materiales de mampostería, columnas y vigas, y pisos con precisión. Obtén estimaciones instantáneas para cemento, arena, acero y más.",
    color: "#82ca57",
  },
  {
    icon: FileText,
    title: "Licitaciones Inteligentes",
    description:
      "Publica los requisitos de tu proyecto y recibe ofertas competitivas de contratistas verificados. Compara propuestas y elige la mejor opción.",
    color: "#234766",
  },
  {
    icon: MessageSquare,
    title: "Chat en Tiempo Real",
    description:
      "Communicate directly with contractors and suppliers. Discuss project details, negotiate terms, and clarify requirements instantly.",
    color: "#82ca57",
  },
  {
    icon: Store,
    title: "Directorio de Ferreterías",
    description:
      "Accede a una lista curada de ferreterías de confianza en Nicaragua. Encuentra proveedores cerca de ti con calificaciones y especialidades.",
    color: "#234766",
  },
  {
    icon: TrendingUp,
    title: "Gestión de Proyectos",
    description:
      "Realiza un seguimiento de todos tus cálculos, ofertas y proyectos en un solo lugar. Monitorea el progreso y gestiona múltiples proyectos de manera eficiente.",
    color: "#82ca57",
  },
  {
    icon: Shield,
    title: "Seguro y Confiable",
    description:
      "Tus datos están protegidos con seguridad de nivel empresarial. Todos los contratistas y proveedores están verificados para tu tranquilidad.",
    color: "#234766",
  },
]

export function Features() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#234766] mb-4 font-sans text-balance">
            Todo lo que necesitas para construir mejor
          </h2>
          <p className="text-lg text-[#8d99ae] max-w-2xl mx-auto text-pretty">
            Desde cálculos de materiales precisos hasta licitaciones competitivas y conexiones con proveedores, CivilHud simplifica
            todo tu flujo de trabajo en construcción.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-[#f8faf9] rounded-2xl p-6 h-full border border-[#a9b1b2]/20 hover:border-[#82ca57] transition-all duration-300 hover:shadow-lg">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: feature.color }}
                >
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-[#234766] mb-3 font-sans">{feature.title}</h3>
                <p className="text-[#8d99ae] leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
