import multer, { Options, FileFilterCallback } from "multer";
import { Request } from "express";

const uploadConfig: Options = {
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1024 * 1024 * 4, // 4MB
  },
  fileFilter: (
    _req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => {
    const allowedMimes = [
      "image/jpeg",
      "image/pjpeg",
      "image/png",
      "image/webp",
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Tipo de arquivo inválido"));
    }
  },
};

export default uploadConfig;
