import { cookies } from "next/headers"
import { createServerClient, createBrowserClient } from "@supabase/ssr"

// Detecta automáticamente si está en server o client
function isServer() {
  return typeof window === "undefined"
}

// ✅ Devuelve el cliente correcto según el contexto
function getSupabase() {
  if (isServer()) {
    const cookieStore = cookies()
    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          async get(name) {
            return (await cookieStore).get(name)?.value
          },
        },
      }
    )
  } else {
    return createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
}

export async function getUserSession() {
  const supabase = getSupabase()
  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) return null
  return data.user
}

export async function logout() {
  const supabase = getSupabase()
  await supabase.auth.signOut()
  if (!isServer()) window.location.href = "/login"
}
