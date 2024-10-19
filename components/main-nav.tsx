import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PencilRuler,
  ShoppingBag,
  ImagePlus,
  UsersRound,
  Settings,
  Layers3,
  Palette,
  Tag,
  UserRoundCog,
} from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { UserButton } from "./auth/user-button";

export const MainNav = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) => {
  const pathName = usePathname();
  const user = useCurrentUser();
  const params = useParams();
  let routes;
  if (user?.role === "SUPERADMIN") {
    routes = [
      {
        href: `/owner`,
        label: "Dashboard",
        icon: <LayoutDashboard />,
        active: pathName === `/owner`,
      },

      {
        href: `/owner/categories`,
        label: "Categories",
        icon: <Layers3 />,
        active: pathName === `/owner/categories`,
      },
      {
        href: `/owner/sliders`,
        label: "sliders",
        icon: <Layers3 />,
        active: pathName === `/owner/sliders`,
      },
      {
        href: `/owner/flashDeals`,
        label: "Flash Deals",
        icon: <Layers3 />,
        active: pathName === `/owner/flashDeals`,
      },
    ];
  } else {
    routes = [
      {
        href: `/${params.storeId}`,
        label: "Dashboard",
        icon: <LayoutDashboard />,
        active: pathName === `/${params.storeId}`,
      },

      {
        href: `/${params.storeId}/billboards`,
        label: "Billboards",
        icon: <ImagePlus />,
        active: pathName === `/${params.storeId}/billboards`,
      },
      {
        href: `/${params.storeId}/categories`,
        label: "Categories",
        icon: <Layers3 />,
        active: pathName === `/${params.storeId}/categories`,
      },
      {
        href: `/${params.storeId}/sizes`,
        label: "Sizes",
        icon: <PencilRuler />,
        active: pathName === `/${params.storeId}/sizes`,
      },
      {
        href: `/${params.storeId}/colors`,
        label: "Colors",
        icon: <Palette />,
        active: pathName === `/${params.storeId}/colors`,
      },
      {
        href: `/${params.storeId}/products`,
        icon: <Tag />,
        label: "Products",
        active: pathName === `/${params.storeId}/products`,
      },
      {
        href: `/${params.storeId}/orders`,
        icon: <ShoppingBag />,
        label: "Orders",
        active: pathName === `/${params.storeId}/orders`,
      },
      {
        href: `/${params.storeId}/profile`,
        icon: <UserRoundCog />,
        label: "Profile",
        active: pathName === `/${params.storeId}/profile`,
      },
      {
        href: `/${params.storeId}/settings`,
        label: "Settings",
        icon: <Settings />,
        active: pathName === `/${params.storeId}/settings`,
      },
    ];
  }

  return (
    <nav className={cn("flex flex-col items-start  gap-8 ", className)}>
      {user?.role === "SUPERADMIN" && <UserButton />}
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-Primary",
            route.active
              ? "text-[#f15222] dark:text-white"
              : "text-muted-foreground"
          )}
        >
          <div className="flex items-start justify-between gap-4">
            {route.icon}
            {route.label}
          </div>
        </Link>
      ))}
    </nav>
  );
};
