const prisma1 = require("@prisma/client");


const prisma = new prisma1.PrismaClient();

async function main() {
    let i = 1
    while (i <= 369) {
        let stringI = `${i}`;
        if (i < 10) {
            stringI = `00${i}`;
        }
        if (i > 10 && i < 100) {
            stringI = `0${i}`;
        }
        await prisma.assets.create({
            data: {
                url: `https://ipfs.io/ipfs/Qmdg1ZGrHV2HmHBJkfSka2AuGcL3fU8BKidEbJSBCbVvfc/BIXCIP_${stringI}.jpg`,
                title: `BIXCIP #${i}`,
                description: `This is BIXCIP #${i}`
            }
        });
        i++;
    }
    const assets = await prisma.assets.findMany();
    console.log(assets);
}

main().then(async () => {
    await prisma.$disconnect();
}).catch(async (e) => {
    console.log(e);
    await prisma.$disconnect();
    process.exit(1);
})