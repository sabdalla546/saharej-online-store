import { Header } from "@/components/auth/header";
import { MainHeader } from "@/components/main-heading";
import { db } from "@/lib/db";
import React from "react";

interface DashboardPageProps {
  params: {
    storeId: string;
  };
}

const DashboardPage: React.FC<DashboardPageProps> = async ({ params }) => {
  const store = await db.store.findFirst({
    where: {
      id: params.storeId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <MainHeader lebel="Dashboard" description="OverView of your store" />
      </div>
    </div>
  );
};

export default DashboardPage;
