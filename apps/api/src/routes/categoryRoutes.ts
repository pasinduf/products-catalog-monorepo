import { Router, Request, Response } from "express";
import { initializeDatabase } from "../data-source";
import { Category } from "../entities/Category.entity";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
    const ds = await initializeDatabase();
    const categories = await ds.getRepository(Category).find();
    res.json(categories);
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
