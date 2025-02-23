"use client";
import { Trash } from "lucide-react";
import axios from "axios";
import { CategorySchema, MainCategorySchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { MainHeader } from "@/components/main-heading";

import { Separator } from "@/components/ui/separator";
import { Billboard, Category, MainCategory } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { AlertModal } from "@/components/modals/alert-model";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
interface CategoryFormProps {
  initialData: MainCategory | null | undefined;
}
export const CategoryForm = ({ initialData }: CategoryFormProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoding] = useState(false);

  const params = useParams();
  const router = useRouter();

  const title = initialData ? "Edit Category" : "Create Category";
  const description = initialData ? "Edit a Category" : "Add new Category";
  const toastMessage = initialData ? "Category updated" : "Category created";
  const action = initialData ? "ٍSave changes" : "Create";

  const form = useForm<z.infer<typeof MainCategorySchema>>({
    resolver: zodResolver(MainCategorySchema),
    defaultValues: {
      name: initialData?.name,
    },
  });
  async function onSubmit(values: z.infer<typeof MainCategorySchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log("values", values);
    try {
      setLoding(true);
      if (initialData) {
        const response = await axios.patch(
          `/api/owner/categories/${params.categoryId}`,
          values
        );
      } else {
        const response = await axios.post(`/api/owner/categories`, values);
        console.log(response);
      }

      router.push(`/owner/categories`);
      router.refresh();
      toast.success(toastMessage);
    } catch (error) {
      console.log(error);
      toast.error("samething want wrong");
    } finally {
      setLoding(false);
    }
  }
  const deleteBillboard = async () => {
    try {
      setLoding(true);
      await axios.delete(`/api/owner/categories/${params.categoryId}`);
      router.refresh();
      router.push(`/owner/categories`);
      toast.success("Category is deleted");
    } catch (error) {
      console.log(error);
      toast.error(
        "make sure to delete  all products using this category frist"
      );
    } finally {
      setLoding(false);
      setOpen(false);
    }
  };
  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={deleteBillboard}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <MainHeader lebel={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant={"destructive"}
            size={"icon"}
            onClick={() => setOpen(true)}
          >
            <Trash className="h-5 w-5" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-3 gap-10">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="category name"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
