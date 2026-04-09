import { Router, Request, Response } from "express";
import { initializeDatabase } from "../data-source";
import { Product } from "../entities/Product.entity";
import { ProductDto } from "@repo/types";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
    const ds = await initializeDatabase();
    const products = await ds.getRepository(Product).find({ relations: ["category"] });

    const response : ProductDto[] = products.map(product => ({
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,       
        categoryId: product.categoryId,    
        category: {   
            id: product.category.id,
            name: product.category.name,
            description: product.category.description
        }
    }));
    res.json(response);
});

router.get("/:slug", async (req: Request, res: Response) => {
    const ds = await initializeDatabase();
    const product = await ds.getRepository(Product).findOne({
        where: { slug: req.params.slug },
        relations: ["category"]
    });
    if (!product) {
        return res.status(404).json({ error: "Not found" });
    }
    res.json(product);
});

router.post("/", async (req: Request, res: Response) => {
    const ds = await initializeDatabase();
    const product = ds.getRepository(Product).create(req.body as Partial<Product>);
    const result = await ds.getRepository(Product).save(product);
    res.status(201).json(result);
});

router.put("/:id", async (req: Request, res: Response) => {
    const ds = await initializeDatabase();
    const result = await ds.getRepository(Product).update(req.params.id, req.body);
    res.json({ updated: result.affected });
});

router.delete("/:id", async (req: Request, res: Response) => {
    const ds = await initializeDatabase();
    const result = await ds.getRepository(Product).delete(req.params.id);
    res.json({ deleted: result.affected });
});

export default router;
