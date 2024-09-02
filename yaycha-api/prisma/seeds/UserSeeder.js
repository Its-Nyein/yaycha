import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { bcrypt } from "brcypt";

const prisma = new PrismaClient();

async function UserSeeder() {
  const password = await bcrypt.hash("password", 10);
  console.log("User seeding started ...");

  for (let i = 0; i < 10; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const name = `${firstName} ${lastName}`;
    const userName = `${firstName}${lastName[0]}`.toLocaleLowerCase();
    const bio = faker.person.bio;

    await prisma.user.upsert({
      where: { userName },
      update: {},
      create: { name, userName, bio, password },
    });
  }
  console.log("User seeding Done!");
}

module.exports = { UserSeeder };
