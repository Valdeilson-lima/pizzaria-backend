import { Router } from "express";
import multer from "multer";
import uploadConfig from "./config/multer";
import { validateSchema } from "./middlewares/validateSchema";
import { createUserSchema, authUserSchema } from "./schemas/userSchema";
import { createCategorySchema } from "./schemas/createCategorySchema";
import {
  createProductSchema,
  listProductsSchema,
} from "./schemas/productSchema";
import { CreateUserController } from "./controllers/user/createUserController";
import { AuthUserController } from "./controllers/user/authUserController";
import { DetailUserController } from "./controllers/user/detailUserController";
import { CreateCategoryController } from "./controllers/category/createCategoryController";
import { ListCategoryController } from "./controllers/category/listCategoryController";
import { isAuthenticated } from "./middlewares/isAutehtication";
import { isAdmin } from "./middlewares/isAdmin";
import { CreateProductController } from "./controllers/product/createProductController";
import { ListProductsController } from "./controllers/product/listProductsController";
import { DeleteProductController } from "./controllers/product/deleteProductController";

const router = Router();
const upload = multer(uploadConfig);

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
  isAdmin,
  validateSchema(createCategorySchema),
  new CreateCategoryController().handle
);
router.get("/category", isAuthenticated, new ListCategoryController().handle);

//Routes products
router.post(
  "/product",
  isAuthenticated,
  isAdmin,
  upload.single("file"),
  validateSchema(createProductSchema),
  new CreateProductController().handle
);
router.get(
  "/products",
  isAuthenticated,
  validateSchema(listProductsSchema),
  new ListProductsController().handle
);

router.delete(
  "/product",
  isAuthenticated,
  isAdmin,
  new DeleteProductController().handle
);
export default router;
