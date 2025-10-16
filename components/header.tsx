"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calculator, Menu, X, MessageSquare } from "lucide-react"
import { useState, useEffect } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Badge } from "@/components/ui/badge"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    setIsAuthenticated(!!user)

    if (user) {
      // Fetch unread message count
      const { count } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .eq("receiver_id", user.id)
        .eq("read", false)

      setUnreadCount(count || 0)

      // Subscribe to message changes
      const channel = supabase
        .channel("unread-messages")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "messages",
            filter: `receiver_id=eq.${user.id}`,
          },
          async () => {
            const { count: newCount } = await supabase
              .from("messages")
              .select("*", { count: "exact", head: true })
              .eq("receiver_id", user.id)
              .eq("read", false)

            setUnreadCount(newCount || 0)
          },
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#a9b1b2]/20">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#82ca57] rounded-xl flex items-center justify-center">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-[#234766] font-sans">CivilHud</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-[#234766] hover:text-[#82ca57] transition-colors font-sans">
              Características
            </Link>
            <Link href="#how-it-works" className="text-[#234766] hover:text-[#82ca57] transition-colors font-sans">
              Cómo Funciona
            </Link>
            <Link href="/stores" className="text-[#234766] hover:text-[#82ca57] transition-colors font-sans">
              Ferreterías
            </Link>
            {isAuthenticated ? (
              <>
                <Link href="/calculators" className="text-[#234766] hover:text-[#82ca57] transition-colors font-sans">
                  Calculadoras
                </Link>
                <Link href="/tenders" className="text-[#234766] hover:text-[#82ca57] transition-colors font-sans">
                  Licitaciones
                </Link>
                <Link href="/messages" className="relative">
                  <Button
                    variant="ghost"
                    className="text-[#234766] hover:text-[#82ca57] hover:bg-transparent"
                    size="icon"
                  >
                    <MessageSquare className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 bg-[#82ca57] text-white rounded-full w-5 h-5 flex items-center justify-center p-0 text-xs">
                        {unreadCount}
                      </Badge>
                    )}
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button className="bg-[#82ca57] hover:bg-[#82ca57]/90 text-white rounded-xl">Dashboard</Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="outline"
                    className="border-[#82ca57] text-[#82ca57] hover:bg-[#82ca57] hover:text-white rounded-xl bg-transparent"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-[#82ca57] hover:bg-[#82ca57]/90 text-white rounded-xl">Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-[#234766]" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4">
            <Link href="#features" className="block text-[#234766] hover:text-[#82ca57] transition-colors font-sans">
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="block text-[#234766] hover:text-[#82ca57] transition-colors font-sans"
            >
              How It Works
            </Link>
            <Link href="/stores" className="block text-[#234766] hover:text-[#82ca57] transition-colors font-sans">
              Hardware Stores
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  href="/calculators"
                  className="block text-[#234766] hover:text-[#82ca57] transition-colors font-sans"
                >
                  Calculators
                </Link>
                <Link href="/tenders" className="block text-[#234766] hover:text-[#82ca57] transition-colors font-sans">
                  Tenders
                </Link>
                <Link
                  href="/messages"
                  className="block text-[#234766] hover:text-[#82ca57] transition-colors font-sans"
                >
                  Messages {unreadCount > 0 && `(${unreadCount})`}
                </Link>
                <Link href="/dashboard">
                  <Button className="w-full bg-[#82ca57] hover:bg-[#82ca57]/90 text-white rounded-xl">Dashboard</Button>
                </Link>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <Link href="/login">
                  <Button
                    variant="outline"
                    className="w-full border-[#82ca57] text-[#82ca57] hover:bg-[#82ca57] hover:text-white rounded-xl bg-transparent"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="w-full bg-[#82ca57] hover:bg-[#82ca57]/90 text-white rounded-xl">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  )
}
