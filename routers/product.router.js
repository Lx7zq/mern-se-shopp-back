const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const { upload, uploadToFirebase } = require("../middlewares/file.middleware");

//http://localhost:5000/api/v1/product
router.post("/", upload, uploadToFirebase, productController.createProduct);
//http://localhost:5000/api/v1/product
router.get("/", productController.getProducts);
//http://localhost:5000/api/v1/product/id
router.get("/:id", productController.getProductsById);
//http://localhost:5000/api/v1/product/id
router.delete("/:id", productController.deleteProduct);
//http://localhost:5000/api/v1/product/id
router.put("/:id", upload, uploadToFirebase, productController.updateProduct);
module.exports = router;
