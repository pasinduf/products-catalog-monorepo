"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const data_source_1 = require("../data-source");
const Category_entity_1 = require("../entities/Category.entity");
const router = (0, express_1.Router)();
router.get("/", async (req, res) => {
    const ds = await (0, data_source_1.initializeDatabase)();
    const categories = await ds.getRepository(Category_entity_1.Category).find();
    res.json(categories);
});
router.post("/", async (req, res) => {
    const ds = await (0, data_source_1.initializeDatabase)();
    const category = ds.getRepository(Category_entity_1.Category).create(req.body);
    const result = await ds.getRepository(Category_entity_1.Category).save(category);
    res.status(201).json(result);
});
router.put("/:id", async (req, res) => {
    const ds = await (0, data_source_1.initializeDatabase)();
    const result = await ds.getRepository(Category_entity_1.Category).update(req.params.id, req.body);
    res.json({ updated: result.affected });
});
router.delete("/:id", async (req, res) => {
    const ds = await (0, data_source_1.initializeDatabase)();
    const result = await ds.getRepository(Category_entity_1.Category).delete(req.params.id);
    res.json({ deleted: result.affected });
});
exports.default = router;
//# sourceMappingURL=categoryRoutes.js.map