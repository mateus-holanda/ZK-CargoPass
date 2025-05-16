/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-use-before-define, @typescript-eslint/no-unused-vars */
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const tableNames = await prisma.$queryRaw<Array<{ tableName: string }>>`SELECT tablename FROM pg_tables WHERE schemaname='public'`

  const tables = tableNames
    .map(({ tableName }) => tableName)
    .filter((name) => name !== '_prisma_migrations')
    .map((name) => `"public"."${name}"`)
    .join(', ')

  try {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`)
    console.info('Database cleared!')
  } catch (error) {
    console.log({ error })
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })
