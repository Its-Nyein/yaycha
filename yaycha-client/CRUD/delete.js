import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// thow err because there are many posts that are referenced to User
prisma.user
  .delete({
    where: { id: 1 },
  })
  .then(() => console.log("Deleted User 1"))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
