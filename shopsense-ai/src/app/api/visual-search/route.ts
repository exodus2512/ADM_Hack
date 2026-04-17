import { NextRequest, NextResponse } from 'next/server';
import { mockProducts } from '@/lib/mockData';
import { generateGeminiVisionText } from '@/lib/gcp/gemini';

export async function POST(req: NextRequest) {
  try {
    const { imageBase64, mimeType } = await req.json();

    let detectedAttributes: Record<string, unknown> | null = null;
    if (typeof imageBase64 === 'string' && imageBase64.length > 0) {
      const prompt = [
        'Analyze this fashion image and extract attributes as JSON with keys:',
        'category (string), style (string), color (string), genderTarget (string), occasion (string), tags (string[]).',
        'Return only valid JSON, no markdown.',
      ].join(' ');

      const vision = await generateGeminiVisionText(prompt, imageBase64, mimeType || 'image/jpeg');
      if (vision) {
        try {
          detectedAttributes = JSON.parse(vision);
        } catch {
          detectedAttributes = { raw: vision };
        }
      }
    }

    await new Promise((r) => setTimeout(r, 500));

    const shuffled = [...mockProducts].sort(() => Math.random() - 0.5);
    const similar = shuffled.slice(0, 6);
    const complementary = shuffled.slice(6, 9);

    return NextResponse.json({ similar, complementary, detectedAttributes });
  } catch (e) {
    return NextResponse.json({ error: 'Visual search failed' }, { status: 500 });
  }
}
