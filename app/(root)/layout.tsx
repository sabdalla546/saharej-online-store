import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

const HomePageLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await currentUser();
  let store;
  if (!user?.id) {
    redirect("/auth/login");
  }
  if (user.role === "SUPERADMIN") {
    redirect("/owner");
  }
  if (user.role === "ADMIN") {
    store = await db.store.findFirst({
      where: {
        userId: user?.id,
      },
    });
  }

  // console.log("root", store);
  if (store) {
    redirect(`/${store.id}`);
  }
  return <>{children}</>;
};

export default HomePageLayout;
