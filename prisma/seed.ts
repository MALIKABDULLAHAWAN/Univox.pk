import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seed script - add seed data here after fixing Prisma schema')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .then(async () => {
    await prisma.$disconnect()
  })
