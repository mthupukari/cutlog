import { defaultProfile } from "../data/mockData";
import { ensureProfileForUser } from "./profile";
import { isSupabaseConfigured, supabase } from "./supabase";

const redirectUrl = "cutlog://auth/callback";

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
      emailRedirectTo: redirectUrl,
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

export async function getAuthBootstrap() {
  if (!isSupabaseConfigured || !supabase) {
    return {
      authState: {
        email: defaultProfile.email,
        mode: "demo",
        status: "signed_in",
      },
      profile: defaultProfile,
    };
  }

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session?.user) {
    return {
      authState: {
        email: defaultProfile.email,
        mode: "magic_link",
        status: "signed_out",
      },
      profile: defaultProfile,
    };
  }

  const profile = await ensureProfileForUser(session.user, defaultProfile);

  return {
    authState: {
      email: session.user.email || profile.email,
      mode: "magic_link",
      status: "signed_in",
    },
    profile,
  };
}

export function subscribeToAuthChanges(onChange) {
  if (!isSupabaseConfigured || !supabase) {
    return () => {};
  }

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(async (_event, session) => {
    if (!session?.user) {
      onChange({
        authState: {
          email: defaultProfile.email,
          mode: "magic_link",
          status: "signed_out",
        },
        profile: defaultProfile,
      });
      return;
    }

    const profile = await ensureProfileForUser(session.user, defaultProfile);
    onChange({
      authState: {
        email: session.user.email || profile.email,
        mode: "magic_link",
        status: "signed_in",
      },
      profile,
    });
  });

  return () => subscription.unsubscribe();
}
