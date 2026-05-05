import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { username, code } = await req.json();

    if (!username || !code) {
      return NextResponse.json(
        { success: false, error: "Missing data" },
        { status: 400 }
      );
    }

    // 🔥 Fetch Instagram page
    const res = await fetch(`https://www.instagram.com/${username}/`, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    const html = await res.text();

    // 🔥 Check if code exists in page
    const found = html.includes(code);

    if (found) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false });
    }
  } catch (err) {
    console.error("Verification error:", err);

    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}
