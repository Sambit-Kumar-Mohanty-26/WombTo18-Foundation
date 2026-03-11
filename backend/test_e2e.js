const email = 'test_donor@example.com';
let token = '';

async function runTests() {
  console.log('--- E2E Flow Test ---');
  
  // 1. Login
  console.log('1. Logging in...');
  const loginRes = await fetch('http://localhost:3000/api/donor/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  const loginData = await loginRes.json();
  console.log('Login Response:', loginData);

  // Note: Since OTP is sent to console/DB and typically bypassed in dev or logged, 
  // We'll need to grab the OTP from DB manually if it's random. 
  // Since we don't have direct DB access in this script, we can query it via Prisma directly from this script!
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();
  const donor = await prisma.donor.findUnique({ where: { email } });
  const otp = donor.otpHash;
  console.log('Obtained OTP from DB:', otp);

  // 2. Verify OTP
  console.log('\n2. Verifying OTP...');
  const verifyRes = await fetch('http://localhost:3000/api/donor/verify-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp })
  });
  
  // Extract token from cookie or response
  const verifyData = await verifyRes.json();
  console.log('Verify Response:', verifyData);
  token = verifyData.token;

  if (!token) {
    console.error('Failed to get token!');
    process.exit(1);
  }

  // 3. Create Donation Order
  console.log('\n3. Creating Donation Order (₹6000 to unlock 80G)...');
  const program = await prisma.program.findFirst();
  const orderRes = await fetch('http://localhost:3000/api/donations/create', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify({
      amount: 6000,
      currency: 'INR',
      donorId: donor.id,
      programId: program.id,
      displayName: true
    })
  });
  const orderData = await orderRes.json();
  console.log('Order Response:', JSON.stringify(orderData, null, 2));

  if (!orderData.donationId) {
    console.error('Failed to create donation. Aborting.');
    process.exit(1);
  }

  // 4. Simulate Razorpay Verification (Bypass signature check for testing)

  // Usually we'd need Razorpay's signature, but we can update DB directly to simulate success
  // so we can test the Receipt/80G generation
  console.log('\n4. Simulating Payment Success in DB...');
  await prisma.donation.update({
    where: { id: orderData.donationId },
    data: { status: 'SUCCESS' }
  });
  console.log('Payment marked as SUCCESS');

  // 5. Test Dashboard
  console.log('\n5. Testing Dashboard Access...');
  const dashRes = await fetch(`http://localhost:3000/api/donors/dashboard?donorId=${donor.donorId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const dashData = await dashRes.json();
  console.log('Dashboard Data:', JSON.stringify(dashData, null, 2));

  // 6. Test Receipt Generation Note
  console.log(`\n6. To test Receipt: Try GET http://localhost:3000/api/donor/receipts/download/${orderData.donationId}`);
  console.log(`To test 80G: Try GET http://localhost:3000/api/certificates/download/${orderData.donationId}`);

  await prisma.$disconnect();
}

runTests().catch(e => console.error(e));
