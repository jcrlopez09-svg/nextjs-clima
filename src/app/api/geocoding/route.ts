import { NextResponse, type NextRequest } from "next/server";
import { searchCities } from "@/lib/weather";

/** Route Handler interno: proxy de geocodificación de Open-Meteo. */
export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const results = await searchCities(query);
    return NextResponse.json(
      { results },
      { headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" } },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error inesperado";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
