import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// findFirst, findMany, findUnique etc
prisma.user
  .findFirst({
    where: { id: 1 },
    include: { posts: true },
  })
  .then((data) => {
    console.log(data);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
