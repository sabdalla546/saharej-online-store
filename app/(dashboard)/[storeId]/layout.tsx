import { auth } from "@/auth";
import { LeftSideNavBar } from "@/components/left-side-navbar";
import { TopNav } from "@/components/top-nav";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { SessionProvider } from "next-auth/react";
import { redirect } from "next/navigation";

interface LayoutDashboardProps {
  children: React.ReactNode;
  params: { storeId: string };
}
const LayoutDashboard = async ({ children, params }: LayoutDashboardProps) => {
  const user = await currentUser();
  const session = await auth();
  if (!user?.id) {
    redirect("/auth/login");
  }

  const store = await db.store.findFirst({
    where: {
      id: params.storeId,
      userId: user.id,
    },
  });
  const stores = await db.store.findMany({
    where: {
      userId: user.id,
    },
  });
  if (!store) {
    redirect("/");
  }
  return (
    <SessionProvider session={session}>
      <>
        <div className="flex-row w-full">
          <TopNav data={stores} />
        </div>
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

export default LayoutDashboard;
