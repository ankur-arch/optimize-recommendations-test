import { prisma } from "./utils";

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// A `main` function so that we can use async/await
async function main() {
  // A simple query to create the database connection as the database connection usually takes a lot of time
  await prisma.user.findFirst({
    select: {
      id: true,
    },
  });

  // const user = await prisma.user.create({
  //   data: { image: "0".repeat(1_000_001), email: "dev.ankur.datta" },
  // });

  // // Transaction to trigger the long running transaction recommendation
  await prisma.$transaction(async (itx) => {
    await itx.$executeRaw`SELECT pg_sleep(5);`
    await itx.user.findFirst({
      select: {
        email: true
      }
    })
    await itx.$executeRaw`SELECT pg_sleep(10);`
    await itx.$executeRaw`SELECT pg_sleep(4);`
    return
  }, {
    maxWait: 25000,
    timeout: 25000
  })
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Done");
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
