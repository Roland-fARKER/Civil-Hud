import Link from "next/link"
import { Calculator, Facebook, Twitter, Linkedin, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-[#234766] text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-[#82ca57] rounded-xl flex items-center justify-center">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold font-sans">CivilHud</span>
            </Link>
            <p className="text-white/80 leading-relaxed">
              Su plataforma confiable para cálculos de materiales de construcción, licitaciones competitivas y conexiones
              con proveedores.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 font-sans">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#features" className="text-white/80 hover:text-[#82ca57] transition-colors">
                  Características
                </Link>
              </li>
              <li>
                <Link href="#how-it-works" className="text-white/80 hover:text-[#82ca57] transition-colors">
                  Cómo Funciona
                </Link>
              </li>
              <li>
                <Link href="/calculators" className="text-white/80 hover:text-[#82ca57] transition-colors">
                  Calculadoras
                </Link>
              </li>
              <li>
                <Link href="/stores" className="text-white/80 hover:text-[#82ca57] transition-colors">
                  Ferreterías
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 font-sans">Compañía</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-white/80 hover:text-[#82ca57] transition-colors">
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/80 hover:text-[#82ca57] transition-colors">
                  Contacto
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-white/80 hover:text-[#82ca57] transition-colors">
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-white/80 hover:text-[#82ca57] transition-colors">
                  Términos de Servicio
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 font-sans">Conectar</h3>
            <div className="flex gap-4 mb-4">
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-[#82ca57] transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-[#82ca57] transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-[#82ca57] transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-[#82ca57] transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
            <p className="text-white/80 text-sm">
              Email: info@civilhud.co.ke
              <br />
              Phone: +505 7020 1212
            </p>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center text-white/60 text-sm">
          <p>&copy; {new Date().getFullYear()} CivilHud. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
