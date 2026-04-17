import { NextRequest, NextResponse } from 'next/server';
import { mockProducts, getProductsByVibe } from '@/lib/mockData';
import { classifyIntent } from '@/lib/utils';
import { queryVertexSearch } from '@/lib/gcp/vertexSearch';
import { verifyFirebaseIdToken } from '@/lib/gcp/firebaseAdmin';

export async function POST(req: NextRequest) {
  try {
    const { query, vibe, userId } = await req.json();
    const uid = (await verifyFirebaseIdToken(req)) ?? userId;

    const vertexResults = query?.trim()
      ? await queryVertexSearch(String(query), uid)
      : null;

    // Classify intent
    const intent = classifyIntent(query ?? '');

    // Filter products by query keywords
    const filtered = (query?.trim()
      ? mockProducts.filter((p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.tags.some((t: string) => t.toLowerCase().includes(query.toLowerCase())) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.brand.toLowerCase().includes(query.toLowerCase())
        )
      : getProductsByVibe(vibe ?? 'casual')
    );

    const products = filtered.length > 0 ? filtered : mockProducts;

    // Rerank: buying = price asc, browsing = by rating
    const sorted = intent === 'buying'
      ? [...products].sort((a, b) => a.price - b.price)
      : [...products].sort((a, b) => b.rating - a.rating);

    const filters = {
      categories: [...new Set(products.map((p) => p.category))],
      brands: [...new Set(products.map((p) => p.brand))],
      priceRange: { min: Math.min(...products.map((p) => p.price)), max: Math.max(...products.map((p) => p.price)) },
    };

    return NextResponse.json({ intent, products: sorted, filters, vertexResults });
  } catch (e) {
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
