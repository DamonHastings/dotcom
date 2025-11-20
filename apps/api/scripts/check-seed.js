const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
(async () => {
  try {
    const leads = await prisma.lead.findMany();
    const bookings = await prisma.booking.findMany();
    console.log('Leads:', leads.length);
    console.log('Bookings:', bookings.length);
    if (bookings.length) console.log('Sample booking:', bookings[0]);
  } catch (e) {
    console.error('Error checking seed:', e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
