"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";

import { CardWrapper } from "./card-wrapper";
import { ResetSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { FormError } from "./form-error";
import { FormSeccess } from "./form-success";
//import { reset } from "@/actions/reset";
import axios from "axios";

export const ResetForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState<string | undefined>("");
  const [isSuccess, setIsSuccess] = useState<string | undefined>("");

  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    },
  });
  async function onSubmit(values: z.infer<typeof ResetSchema>) {
    setIsError("");
    setIsSuccess("");
    console.log(values);
    /* startTransition(() => {
      reset(values).then((data: any) => {
        setIsError(data?.error);
        setIsSuccess(data?.success);
      });
    });*/
    try {
      setIsLoading(true);
      const res = await axios.post(`/api/auth/reset`, values);
      setIsError(res.data.error);
      setIsSuccess(res.data.success);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <CardWrapper
      headerLabel="Fotgot your password"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      disabled={isLoading}
                      placeholder="something@gamil.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={isError} />
          <FormSeccess message={isSuccess} />
          <Button
            disabled={isLoading}
            className="w-full bg-green-500 hover:bg-green-600"
            type="submit"
          >
            Send reset email
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
