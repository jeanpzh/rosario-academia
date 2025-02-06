import { IconBrandTabler, IconId, IconUserBolt } from "@tabler/icons-react";
import React from "react";
const links = [
  {
    label: "Dashboard",
    href: "/dashboard/admin",
    icon: <IconBrandTabler className="size-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
  },
  {
    label: "Perfil",
    href: "/dashboard/admin/profile",
    icon: <IconUserBolt className="size-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
  },
  {
    label: "Control Auxiliares",
    href: "/dashboard/athlete/auxiliaries",
    icon: <IconId className="size-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
  },
];
export default links;
