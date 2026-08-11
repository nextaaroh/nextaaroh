import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createAdminClient } from "@/lib/supabase/admin";

const ALLOWED_STATUS = [
  "new",
  "contacted",
  "confirmed",
  "in_progress",
  "delivered",
];

export async function GET() {
  const { authorized } = await requireAdmin();

  if (!authorized) {
    return NextResponse.json(
      {
        error: {
          code: "forbidden",
          message: "Admin access ज़रूरी है",
        },
      },
      { status: 403 }
    );
  }

  const admin = createAdminClient();

  const { data, error } = await admin
    .from("website_service_requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      {
        error: {
          code: "fetch_failed",
          message: error.message,
        },
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    data: data ?? [],
  });
}

export async function PATCH(req: NextRequest) {
  const { authorized } = await requireAdmin();

  if (!authorized) {
    return NextResponse.json(
      {
        error: {
          code: "forbidden",
          message: "Admin access ज़रूरी है",
        },
      },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !ALLOWED_STATUS.includes(status)) {
      return NextResponse.json(
        {
          error: {
            code: "validation_error",
            message: "Invalid id or status",
          },
        },
        { status: 400 }
      );
    }

    const admin = createAdminClient();

    const { error } = await admin
      .from("website_service_requests")
      .update({ status })
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        {
          error: {
            code: "update_failed",
            message: error.message,
          },
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch {
    return NextResponse.json(
      {
        error: {
          code: "invalid_json",
          message: "Invalid request body",
        },
      },
      { status: 400 }
    );
  }
}
