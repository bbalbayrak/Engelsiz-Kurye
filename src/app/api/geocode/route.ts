import { NextRequest, NextResponse } from 'next/server';

async function nominatimFetch(params: Record<string, string>): Promise<[number, number] | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?${new URLSearchParams({ format: 'json', limit: '1', countrycodes: 'tr', ...params })}`;
    const res = await fetch(url, { headers: { 'User-Agent': 'EngelsizTeslimat/1.0' }, signal: AbortSignal.timeout(5000) });
    if (!res.ok) return null;
    const results = await res.json();
    if (results.length > 0) {
      const lat = parseFloat(results[0].lat);
      const lon = parseFloat(results[0].lon);
      if (!isNaN(lat) && !isNaN(lon)) return [lat, lon];
    }
  } catch { /* continue */ }
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const { siteName, neighborhood, street, buildingNo, city, district } = await request.json();

    if (!city || !district) {
      return NextResponse.json({ success: false, error: 'İl ve İlçe gereklidir.' }, { status: 400 });
    }

    const streetPart = [buildingNo, street].filter(Boolean).join(' ');

    // Strategy 1: Structured query
    if (streetPart) {
      const result = await nominatimFetch({ street: streetPart, city, county: district });
      if (result) return NextResponse.json({ success: true, latitude: result[0], longitude: result[1] });
    }

    // Strategy 2: Free-text with all parts
    const parts = [streetPart, neighborhood ? `${neighborhood} Mahallesi` : '', district, city, 'Turkey'].filter(Boolean);
    if (parts.length > 3) {
      const result = await nominatimFetch({ q: parts.join(', ') });
      if (result) return NextResponse.json({ success: true, latitude: result[0], longitude: result[1] });
    }

    // Strategy 3: Site name + location
    if (siteName) {
      const result = await nominatimFetch({ q: `${siteName}, ${district}, ${city}, Turkey` });
      if (result) return NextResponse.json({ success: true, latitude: result[0], longitude: result[1] });
    }

    // Strategy 4: District + city
    const result = await nominatimFetch({ q: `${district}, ${city}, Turkey` });
    if (result) return NextResponse.json({ success: true, latitude: result[0], longitude: result[1] });

    return NextResponse.json({ success: false, error: 'Konum bulunamadı.' });
  } catch {
    return NextResponse.json({ success: false, error: 'Sunucu hatası.' }, { status: 500 });
  }
}
