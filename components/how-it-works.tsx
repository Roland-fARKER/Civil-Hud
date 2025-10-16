"use client"

import { Calculator, FileText, MessageSquare, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"

const steps = [
  {
    icon: Calculator,
    title: "Calcular materiales",
    description:
      "Utiliza nuestras calculadoras avanzadas para determinar las cantidades exactas de materiales para tu proyecto. Elige entre cálculos de mampostería, estructurales o de pisos.",
    step: "01",
  },
  {
    icon: FileText,
    title: "Publicar tu Licitación",
    description:
      "Crea una licitación detallada con los requisitos de tu proyecto y los materiales calculados. Establece tu rango de presupuesto y fecha límite.",
    step: "02",
  },
  {
    icon: MessageSquare,
    title: "Recibir y Comparar Ofertas",
    description:
      "Recibe ofertas competitivas de contratistas verificados. Chatea directamente para discutir detalles, negociar términos y aclarar requisitos.",
    step: "03",
  },
  {
    icon: CheckCircle,
    title: "Seleccionar y Construir",
    description:
      "Selecciona al mejor contratista para tu proyecto. Realiza un seguimiento del progreso, gestiona las comunicaciones y construye con confianza.",
    step: "04",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-[#f8faf9]">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#234766] mb-4 font-sans text-balance">
            How CivilHud Works
          </h2>
          <p className="text-lg text-[#8d99ae] max-w-2xl mx-auto text-pretty">
            Four simple steps to transform your construction project from planning to execution.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative"
            >
              <div className="bg-white rounded-2xl p-6 h-full border border-[#a9b1b2]/20 hover:border-[#82ca57] transition-all duration-300 hover:shadow-lg">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#82ca57] rounded-xl flex items-center justify-center text-white font-bold text-lg font-sans shadow-lg">
                  {step.step}
                </div>
                <div className="w-14 h-14 bg-[#234766] rounded-xl flex items-center justify-center mb-4 mt-4">
                  <step.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-[#234766] mb-3 font-sans">{step.title}</h3>
                <p className="text-[#8d99ae] leading-relaxed">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-[#82ca57]/30" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
