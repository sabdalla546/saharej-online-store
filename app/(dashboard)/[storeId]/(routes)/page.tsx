import {
  getGraphRevenue,
  getSalesCount,
  getStockCount,
  getTotalRevenue,
} from "@/actions/dashboard";
import { MainHeader } from "@/components/main-heading";
import OverView from "@/components/overview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { db } from "@/lib/db";
import { formater } from "@/lib/utils";
import { CreditCard, DollarSign, Package } from "lucide-react";
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

  const totalRevenue = await getTotalRevenue(params.storeId);
  const salesCount = await getSalesCount(params.storeId);
  const stockCount = await getStockCount(params.storeId);
  const graph = await getGraphRevenue(params.storeId);
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <MainHeader lebel="Dashboard" description="Overview of your store" />
        <Separator />
        <div className="grid gap-4 grid-cols-4 ">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-4">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formater.format(totalRevenue)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-4">
              <CardTitle className="text-sm font-medium">Sales</CardTitle>
              <CreditCard className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold"> + {salesCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-4">
              <CardTitle className="text-sm font-medium">
                Product In Stock
              </CardTitle>
              <Package className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stockCount}</div>
            </CardContent>
          </Card>
        </div>
        <div className="col-span-4">
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <OverView data={graph} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
