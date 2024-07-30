"use client";

import { MainNav } from "./main-nav";

export const LeftSideNavBar = () => {
  return (
    <div className="min-h-screen left-0 top-0  sticky p-10  flex flex-col gap-10 w-[230px] shadow-xl max-lg:hidden">
      <MainNav />
    </div>
  );
};
