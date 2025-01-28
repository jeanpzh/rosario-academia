import { NextRequest, NextResponse } from "next/server";
import { createClient } from "./utils/supabase/server";
import { updateSession } from "./utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  try {
    // Update the session cookie
    await updateSession(request);

    // Create an supabase instance
    const supabase = await createClient();

    // Get the user
    const { data, error } = await supabase.auth.getUser();
    // If there is an error or no user, redirect to the sign-in page
    const user = data.user;
    if (error || !user) {
      return NextResponse.redirect(new URL("/auth/sign-in", request.url));
    }
    // Check the user role
    const { data: userProfile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    const userRole = userProfile?.role;
    // Redirect to respective dashboard if the user presses "/dashboard" in the URL
    if (error || !userRole) return NextResponse.redirect(new URL("/auth/sign-in", request.url));
    if (request.nextUrl.pathname === "/dashboard") {
      if (userRole === "admin") {
        return NextResponse.redirect(new URL("/dashboard/admin", request.url));
      } else if (userRole === "deportista") {
        return NextResponse.redirect(new URL("/dashboard/athlete", request.url));
      } else if (userRole === "auxiliar_administrativo") {
        return NextResponse.redirect(new URL("/dashboard/auxiliar", request.url));
      } else {
        // Si no coincide con ningún rol
        return NextResponse.redirect(new URL("/sign-in", request.url));
      }
    }
    // Redirect to the sign-in page if the user is not who they say they are
    if (request.nextUrl.pathname.startsWith("/dashboard/admin") && userRole !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    if (request.nextUrl.pathname.startsWith("/dashboard/athlete") && userRole !== "deportista") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    if (
      request.nextUrl.pathname.startsWith("/dashboard/auxiliar") &&
      userRole !== "auxiliar_administrativo"
    ) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error(error);
  }
}
// matcher for the middleware to run
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/dashboard/admin/:path*",
    "/dashboard/athlete/:path*",
    "/dashboard/admin-auxiliar/:path*",
  ],
};
