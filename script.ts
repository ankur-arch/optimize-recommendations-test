import { prisma } from './utils'

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}


// A `main` function so that we can use async/await
async function main() {

  // A simple query to create the database connection as the database connection usually takes a lot of time
  await prisma.user.findFirst({
    select: {
      id: true
    }
  })

  // Transaction to trigger the long running transaction recommendation
  await prisma.$transaction(async (itx) => {
    await wait(5000)
    await itx.user.findFirst({
      select: {
        email: true
      }
    })
    return 
  }, {
    maxWait: 10000,
    timeout: 10000
  })
  
}

main()
  .then(async () => {
    await prisma.$disconnect()
    console.log('Done')
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
