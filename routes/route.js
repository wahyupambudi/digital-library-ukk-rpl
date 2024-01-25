const express = require("express");
const router = express.Router();
const authRoute = require("../routes/auth.route");
const bookRoute = require("../routes/book.route");
const categoryrelationRoute = require("../routes/categoryrelation.route");
const categoryRoute = require("../routes/category.route");
const borrowRoute = require("../routes/borrow.route")
const morgan = require("morgan");

router.use(morgan("dev"));

router.use("/api/v1/auth", authRoute);
router.use("/api/v1/book", bookRoute);
router.use("/api/v1/category", categoryRoute);
router.use("/api/v1/category-relation", categoryrelationRoute);
router.use("/api/v1/borrow-book", borrowRoute);

module.exports = router;
