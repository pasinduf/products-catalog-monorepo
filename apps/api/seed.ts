import "dotenv/config";
import { AppDataSource } from "./src/data-source";
import { Category } from "./src/entities/Category.entity";
import { Product } from "./src/entities/Product.entity";

async function seed() {
    try {
        const ds = await AppDataSource.initialize();
        console.log("Seeding data...");

        const catRepo = ds.getRepository(Category);
        const prodRepo = ds.getRepository(Product);

        const count = await catRepo.count();
        if (count > 0) {
            console.log("Database already seeded.");
            process.exit(0);
        }

        const electronics = catRepo.create({ name: "Electronics", description: "Premium gadgets and hardware" });
        const homeOffice = catRepo.create({ name: "Home & Office", description: "Essential workspace gear" });
        await catRepo.save([electronics, homeOffice]);

        await prodRepo.save([
            prodRepo.create({
                name: "UltraWide Monitor",
                slug: "ultrawide-monitor",
                description: "49-inch curved productivity powerhouse.",
                price: 999.99,
                category: electronics,
                categoryId: electronics.id
            }),
            prodRepo.create({
                name: "Mechanical Keyboard",
                slug: "mechanical-keyboard",
                description: "Tactile typing experience with RGB lighting.",
                price: 159.50,
                category: homeOffice,
                categoryId: homeOffice.id
            }),
            prodRepo.create({
                name: "Wireless ANC Headphones",
                slug: "wireless-anc-headphones",
                description: "Studio quality sound with best-in-class noise isolation.",
                price: 349.00,
                category: electronics,
                categoryId: electronics.id
            })
        ]);

        console.log("Seeding completed successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding data:", error);
        process.exit(1);
    }
}

seed();
