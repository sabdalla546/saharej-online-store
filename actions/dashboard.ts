import { db } from "@/lib/db";

interface graphData {
  name: string;
  total: number;
}
export const getTotalRevenue = async (storeId: string) => {
  const paidOrder = await db.order.findMany({
    where: {
      storeId,
      isPaid: true,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });
  const totalRevenue = paidOrder.reduce((total, order) => {
    const orderTotal = order.orderItems.reduce((totalSum, item) => {
      return total + Number(item.product.price);
    }, 0);
    return total + orderTotal;
  }, 0);

  return totalRevenue;
};
export const getSalesCount = async (storeId: string) => {
  const salesCount = await db.order.count({
    where: {
      storeId,
      isPaid: true,
    },
  });

  return salesCount;
};
export const getStockCount = async (storeId: string) => {
  const stockCount = await db.product.count({
    where: {
      storeId,
      isArchived: false,
    },
  });

  return stockCount;
};

export const getGraphRevenue = async (storeId: string) => {
  const paidOrder = await db.order.findMany({
    where: {
      storeId,
      isPaid: true,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  const monthlyRevenue: { [key: number]: number } = {};
  for (const order of paidOrder) {
    const month = order.createdAt.getMonth();
    let revenueForOrder = 0;
    for (const item of order.orderItems) {
      revenueForOrder += Number(item.product.price);
    }
    monthlyRevenue[month] = (monthlyRevenue[month] || 0) + revenueForOrder;
  }
  const graphData: graphData[] = [
    { name: "Jan", total: 0 },
    { name: "Feb", total: 0 },
    { name: "Mar", total: 0 },
    { name: "Apr", total: 0 },
    { name: "May", total: 0 },
    { name: "Jun", total: 0 },
    { name: "Jul", total: 0 },
    { name: "Aug", total: 0 },
    { name: "Sep", total: 0 },
    { name: "Oct", total: 0 },
    { name: "Nov", total: 0 },
    { name: "Dec", total: 0 },
  ];
  for (const month in monthlyRevenue) {
    graphData[parseInt(month)].total = monthlyRevenue[parseInt(month)];
  }
  return graphData;
};
