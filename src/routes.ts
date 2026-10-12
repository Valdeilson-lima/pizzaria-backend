import { Router } from "express";
import multer from "multer";
import uploadConfig from "./config/multer";
import { validateSchema } from "./middlewares/validateSchema";
import { createUserSchema, authUserSchema } from "./schemas/userSchema";
import { createCategorySchema } from "./schemas/createCategorySchema";
import {
  createProductSchema,
  listProductsSchema,
  listByCategorySchema,
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
import { ListByCategoryController } from "./controllers/product/listByCategoryController";
import {
  addItemOrderSchema,
  createOrderSchema,
  listOrdersSchema,
  removeItemOrderSchema,
} from "./schemas/orderSchema";
import { CreateOrderController } from "./controllers/order/createOrderController";
import { ListOrdersController } from "./controllers/order/listOrdersController";
import { AddItemOrderController } from "./controllers/order/addItemOrderController";
import { RemoveItemOrderController } from "./controllers/order/removeItemOrderController";

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

router.get(
  "/category/product",
  isAuthenticated,
  validateSchema(listByCategorySchema),
  new ListByCategoryController().handle
);

//Routes orders
router.post(
  "/order",
  isAuthenticated,
  validateSchema(createOrderSchema),
  new CreateOrderController().handle
);
router.get(
  "/orders",
  isAuthenticated,
  validateSchema(listOrdersSchema),
  new ListOrdersController().handle
);
router.post(
  "/order/add",
  isAuthenticated,
  validateSchema(addItemOrderSchema),
  new AddItemOrderController().handle
);
router.delete(
  "/order/remove",
  isAuthenticated,
  validateSchema(removeItemOrderSchema),
  new RemoveItemOrderController().handle
);

export default router;
