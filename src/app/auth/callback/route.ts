import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;
  const redirectTo = requestUrl.searchParams.get("redirect_to")?.toString();
  // Handle the verification token directly if present
  const token = requestUrl.searchParams.get("token");
  const type = requestUrl.searchParams.get("type");

  if (token && type === "signup") {
    // This is an email verification flow
    const supabase = await createClient();
    await supabase.auth.verifyOtp({
      token_hash: token,
      type: "email",
    });
    return NextResponse.redirect(`${origin}/protected`);
  }

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  if (redirectTo) {
    return NextResponse.redirect(`${origin}${redirectTo}`);
  }

  // URL to redirect to after sign up process completes
  return NextResponse.redirect(`${origin}/protected`);
}
