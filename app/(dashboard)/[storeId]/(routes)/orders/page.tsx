import { format } from "date-fns";
import { db } from "@/lib/db";
import { OrderClient } from "./_component/billboard-clients";
import { OrdersColumn } from "./_component/columns";

const Orders = async ({ params }: { params: { storeId: string } }) => {
  const orders = await db.order.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  const formatedOrders: OrdersColumn[] = orders.map((order) => ({
    id: order.id,
    phone: order.phone,
    address: order.address,
    product: order.orderItems.map((item) => item.product.name).join(", "),
    isPaid: order.isPaid,
    totalPrice: order.orderItems.reduce((total, item) => {
      return total + Number(item.product.price);
    }, 0),
    createdAt: format(order.createdAt, "MMMM do , yyyy"),
  }));
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderClient data={formatedOrders} />
      </div>
    </div>
  );
};

export default Orders;
