import { Router } from "express";
import { register, login, getUsers } from "../controllers/authController";
import { Request, Response, NextFunction } from "express";

const router = Router();

router.post("/register", (req: Request, res: Response, next: NextFunction) => {
  register(req, res).catch(next);
});

router.post("/login", (req: Request, res: Response, next: NextFunction) => {
  login(req, res).catch(next);
});

router.get("/users", (req: Request, res: Response, next: NextFunction) => {
  getUsers(req, res).catch(next);
});

export default router;
