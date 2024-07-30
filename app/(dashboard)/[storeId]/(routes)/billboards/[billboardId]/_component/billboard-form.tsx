"use client";
import { Trash } from "lucide-react";
import axios from "axios";
import { BillboardSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { MainHeader } from "@/components/main-heading";

import { Separator } from "@/components/ui/separator";
import { Billboard } from "@prisma/client";
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
import ImageUpload from "@/components/ui/image-upload";
interface BillboardFormProps {
  initialData: Billboard | null | undefined;
}
export const BillboardForm = ({ initialData }: BillboardFormProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoding] = useState(false);

  const params = useParams();
  const router = useRouter();

  const title = initialData ? "Edit billboard" : "Create billboard";
  const description = initialData ? "Edit a billboard" : "Add new billboard";
  const toastMessage = initialData ? "billboard updated" : "billboard created";
  const action = initialData ? "ٍSave changes" : "Create";

  const form = useForm<z.infer<typeof BillboardSchema>>({
    resolver: zodResolver(BillboardSchema),
    defaultValues: {
      label: initialData?.label,
      imageUrl: initialData?.imageUrl,
    },
  });
  async function onSubmit(values: z.infer<typeof BillboardSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    // console.log(values);
    try {
      setLoding(true);
      if (initialData) {
        const response = await axios.patch(
          `/api/${params.storeId}/billboards/${params.billboardId}`,
          values
        );
      } else {
        const response = await axios.post(
          `/api/${params.storeId}/billboards`,
          values
        );
      }
      router.refresh();
      router.push(`/${params.storeId}/billboards`);
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
      await axios.delete(
        `/api/${params.storeId}/billboards/${params.billboardId}`
      );
      router.refresh();
      router.push(`/${params.storeId}/billboards`);
      toast.success("billboard is deleted");
    } catch (error) {
      console.log(error);
      toast.error(
        "make shue to delete  all catergories using this billboard frist"
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
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background image</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value ? [field.value] : []}
                    disabeld={loading}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange("")}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-col-3 gap-8">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billboard name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="billboard name"
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
