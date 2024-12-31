import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker'

const prisma = new PrismaClient()
const TOTAL = 30

const main = async () => {
  

  console.log(`Inserted ${5000}/${TOTAL} item.`)
}

main().then(() => console.log('🌿 Seeding completed.'))
