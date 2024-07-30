"use client";

import { db } from "@/lib/db";
import { StoreSwitcher } from "./store-switcher";
//import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { UserButton } from "./auth/user-button";
import { AlignJustify } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Store } from "@prisma/client";
import { useState } from "react";
import { LeftSideNavBar } from "./left-side-navbar";
import { MainNav } from "./main-nav";
interface TopNavProps {
  data: Store[];
}
export const TopNav: React.FC<TopNavProps> = ({ data }) => {
  const [stores, setStores] = useState(data);
  const [open, setOpen] = useState(false);

  const user = useCurrentUser();
  //const user = await currentUser();
  if (!user?.id || user.role !== "ADMIN") {
    redirect("/auth/login");
  }

  return (
    <div className=" flex items-center justify-between   gap-10 h-16 px-10  relative left-0 top-0   shadow-sm bg-[#00887a] z-10">
      <StoreSwitcher items={stores} />
      <div className="flex items-center gap-4">
        <AlignJustify
          onClick={() => setOpen(!open)}
          className="text-white lg:hidden"
        />
        {open && (
          <div className="absolute top-16 left-0 flex flex-col w-full gap-8 p-5 bg-white shadow-xl">
            <MainNav />
          </div>
        )}
        <UserButton />
      </div>
    </div>
  );
};
