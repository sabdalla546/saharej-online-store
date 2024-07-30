"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState, useTransition } from "react";
import { CardWrapper } from "./card-wrapper";
import { RegisterSchema } from "@/schemas";
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
import { register } from "@/actions/register";
import axios from "axios";

export const RegisterForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState<string | undefined>("");
  const [isSuccess, setIsSuccess] = useState<string | undefined>("");
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  async function onSubmit(values: z.infer<typeof RegisterSchema>) {
    setIsError("");
    setIsSuccess("");
    try {
      setIsLoading(true);
      const res = await axios.post(`/api/auth/register`, values);
      setIsSuccess(res.data.success);
      setIsError(res.data.error);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
    /* startTransition(() => {
      register(values).then((data) => {
        setIsError(data.error);
        setIsSuccess(data.success);
      });
    });*/
  }
  return (
    <CardWrapper
      headerLabel="Create an account "
      backButtonLabel="Already have an account"
      backButtonHref="/auth/login"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder=" name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      type="password"
                      placeholder="******"
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
            Register
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
