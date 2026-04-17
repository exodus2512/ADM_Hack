import { NextRequest, NextResponse } from 'next/server';
import { mockProducts, getProductsByVibe } from '@/lib/mockData';

export async function POST(req: NextRequest) {
  try {
    const { userId, vibeMode } = await req.json();
    const feed = getProductsByVibe(vibeMode ?? 'casual');
    const trending = [...mockProducts].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 6);
    const completeLook = mockProducts.slice(4, 8);

    return NextResponse.json({ feed, trending, completeLook });
  } catch (e) {
    return NextResponse.json({ error: 'Recommendations failed' }, { status: 500 });
  }
}
