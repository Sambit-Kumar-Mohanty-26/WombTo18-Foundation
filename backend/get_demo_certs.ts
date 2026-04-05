import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("=== Demo Certificate IDs ===");

  // Donation / 80G
  const donation = await prisma.donation.findFirst({
    where: { amount: { gte: 5000 }, status: 'SUCCESS' },
    include: { donor: true, program: true }
  });
  if (donation) {
    const suffix = donation.id.slice(-8).toUpperCase();
    console.log(`Donation Receipt: DON-${suffix} (Donor: ${donation.donor.name || 'Anonymous'})`);
    console.log(`80G Exemption:    80G-${suffix} (Donor: ${donation.donor.name || 'Anonymous'})`);
  } else {
    console.log("No eligible donation (>= 5000) found for 80G demo.");
    
    // Create one if it doesn't exist
    const donor = await prisma.donor.findFirst() || await prisma.donor.create({
        data: { donorId: 'DNR123', email: 'demo@demo.com', name: 'Demo Donor', mobile: '1234567890' }
    });
    const program = await prisma.program.findFirst() || await prisma.program.create({
        data: { name: 'Demo Program', targetAmount: 100000, description: 'Demo' }
    });
    const newDonation = await prisma.donation.create({
        data: { amount: 5000, status: 'SUCCESS', currency: 'INR', razorpayOrderId: 'mock_123', donorId: donor.id, programId: program.id }
    });
    const suffix = newDonation.id.slice(-8).toUpperCase();
    console.log(`NEW Donation Receipt: DON-${suffix} (Donor: ${donor.name})`);
    console.log(`NEW 80G Exemption:    80G-${suffix} (Donor: ${donor.name})`);
  }

  // Volunteer
  let volunteer = await prisma.volunteer.findFirst();
  if(!volunteer && donation?.donor) {
      volunteer = await prisma.volunteer.create({
          data: { volunteerId: 'VOL_DEMO', donorId: donation.donor.id, name: donation.donor.name || 'Demo Vol', email: donation.donor.email, mobile: donation.donor.mobile || '1111111111' }
      });
  }
  if (volunteer) {
    const suffix = volunteer.id.slice(-8).toUpperCase();
    console.log(`Volunteer Cert:   VOL-${suffix} (Volunteer: ${volunteer.name})`);
  } else {
      console.log("No volunteer found.");
  }

  // Partner
  const partner = await prisma.partner.findFirst();
  if (partner) {
    const suffix = partner.id.slice(-8).toUpperCase();
    console.log(`Partner CSR:      PTR-${suffix} (Partner: ${partner.organizationName})`);
  } else {
      console.log("No partner found.");
  }

  console.log("============================");
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
