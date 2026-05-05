 export async function POST(req: Request) {
  const { username, code, platform } = await req.json();

  // 🔥 FUTURE:
  // Call scraper / API here

  return Response.json({
    verified: true, // simulate for now
  });
}
