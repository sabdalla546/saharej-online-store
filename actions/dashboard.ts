import { db } from "@/lib/db";

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
