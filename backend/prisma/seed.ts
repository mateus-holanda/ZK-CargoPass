import { PrismaClient } from "@prisma/client"
import * as bcrypt from "bcrypt"

const prisma = new PrismaClient()

async function main() {
  // Create a test user
  const hashedPassword = await bcrypt.hash("password123", 10)

  const user = await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      email: "test@example.com",
      name: "Test User",
      password: hashedPassword,
      role: "user",
      documents: {
        create: [
          {
            name: "Sample Document 1",
            status: "active",
            type: "text",
            size: 1024,
            data: { content: "This is a sample document content." },
          },
          {
            name: "Sample Document 2",
            status: "archived",
            type: "image",
            size: 2048,
            data: { url: "https://example.com/image.jpg" },
          },
        ],
      },
    },
  })

  console.log('Seed data generated!')
  console.log({ user })
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })
