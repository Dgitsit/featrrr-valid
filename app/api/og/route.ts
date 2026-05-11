import ogs from "open-graph-scraper";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return Response.json({ error: "Missing URL" }, { status: 400 });
    }

    const { result } = await ogs({
      url,
      timeout: 5000,
      fetchOptions: {
        headers: {
          "user-agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      },
    });

    return Response.json({
      title: result.ogTitle || "",
      description: result.ogDescription || "",
      image: result.ogImage?.[0]?.url || "",
    });
  } catch (err) {
    console.error("OG ERROR:", err);
    return Response.json({ error: "Failed to scrape OG" }, { status: 500 });
  }
} 
