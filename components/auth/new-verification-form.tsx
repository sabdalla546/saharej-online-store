"use client";
import { BeatLoader } from "react-spinners";

import { CardWrapper } from "./card-wrapper";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
//import { newVerification } from "@/actions/new-verification";
import { FormSeccess } from "./form-success";
import { FormError } from "./form-error";
import axios from "axios";

const NewVerificationForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const onSubmit = useCallback(async () => {
    if (success || error) return;
    if (!token) {
      setError("missing token");
      return;
    }
    /* newVerification(token)
      .then((data) => {
        setSuccess(data.success);
        setError(data.error);
      })
      .catch(() => {
        setError("something wont wrong");
      });*/
    const res = await axios.post(`/api/auth/new-verification`, { token });
    setSuccess(res.data.success);
    setError(res.data.error);
  }, [token, success, error]);
  useEffect(() => {
    onSubmit();
  }, [onSubmit]);
  return (
    <CardWrapper
      headerLabel="Confirming your verification"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <div className="flex w-full items-center justify-center">
        {!success && !error && <BeatLoader />}

        <FormSeccess message={success} />
        {!success && <FormError message={error} />}
      </div>
    </CardWrapper>
  );
};

export default NewVerificationForm;
