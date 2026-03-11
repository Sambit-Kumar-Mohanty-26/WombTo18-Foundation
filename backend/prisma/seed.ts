import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding data...');

  // Programs
  await prisma.program.upsert({
    where: { name: 'Child Health Initiative' },
    update: {},
    create: {
      name: 'Child Health Initiative',
      description: 'Healthcare support for children in rural areas.',
      targetAmount: 500000,
      raisedAmount: 125000,
    },
  });

  await prisma.program.upsert({
    where: { name: 'Education for All' },
    update: {},
    create: {
      name: 'Education for All',
      description: 'Sponsoring school fees and supplies for underprivileged children.',
      targetAmount: 1000000,
      raisedAmount: 450000,
    },
  });

  // Impact Metrics
  await prisma.impactMetrics.upsert({
    where: { id: 'global' },
    update: {},
    create: {
      id: 'global',
      totalRaised: 1000000,
      totalUtilized: 750000,
      childrenImpacted: 250,
      schoolsReached: 15,
      healthCheckups: 120,
      programsSupported: 5,
    },
  });

  // Donors
  const donor1 = await prisma.donor.upsert({
    where: { email: 'test.donor@example.com' },
    update: {},
    create: {
      donorId: 'DNR1001',
      email: 'test.donor@example.com',
      name: 'Test Donor',
      mobile: '9876543210',
      totalDonated: 7500,
      isEligible: true,
      tier: 'PATRON',
    },
  });

  const donor2 = await prisma.donor.upsert({
    where: { email: 'jane.doe@example.com' },
    update: {},
    create: {
      donorId: 'DNR1002',
      email: 'jane.doe@example.com',
      name: 'Jane Doe',
      mobile: '9988776655',
      totalDonated: 15000,
      isEligible: true,
      tier: 'CHAMPION',
    },
  });

  // Blogs
  await prisma.blog.upsert({
    where: { slug: 'impact-2025' },
    update: {},
    create: {
      title: 'Our Impact in 2025',
      slug: 'impact-2025',
      content: '<h2>A Year of Growth</h2><p>In 2025, we reached over 500 children across 15 rural schools. Our nutrition programs delivered 12,000 meals daily...</p>',
      author: 'Admin',
    },
  });

  await prisma.blog.upsert({
    where: { slug: 'new-healthcare-initiative' },
    update: {},
    create: {
      title: 'New Healthcare Initiative for Rural Districts',
      slug: 'new-healthcare-initiative',
      content: '<h2>Expanding Our Reach</h2><p>We are excited to announce our new mobile clinic program targeting five new districts in the upcoming quarter...</p>',
      author: 'Sarah Jenkins',
    },
  });

  console.log('Seed completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
