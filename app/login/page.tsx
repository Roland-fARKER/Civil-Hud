import { LoginForm } from "@/components/auth/login-form"
import { Calculator } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#f8faf9] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-[#82ca57] rounded-xl flex items-center justify-center">
              <Calculator className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-bold text-[#234766] font-sans">CivilHud</span>
          </Link>
          <h1 className="text-2xl font-bold text-[#234766] mb-2 font-sans">Bienvenido de nuevo</h1>
          <p className="text-[#8d99ae]">Inicia sesión en tu cuenta para continuar</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-[#a9b1b2]/20">
          <LoginForm />

          <div className="mt-6 text-center text-sm text-[#8d99ae]">
            No tienes una cuenta?{" "}
            <Link href="/signup" className="text-[#82ca57] hover:underline font-semibold">
              Regístrate
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
