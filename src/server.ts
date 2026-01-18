import { prisma } from "./lib/prisma"

async function main() {
    try {
        await prisma.$connect();
        console.log("Connected to database successfully");



    } catch (error) {
        console.log("An error occurred: ", error)
    }
}