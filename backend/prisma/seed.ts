import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categories = [
  'Makanan',
  'Transportasi',
  'Belanja',
  'Tagihan',
  'Hiburan',
  'Pendidikan',
  'Kesehatan',
  'Lainnya',
];

async function main() {
  console.log('Start seeding...');
  for (const name of categories) {
    const category = await prisma.category.upsert({
      where: { name },
      update: {},
      create: {
        name,
      },
    });
    console.log(`Created category with id: ${category.id} - ${category.name}`);
  }
  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
