"use client";
import { Trash } from "lucide-react";
import axios from "axios";
import { StoreSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { MainHeader } from "@/components/main-heading";

import { Separator } from "@/components/ui/separator";
import { Store } from "@prisma/client";
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
interface SettingFormProps {
  initialData: Store;
}
export const SettingForm = ({ initialData }: SettingFormProps) => {
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoding] = useState(false);
  const form = useForm<z.infer<typeof StoreSchema>>({
    resolver: zodResolver(StoreSchema),
    defaultValues: {
      storeName: initialData.name,
      description: initialData.description,
      imageUrl: initialData.imageUrl,
    },
  });
  async function onSubmit(values: z.infer<typeof StoreSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    // console.log(values);
    try {
      setLoding(true);
      const response = await axios.patch(
        `/api/stores/${params.storeId}`,
        values
      );
      router.refresh();
      toast.success("Store  updated");
    } catch (error) {
      console.log(error);
      toast.error("samething want wrong");
    } finally {
      setLoding(false);
    }
  }
  const deleteStore = async () => {
    try {
      setLoding(true);
      await await axios.delete(`/api/stores/${params.storeId}`);
      router.refresh();
      router.push("/");
      toast.success("Store  deleted");
    } catch (error) {
      console.log(error);
      toast.error("make shue to delete products and catergories first");
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
        onConfirm={deleteStore}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <MainHeader lebel="Setting" description="Manage store seting" />
        <Button
          disabled={loading}
          variant={"destructive"}
          size={"icon"}
          onClick={() => setOpen(true)}
        >
          <Trash className="h-5 w-5" />
        </Button>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-col-3 gap-8">
            <FormField
              control={form.control}
              name="storeName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Store name"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store describtion</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Store description"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store image</FormLabel>
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
          </div>
          <Button disabled={loading} type="submit">
            Save change
          </Button>
        </form>
      </Form>
    </>
  );
};
