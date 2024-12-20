import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function PostSeeder() {
  const data = [];

  for (let i = 0; i < 20; i++) {
    const content = faker.lorem.paragraph();
    const userId = faker.number.int({ min: 1, max: 10 });

    data.push({ content, userId });
  }
  console.log("Post Seeding is started!");
  await prisma.post.createMany({ data });
  console.log("Post Seeding Done!");
}

export default PostSeeder;
