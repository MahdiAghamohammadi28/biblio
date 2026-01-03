import { supabase } from "@/utils/supabase";

export async function checkEmailExists(email: string) {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", email)
      .maybeSingle(); // safer than .single()

    if (error) {
      console.log("Error checking email:", error);
      return false;
    }

    return !!data; // true if email exists
  } catch (err) {
    console.log("Unexpected error:", err);
    return false;
  }
}
