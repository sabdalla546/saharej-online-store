import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

const HomePageLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await currentUser();
  if (!user?.id) {
    redirect("/auth/login");
  }
  const store = await db.store.findFirst({
    where: {
      userId: user?.id,
    },
  });
  // console.log("root", store);
  if (store) {
    redirect(`/${store.id}`);
  }
  return <>{children}</>;
};

export default HomePageLayout;
