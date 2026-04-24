import { isSupabaseConfigured, supabase } from "./supabase";

export async function sendMagicLink(email) {
  if (!isSupabaseConfigured || !supabase) {
    return {
      ok: false,
      message: "Supabase env vars are missing. Add them to send a real magic link.",
    };
  }

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: "cutlog://auth/callback",
    },
  });

  if (error) {
    return {
      ok: false,
      message: error.message,
    };
  }

  return {
    ok: true,
    message: `Magic link sent to ${email}.`,
  };
}
