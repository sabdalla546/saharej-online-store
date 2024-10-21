"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";

import { CardWrapper } from "./card-wrapper";
import { LoginSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import Link from "next/link";
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
//import { login } from "@/actions/login";

export const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState<string | undefined>("");
  const [isSuccess, setIsSuccess] = useState<string | undefined>("");
  const [showToFactor, setShowTwoFactor] = useState(false);
  const serchParams = useSearchParams();
  const errorUrl =
    serchParams.get("error") === "OAuthAccountNotLinked"
      ? "email is already in use"
      : "";
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  async function onSubmit(values: z.infer<typeof LoginSchema>) {
    setIsError("");
    setIsSuccess("");
    try {
      setIsLoading(true);
      const res = await axios.post(`/api/auth/login`, values);
      console.log(res);
      setIsSuccess(res.data.success);
      setIsError(res.data.error);

      if (!res.data.err) {
        window.location.reload();
      }
      form.reset();
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
    /*startTransition(() => {
      login(values)
        .then((data: any) => {
          if (data?.error) {
            form.reset();
            setIsError(data?.error);
          }
          if (data?.success) {
            form.reset();
            setIsSuccess(data?.success);
          }
          if (data?.twoFactor) {
            setShowTwoFactor(true);
          }
        })
        .catch(() => setIsError("simething wont wrong"));
    });*/
  }
  return (
    <CardWrapper
      headerLabel="Welcome back"
      backButtonLabel="Don't have an account"
      backButtonHref="/auth/register"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {showToFactor && (
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>2FA Code</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="Code"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {!showToFactor && (
              <>
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
                      <Button
                        variant={"link"}
                        size={"sm"}
                        asChild
                        className="px-0 font-normal text-white"
                      >
                        <Link href="/auth/reset">Forgot password</Link>
                      </Button>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>
          <FormError message={isError || errorUrl} />
          <FormSeccess message={isSuccess} />
          <Button
            disabled={isLoading}
            className="w-full bg-green-500 hover:bg-green-600"
            type="submit"
          >
            {showToFactor ? "Confirm" : " Login"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
