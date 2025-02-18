"use client";
import React, { useEffect, useState } from "react";
import LoadingPage from "@/components/LoadingPage";
import SignIn from "@/app/(auth-pages)/sign-in/SignIn";
import { Message } from "@/components/form-message";

export default function Login(props: { searchParams: Promise<Message> }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(async () => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [props.searchParams]);

  return <div>{isLoading ? <LoadingPage className="bg-background" /> : <SignIn />}</div>;
}
