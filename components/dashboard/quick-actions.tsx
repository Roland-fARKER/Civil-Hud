"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calculator, FileText, Store, MessageSquare, User } from "lucide-react"
import Link from "next/link"

interface QuickActionsProps {
  userType: string
}

export function QuickActions({ userType }: QuickActionsProps) {
  const actions = [
    {
      title: "Calculadoras de materiales",
      description: "Calcule materiales para su proyecto",
      icon: Calculator,
      href: "/calculators",
      color: "bg-[#82ca57]",
    },
    {
      title: userType === "client" ? "Crear Licitación" : "Explorar Licitaciones",
      description: userType === "client" ? "Publicar una nueva licitación de proyecto" : "Encontrar proyectos para licitar",
      icon: FileText,
      href: userType === "client" ? "/tenders/create" : "/tenders",
      color: "bg-[#234766]",
    },
    {
      title: "Ferreterías",
      description: "Encuentra proveedores cercanos",
      icon: Store,
      href: "/stores",
      color: "bg-[#82ca57]",
    },
    {
      title: "Mensajes",
      description: "Ver tus conversaciones",
      icon: MessageSquare,
      href: "/messages",
      color: "bg-[#234766]",
    },
    {
      title: "Configuración de perfil",
      description: "Administra tu cuenta",
      icon: User,
      href: "/profile",
      color: "bg-[#82ca57]",
    },
  ]

  return (
    <Card className="border-[#a9b1b2]/20 rounded-xl lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-[#234766]">Acciones Rápidas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {actions.map((action) => (
            <Link key={action.title} href={action.href}>
              <Button
                variant="outline"
                className="h-auto flex-col items-start gap-2 p-4 w-full border-[#a9b1b2]/20 hover:border-[#82ca57] rounded-xl bg-transparent"
              >
                <div className={`${action.color} p-2 rounded-lg`}>
                  <action.icon className="h-5 w-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-[#234766]">{action.title}</div>
                  <div className="text-xs text-[#8d99ae]">{action.description}</div>
                </div>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
