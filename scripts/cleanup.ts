import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning up database...');
  
  // Delete in order to respect dependencies
  await prisma.activity.deleteMany({});
  await prisma.task.deleteMany({});
  await prisma.opportunityProofAsset.deleteMany({});
  await prisma.opportunity.deleteMany({});
  await prisma.contact.deleteMany({});
  await prisma.account.deleteMany({});
  await prisma.lead.deleteMany({});
  
  console.log('✅ Cleanup complete. All test data removed.');
}

main()
  .catch((e) => {
    console.error('❌ Error during cleanup:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
