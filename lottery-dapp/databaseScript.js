const prisma1 = require("@prisma/client");


const prisma = new prisma1.PrismaClient();

async function main() {
    createBixcipData()
    // createRoundsData()
    // createAccountAssets();

}

async function createAccountAssets() {
    const accountAsset = await prisma.playerAssets.create({
        data: {
            address: "1",
            assetId: 1
        }
    });
    console.log(accountAsset);
}

async function createRoundsData() {
    await prisma.rounds.deleteMany();
    let i = 0;
    const date = new Date();
    while (i < 20) {
        const round = await prisma.rounds.create({
            data: {
                date: `${date.getDay()} ${date.getDate()} ${date.getMonth()} ${date.getFullYear()}`,
                title: `${i}`,
                description: `This is round ${i}`
            }
        });
        console.log(round);
        i++;
    }
}

async function createBixcipData() {
    let i = 1
    while (i <= 369) {
        let stringI = `${i}`;
        if (i < 10) {
            stringI = `00${i}`;
        }
        if (i > 10 && i < 100) {
            stringI = `0${i}`;
        }
        const asset = await prisma.assets.create({
            data: {
                url: `https://ipfs.io/ipfs/Qmdg1ZGrHV2HmHBJkfSka2AuGcL3fU8BKidEbJSBCbVvfc/BIXCIP_${stringI}.jpg`,
                title: `BIXCIP #${i}`,
                description: `This is BIXCIP #${i}`
            }
        });
        console.log(asset);
        i++;
    }
}

main().then(async () => {
    await prisma.$disconnect();
}).catch(async (e) => {
    console.log(e);
    await prisma.$disconnect();
    process.exit(1);
})