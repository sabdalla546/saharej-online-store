import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4, {
    message: "password is required",
  }),
  code: z.optional(z.string()),
});

export const ResetSchema = z.object({
  email: z.string().email(),
});
export const NewPasswodSchema = z.object({
  password: z.string().min(6, {
    message: "mimimum 6 characters required",
  }),
});
export const RegisterSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6, {
    message: "minimam 6 characters ",
  }),
});

export const StoreSchema = z.object({
  storeName: z.string().min(1, {
    message: "store name must have 1  character",
  }),
  description: z.string().min(1, {
    message: "store description must have 1  character",
  }),
  imageUrl: z.string().nullable().optional(),
});
export const BillboardSchema = z.object({
  label: z.string().min(1, {
    message: "billoard name must have 1  character",
  }),
  imageUrl: z.string().min(1),
});
export const CategorySchema = z.object({
  name: z.string().min(1, {
    message: "category name must have 1  character",
  }),
  billboardId: z.string().min(1),
});
export const ProductSchema = z.object({
  name: z.string().min(1, {
    message: "category name must have 1  character",
  }),
  description: z.string().min(1),
  categoryId: z.string().min(1),
  images: z.object({ url: z.string() }).array(),
  sizeId: z.string().min(1),
  colorId: z.string().min(1),
  price: z.string().min(1),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
});
export const SizeSchema = z.object({
  name: z.string().min(1, {
    message: "billoard name must have 1  character",
  }),
  value: z.string().min(1),
});
export const ColorSchema = z.object({
  name: z.string().min(1, {
    message: "billoard name must have 1  character",
  }),
  value: z.string().min(1).regex(/^#/, {
    message: "color must be valid hex code",
  }),
});

export const SettingSchema = z.object({
  name: z.optional(z.string()),
});
