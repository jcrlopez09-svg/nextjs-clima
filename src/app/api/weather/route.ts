import { NextResponse, type NextRequest } from "next/server";
import { getWeatherByCoords } from "@/lib/weather";

/** Route Handler interno: datos del clima para el buscador y favoritos. */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const latitude = Number(params.get("lat"));
  const longitude = Number(params.get("lon"));

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return NextResponse.json(
      { error: "Se requieren los parámetros lat y lon." },
      { status: 400 },
    );
  }

  try {
    const snapshot = await getWeatherByCoords(latitude, longitude);
    return NextResponse.json(snapshot, {
      headers: { "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error inesperado";
    const status = message.includes("Coordenadas") ? 400 : 502;
    return NextResponse.json({ error: message }, { status });
  }
}
