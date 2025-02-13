import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const users = [
  {
    name: "Admin",
    email: "admin@example.com",
    password: "admin",
    role: "ADMIN",
  },
];

async function seedDatabase() {
  try {
    for (const user of users) {
      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(user.password, salt);
      
      await prisma.user.upsert({
        where: { email: user.email },
        update: {},
        create: {
          name: user.name,
          email: user.email,
          password: hashPassword,
          role: Role.ADMIN,
        },
      });
    }
    console.log("🌱 Seeding completed successfully.");
  } catch (error) {
    console.error("Error during seeding:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase();
