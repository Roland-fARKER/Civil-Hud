"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function SignupForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [userType, setUserType] = useState<"client" | "contractor" | "supplier">("client")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = getSupabaseBrowserClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
          data: {
            full_name: fullName,
            phone,
            user_type: userType,
          },
        },
      })

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        })
        return
      }

      if (data.user) {
        toast({
          title: "Success",
          description: "Account created! Please check your email to verify your account.",
        })

        // If email confirmation is disabled, redirect to dashboard
        if (data.session) {
          router.push("/dashboard")
          router.refresh()
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSignup} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName" className="text-[#234766]">
          Nombre completo
        </Label>
        <Input
          id="fullName"
          type="text"
          placeholder="John Doe"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          className="rounded-xl border-[#a9b1b2]/40 focus:border-[#82ca57] focus:ring-[#82ca57]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-[#234766]">
          Correo electrónico
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="rounded-xl border-[#a9b1b2]/40 focus:border-[#82ca57] focus:ring-[#82ca57]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="text-[#234766]">
          Número de teléfono
        </Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+254 700 000 000"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          className="rounded-xl border-[#a9b1b2]/40 focus:border-[#82ca57] focus:ring-[#82ca57]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="userType" className="text-[#234766]">
          Soy un
        </Label>
        <Select value={userType} onValueChange={(value: any) => setUserType(value)}>
          <SelectTrigger className="rounded-xl border-[#a9b1b2]/40 focus:border-[#82ca57] focus:ring-[#82ca57]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="client">Cliente (Propietario del proyecto)</SelectItem>
            <SelectItem value="contractor">Contratista</SelectItem>
            <SelectItem value="supplier">Proveedor</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-[#234766]">
          Contraseña
        </Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="rounded-xl border-[#a9b1b2]/40 focus:border-[#82ca57] focus:ring-[#82ca57]"
        />
        <p className="text-xs text-[#8d99ae]">Debe tener al menos 6 caracteres</p>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-[#82ca57] hover:bg-[#82ca57]/90 text-white rounded-xl"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creando cuenta...
          </>
        ) : (
          "Crear cuenta"
        )}
      </Button>
    </form>
  )
}
