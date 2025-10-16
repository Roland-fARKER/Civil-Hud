"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Calculator, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#234766] mb-6 leading-tight font-sans text-balance">
              Tu mejor aliado para construir{" "}
              <span className="text-[#82ca57]">sin sorpresas.</span>
            </h1>
            <p className="text-lg md:text-xl text-[#8d99ae] mb-8 leading-relaxed text-pretty">
              Planifica, calcula y ahorra desde 15 hasta un 30% en tu proyecto
              con la plataforma más inteligente de Nicaragua.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-[#82ca57] hover:bg-[#82ca57]/90 text-white rounded-xl text-lg px-8"
                >
                  Ir a la Calculadora
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-[#234766] text-[#234766] hover:bg-[#234766] hover:text-white rounded-xl text-lg px-8 bg-transparent"
                >
                  Leer más
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-6 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#82ca57] font-sans">
                  500+
                </div>
                <div className="text-sm text-[#8d99ae]">Proyectos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#82ca57] font-sans">
                  1000+
                </div>
                <div className="text-sm text-[#8d99ae]">Usuarios</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#82ca57] font-sans">
                  50+
                </div>
                <div className="text-sm text-[#8d99ae]">Proveedores</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-[#a9b1b2]/20">
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-[#82ca57]/10 rounded-xl">
                  <div className="w-12 h-12 bg-[#82ca57] rounded-xl flex items-center justify-center">
                    <Calculator className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-[#234766] font-sans">
                      Calculadora de materiales
                    </div>
                    <div className="text-sm text-[#8d99ae]">
                      Estimaciones precisas en segundos
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-[#234766]/10 rounded-xl">
                  <div className="w-12 h-12 bg-[#234766] rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-[#234766] font-sans">
                      Licitaciones Competitivas
                    </div>
                    <div className="text-sm text-[#8d99ae]">
                      Obtén los mejores precios
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-[#82ca57]/10 rounded-xl">
                  <div className="w-12 h-12 bg-[#82ca57] rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-[#234766] font-sans">
                      Red de Proveedores Verificados
                    </div>
                    <div className="text-sm text-[#8d99ae]">
                      Conéctate con proveedores verificados
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
