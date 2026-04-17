import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { cartItems, userId, behaviorSignal } = await req.json();
    const FREE_THRESHOLD = 999;
    const total = cartItems.reduce((s: number, i: any) => s + i.product.price * i.quantity, 0);
    const remaining = FREE_THRESHOLD - total;

    let nudgeType: string | null = null;
    let message = '';
    let urgency = 'low';

    // Priority: low stock > price drop > delivery threshold
    const lowStockItem = cartItems.find((i: any) => i.product.stock <= 5);
    if (lowStockItem) {
      nudgeType = 'low-stock';
      message = `⚡ Only ${lowStockItem.product.stock} left of "${lowStockItem.product.name}" in your size!`;
      urgency = 'high';
    } else if (remaining > 0 && remaining < 400) {
      nudgeType = 'delivery-threshold';
      message = `You're just ₹${Math.ceil(remaining)} away from FREE delivery! 🚚`;
      urgency = 'medium';
    }

    return NextResponse.json({ nudgeType, message, urgency });
  } catch (e) {
    return NextResponse.json({ error: 'Nudge failed' }, { status: 500 });
  }
}
