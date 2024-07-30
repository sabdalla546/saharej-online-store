"use client";
import { Trash } from "lucide-react";
import axios from "axios";
import { ColorSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { MainHeader } from "@/components/main-heading";

import { Separator } from "@/components/ui/separator";
import { Color } from "@prisma/client";
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

interface ColorFormProps {
  initialData: Color | null | undefined;
}
export const ColorForm = ({ initialData }: ColorFormProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoding] = useState(false);

  const params = useParams();
  const router = useRouter();

  const title = initialData ? "color billboard" : "Create color";
  const description = initialData ? "Edit a color" : "Add new color";
  const toastMessage = initialData ? "color updated" : "color created";
  const action = initialData ? "ٍSave changes" : "Create";

  const form = useForm<z.infer<typeof ColorSchema>>({
    resolver: zodResolver(ColorSchema),
    defaultValues: {
      name: initialData?.name,
      value: initialData?.value,
    },
  });
  async function onSubmit(values: z.infer<typeof ColorSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    // console.log(values);
    try {
      setLoding(true);
      if (initialData) {
        const response = await axios.patch(
          `/api/${params.storeId}/colors/${params.colorId}`,
          values
        );
      } else {
        const response = await axios.post(
          `/api/${params.storeId}/colors`,
          values
        );
      }
      router.refresh();
      router.push(`/${params.storeId}/colors`);
      toast.success(toastMessage);
    } catch (error) {
      console.log(error);
      toast.error("samething want wrong");
    } finally {
      setLoding(false);
    }
  }
  const deleteColor = async () => {
    try {
      setLoding(true);
      await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`);
      router.refresh();
      router.push(`/${params.storeId}/colors`);
      toast.success("color is deleted");
    } catch (error) {
      console.log(error);
      toast.error("make sure to delete  all product using this color frist");
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
        onConfirm={deleteColor}
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
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="color name"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>color value</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-x-4">
                      <Input
                        disabled={loading}
                        placeholder="size value"
                        {...field}
                      />
                      <div
                        className="border p-4 rounded-full "
                        style={{ backgroundColor: field.value }}
                      />
                    </div>
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
