import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).json({ message: `request method ${req.method} not allowed` });
    }

    try {
        const data = JSON.parse(req.body);
        const accountAsset = await prisma.playerAssets.create({
            data: {
                address: data.address,
                assetId: data.assetId
            }
        });
        res.status(200).json(accountAsset);
    } catch (error) {
        res.status(400).json({ message: `Error occurred: ${error}` });
    }
}