const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function downloadPdfs() {
  const donation = await prisma.donation.findFirst({
    where: { status: 'SUCCESS' },
    orderBy: { createdAt: 'desc' }
  });

  if (!donation) {
    console.error('No successful donation found!');
    process.exit(1);
  }

  console.log(`Downloading PDFs for Donation ID: ${donation.id}`);

  // Download Receipt
  const receiptRes = await fetch(`http://localhost:3000/api/donor/receipts/download/${donation.id}`);
  if (!receiptRes.ok) {
    console.error(`Failed to download receipt: ${receiptRes.statusText}`);
  } else {
    const buffer = await receiptRes.arrayBuffer();
    fs.writeFileSync('receipt_test.pdf', Buffer.from(buffer));
    console.log('Saved receipt_test.pdf');
  }

  // Download 80G
  const certRes = await fetch(`http://localhost:3000/api/certificates/download/${donation.id}`);
  if (!certRes.ok) {
    console.error(`Failed to download 80G certificate: ${certRes.statusText}`);
  } else {
    const buffer = await certRes.arrayBuffer();
    fs.writeFileSync('80g_test.pdf', Buffer.from(buffer));
    console.log('Saved 80g_test.pdf');
  }

  await prisma.$disconnect();
}

downloadPdfs().catch(e => console.error(e));
