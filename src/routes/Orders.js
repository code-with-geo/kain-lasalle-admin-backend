import express from "express";
import { getAllOrders } from "../controllers/Orders.js";

const router = express.Router();

router.get("/", getAllOrders);

export { router as OrdersRoute };
