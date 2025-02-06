"use client";
import React, { useEffect, useState } from "react";
import LoadingPage from "@/app/dashboard/athlete/components/LoadingPage";
import SignIn from "./SignIn";
import { Message } from "@/components/form-message";

export default function Login(props: { searchParams: Promise<Message> }) {
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useState<Message | null>(null);

  useEffect(() => {
    const timer = setTimeout(async () => {
      const params = await props.searchParams;
      setSearchParams(params);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [props.searchParams]);

  return <div>{isLoading ? <LoadingPage /> : <SignIn searchParams={searchParams!} />}</div>;
}
