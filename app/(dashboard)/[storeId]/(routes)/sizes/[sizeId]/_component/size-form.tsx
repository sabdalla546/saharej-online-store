"use client";
import { Trash } from "lucide-react";
import axios from "axios";
import { SizeSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { MainHeader } from "@/components/main-heading";

import { Separator } from "@/components/ui/separator";
import { Size } from "@prisma/client";
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

interface SizeFormProps {
  initialData: Size | null | undefined;
}
export const SizeForm = ({ initialData }: SizeFormProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoding] = useState(false);

  const params = useParams();
  const router = useRouter();

  const title = initialData ? "Size billboard" : "Create Size";
  const description = initialData ? "Edit a Size" : "Add new Size";
  const toastMessage = initialData ? "Size updated" : "Size created";
  const action = initialData ? "ٍSave changes" : "Create";

  const form = useForm<z.infer<typeof SizeSchema>>({
    resolver: zodResolver(SizeSchema),
    defaultValues: {
      name: initialData?.name,
      value: initialData?.value,
    },
  });
  async function onSubmit(values: z.infer<typeof SizeSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    // console.log(values);
    try {
      setLoding(true);
      if (initialData) {
        const response = await axios.patch(
          `/api/${params.storeId}/sizes/${params.sizeId}`,
          values
        );
      } else {
        const response = await axios.post(
          `/api/${params.storeId}/sizes`,
          values
        );
      }
      router.refresh();
      router.push(`/${params.storeId}/sizes`);
      toast.success(toastMessage);
    } catch (error) {
      console.log(error);
      toast.error("samething want wrong");
    } finally {
      setLoding(false);
    }
  }
  const deleteSize = async () => {
    try {
      setLoding(true);
      await axios.delete(`/api/${params.storeId}/sizes/${params.sizeId}`);
      router.refresh();
      router.push(`/${params.storeId}/sizes`);
      toast.success("size is deleted");
    } catch (error) {
      console.log(error);
      toast.error("make shue to delete  all product using this size frist");
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
        onConfirm={deleteSize}
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
                      placeholder="size name"
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
                  <FormLabel>Size value</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="size value"
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
