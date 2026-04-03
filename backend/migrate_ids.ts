import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function generateNewId(role: string, date: Date): string {
  const yy = date.getFullYear().toString().substring(2);
  const mm = (date.getMonth() + 1).toString().padStart(2, '0');
  const dd = date.getDate().toString().padStart(2, '0');
  
  // 4 random alphanumeric characters
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomStr = '';
  for (let i = 0; i < 4; i++) {
    randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return `W18-${role}-${yy}${mm}${dd}-${randomStr}`;
}

async function main() {
  console.log('Starting ID migration...');
  
  // Migrate Donors
  const donors = await prisma.donor.findMany();
  let updatedDonors = 0;
  for (const donor of donors) {
    if (!donor.donorId.startsWith('W18-DNR-')) {
      const newId = generateNewId('DNR', donor.createdAt);
      await prisma.donor.update({
        where: { id: donor.id },
        data: { donorId: newId }
      });
      updatedDonors++;
    }
  }
  console.log(`Migrated ${updatedDonors} Donors.`);

  // Migrate Volunteers
  const volunteers = await prisma.volunteer.findMany();
  let updatedVols = 0;
  for (const vol of volunteers) {
    if (!vol.volunteerId.startsWith('W18-VOL-')) {
      const newId = generateNewId('VOL', vol.createdAt);
      await prisma.volunteer.update({
        where: { id: vol.id },
        data: { volunteerId: newId }
      });
      updatedVols++;
    }
  }
  console.log(`Migrated ${updatedVols} Volunteers.`);

  // Migrate Partners
  const partners = await prisma.partner.findMany();
  let updatedPartners = 0;
  for (const pt of partners) {
    if (!pt.partnerId.startsWith('W18-PTN-')) {
      const newId = generateNewId('PTN', pt.createdAt);
      await prisma.partner.update({
        where: { id: pt.id },
        data: { partnerId: newId }
      });
      updatedPartners++;
    }
  }
  console.log(`Migrated ${updatedPartners} Partners.`);

  console.log('Migration complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
