import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { updateSession } from "@/utils/supabase/middleware";
import { athleteMiddleware } from "@/utils/athlete/middleware";

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
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    // Check the user role
    const { data: userProfile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const userRole = userProfile?.role;
    if (profileError || !userRole) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
    // Redirect to respective dashboard if the user presses "/dashboard" in the URL
    if (request.nextUrl.pathname === "/dashboard") {
      console.log("Redirecting to specific dashboard based on user role");
      if (userRole === "admin") {
        return NextResponse.redirect(new URL("/dashboard/admin", request.url));
      } else if (userRole === "deportista") {
        return NextResponse.redirect(new URL("/dashboard/athlete", request.url));
      } else if (userRole === "auxiliar_administrativo") {
        return NextResponse.redirect(new URL("/dashboard/auxiliar", request.url));
      } else {
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
    if (userProfile.role === "deportista") {
      const athleteResponse = await athleteMiddleware(request, user);
      if (athleteResponse) return athleteResponse;
    }
    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
}

// matcher for the middleware to run
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/dashboard/admin/:path*",
    "/dashboard/athlete/:path*",
    "/dashboard/admin-auxiliar/:path*",
    "/dashboard/athlete/profile/:path*",
    "/dashboard/athlete/schedule/:path*",
    "/dashboard/athlete/carnet/:path*",
  ],
};
