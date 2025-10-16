"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Loader2, LogOut } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ProfileFormProps {
  profile: any
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const [fullName, setFullName] = useState(profile?.full_name || "")
  const [phone, setPhone] = useState(profile?.phone || "")
  const [userType, setUserType] = useState<"client" | "contractor" | "supplier">(profile?.user_type || "client")
  const [loading, setLoading] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = getSupabaseBrowserClient()

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          phone,
          user_type: userType,
        })
        .eq("id", profile.id)

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Success",
        description: "Profile updated successfully",
      })

      router.refresh()
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

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await supabase.auth.signOut()
      router.push("/")
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive",
      })
    } finally {
      setLoggingOut(false)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleUpdate} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-[#234766]">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={profile?.email || ""}
            disabled
            className="rounded-xl border-[#a9b1b2]/40 bg-[#f8faf9]"
          />
          <p className="text-xs text-[#8d99ae]">Email cannot be changed</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-[#234766]">
            Full Name
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
          <Label htmlFor="phone" className="text-[#234766]">
            Phone Number
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
            User Type
          </Label>
          <Select value={userType} onValueChange={(value: any) => setUserType(value)}>
            <SelectTrigger className="rounded-xl border-[#a9b1b2]/40 focus:border-[#82ca57] focus:ring-[#82ca57]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="client">Client (Project Owner)</SelectItem>
              <SelectItem value="contractor">Contractor</SelectItem>
              <SelectItem value="supplier">Supplier</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-[#82ca57] hover:bg-[#82ca57]/90 text-white rounded-xl"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            "Update Profile"
          )}
        </Button>
      </form>

      <div className="pt-6 border-t border-[#a9b1b2]/20">
        <Button
          onClick={handleLogout}
          disabled={loggingOut}
          variant="outline"
          className="w-full border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-xl bg-transparent"
        >
          {loggingOut ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Logging out...
            </>
          ) : (
            <>
              <LogOut className="mr-2 h-4 w-4" />
              Log Out
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
