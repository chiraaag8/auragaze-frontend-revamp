import { NextResponse } from "next/server";

/** COD checkout endpoint — disabled in favor of online payment only. */
export async function POST() {
  return NextResponse.json(
    {
      error:
        "Cash on delivery is no longer available. Please pay online at checkout.",
    },
    { status: 410 },
  );
}
