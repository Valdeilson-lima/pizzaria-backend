import { prisma } from "../../lib/prisma";
import { cloudinary } from "../../config/cloudinary";
import { UploadApiResponse } from "cloudinary";
import { Readable } from "stream";

interface CreatePRoductServiceProps {
  name: string;
  price: string;
  description: string;
  categoryId: string;
  imageBuffer: Buffer;
  imageName: string;
}

class CreateProductService {
  async execute({
    name,
    price,
    description,
    categoryId,
    imageBuffer,
    imageName,
  }: CreatePRoductServiceProps) {
    const categoryAlreadyExists = await prisma.category.findFirst({
      where: {
        id: categoryId,
      },
    });

    if (!categoryAlreadyExists) {
      throw new Error("Categoria não encontrada");
    }
    let bannerUrl = "";

    try {
      const uploadResult = await new Promise<UploadApiResponse>(
        (resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: "products",
              resource_type: "image",
              public_id: `${Date.now()}_${imageName.split(".")[0]}`,
            },
            (error, result) => {
              if (error || !result) {
                reject(error || new Error("Erro no upload para o Cloudinary"));
              } else {
                resolve(result);
              }
            }
          );

          const bufferStream = Readable.from(imageBuffer);
          bufferStream.pipe(uploadStream);
        }
      );

      bannerUrl = uploadResult.secure_url;
    } catch (error) {
      throw new Error("Erro no upload do banner");
    }

    const product = await prisma.product.create({
      data: {
        name,
        price: parseInt(price),
        description,
        banner: bannerUrl,
        category_id: categoryId,
      },
      select: {
        id: true,
        name: true,
        price: true,
        description: true,
        banner: true,
        category_id: true,
      },
    });

    return product;
  }
}

export { CreateProductService };
