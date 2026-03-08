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
  { name: "Wireless Mouse", description: "Ergonomic wireless mouse with long battery life and silent clicks.", priceCents: 3499, imageUrl: IMG("1613091252604-dd0746e2f358") },
  { name: "Webcam", description: "1080p webcam with built-in microphone and privacy shutter.", priceCents: 7999, imageUrl: IMG("1650017067794-80fd3a99a104") },
  { name: "Monitor Arm", description: "VESA mount monitor arm for dual screens, height and tilt adjustable.", priceCents: 9999, imageUrl: IMG("1678733404598-d56e3d232483") },
  { name: "Desk Mat", description: "Large desk pad with stitched edges, protects desk and smooth mouse movement.", priceCents: 2999, imageUrl: IMG("1743862558369-5dcea79ccbff") },
  { name: "Cable Organizer", description: "Silicone cable management sleeve to keep cords tidy under the desk.", priceCents: 1499, imageUrl: IMG("1770417999483-e5a313b33468") },
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
