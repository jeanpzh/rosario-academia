import { Avatar } from "@/components/ui/avatar";
import Image from "next/image";
import React from "react";

export default function Header({ title }: { title: string }) {
  return (
    <header className="flex items-center justify-between">
      <h1 className="text-3xl font-semibold text-primary">{title}</h1>
      <Avatar>
        <Image
          className="rounded-full"
          src="https://res.cloudinary.com/dlzlfasou/image/upload/v1736358072/avatar-40-03_dkeufx.jpg"
          alt="Maria Garcia"
          width={40}
          height={40}
        />
      </Avatar>
    </header>
  );
}
