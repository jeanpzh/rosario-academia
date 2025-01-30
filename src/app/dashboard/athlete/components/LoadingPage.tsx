import React from "react";

export default function LoadingPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="size-16 animate-spin rounded-full border-y-2 border-black dark:border-gray-300 "></div>
    </div>
  );
}
