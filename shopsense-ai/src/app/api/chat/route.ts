import { NextRequest, NextResponse } from 'next/server';
import { generateGeminiText } from '@/lib/gcp/gemini';
import { verifyFirebaseIdToken } from '@/lib/gcp/firebaseAdmin';

export async function POST(req: NextRequest) {
  try {
    const { message, context } = await req.json();
    const uid = await verifyFirebaseIdToken(req);
    const lc = message.toLowerCase();

    let reply = "That's an interesting question! Since I'm in demo mode, I can help you with styling advice, pricing checks, or sizing.";

    const systemInstruction = 'You are ShopSense AI, a fashion shopping assistant. Keep replies concise, practical, and personalized to user vibe/cart context. Avoid unsafe or harmful recommendations.';
    const prompt = [
      `User message: ${String(message ?? '')}`,
      `Context: ${JSON.stringify(context ?? {})}`,
      `Authenticated user id: ${uid ?? 'anonymous'}`,
      'Answer as a helpful stylist. If the user asks for deals, include price and value framing.',
    ].join('\n');

    const geminiReply = await generateGeminiText(prompt, systemInstruction);
    if (geminiReply?.trim()) {
      return NextResponse.json({ reply: geminiReply.trim() });
    }

    if (lc.includes('worth it') || lc.includes('price') || lc.includes('deal')) {
      reply = "Our AI price intelligence indicates that prices right now are at a historic low for this season! It's a great time to buy, especially since you have items matching your vibe in your cart.";
    } else if (lc.includes('outfit') || lc.includes('friday') || lc.includes('party')) {
      reply = "For a Friday night output, I recommend pairing a slim-fit black top with the Floral Midi Dress and some statement jewelry. Our 'Complete the Look' engine on the homepage can assemble this instantly!";
    } else if (lc.includes('cheaper') || lc.includes('budget')) {
      reply = "I can definitely help! If you adjust your budget slider in your Style Profile (/profile), I'll automatically re-rank all products across the store to show you the best affordable options.";
    } else if (lc.includes('cart') || lc.includes('basket')) {
      reply = `You currently have ${context.cartCount} items in your cart. You're very close to unlocking free delivery!`;
    }

    await new Promise(r => setTimeout(r, 1200));

    return NextResponse.json({ reply });
  } catch (e) {
    return NextResponse.json({ error: 'Chat failed' }, { status: 500 });
  }
}
