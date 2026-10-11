import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import router from "./routes";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api", router);

app.use(
  (
    error: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    if (error instanceof Error) {
      return res.status(400).json({
        error: error.message,
      });
    }

    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
);

app.listen(process.env.PORT || 3333, () => {
  console.log(`Server is running on port ${process.env.PORT || 3333}`);
});
