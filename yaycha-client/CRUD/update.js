import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// update, updateMany, upsert
prisma.user
  .upsert({
    where: { id: 1 },
    update: { name: "Its_Nyeinn" },
    create: { name: "Its_Nyeinn", bio: "Its_Nyeinn's bio" },
  })
  .then((data) => {
    console.log(data);
  })
  .catch((err) => {
    console.error(err);
  })
  .finally(() => {
    prisma.$disconnect();
  });
