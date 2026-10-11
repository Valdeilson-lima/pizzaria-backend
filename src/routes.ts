import { Router } from "express";
import { validateSchema } from "./middlewares/validateSchema";
import { createUserSchema, authUserSchema } from "./schemas/userSchema";
import { createCategorySchema } from "./schemas/createCategorySchema";
import { CreateUserController } from "./controllers/user/createUserController";
import { AuthUserController } from "./controllers/user/authUserController";
import { DetailUserController } from "./controllers/user/detailUserController";
import { CreateCategoryController } from "./controllers/category/createCategoryController";
import { isAuthenticated } from "./middlewares/isAutehtication";

const router = Router();

//Routes users
router.post(
  "/users",
  validateSchema(createUserSchema),
  new CreateUserController().handle
);
router.post(
  "/session",
  validateSchema(authUserSchema),
  new AuthUserController().handle
);
router.get("/me", isAuthenticated, new DetailUserController().handle);

//Routes categories
router.post(
  "/category",
  isAuthenticated,
  validateSchema(createCategorySchema),
  new CreateCategoryController().handle
);

export default router;
