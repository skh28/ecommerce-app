import Link from "next/link";
import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { OrderDetailView } from "@/components/order-detail-view";

type Props = { params: Promise<{ id: string }> };

export default async function OrderDetailPage({ params }: Props) {
  const session = await getSession();
  if (!session) {
    notFound();
  }

  const { id } = await params;
  const order = await prisma.order.findFirst({
    where: { id, userId: session.user.id },
    include: { items: { include: { product: true } } },
  });
  if (!order) notFound();

  const orderDto = {
    id: order.id,
    totalCents: order.totalCents,
    createdAt: order.createdAt.toISOString(),
    items: order.items.map((i) => ({
      productId: i.productId,
      productName: i.product.name,
      quantity: i.quantity,
      priceCents: i.priceCents,
    })),
  };

  return (
    <main className="max-w-2xl mx-auto p-8">
      <p className="mb-4">
        <Link href="/orders" className="text-sm text-gray-600 hover:text-gray-900">
          ← Back to orders
        </Link>
      </p>
      <OrderDetailView order={orderDto} />
    </main>
  );
}
