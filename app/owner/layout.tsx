import { currentUser } from "@/lib/auth";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { LeftSideNavBar } from "@/components/left-side-navbar";
import { TopNav } from "@/components/top-nav";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
const OwnerLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await currentUser();
  const session = await auth();
  if (user?.role !== "SUPERADMIN") {
    redirect("/auth/login");
  }
  return (
    <SessionProvider session={session}>
      <>
        <div className="flex flex-row ">
          <div>
            <LeftSideNavBar />
          </div>
          <div className="flex-1 overflow-x-scroll">{children}</div>
        </div>
      </>
    </SessionProvider>
  );
};

export default OwnerLayout;
