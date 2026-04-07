"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const data_source_1 = require("../data-source");
const Product_entity_1 = require("../entities/Product.entity");
const router = (0, express_1.Router)();
router.get("/", async (req, res) => {
    const ds = await (0, data_source_1.initializeDatabase)();
    const products = await ds.getRepository(Product_entity_1.Product).find({ relations: ["category"] });
    res.json(products);
});
router.get("/:slug", async (req, res) => {
    const ds = await (0, data_source_1.initializeDatabase)();
    const product = await ds.getRepository(Product_entity_1.Product).findOne({
        where: { slug: req.params.slug },
        relations: ["category"]
    });
    if (!product) {
        return res.status(404).json({ error: "Not found" });
    }
    res.json(product);
});
router.post("/", async (req, res) => {
    const ds = await (0, data_source_1.initializeDatabase)();
    const product = ds.getRepository(Product_entity_1.Product).create(req.body);
    const result = await ds.getRepository(Product_entity_1.Product).save(product);
    res.status(201).json(result);
});
router.put("/:id", async (req, res) => {
    const ds = await (0, data_source_1.initializeDatabase)();
    const result = await ds.getRepository(Product_entity_1.Product).update(req.params.id, req.body);
    res.json({ updated: result.affected });
});
router.delete("/:id", async (req, res) => {
    const ds = await (0, data_source_1.initializeDatabase)();
    const result = await ds.getRepository(Product_entity_1.Product).delete(req.params.id);
    res.json({ deleted: result.affected });
});
exports.default = router;
//# sourceMappingURL=productRoutes.js.map