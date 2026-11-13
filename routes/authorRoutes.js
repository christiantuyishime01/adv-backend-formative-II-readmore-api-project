const express = require("express");
const router = express.Router();
const authorController = require("../controllers/authorControllers");

router.post("/", authorController.createAuthor);
router.get("/", authorController.getAuthors);
router.get("/:id/books", authorController.getAuthorBooks);
router.get("/:id/stats", authorController.getAuthorStats);
router.get("/:id", authorController.getAuthorById);
router.put("/:id", authorController.updateAuthor);
router.delete("/:id", authorController.deleteAuthor);

module.exports = router;