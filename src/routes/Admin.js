import express from "express";
import { createAdmin, login, resetPassword } from "../controllers/Admin.js";

const router = express.Router();

router.post("/create", createAdmin);
router.post("/login", login);
router.post("/reset", resetPassword);

export { router as AdminsRouter };
