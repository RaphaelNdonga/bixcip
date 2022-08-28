import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async (req, res) => {
    console.log("Inside the server...");
    if (req.method !== 'POST') {
        return res.status(405).json({ message: `request method ${req.method} not allowed` });
    }
    try {
        let accountData = JSON.parse(req.body);
        const playerAccount = await prisma.accounts.findFirst({ where: { player_wallet: accountData } });
        let savedAccount;
        if (playerAccount === null) {
            savedAccount = await prisma.accounts.create({
                data: {
                    player_wallet: accountData,
                    connected_wallet: accountData
                }
            });
        }
        res.status(200).json(savedAccount);
    } catch (error) {
        res.status(400).json({ message: `something went wrong ${error}` });
    }
}