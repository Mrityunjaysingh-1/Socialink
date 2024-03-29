import express from "express";
import authRoute from "./authRoutes.js";

const router = express.Router();

router.use(`/auth`, authRoute); //auth/register

export default router;