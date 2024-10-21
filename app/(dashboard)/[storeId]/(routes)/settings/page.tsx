import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { SettingForm } from "./_component/setting-form";
import axios from "axios";

interface SettingsProps {
  params: { storeId: string };
}

const Settings = async ({ params }: SettingsProps) => {
  const user = await currentUser();

  if (!user?.id || user.role !== "ADMIN") {
    redirect("/auth/login");
  }
  const store = await db.store.findFirst({
    where: {
      id: params.storeId,
      userId: user.id,
    },
  });
  if (!store) {
    redirect("/");
  }
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SettingForm initialData={store} />
      </div>
    </div>
  );
};

export default Settings;
