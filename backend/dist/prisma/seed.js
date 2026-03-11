"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Seeding data...');
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
    await prisma.blog.upsert({
        where: { slug: 'impact-2025' },
        update: {},
        create: {
            title: 'Our Impact in 2025',
            slug: 'impact-2025',
            content: 'In 2025, we reached over 500 children...',
            author: 'Admin',
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
//# sourceMappingURL=seed.js.map