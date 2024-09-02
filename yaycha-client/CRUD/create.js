import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

prisma.user
  .create({
    data: {
      name: "Nyeinn",
      bio: "Nyeinn Bio",
      posts: {
        create: [{ content: "First post" }, { content: "Second post" }],
      },
    },
  })
  .then(() => {
    console.log("Inserted User Nyeinn with posts");
  })
  .catch((err) => {
    console.error(err), process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
