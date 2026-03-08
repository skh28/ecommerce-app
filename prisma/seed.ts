import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const products = [
  { name: "Wireless Headphones", description: "Noise-cancelling over-ear headphones with 30-hour battery.", priceCents: 12999, imageUrl: null },
  { name: "USB-C Hub", description: "7-in-1 adapter with HDMI, USB 3.0, and SD card reader.", priceCents: 4999, imageUrl: null },
  { name: "Desk Lamp", description: "LED desk lamp with adjustable brightness and color temperature.", priceCents: 3999, imageUrl: null },
  { name: "Mechanical Keyboard", description: "Tenkeyless mechanical keyboard with brown switches.", priceCents: 8999, imageUrl: null },
  { name: "Laptop Stand", description: "Aluminum laptop stand for better ergonomics.", priceCents: 4499, imageUrl: null },
];

async function main() {
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
