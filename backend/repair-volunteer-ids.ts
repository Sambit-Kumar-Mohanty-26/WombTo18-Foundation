import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function generateNewId(role: string, date: Date): string {
  const yy = date.getFullYear().toString().substring(2);
  const mm = (date.getMonth() + 1).toString().padStart(2, '0');
  const dd = date.getDate().toString().padStart(2, '0');
  
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomStr = '';
  for (let i = 0; i < 4; i++) {
    randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return `W18-${role}-${yy}${mm}${dd}-${randomStr}`;
}

async function repair() {
  console.log('Starting repair of Volunteer IDs to W18-VOLD format...');

  // Find all volunteer records that don't follow the W18 format
  const brokenVolunteers = await prisma.volunteer.findMany({
    where: {
      NOT: {
        volunteerId: { startsWith: 'W18-' }
      }
    },
    orderBy: { createdAt: 'asc' },
  });

  console.log(`Found ${brokenVolunteers.length} volunteer records to transition/repair.`);

  for (const vol of brokenVolunteers) {
    const newId = generateNewId('VOLD', vol.createdAt || new Date());
    
    console.log(`Updating ${vol.email}: ${vol.volunteerId} -> ${newId}`);
    
    await prisma.volunteer.update({
      where: { id: vol.id },
      data: { volunteerId: newId },
    });
  }

  console.log('Repair complete!');
}

repair()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
