import { PrismaClient, UserRole } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  // Create a test user
  const user = await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      email: "test@example.com",
      name: "Test User",
      password: 'f4b81f0e7d8a18c99dc6cde47a70d2ea517f1de1aecb45c805126e3ad412dec5',
      salt: 'e8cccb99c10a449af4c90570ad2b6c86',
      role: UserRole.ADMIN,
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
