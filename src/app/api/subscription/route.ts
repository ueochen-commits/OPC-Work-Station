import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ authenticated: false, subscription: null });
    }

    const { data, error } = await supabase
      .from("subscriptions")
      .select("plan,status,trial_ends_at,current_period_start,current_period_end,renewal_reminder_enabled")
      .eq("user_id", user.id)
      .single();

    if (error) {
      return NextResponse.json({ authenticated: true, subscription: null, error: error.message }, { status: 200 });
    }

    return NextResponse.json({ authenticated: true, subscription: data });
  } catch (error) {
    return NextResponse.json(
      { authenticated: false, subscription: null, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 200 }
    );
  }
}
