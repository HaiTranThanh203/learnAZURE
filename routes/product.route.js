const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const productController = require("../controllers/product.controller");

router.post("/", productController.create);
router.get("/", productController.findAll);
router.get("/:id", productController.findOne);
router.put("/:id", productController.update);
router.delete("/:id", productController.remove);

module.exports = router;
