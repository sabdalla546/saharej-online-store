"use client";

import { z } from "zod";
import axios from "axios";
import { useStoreModal } from "@/hooks/use-store-modal";
import { Modal } from "@/components/ui/modal";

import { StoreSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
//import { CreateStore } from "@/actions/store";
import toast from "react-hot-toast";
import { Textarea } from "../ui/textarea";
import ImageUpload from "@/components/ui/image-upload";

export const StoreModal = () => {
  const [loading, setLoading] = useState(false);
  const storeModal = useStoreModal();
  const form = useForm<z.infer<typeof StoreSchema>>({
    resolver: zodResolver(StoreSchema),
    defaultValues: {
      storeName: "",
      description: "",
      imageUrl: "",
    },
  });
  async function onSubmit(values: z.infer<typeof StoreSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    try {
      setLoading(true);
      const response = await axios.post(`/api/stores`, values);
      //console.log(response);
      toast.success("Store Created");
      window.location.assign(`/${response.data.id}`);
    } catch (error) {
      console.log(error);
      toast.error("something wont wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      title="Create Store"
      description="Manage Store Products and Categories"
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
    >
      <>
        <div className="flex-col">
          <div className=" flex-1 spacy-y-4 py-2 pb-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="storeName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Store Name</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="Sherts"
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
                      <FormLabel>Store Description</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={6}
                          disabled={loading}
                          placeholder="Store description"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* <FormField
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
                />*/}

                <div className="pt-2 space-x-2 flex items-center justify-end">
                  <Button
                    variant={"outline"}
                    onClick={storeModal.onClose}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    Continue
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </>
    </Modal>
  );
};
