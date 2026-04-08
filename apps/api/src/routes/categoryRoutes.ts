import { Router, Request, Response } from "express";
import { initializeDatabase } from "../data-source";
import { Category } from "../entities/Category.entity";
import { CategoryDto } from "@repo/types";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
    const ds = await initializeDatabase();
    const categories = await ds.getRepository(Category).find();

    const response  : CategoryDto[] = categories.map(category => ({
        id: category.id,
        name: category.name,
        description: category.description
    }));
    res.json(response);
});

router.post("/", async (req: Request, res: Response) => {
    const ds = await initializeDatabase();
    const category = ds.getRepository(Category).create(req.body);
    const result = await ds.getRepository(Category).save(category);
    res.status(201).json(result);
});

router.put("/:id", async (req: Request, res: Response) => {
    const ds = await initializeDatabase();
    const result = await ds.getRepository(Category).update(req.params.id, req.body);
    res.json({ updated: result.affected });
});

router.delete("/:id", async (req: Request, res: Response) => {
    const ds = await initializeDatabase();
    const result = await ds.getRepository(Category).delete(req.params.id);
    res.json({ deleted: result.affected });
});

export default router;
