import { getSupabaseBrowserClient} from "./client"

export async function getUserProfile(userId: string) {
  const supabase = await getSupabaseBrowserClient()
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single()

  if (error) console.error("Error fetching profile:", error)
  return data
}
