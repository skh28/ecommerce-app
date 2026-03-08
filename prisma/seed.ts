import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Product images: relevant Unsplash photos (free to use, direct CDN links)
const IMG = (id: string) => `https://images.unsplash.com/photo-${id}?w=400&h=300&fit=crop`;

const products = [
  { name: "Wireless Headphones", description: "Noise-cancelling over-ear headphones with 30-hour battery.", priceCents: 12999, imageUrl: IMG("1615433366992-1586f3b8fca5") },
  { name: "USB-C Hub", description: "7-in-1 adapter with HDMI, USB 3.0, and SD card reader.", priceCents: 4999, imageUrl: IMG("1770417999483-e5a313b33468") },
  { name: "Desk Lamp", description: "LED desk lamp with adjustable brightness and color temperature.", priceCents: 3999, imageUrl: IMG("1657772608811-d8d1bb1b6092") },
  { name: "Mechanical Keyboard", description: "Tenkeyless mechanical keyboard with brown switches.", priceCents: 8999, imageUrl: IMG("1762117643785-f05364c2f44d") },
  { name: "Laptop Stand", description: "Aluminum laptop stand for better ergonomics.", priceCents: 4499, imageUrl: IMG("1743862558309-d3e9da38404c") },
];

async function main() {
  // Clear products and dependent rows so re-running the seed doesn't create duplicates
  await prisma.cartItem.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.product.deleteMany();

  await prisma.product.createMany({
    data: products,
  });
  console.log(`Seeded ${products.length} products.`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
