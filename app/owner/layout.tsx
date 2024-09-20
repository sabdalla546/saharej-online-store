import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

const OwnerLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await currentUser();
  if (user?.role !== "SUPERADMIN") {
    redirect("/auth/login");
  }
  return <>{children}</>;
};

export default OwnerLayout;
